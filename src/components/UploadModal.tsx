"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

export default function UploadModal() {
  const [open, setOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    }
  }, [open]);

  function closeModal() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        aria-label="Upload customer data"
        className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-800"
      >
        <Upload size={16} aria-hidden="true" />
        Upload data
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="upload-modal-title"
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg backdrop:fixed backdrop:inset-0 backdrop:bg-black/60"
      >
        <div className="flex items-center justify-between">
          <h2 id="upload-modal-title" className="text-base font-semibold text-white">
            Upload data
          </h2>
          <button
            onClick={closeModal}
            className="rounded text-neutral-400 hover:text-neutral-200"
            aria-label="Close upload dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="mt-1 text-sm text-neutral-400">
          Import your customer data as a CSV to generate churn predictions.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          className={`mt-5 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragOver ? "border-neutral-600 bg-neutral-800" : "border-neutral-700"
          }`}
        >
          <Upload size={24} className="text-neutral-400" aria-hidden="true" />
          <p className="text-sm text-neutral-400">
            Drag and drop a CSV file here, or click to browse
          </p>
          <p className="text-xs text-neutral-400">
            Real upload &amp; parsing coming soon
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={closeModal}
            className="flex-1 rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
          >
            Use demo dataset
          </button>
          <button
            onClick={closeModal}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
          >
            Cancel
          </button>
        </div>
      </dialog>
    </>
  );
}
