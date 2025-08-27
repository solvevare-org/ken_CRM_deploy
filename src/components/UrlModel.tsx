"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { generateClientLink } from "@/store/slices/realtorSlice";

interface UrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  description?: string;
}

export function UrlModal({
  isOpen,
  onClose,
  url,
  title = "Share URL",
  description = "Copy the URL below to share",
}: UrlModalProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      const current = generatedUrl || url;
      if (!current) {
        console.warn("No URL available to copy");
        return;
      }

      // Prefer modern clipboard API when available
      if (
        typeof navigator !== "undefined" &&
        (navigator as any).clipboard &&
        typeof (navigator as any).clipboard.writeText === "function"
      ) {
        await (navigator as any).clipboard.writeText(current);
      } else {
        // Fallback for environments where navigator.clipboard is undefined
        const textarea = document.createElement("textarea");
        textarea.value = current;
        // Prevent zooming on iOS and keep off-screen
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!successful)
          throw new Error("Fallback: copy command was unsuccessful");
      }

      setCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const [generatedUrl, setGeneratedUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}

        {/* URL Input and Copy Button */}
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            value={generatedUrl || url}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {/* Generate button - calls API to get a client signup URL */}
          <button
            onClick={async () => {
              // prevent duplicate generation
              if (isGenerating) return;
              setGenerateError(null);
              setIsGenerating(true);
              try {
                const result = await dispatch(
                  generateClientLink() as any
                ).unwrap();

                // Thunk may return different shapes depending on the API
                // - a plain string (direct URL)
                // - an object containing `url` somewhere
                // - an object containing `shortLink` which we need to expand
                let urlFromResult = "";

                if (typeof result === "string") {
                  urlFromResult = result;
                } else if (result && typeof result === "object") {
                  // common places the url/shortLink might live
                  urlFromResult =
                    result.url ||
                    result.data?.url ||
                    result.data?.data?.url ||
                    "";

                  const short =
                    result.shortLink ||
                    result.data?.shortLink ||
                    result.data?.data?.shortLink ||
                    "";

                  if (!urlFromResult && short) {
                    // Build a full clientForm URL from the short link
                    try {
                      const origin =
                        typeof window !== "undefined"
                          ? window.location.origin
                          : "";
                      urlFromResult = origin
                        ? `${origin}/clientForm/${short}`
                        : `/clientForm/${short}`;
                    } catch (e) {
                      urlFromResult = `/clientForm/${short}`;
                    }
                  }
                }

                setGeneratedUrl(urlFromResult || "");
              } catch (err: any) {
                setGenerateError(
                  err instanceof Error ? err.message : String(err)
                );
              } finally {
                setIsGenerating(false);
              }
            }}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            disabled={isGenerating}
            title="Generate a client signup URL"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {copied ? (
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>

        {generateError && (
          <div className="mb-4 text-sm text-red-600">{generateError}</div>
        )}
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
