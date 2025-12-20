/**
 * @typedef {Object} CodeExample
 * @property {string} id
 * @property {string} language
 * @property {string} code
 */

export const homepageCodeExamples = [
  {
    id: "agent-mode-main-go",
    language: "go",
    code: `package http

import (
    "io"
    "log/slog"
    "mime/multipart"
    "net/http"
    "strings"
)

type BatchItemResult struct {
    Name string \`json:"name"\`
    Metadata *struct {
        Format string \`json:"format"\`
        Width  int    \`json:"width"\`
        Height int    \`json:"height"\`
        Bytes  int    \`json:"bytes"\`
    } \`json:"metadata,omitempty"\`
    Error string \`json:"error,omitempty"\`
}

type BatchResponse struct {
    Results []*BatchItemResult \`json:"results"\`
    Count   int                \`json:"count"\`
    Success int                \`json:"success"\`
    Failed  int                \`json:"failed"\`
}

// handleProcessBatch processes multiple uploaded images (multipart/form-data) under the field name "files".
// It returns metadata for each image or an error per item without failing the whole batch unless the request is malformed.
func (s *Server) handleProcessBatch(w http.ResponseWriter, r *http.Request) {
    // Enforce max body size overall.
    r.Body = http.MaxBytesReader(w, r.Body, s.cfg.MaxUploadBytes)
    if ct := r.Header.Get("Content-Type"); !strings.HasPrefix(ct, "multipart/form-data") {
        s.writeJSON(w, http.StatusBadRequest, map[string]string{"error": "content type must be multipart/form-data"})
        return
    }
    if err := r.ParseMultipartForm(s.cfg.MaxUploadBytes); err != nil {
        status := http.StatusBadRequest
        if strings.Contains(err.Error(), "request body too large") {
            status = http.StatusRequestEntityTooLarge
        }
        s.writeJSON(w, status, map[string]string{"error": "invalid multipart form: " + err.Error()})
        return
    }

    // Accept files under the key "files". If absent, attempt to fallback to any file parts.
    var fileHeaders []*multipart.FileHeader
    if r.MultipartForm != nil && len(r.MultipartForm.File["files"]) > 0 {
        fileHeaders = r.MultipartForm.File["files"]
    } else if r.MultipartForm != nil {
        // Fallback: gather all files across keys.
        for _, fhs := range r.MultipartForm.File {
            fileHeaders = append(fileHeaders, fhs...)
        }
    }

    if len(fileHeaders) == 0 {
        s.writeJSON(w, http.StatusBadRequest, map[string]string{"error": "no files provided (expect key 'files')"})
        return
    }

    resp := &BatchResponse{Results: make([]*BatchItemResult, 0, len(fileHeaders))}

    for _, fh := range fileHeaders {
        item := &BatchItemResult{Name: fh.Filename}
        f, err := fh.Open()
        if err != nil {
            item.Error = "open file: " + err.Error()
            resp.Results = append(resp.Results, item)
            resp.Failed++
            continue
        }
        data, err := io.ReadAll(f)
        _ = f.Close()
        if err != nil {
            item.Error = "read file: " + err.Error()
            resp.Results = append(resp.Results, item)
            resp.Failed++
            continue
        }
        meta, err := s.proc.ExtractMetadata(data)
        if err != nil {
            item.Error = err.Error()
            resp.Results = append(resp.Results, item)
            resp.Failed++
            continue
        }
        // Copy into anonymous struct to decouple from internal type if it changes.
        item.Metadata = &struct {
            Format string \`json:"format"\`
            Width  int    \`json:"width"\`
            Height int    \`json:"height"\`
            Bytes  int    \`json:"bytes"\`
        }{Format: meta.Format, Width: meta.Width, Height: meta.Height, Bytes: meta.Bytes}
        resp.Results = append(resp.Results, item)
        resp.Success++
    }

    resp.Count = len(resp.Results)
    s.log.LogAttrs(r.Context(), slog.LevelInfo, "batch processed", slog.Int("count", resp.Count), slog.Int("success", resp.Success), slog.Int("failed", resp.Failed))
    s.writeJSON(w, http.StatusOK, resp)
}
`,
  },
];
