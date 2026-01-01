/**
 * @typedef {Object} CodeExample
 * @property {string} id
 * @property {string} language
 * @property {string} code
 */

export const fileCodeExamples = {
	"main.go": {
		language: "go",
		code: `package main

import (
    "context"
    "flag"
    "log/slog"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/example/imageproc/internal/processor"
    "github.com/example/imageproc/internal/server"
)

func main() {
    var (
        addr        = flag.String("addr", ":8080", "HTTP server address")
        maxUploadMB = flag.Int("max-upload-mb", 32, "Maximum upload size in megabytes")
    )
    flag.Parse()

    logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
        Level: slog.LevelInfo,
    }))
    slog.SetDefault(logger)

    proc := processor.New()
    srv := server.New(server.Config{
        Addr:           *addr,
        MaxUploadBytes: int64(*maxUploadMB) * 1024 * 1024,
        Processor:      proc,
        Logger:         logger,
    })

    // Graceful shutdown handling
    ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
    defer stop()

    go func() {
        logger.Info("starting server", "addr", *addr)
        if err := srv.ListenAndServe(); err != nil {
            logger.Error("server error", "error", err)
        }
    }()

    <-ctx.Done()
    logger.Info("shutting down server...")

    shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    if err := srv.Shutdown(shutdownCtx); err != nil {
        logger.Error("shutdown error", "error", err)
    }
    logger.Info("server stopped")
}
`,
	},
	"batch.go": {
		language: "go",
		code: `package batch

import (
    "context"
    "sync"

    "github.com/example/imageproc/internal/processor"
)

// BatchProcessor handles concurrent processing of multiple images.
type BatchProcessor struct {
    proc        *processor.Processor
    concurrency int
}

// BatchResult contains the result of processing a single item.
type BatchResult struct {
    Index    int
    Metadata *processor.ImageMetadata
    Error    error
}

// New creates a new BatchProcessor with the given concurrency limit.
func New(proc *processor.Processor, concurrency int) *BatchProcessor {
    if concurrency < 1 {
        concurrency = 4
    }
    return &BatchProcessor{
        proc:        proc,
        concurrency: concurrency,
    }
}

// Process handles multiple images concurrently and returns results in order.
func (b *BatchProcessor) Process(ctx context.Context, images [][]byte) []BatchResult {
    results := make([]BatchResult, len(images))
    var wg sync.WaitGroup
    sem := make(chan struct{}, b.concurrency)

    for i, data := range images {
        wg.Add(1)
        go func(idx int, imgData []byte) {
            defer wg.Done()

            select {
            case <-ctx.Done():
                results[idx] = BatchResult{Index: idx, Error: ctx.Err()}
                return
            case sem <- struct{}{}:
                defer func() { <-sem }()
            }

            meta, err := b.proc.ExtractMetadata(imgData)
            results[idx] = BatchResult{
                Index:    idx,
                Metadata: meta,
                Error:    err,
            }
        }(i, data)
    }

    wg.Wait()
    return results
}

// ProcessStream processes images as they arrive through a channel.
func (b *BatchProcessor) ProcessStream(ctx context.Context, input <-chan []byte) <-chan BatchResult {
    output := make(chan BatchResult)
    var wg sync.WaitGroup
    sem := make(chan struct{}, b.concurrency)

    go func() {
        idx := 0
        for data := range input {
            wg.Add(1)
            go func(i int, imgData []byte) {
                defer wg.Done()

                select {
                case <-ctx.Done():
                    output <- BatchResult{Index: i, Error: ctx.Err()}
                    return
                case sem <- struct{}{}:
                    defer func() { <-sem }()
                }

                meta, err := b.proc.ExtractMetadata(imgData)
                output <- BatchResult{Index: i, Metadata: meta, Error: err}
            }(idx, data)
            idx++
        }
        wg.Wait()
        close(output)
    }()

    return output
}
`,
	},
	"batch_test.go": {
		language: "go",
		code: `package batch_test

import (
    "context"
    "testing"
    "time"

    "github.com/example/imageproc/internal/batch"
    "github.com/example/imageproc/internal/processor"
)

func TestBatchProcessor_Process(t *testing.T) {
    proc := processor.New()
    bp := batch.New(proc, 2)

    // Create test images (1x1 PNG pixels)
    testImages := [][]byte{
        createTestPNG(t, 100, 100),
        createTestPNG(t, 200, 150),
        createTestPNG(t, 50, 50),
    }

    ctx := context.Background()
    results := bp.Process(ctx, testImages)

    if len(results) != len(testImages) {
        t.Errorf("expected %d results, got %d", len(testImages), len(results))
    }

    for i, r := range results {
        if r.Error != nil {
            t.Errorf("result[%d] unexpected error: %v", i, r.Error)
        }
        if r.Metadata == nil {
            t.Errorf("result[%d] missing metadata", i)
        }
    }
}

func TestBatchProcessor_ProcessWithCancellation(t *testing.T) {
    proc := processor.New()
    bp := batch.New(proc, 1)

    testImages := make([][]byte, 100)
    for i := range testImages {
        testImages[i] = createTestPNG(t, 10, 10)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Millisecond)
    defer cancel()

    results := bp.Process(ctx, testImages)

    var cancelled int
    for _, r := range results {
        if r.Error == context.DeadlineExceeded {
            cancelled++
        }
    }

    if cancelled == 0 {
        t.Log("warning: no tasks were cancelled (may be too fast)")
    }
}

func TestBatchProcessor_ProcessStream(t *testing.T) {
    proc := processor.New()
    bp := batch.New(proc, 4)

    input := make(chan []byte, 5)
    for i := 0; i < 5; i++ {
        input <- createTestPNG(t, 64, 64)
    }
    close(input)

    ctx := context.Background()
    output := bp.ProcessStream(ctx, input)

    var count int
    for result := range output {
        if result.Error != nil {
            t.Errorf("stream result error: %v", result.Error)
        }
        count++
    }

    if count != 5 {
        t.Errorf("expected 5 results, got %d", count)
    }
}

func createTestPNG(t *testing.T, width, height int) []byte {
    t.Helper()
    // Minimal valid PNG header for testing
    return []byte{
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        // ... simplified for demo
    }
}
`,
	},
	"processor.go": {
		language: "go",
		code: `package processor

import (
    "bytes"
    "errors"
    "image"
    _ "image/gif"
    _ "image/jpeg"
    _ "image/png"

    _ "golang.org/x/image/webp"
)

// ImageMetadata contains extracted metadata from an image.
type ImageMetadata struct {
    Format string \`json:"format"\`
    Width  int    \`json:"width"\`
    Height int    \`json:"height"\`
    Bytes  int    \`json:"bytes"\`
}

// Processor handles image processing operations.
type Processor struct {
    supportedFormats map[string]bool
}

// New creates a new Processor instance.
func New() *Processor {
    return &Processor{
        supportedFormats: map[string]bool{
            "jpeg": true,
            "png":  true,
            "gif":  true,
            "webp": true,
        },
    }
}

// ExtractMetadata reads image data and returns metadata.
func (p *Processor) ExtractMetadata(data []byte) (*ImageMetadata, error) {
    if len(data) == 0 {
        return nil, errors.New("empty image data")
    }

    reader := bytes.NewReader(data)
    config, format, err := image.DecodeConfig(reader)
    if err != nil {
        return nil, err
    }

    if !p.supportedFormats[format] {
        return nil, errors.New("unsupported image format: " + format)
    }

    return &ImageMetadata{
        Format: format,
        Width:  config.Width,
        Height: config.Height,
        Bytes:  len(data),
    }, nil
}

// IsSupported checks if the given format is supported.
func (p *Processor) IsSupported(format string) bool {
    return p.supportedFormats[format]
}

// SupportedFormats returns a list of supported image formats.
func (p *Processor) SupportedFormats() []string {
    formats := make([]string, 0, len(p.supportedFormats))
    for f := range p.supportedFormats {
        formats = append(formats, f)
    }
    return formats
}
`,
	},
	"image_processor.go": {
		language: "go",
		code: `package processor

import (
    "bytes"
    "image"
    "image/jpeg"
    "image/png"

    "golang.org/x/image/draw"
)

// ResizeOptions configures image resizing behavior.
type ResizeOptions struct {
    Width       int
    Height      int
    MaintainAR  bool // Maintain aspect ratio
    Interpolate draw.Interpolator
}

// DefaultResizeOptions returns sensible defaults for resizing.
func DefaultResizeOptions() ResizeOptions {
    return ResizeOptions{
        Width:       800,
        Height:      600,
        MaintainAR:  true,
        Interpolate: draw.BiLinear,
    }
}

// Resize resizes an image according to the given options.
func (p *Processor) Resize(data []byte, opts ResizeOptions) ([]byte, error) {
    reader := bytes.NewReader(data)
    img, format, err := image.Decode(reader)
    if err != nil {
        return nil, err
    }

    bounds := img.Bounds()
    srcWidth := bounds.Dx()
    srcHeight := bounds.Dy()

    targetWidth := opts.Width
    targetHeight := opts.Height

    if opts.MaintainAR {
        ratio := float64(srcWidth) / float64(srcHeight)
        if float64(targetWidth)/float64(targetHeight) > ratio {
            targetWidth = int(float64(targetHeight) * ratio)
        } else {
            targetHeight = int(float64(targetWidth) / ratio)
        }
    }

    dst := image.NewRGBA(image.Rect(0, 0, targetWidth, targetHeight))
    if opts.Interpolate == nil {
        opts.Interpolate = draw.BiLinear
    }
    opts.Interpolate.Scale(dst, dst.Bounds(), img, bounds, draw.Over, nil)

    var buf bytes.Buffer
    switch format {
    case "jpeg":
        err = jpeg.Encode(&buf, dst, &jpeg.Options{Quality: 85})
    default:
        err = png.Encode(&buf, dst)
    }

    if err != nil {
        return nil, err
    }
    return buf.Bytes(), nil
}

// Crop extracts a rectangular region from an image.
func (p *Processor) Crop(data []byte, x, y, width, height int) ([]byte, error) {
    reader := bytes.NewReader(data)
    img, format, err := image.Decode(reader)
    if err != nil {
        return nil, err
    }

    rect := image.Rect(x, y, x+width, y+height)
    dst := image.NewRGBA(image.Rect(0, 0, width, height))
    draw.Draw(dst, dst.Bounds(), img, rect.Min, draw.Src)

    var buf bytes.Buffer
    switch format {
    case "jpeg":
        err = jpeg.Encode(&buf, dst, &jpeg.Options{Quality: 85})
    default:
        err = png.Encode(&buf, dst)
    }

    if err != nil {
        return nil, err
    }
    return buf.Bytes(), nil
}
`,
	},
	"image_processor_test.go": {
		language: "go",
		code: `package processor_test

import (
    "bytes"
    "image"
    "image/png"
    "testing"

    "github.com/example/imageproc/internal/processor"
)

func TestProcessor_Resize(t *testing.T) {
    proc := processor.New()
    original := createTestImage(t, 400, 300)

    tests := []struct {
        name    string
        opts    processor.ResizeOptions
        wantW   int
        wantH   int
        wantErr bool
    }{
        {
            name:  "resize to smaller",
            opts:  processor.ResizeOptions{Width: 200, Height: 150, MaintainAR: true},
            wantW: 200,
            wantH: 150,
        },
        {
            name:  "resize maintain aspect ratio",
            opts:  processor.ResizeOptions{Width: 100, Height: 100, MaintainAR: true},
            wantW: 100,
            wantH: 75, // 4:3 aspect ratio maintained
        },
        {
            name:  "resize ignore aspect ratio",
            opts:  processor.ResizeOptions{Width: 100, Height: 100, MaintainAR: false},
            wantW: 100,
            wantH: 100,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result, err := proc.Resize(original, tt.opts)
            if (err != nil) != tt.wantErr {
                t.Errorf("Resize() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if tt.wantErr {
                return
            }

            img, _, err := image.Decode(bytes.NewReader(result))
            if err != nil {
                t.Fatalf("failed to decode result: %v", err)
            }

            bounds := img.Bounds()
            if bounds.Dx() != tt.wantW || bounds.Dy() != tt.wantH {
                t.Errorf("got size %dx%d, want %dx%d",
                    bounds.Dx(), bounds.Dy(), tt.wantW, tt.wantH)
            }
        })
    }
}

func TestProcessor_Crop(t *testing.T) {
    proc := processor.New()
    original := createTestImage(t, 400, 300)

    result, err := proc.Crop(original, 50, 50, 100, 100)
    if err != nil {
        t.Fatalf("Crop() error: %v", err)
    }

    img, _, err := image.Decode(bytes.NewReader(result))
    if err != nil {
        t.Fatalf("failed to decode result: %v", err)
    }

    bounds := img.Bounds()
    if bounds.Dx() != 100 || bounds.Dy() != 100 {
        t.Errorf("got size %dx%d, want 100x100", bounds.Dx(), bounds.Dy())
    }
}

func TestProcessor_ExtractMetadata(t *testing.T) {
    proc := processor.New()
    testImage := createTestImage(t, 256, 128)

    meta, err := proc.ExtractMetadata(testImage)
    if err != nil {
        t.Fatalf("ExtractMetadata() error: %v", err)
    }

    if meta.Width != 256 || meta.Height != 128 {
        t.Errorf("wrong dimensions: got %dx%d, want 256x128", meta.Width, meta.Height)
    }
    if meta.Format != "png" {
        t.Errorf("wrong format: got %s, want png", meta.Format)
    }
}

func createTestImage(t *testing.T, width, height int) []byte {
    t.Helper()
    img := image.NewRGBA(image.Rect(0, 0, width, height))
    var buf bytes.Buffer
    if err := png.Encode(&buf, img); err != nil {
        t.Fatalf("failed to create test image: %v", err)
    }
    return buf.Bytes()
}
`,
	},
	"health.go": {
		language: "go",
		code: `package server

import (
    "encoding/json"
    "net/http"
    "runtime"
    "sync/atomic"
    "time"
)

// HealthStatus represents the server health status.
type HealthStatus struct {
    Status    string            \`json:"status"\`
    Timestamp string            \`json:"timestamp"\`
    Uptime    string            \`json:"uptime"\`
    Version   string            \`json:"version"\`
    Checks    map[string]string \`json:"checks"\`
    Stats     *RuntimeStats     \`json:"stats,omitempty"\`
}

// RuntimeStats contains runtime statistics.
type RuntimeStats struct {
    GoRoutines   int    \`json:"goroutines"\`
    HeapAlloc    uint64 \`json:"heap_alloc_bytes"\`
    HeapSys      uint64 \`json:"heap_sys_bytes"\`
    NumGC        uint32 \`json:"num_gc"\`
    RequestCount int64  \`json:"request_count"\`
}

var (
    startTime    = time.Now()
    requestCount int64
    version      = "1.0.0"
)

// IncrementRequestCount increments the request counter.
func IncrementRequestCount() {
    atomic.AddInt64(&requestCount, 1)
}

// handleHealth returns the server health status.
func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
    var memStats runtime.MemStats
    runtime.ReadMemStats(&memStats)

    status := HealthStatus{
        Status:    "healthy",
        Timestamp: time.Now().UTC().Format(time.RFC3339),
        Uptime:    time.Since(startTime).Round(time.Second).String(),
        Version:   version,
        Checks: map[string]string{
            "processor": "ok",
            "memory":    "ok",
        },
        Stats: &RuntimeStats{
            GoRoutines:   runtime.NumGoroutine(),
            HeapAlloc:    memStats.HeapAlloc,
            HeapSys:      memStats.HeapSys,
            NumGC:        memStats.NumGC,
            RequestCount: atomic.LoadInt64(&requestCount),
        },
    }

    // Check memory threshold (warn if > 1GB heap)
    if memStats.HeapAlloc > 1<<30 {
        status.Checks["memory"] = "warning: high memory usage"
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(status)
}

// handleReady returns whether the server is ready to accept requests.
func (s *Server) handleReady(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "status": "ready",
    })
}

// handleLive returns whether the server is alive.
func (s *Server) handleLive(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "status": "alive",
    })
}
`,
	},
	"routes.go": {
		language: "go",
		code: `package server

import (
    "encoding/json"
    "io"
    "log/slog"
    "net/http"
    "strings"
    "time"

    "github.com/example/imageproc/internal/processor"
)

// Config holds server configuration.
type Config struct {
    Addr           string
    MaxUploadBytes int64
    Processor      *processor.Processor
    Logger         *slog.Logger
}

// Server is the HTTP server instance.
type Server struct {
    *http.Server
    cfg  Config
    proc *processor.Processor
    log  *slog.Logger
}

// New creates a new Server with configured routes.
func New(cfg Config) *Server {
    s := &Server{
        cfg:  cfg,
        proc: cfg.Processor,
        log:  cfg.Logger,
    }

    mux := http.NewServeMux()

    // Health endpoints
    mux.HandleFunc("GET /health", s.handleHealth)
    mux.HandleFunc("GET /ready", s.handleReady)
    mux.HandleFunc("GET /live", s.handleLive)

    // Image processing endpoints
    mux.HandleFunc("POST /api/v1/process", s.handleProcess)
    mux.HandleFunc("POST /api/v1/batch", s.handleBatch)
    mux.HandleFunc("POST /api/v1/resize", s.handleResize)
    mux.HandleFunc("GET /api/v1/formats", s.handleFormats)

    // Wrap with middleware
    handler := s.requestLogger(mux)
    handler = s.recoverer(handler)

    s.Server = &http.Server{
        Addr:         cfg.Addr,
        Handler:      handler,
        ReadTimeout:  30 * time.Second,
        WriteTimeout: 60 * time.Second,
        IdleTimeout:  120 * time.Second,
    }

    return s
}

// requestLogger logs incoming requests.
func (s *Server) requestLogger(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        IncrementRequestCount()

        next.ServeHTTP(w, r)

        s.log.LogAttrs(r.Context(), slog.LevelInfo, "request",
            slog.String("method", r.Method),
            slog.String("path", r.URL.Path),
            slog.Duration("duration", time.Since(start)),
        )
    })
}

// recoverer handles panics gracefully.
func (s *Server) recoverer(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if err := recover(); err != nil {
                s.log.Error("panic recovered", "error", err)
                s.writeJSON(w, http.StatusInternalServerError, map[string]string{
                    "error": "internal server error",
                })
            }
        }()
        next.ServeHTTP(w, r)
    })
}

// handleProcess processes a single image upload.
func (s *Server) handleProcess(w http.ResponseWriter, r *http.Request) {
    r.Body = http.MaxBytesReader(w, r.Body, s.cfg.MaxUploadBytes)

    data, err := io.ReadAll(r.Body)
    if err != nil {
        if strings.Contains(err.Error(), "request body too large") {
            s.writeJSON(w, http.StatusRequestEntityTooLarge, map[string]string{
                "error": "file too large",
            })
            return
        }
        s.writeJSON(w, http.StatusBadRequest, map[string]string{
            "error": "failed to read request body",
        })
        return
    }

    meta, err := s.proc.ExtractMetadata(data)
    if err != nil {
        s.writeJSON(w, http.StatusBadRequest, map[string]string{
            "error": err.Error(),
        })
        return
    }

    s.writeJSON(w, http.StatusOK, meta)
}

// handleFormats returns supported image formats.
func (s *Server) handleFormats(w http.ResponseWriter, r *http.Request) {
    s.writeJSON(w, http.StatusOK, map[string]interface{}{
        "formats": s.proc.SupportedFormats(),
    })
}

// writeJSON writes a JSON response.
func (s *Server) writeJSON(w http.ResponseWriter, status int, v interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(v)
}
`,
	},
	"go.mod": {
		language: "go",
		code: `module github.com/example/imageproc

go 1.22

require (
    golang.org/x/image v0.15.0
)

require (
    github.com/davecgh/go-spew v1.1.1 // indirect
    github.com/pmezard/go-difflib v1.0.0 // indirect
    gopkg.in/yaml.v3 v3.0.1 // indirect
)
`,
	},
	"go.sum": {
		language: "go",
		code: `github.com/davecgh/go-spew v1.1.1 h1:vj9j/u1bqnvCEfJOwUGvLyXZ...
github.com/davecgh/go-spew v1.1.1/go.mod h1:J7Y8YcW2NihsgmVo/mv3lAwl/ky...
github.com/pmezard/go-difflib v1.0.0 h1:4DBwDE0NGyQoBHbL...
github.com/pmezard/go-difflib v1.0.0/go.mod h1:iKH77koFhYxTK1pcRnk...
github.com/stretchr/testify v1.8.4 h1:CcVxjf3Q8PM0mHUKJCdn+e...
github.com/stretchr/testify v1.8.4/go.mod h1:sz/lmYIOXD/1dqDm...
golang.org/x/image v0.15.0 h1:kOELfmgrmJlw4Cdb7g...
golang.org/x/image v0.15.0/go.mod h1:HUYqC05R2ZcZ3ejNQsI...
gopkg.in/check.v1 v0.0.0-20161208181325-20d25e280405 h1:yhCVg...
gopkg.in/check.v1 v0.0.0-20161208181325-20d25e280405/go.mod h1:Co6...
gopkg.in/yaml.v3 v3.0.1 h1:fxVm/GzAzEWqLHuvctI91KS9hhNmmW...
gopkg.in/yaml.v3 v3.0.1/go.mod h1:K4uyk7z7BCEPqu6E+C64 Voices...
`,
	},
	"README.md": {
		language: "markdown",
		code: `# Image Processing Service

A high-performance HTTP service for batch image processing, metadata extraction, and transformations.

## Features

- **Batch Processing**: Process multiple images concurrently
- **Metadata Extraction**: Get format, dimensions, and size information
- **Image Resizing**: Resize with aspect ratio preservation
- **Format Support**: JPEG, PNG, GIF, and WebP

## Quick Start

\`\`\`bash
# Build the service
go build -o imageproc ./cmd/main.go

# Run with defaults
./imageproc

# Run with custom settings
./imageproc -addr :3000 -max-upload-mb 64
\`\`\`

## API Endpoints

### Health Checks

| Endpoint | Method | Description |
|----------|--------|-------------|
| \`/health\` | GET | Full health status with metrics |
| \`/ready\` | GET | Readiness probe |
| \`/live\` | GET | Liveness probe |

### Image Processing

| Endpoint | Method | Description |
|----------|--------|-------------|
| \`/api/v1/process\` | POST | Process single image |
| \`/api/v1/batch\` | POST | Process multiple images |
| \`/api/v1/resize\` | POST | Resize an image |
| \`/api/v1/formats\` | GET | List supported formats |

## Configuration

| Flag | Default | Description |
|------|---------|-------------|
| \`-addr\` | \`:8080\` | Server listen address |
| \`-max-upload-mb\` | \`32\` | Maximum upload size in MB |

## License

MIT License - see LICENSE file for details.
`,
	},
};

// For backwards compatibility
export const homepageCodeExamples = [
	{
		id: "agent-mode-main-go",
		language: "go",
		code: fileCodeExamples["batch.go"].code,
	},
];
