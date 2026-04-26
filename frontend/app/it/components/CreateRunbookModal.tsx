"use client";

import * as React from "react";
import { RunbookService } from "../services/runbook.service";
import { Button } from "@/components/ui/button";

interface CreateRunbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateRunbookModal({ isOpen, onClose, onSuccess }: CreateRunbookModalProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  
  // Optional overrides
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await RunbookService.uploadDocument(file, title || undefined, tags || undefined);
      setFile(null);
      setTitle("");
      setTags("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform rounded-xl bg-card p-8 shadow-[0_20px_60px_rgba(44,52,55,0.12)] border border-outline-variant/20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Upload Knowledge Document</h2>
            <p className="text-xs text-muted-foreground mt-1">A runbook will be auto-generated from your document.</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/10 hover:text-foreground">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Auto-generated if blank"
                className="h-11 w-full rounded-md border border-outline-variant/15 bg-white px-4 text-sm text-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Tags (Optional)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. AWS, Network (comma separated)"
                className="h-11 w-full rounded-md border border-outline-variant/15 bg-white px-4 text-sm text-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          <div
            className={`relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all ${
              isDragging ? "border-primary/40 bg-primary/5" : "border-muted-foreground/20 bg-[#f7f9fb] hover:bg-secondary/5"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input id="file-upload" type="file" className="hidden" accept=".pdf,.txt,.md" onChange={handleFileChange} />
            <span className="material-symbols-outlined mb-3 text-[32px] text-muted-foreground/50">upload_file</span>
            <span className="text-sm font-semibold text-foreground">Drag & drop or click to browse</span>
            <div className="mt-4 flex gap-2">
              <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">.pdf</span>
              <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">.txt</span>
              <span className="rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">.md</span>
            </div>
          </div>

          {file && (
            <div className="flex items-center justify-between rounded-lg border border-outline-variant/15 bg-card p-4 shadow-[0_10px_30px_rgba(44,52,55,0.03)]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">description</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{file.name}</span>
                  <span className="text-[10px] font-medium text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={uploading} className="px-6 border-outline-variant/20 hover:bg-secondary/5">
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || uploading} className="bg-primary-gradient border-none px-6 text-white shadow-lg shadow-primary/20 hover:opacity-90 min-w-[140px]">
              {uploading ? (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Processing...
                </div>
              ) : (
                "Upload & Create"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
