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

	// Personal Blog Project Files
	"Header.jsx": {
		language: "javascript",
		code: `import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">✍️</span>
          <span className="logo-text">My Blog</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/posts" className="nav-link">Posts</Link>
        </nav>
        
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
`,
	},
	"Footer.jsx": {
		language: "javascript",
		code: `import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About</h4>
          <p>A personal blog about web development, design, and technology.</p>
        </div>
        
        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li><a href="/rss">RSS Feed</a></li>
            <li><a href="https://github.com" target="_blank">GitHub</a></li>
            <li><a href="https://twitter.com" target="_blank">Twitter</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>hello@myblog.com</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} My Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
`,
	},
	"BlogPost.jsx": {
		language: "javascript",
		code: `import { Link } from 'react-router-dom';
import './BlogPost.css';

export function BlogPost({ post, isPreview = false }) {
  const { slug, title, date, excerpt, content, tags, readingTime } = post;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <article className={\`blog-post \${isPreview ? 'preview' : 'full'}\`}>
      <header className="post-header">
        {isPreview ? (
          <Link to={\`/posts/\${slug}\`}>
            <h2 className="post-title">{title}</h2>
          </Link>
        ) : (
          <h1 className="post-title">{title}</h1>
        )}
        
        <div className="post-meta">
          <time dateTime={date}>{formattedDate}</time>
          <span className="separator">·</span>
          <span>{readingTime} min read</span>
        </div>
        
        {tags && tags.length > 0 && (
          <div className="post-tags">
            {tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </header>
      
      <div className="post-content">
        {isPreview ? (
          <>
            <p>{excerpt}</p>
            <Link to={\`/posts/\${slug}\`} className="read-more">
              Read more →
            </Link>
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>
    </article>
  );
}
`,
	},
	"ThemeToggle.jsx": {
		language: "javascript",
		code: `import { useTheme } from '../hooks/useTheme';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={\`Switch to \${theme === 'light' ? 'dark' : 'light'} mode\`}
      title={\`Switch to \${theme === 'light' ? 'dark' : 'light'} mode\`}
    >
      {theme === 'light' ? (
        <svg className="icon moon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      ) : (
        <svg className="icon sun" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      )}
    </button>
  );
}
`,
	},
	"useTheme.js": {
		language: "javascript",
		code: `import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'blog-theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme;
    
    // Fall back to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  
  useEffect(() => {
    // Update document attribute for CSS
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);
  
  useEffect(() => {
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem(THEME_KEY);
      // Only update if user hasn't manually set a preference
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  return { theme, setTheme, toggleTheme };
}
`,
	},
	"usePosts.js": {
		language: "javascript",
		code: `import { useState, useEffect } from 'react';

const API_URL = '/api/posts';

export function usePosts(options = {}) {
  const { limit, tag, sortBy = 'date' } = options;
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (tag) params.append('tag', tag);
        if (sortBy) params.append('sortBy', sortBy);
        
        const response = await fetch(\`\${API_URL}?\${params}\`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [limit, tag, sortBy]);
  
  return { posts, loading, error };
}

export function usePost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!slug) return;
    
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(\`\${API_URL}/\${slug}\`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
  
  return { post, loading, error };
}
`,
	},
	"Home.jsx": {
		language: "javascript",
		code: `import { BlogPost } from '../components/BlogPost';
import { usePosts } from '../hooks/usePosts';
import './Home.css';

export function Home() {
  const { posts, loading, error } = usePosts({ limit: 5 });
  
  if (loading) {
    return (
      <div className="home">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="home">
        <div className="error">Error: {error}</div>
      </div>
    );
  }
  
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to My Blog</h1>
        <p>Thoughts on web development, design, and technology.</p>
      </section>
      
      <section className="recent-posts">
        <h2>Recent Posts</h2>
        <div className="posts-grid">
          {posts.map(post => (
            <BlogPost key={post.slug} post={post} isPreview />
          ))}
        </div>
      </section>
    </div>
  );
}
`,
	},
	"About.jsx": {
		language: "javascript",
		code: `import './About.css';

export function About() {
  return (
    <div className="about">
      <h1>About Me</h1>
      
      <div className="about-content">
        <img 
          src="/avatar.jpg" 
          alt="Profile" 
          className="profile-image" 
        />
        
        <div className="bio">
          <p>
            Hi! I'm a software developer passionate about building 
            beautiful and functional web applications. I love exploring 
            new technologies and sharing what I learn.
          </p>
          
          <p>
            When I'm not coding, you can find me reading, hiking, 
            or experimenting with new recipes in the kitchen.
          </p>
          
          <h2>Skills</h2>
          <ul className="skills-list">
            <li>JavaScript / TypeScript</li>
            <li>React & Next.js</li>
            <li>Node.js</li>
            <li>CSS & Design Systems</li>
            <li>Cloud Infrastructure</li>
          </ul>
          
          <h2>Get in Touch</h2>
          <p>
            Feel free to reach out via email at{' '}
            <a href="mailto:hello@myblog.com">hello@myblog.com</a>
            {' '}or connect with me on social media.
          </p>
        </div>
      </div>
    </div>
  );
}
`,
	},
	"Post.jsx": {
		language: "javascript",
		code: `import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../components/BlogPost';
import { usePost } from '../hooks/usePosts';
import './Post.css';

export function Post() {
  const { slug } = useParams();
  const { post, loading, error } = usePost(slug);
  
  if (loading) {
    return (
      <div className="post-page">
        <div className="loading">Loading post...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="post-page">
        <div className="error">
          <h2>Post not found</h2>
          <p>{error}</p>
          <Link to="/" className="back-link">← Back to home</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="post-page">
      <Link to="/" className="back-link">← Back to all posts</Link>
      <BlogPost post={post} />
      
      <div className="post-navigation">
        {post.previousPost && (
          <Link to={\`/posts/\${post.previousPost.slug}\`} className="nav-prev">
            <span className="nav-label">Previous</span>
            <span className="nav-title">{post.previousPost.title}</span>
          </Link>
        )}
        {post.nextPost && (
          <Link to={\`/posts/\${post.nextPost.slug}\`} className="nav-next">
            <span className="nav-label">Next</span>
            <span className="nav-title">{post.nextPost.title}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
`,
	},
	"App.jsx": {
		language: "javascript",
		code: `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Post } from './pages/Post';
import './styles/globals.css';

export function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/posts/:slug" element={<Post />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
`,
	},
	"main.jsx": {
		language: "javascript",
		code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
	},
	"globals.css": {
		language: "css",
		code: `/* CSS Reset and Base Styles */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* Light theme (default) */
  --color-bg: #ffffff;
  --color-bg-secondary: #f8f9fa;
  --color-text: #1a1a2e;
  --color-text-secondary: #4a4a68;
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-border: #e5e7eb;
  --color-shadow: rgba(0, 0, 0, 0.1);
  
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', 'Consolas', monospace;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}

[data-theme="dark"] {
  --color-bg: #0f0f1a;
  --color-bg-secondary: #1a1a2e;
  --color-text: #f8f9fa;
  --color-text-secondary: #a0a0b8;
  --color-primary: #818cf8;
  --color-primary-hover: #a5b4fc;
  --color-border: #2d2d44;
  --color-shadow: rgba(0, 0, 0, 0.3);
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  transition: background-color var(--transition-normal),
              color var(--transition-normal);
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-hover);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
`,
	},
	"theme.css": {
		language: "css",
		code: `/* Theme-specific styles and animations */

/* Theme toggle button */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color var(--transition-fast),
              transform var(--transition-fast);
}

.theme-toggle:hover {
  background: var(--color-border);
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle .icon {
  width: 20px;
  height: 20px;
  transition: transform var(--transition-normal);
}

.theme-toggle .sun {
  animation: rotate-in 0.3s ease-out;
}

.theme-toggle .moon {
  animation: rotate-in 0.3s ease-out;
}

@keyframes rotate-in {
  from {
    transform: rotate(-90deg) scale(0);
    opacity: 0;
  }
  to {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
}

/* Theme transition overlay */
.theme-transitioning {
  transition: none !important;
}

/* Code block theming */
pre, code {
  font-family: var(--font-mono);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}

pre {
  padding: var(--spacing-md);
  overflow-x: auto;
  border: 1px solid var(--color-border);
}

code {
  padding: var(--spacing-xs) var(--spacing-sm);
}

pre code {
  padding: 0;
  background: transparent;
}

/* Syntax highlighting - Light theme */
:root {
  --syntax-keyword: #d73a49;
  --syntax-string: #032f62;
  --syntax-comment: #6a737d;
  --syntax-function: #6f42c1;
  --syntax-number: #005cc5;
}

/* Syntax highlighting - Dark theme */
[data-theme="dark"] {
  --syntax-keyword: #ff7b72;
  --syntax-string: #a5d6ff;
  --syntax-comment: #8b949e;
  --syntax-function: #d2a8ff;
  --syntax-number: #79c0ff;
}

.token.keyword { color: var(--syntax-keyword); }
.token.string { color: var(--syntax-string); }
.token.comment { color: var(--syntax-comment); }
.token.function { color: var(--syntax-function); }
.token.number { color: var(--syntax-number); }
`,
	},
	"index.html": {
		language: "html",
		code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="A personal blog about web development, design, and technology." />
    
    <title>My Blog</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="My Blog" />
    <meta property="og:description" content="A personal blog about web development, design, and technology." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://myblog.com" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,
	},
	"package.json": {
		language: "json",
		code: `{
  "name": "personal-blog",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "eslint": "^8.54.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
`,
	},
	"Header.css": {
		language: "css",
		code: `.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-xl);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--color-text);
}

.logo:hover {
  color: var(--color-primary);
}

.logo-icon {
  font-size: 1.5rem;
}

.nav {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav-link:hover,
.nav-link.active {
  color: var(--color-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* Mobile menu */
.menu-toggle {
  display: none;
  padding: var(--spacing-sm);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav {
    position: fixed;
    inset: 0;
    background: var(--color-bg);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-xl);
    font-size: 1.25rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 100;
  }

  .nav.active {
    transform: translateX(0);
  }
}
`,
	},
	"ContactForm.jsx": {
		language: "javascript",
		code: `import { useForm } from '../hooks/useForm';
import './ContactForm.css';

const validationRules = {
  name: ['required', (v) => v.length < 2 ? 'Name must be at least 2 characters' : ''],
  email: ['required', 'email'],
  message: ['required', (v) => v.length < 10 ? 'Message must be at least 10 characters' : '']
};

export function ContactForm() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useForm(
    { name: '', email: '', message: '' },
    validationRules
  );

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        alert('Message sent successfully!');
        reset();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1>Get in Touch</h1>
      
      <div className={\`form-group \${touched.name && errors.name ? 'error' : ''}\`}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.name && errors.name && (
          <span className="error-message">{errors.name}</span>
        )}
      </div>

      <div className={\`form-group \${touched.email && errors.email ? 'error' : ''}\`}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>

      <div className={\`form-group \${touched.message && errors.message ? 'error' : ''}\`}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.message && errors.message && (
          <span className="error-message">{errors.message}</span>
        )}
      </div>

      <button type="submit" className="btn-submit">
        Send Message
      </button>
    </form>
  );
}
`,
	},
	"ContactForm.css": {
		language: "css",
		code: `.contact-form {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
}

.contact-form h1 {
  margin-bottom: var(--spacing-xl);
  color: var(--color-text);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--color-text);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color var(--transition-fast),
              box-shadow var(--transition-fast);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.form-group.error input,
.form-group.error textarea {
  border-color: #dc3545;
}

.form-group.error input:focus,
.form-group.error textarea:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
}

.error-message {
  display: block;
  margin-top: var(--spacing-xs);
  color: #dc3545;
  font-size: 0.875rem;
}

.btn-submit {
  width: 100%;
  padding: 0.875rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast),
              transform var(--transition-fast);
}

.btn-submit:hover {
  background: var(--color-primary-hover);
}

.btn-submit:active {
  transform: scale(0.98);
}
`,
	},
	"useForm.js": {
		language: "javascript",
		code: `import { useState, useCallback } from 'react';

const validators = {
  required: (value) => !value?.trim() ? 'This field is required' : '',
  email: (value) => {
    if (!value?.trim()) return 'Email is required';
    const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return !regex.test(value) ? 'Please enter a valid email' : '';
  },
  minLength: (min) => (value) =>
    value?.trim().length < min ? \`Must be at least \${min} characters\` : ''
};

export function useForm(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name] || [];
    for (const rule of rules) {
      const error = typeof rule === 'function' 
        ? rule(value) 
        : validators[rule]?.(value);
      if (error) return error;
    }
    return '';
  }, [validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  }, [validateField]);

  const handleSubmit = useCallback((onSubmit) => (e) => {
    e.preventDefault();
    
    const newErrors = {};
    const newTouched = {};
    let isValid = true;
    
    for (const [name, value] of Object.entries(values)) {
      const error = validateField(name, value);
      newErrors[name] = error;
      newTouched[name] = true;
      if (error) isValid = false;
    }
    
    setErrors(newErrors);
    setTouched(newTouched);
    
    if (isValid) {
      onSubmit(values);
    }
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  };
}
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
