
import { useState } from "react";
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Sparkles,
  Loader2,
  AlertCircle,
  RotateCcw,
  FileText,
} from "lucide-react";

import API from "../services/api";

// Backend-supported languages
const languages = [
  { label: "English", value: "en" },
  { label: "Urdu", value: "ur" },
  { label: "Sindhi", value: "sd" },
];

function Translation({ darkMode = false }) {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("ur");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const dark = darkMode;

  const panel = dark
    ? "bg-[#191529] border-white/10"
    : "bg-white border-[#ece7f5]";

  const muted = dark ? "text-slate-400" : "text-slate-500";
  const heading = dark ? "text-white" : "text-[#241b35]";

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Please enter some text before translating.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      setCopied(false);

      const response = await API.post("/translation", {
        text: text.trim(),
        targetLanguage,
      });

      console.log("Translation API Response:", response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            response.data?.error ||
            "Translation could not be completed."
        );
      }

      setResult(response.data);
    } catch (err) {
      console.error(
        "Translation API Error:",
        err.response?.data
      );

      console.error(
        "Status Code:",
        err.response?.status
      );

      console.error("Full Error:", err);

      const backendError = err.response?.data;

      setError(
        backendError?.message ||
          backendError?.error ||
          (typeof backendError === "string" ? backendError : "") ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.translatedText) return;

    try {
      await navigator.clipboard.writeText(result.translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Unable to copy text. Please copy it manually.");
    }
  };

  const handleReset = () => {
    setText("");
    setResult(null);
    setError("");
    setCopied(false);
    setTargetLanguage("ur");
  };

  return (
    <div className="w-full space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eaff] text-[#7044c5]">
              <Languages size={19} />
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8059c8]">
              AI & Processing
            </span>
          </div>

          <h1 className={`text-2xl font-bold tracking-tight sm:text-3xl ${heading}`}>
            Translation
          </h1>

          <p className={`mt-2 max-w-xl text-sm leading-6 ${muted}`}>
            Translate university feedback and issue descriptions into your
            preferred language.
          </p>
        </div>

        <button
          onClick={handleReset}
          className={`inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border px-4 text-sm font-semibold transition hover:border-[#9b7ad7] ${
            dark
              ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              : "border-[#e9e2f3] bg-white text-[#625477] hover:bg-[#f8f5ff]"
          }`}
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>

      {/* Intro Strip */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e8def9] bg-gradient-to-r from-[#f5f0ff] to-[#fbf9ff] p-5 dark:border-[#4b376d] dark:from-[#211a35] dark:to-[#191529] sm:flex-row sm:items-center">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#7044c5] shadow-sm dark:bg-[#302447]">
          <Sparkles size={21} />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#39265c] dark:text-white">
            Multilingual text processing
          </h2>

          <p className="mt-1 text-sm leading-5 text-[#76668e] dark:text-slate-400">
            Convert text into another language while keeping the original
            content available for comparison.
          </p>
        </div>
      </div>

      {/* Translation Workspace */}
      <div className={`overflow-hidden rounded-2xl border ${panel}`}>

        <div className="flex flex-col gap-3 border-b border-inherit px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className={`text-base font-bold ${heading}`}>
              Translation Workspace
            </h2>

            <p className={`mt-1 text-xs ${muted}`}>
              Enter text and choose your destination language.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f1ebff] px-3 py-1.5 text-xs font-semibold text-[#7044c5] dark:bg-[#34264d] dark:text-[#c8afff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b5bd6]" />
            AI Translation
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 lg:grid-cols-2">

          {/* Original Text */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <label
                htmlFor="source-text"
                className={`text-sm font-semibold ${heading}`}
              >
                Original Text
              </label>

              <span className={`text-xs ${muted}`}>
                {text.length} characters
              </span>
            </div>

            <textarea
              id="source-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter university feedback or issue description here..."
              rows={10}
              className={`w-full resize-y rounded-xl border p-4 text-sm leading-7 outline-none transition focus:border-[#9872d4] focus:ring-4 focus:ring-[#8b5bd6]/10 ${
                dark
                  ? "border-white/10 bg-[#120f1d] text-white placeholder:text-slate-600"
                  : "border-[#e8e2f0] bg-[#fcfbfe] text-[#30263e] placeholder:text-slate-400"
              }`}
            />

            <p className={`mt-2 text-xs ${muted}`}>
              Supported input: university feedback and issue descriptions.
            </p>
          </div>

          {/* Translation Output */}
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <label
                htmlFor="target-language"
                className={`text-sm font-semibold ${heading}`}
              >
                Translate To
              </label>

              <div className="relative w-full sm:w-44">
                <select
                  id="target-language"
                  value={targetLanguage}
                  onChange={(e) => {
                    setTargetLanguage(e.target.value);
                    setResult(null);
                    setError("");
                  }}
                  className={`h-10 w-full appearance-none rounded-lg border px-3 pr-9 text-sm font-medium outline-none focus:border-[#9872d4] ${
                    dark
                      ? "border-white/10 bg-[#120f1d] text-white"
                      : "border-[#e8e2f0] bg-[#fcfbfe] text-[#49395f]"
                  }`}
                >
                  {languages.map((language) => (
                    <option
                      key={language.value}
                      value={language.value}
                    >
                      {language.label}
                    </option>
                  ))}
                </select>

                <Languages
                  size={15}
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${muted}`}
                />
              </div>
            </div>

            <div
              className={`flex min-h-[260px] flex-col rounded-xl border p-4 ${
                dark
                  ? "border-white/10 bg-[#120f1d]"
                  : "border-[#e8e2f0] bg-[#fcfbfe]"
              }`}
            >
              {result ? (
                <>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#8059c8]">
                      Translated Result
                    </span>

                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#8059c8] transition hover:bg-[#f0eaff] dark:hover:bg-[#302447]"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <p className={`whitespace-pre-wrap text-sm leading-7 ${heading}`}>
                    {result.translatedText}
                  </p>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0eaff] text-[#8059c8] dark:bg-[#302447]">
                    <FileText size={22} />
                  </div>

                  <p className={`text-sm font-semibold ${heading}`}>
                    Translation will appear here
                  </p>

                  <p className={`mt-1 max-w-xs text-xs leading-5 ${muted}`}>
                    Your translated content will be displayed in this area.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-5 mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 sm:mx-6">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="break-words">{error}</p>
          </div>
        )}

        {/* Result Details */}
        {result && (
          <div className="mx-5 mb-5 grid grid-cols-1 gap-3 rounded-xl bg-[#f8f5ff] p-4 dark:bg-[#211a35] sm:mx-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-[#8a78a5]">
                Detected Source Language
              </p>

              <p className="mt-1 text-sm font-semibold text-[#493465] dark:text-white">
                {result.detectedSourceLanguage || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#8a78a5]">
                Target Language
              </p>

              <p className="mt-1 text-sm font-semibold text-[#493465] dark:text-white">
                {languages.find(
                  (language) => language.value === result.targetLanguage
                )?.label || result.targetLanguage || "Not available"}
              </p>
            </div>

            {result.needsReview && (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300 sm:col-span-2">
                <AlertCircle size={15} />
                This translation may need manual review.
              </div>
            )}
          </div>
        )}

        {/* Translate Button */}
        <div className="flex flex-col gap-3 border-t border-inherit px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className={`text-xs ${muted}`}>
            Review the translated text before using it in official documents.
          </p>

          <button
            onClick={handleTranslate}
            disabled={loading || !text.trim()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7044c5] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6035b1] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Translating...
              </>
            ) : (
              <>
                Translate Text
                <ArrowRightLeft size={17} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Translation;