"use client";

import React from "react";

interface AccordionStepProps {
  number: number;
  title: string;
  open: boolean;
  completed: boolean;
  summary?: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function AccordionStep({
  number,
  title,
  open,
  completed,
  summary,
  onEdit,
  children,
}: AccordionStepProps) {
  return (
    <div className="bg-qc-surface border border-qc-border rounded-xl mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
              completed
                ? "bg-green-500 text-white"
                : open
                  ? "bg-qc-accent text-qc-accent-on"
                  : "bg-qc-border text-qc-muted"
            }`}
          >
            {completed ? "✓" : number}
          </span>
          <div>
            <h2 className="font-semibold text-qc-text">{title}</h2>
            {completed && summary && (
              <p className="text-xs text-qc-muted mt-0.5 truncate max-w-xs">
                {summary}
              </p>
            )}
          </div>
        </div>
        {completed && onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-qc-accent hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      {open && (
        <div className="px-5 pb-5 border-t border-qc-border">{children}</div>
      )}
    </div>
  );
}
