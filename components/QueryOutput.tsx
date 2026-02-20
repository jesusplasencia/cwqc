"use client";

import { useState, useCallback } from "react";

interface QueryOutputProps {
  query: string;
}

export default function QueryOutput({ query }: QueryOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(query);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = query;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [query]);

  return (
    <div className="panel">
      <div className="panel-title">Generated Query</div>
      <div className="query-box">
        <pre>{query}</pre>
        <button
          type="button"
          className="copy-btn"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
        {copied && <span className="copied-tooltip">Copied!</span>}
      </div>
    </div>
  );
}
