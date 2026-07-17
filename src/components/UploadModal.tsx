"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function UploadModal() {
  const [open, setOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-700"
      >
        <Upload size={16} />
        Upload data
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-900">Upload data</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-neutral-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-1 text-sm text-neutral-500">
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
                dragOver ? "border-neutral-400 bg-neutral-50" : "border-neutral-200"
              }`}
            >
              <Upload size={24} className="text-neutral-400" />
              <p className="text-sm text-neutral-500">
                Drag and drop a CSV file here, or click to browse
              </p>
              <p className="text-xs text-neutral-400">
                Real upload &amp; parsing coming soon
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
              >
                Use demo dataset
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
