
import { useState } from "react";
import {
  BrainCircuit,
  Sparkles,
  Languages,
  FileText,
  Loader2,
  AlertCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Copy,
  Check,
  Activity,
  Globe,
  Cpu,
  Gauge,
  MessageSquareText,
  Info,
  Heart,
  Frown,
  Angry,
  Smile,
  Meh,
  AlertTriangle,
} from "lucide-react";

import API from "../services/api";

function AIAnalysis({ darkMode = false }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const dark = darkMode;

  const heading = dark ? "text-white" : "text-[#241b35]";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  const panel = dark
    ? "border-white/10 bg-[#191529]"
    : "border-[#ece7f5] bg-white";

  const innerPanel = dark
    ? "border-white/10 bg-[#120f1d]"
    : "border-[#ece7f5] bg-[#fcfbfe]";

  // Backend response sections
  const languageDetection = result?.languageDetection || {};
  const textAnalysis = result?.textAnalysis || {};
  const summary = result?.summary || {};

  const detectedLanguage =
    languageDetection.language ||
    summary.language ||
    "Unknown";

  const sentiment =
    textAnalysis.sentiment ||
    summary.sentiment ||
    "Not Available";

  const emotion =
    textAnalysis.emotion ||
    summary.emotion ||
    "Not Available";

  const confidenceScore =
    textAnalysis.confidenceScore ??
    summary.confidenceScore ??
    null;

  const confidenceLabel =
    textAnalysis.confidence ||
    summary.confidence ||
    languageDetection.confidence ||
    "Not Available";

  const numericConfidence =
    typeof confidenceScore === "number" &&
    Number.isFinite(confidenceScore)
      ? Math.max(0, Math.min(5, confidenceScore))
      : null;

  const wordCount =
    textAnalysis.wordCount ??
    summary.wordCount ??
    (text.trim()
      ? (text.trim().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || []).length
      : 0);

  const matchedKeywords =
    textAnalysis.matchedKeywords ||
    [];

  const emotionBreakdown =
    textAnalysis.emotionBreakdown ||
    {};

  const reviewRequired = Boolean(
    summary.needsReview ??
    (languageDetection.needsReview || textAnalysis.needsReview)
  );

  const analysisMethod =
    result?.analysisMethod ||
    textAnalysis.analysisMethod ||
    "Local Rule-Based NLP";

  const translatedText =
    result?.translatedText ||
    result?.translation?.translatedText ||
    null;

  const originalText =
    result?.originalText ||
    text;

  const emotionCategories = [
    {
      name: "Happy",
      emoji: "😊",
      icon: Smile,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      name: "Sad",
      emoji: "😢",
      icon: Frown,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      name: "Anger",
      emoji: "😠",
      icon: Angry,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      name: "Fear",
      emoji: "😨",
      icon: AlertTriangle,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      name: "Neutral",
      emoji: "😐",
      icon: Meh,
      color: "text-slate-500",
      bg: "bg-slate-500/10",
    },
  ];

  const selectedEmotion = emotionCategories.find(
    (item) =>
      item.name.toLowerCase() === String(emotion).toLowerCase()
  );

  const emotionEmoji = selectedEmotion?.emoji || "💬";

  // Analyze text using combined backend endpoint
  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter some text for analysis.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      setCopied(false);

      const response = await API.post(
        "/text-analysis/analyze",
        {
          text: text.trim(),
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
          "Analysis could not be completed."
        );
      }

      setResult(response.data);
    } catch (err) {
      console.error(
        "AI Analysis Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  // Copy complete analysis
  const handleCopy = async () => {
    if (!result) return;

    const output = [
      "AI ANALYSIS RESULTS",
      "-------------------------",
      `Original Text: ${originalText}`,
      `Detected Language: ${detectedLanguage}`,
      `Sentiment: ${sentiment}`,
      `Emotion: ${emotion}`,
      `Confidence Score: ${
        numericConfidence !== null
          ? `${numericConfidence.toFixed(2)} / 5`
          : confidenceLabel
      }`,
      `Word Count: ${wordCount}`,
      `Matched Keywords: ${
        matchedKeywords.length
          ? matchedKeywords.join(", ")
          : "None"
      }`,
      `Review Required: ${reviewRequired ? "Yes" : "No"}`,
      `Analysis Method: ${analysisMethod}`,
      `Translation: ${translatedText || "Not translated"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError("Unable to copy results. Please try again.");
    }
  };

  // Reusable result card
  const StatCard = ({ icon: Icon, label, children }) => (
    <div
      className={`min-w-0 rounded-2xl border p-5 sm:p-6 ${innerPanel}`}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0eaff] text-[#7044c5] dark:bg-[#302447] dark:text-[#c8afff]">
        <Icon size={20} />
      </div>

      <p className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>
        {label}
      </p>

      <div className={`mt-2 ${heading}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-7">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eaff] text-[#7044c5] dark:bg-[#302447] dark:text-[#c8afff]">
              <BrainCircuit size={20} />
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#8059c8]">
              AI & Processing
            </span>
          </div>

          <h1 className={`text-2xl font-bold tracking-tight sm:text-3xl ${heading}`}>
            AI Analysis
          </h1>

          <p className={`mt-2 max-w-2xl text-sm leading-6 ${muted}`}>
            Analyze university feedback to identify language,
            sentiment, emotions and text insights.
          </p>
        </div>

        <button
          onClick={handleReset}
          className={`inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border px-4 text-sm font-semibold transition ${
            dark
              ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              : "border-[#e9e2f3] bg-white text-[#625477] hover:bg-[#f8f5ff]"
          }`}
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>

      {/* Information Banner */}
      <div
        className={`flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center ${
          dark
            ? "border-[#4b376d] bg-gradient-to-r from-[#211a35] to-[#191529]"
            : "border-[#e8def9] bg-gradient-to-r from-[#f5f0ff] to-[#fbf9ff]"
        }`}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#7044c5] shadow-sm dark:bg-[#302447] dark:text-[#c8afff]">
          <Sparkles size={22} />
        </div>

        <div>
          <h2 className={`text-sm font-bold ${heading}`}>
            Intelligent Text Analysis
          </h2>

          <p className={`mt-1 text-sm leading-6 ${muted}`}>
            Analyze language, sentiment and emotions through
            local text processing.
          </p>
        </div>
      </div>

      {/* Input Workspace */}
      <div className={`overflow-hidden rounded-2xl border ${panel}`}>
        <div className="flex flex-col gap-3 border-b border-inherit px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className={`text-base font-bold ${heading}`}>
              Analysis Workspace
            </h2>

            <p className={`mt-1 text-xs ${muted}`}>
              Enter feedback or a sentence to analyze.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f1ebff] px-3 py-1.5 text-xs font-semibold text-[#7044c5] dark:bg-[#34264d] dark:text-[#c8afff]">
            <Activity size={14} />
            Processing Ready
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label
              htmlFor="analysis-text"
              className={`text-sm font-semibold ${heading}`}
            >
              Input Text
            </label>

            <span className={`text-xs ${muted}`}>
              {text.length} characters
            </span>
          </div>

          <textarea
            id="analysis-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter university feedback or any sentence for analysis..."
            rows={7}
            className={`w-full resize-y rounded-xl border p-4 text-sm leading-7 outline-none transition focus:border-[#9872d4] focus:ring-4 focus:ring-[#8b5bd6]/10 ${
              dark
                ? "border-white/10 bg-[#120f1d] text-white placeholder:text-slate-600"
                : "border-[#e8e2f0] bg-[#fcfbfe] text-[#30263e] placeholder:text-slate-400"
            }`}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className={`text-xs leading-5 ${muted}`}>
              Text analysis does not automatically translate your input.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7044c5] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6035b1] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Text
                  <Search size={17} />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="break-words">{error}</p>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {result && (
          <div className="border-t border-inherit p-5 sm:p-6 lg:p-7">

            {/* Results Header */}
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#8059c8]" />

                  <h2 className={`text-xl font-bold ${heading}`}>
                    Analysis Results
                  </h2>
                </div>

                <p className={`mt-1 text-sm ${muted}`}>
                  Complete analysis of your submitted text.
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e9e2f3] px-4 text-sm font-semibold text-[#8059c8] transition hover:bg-[#f8f5ff] dark:border-white/10 dark:hover:bg-white/5"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy Results"}
              </button>
            </div>

            {/* Emotion Result */}
            <div
              className={`mb-5 overflow-hidden rounded-2xl border p-6 sm:p-8 ${
                dark
                  ? "border-[#574078] bg-gradient-to-br from-[#251b39] to-[#171323]"
                  : "border-[#e5d9fa] bg-gradient-to-br from-[#f7f2ff] to-[#fcfaff]"
              }`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-[#302447]">
                  <span className="text-6xl leading-none">
                    {emotionEmoji}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8059c8]">
                    Detected Emotion
                  </p>

                  <h3 className={`mt-2 text-3xl font-bold ${heading}`}>
                    {emotion}
                  </h3>

                  <p className={`mt-2 text-sm leading-6 ${muted}`}>
                    Emotion classification based on the analyzed text.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Result Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard icon={Languages} label="Detected Language">
                <h3 className="break-words text-2xl font-bold">
                  {detectedLanguage}
                </h3>

                <p className={`mt-2 text-xs ${muted}`}>
                  Identified text language
                </p>
              </StatCard>

              <StatCard icon={Heart} label="Sentiment">
                <h3 className="break-words text-2xl font-bold">
                  {sentiment}
                </h3>

                <p className={`mt-2 text-xs ${muted}`}>
                  Overall text sentiment
                </p>
              </StatCard>

              <StatCard icon={Gauge} label="Confidence Score">
                {numericConfidence !== null ? (
                  <>
                    <h3 className="text-3xl font-bold">
                      {numericConfidence.toFixed(2)}
                      <span className={`ml-1 text-base font-medium ${muted}`}>
                        / 5
                      </span>
                    </h3>

                    <div
                      className={`mt-3 h-2 overflow-hidden rounded-full ${
                        dark ? "bg-white/10" : "bg-[#eee8f7]"
                      }`}
                    >
                      <div
                        className="h-full rounded-full bg-[#8059c8] transition-all"
                        style={{
                          width: `${(numericConfidence / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold">
                      {confidenceLabel}
                    </h3>

                    <p className={`mt-2 text-xs ${muted}`}>
                      Numeric score not provided
                    </p>
                  </>
                )}
              </StatCard>

              <StatCard icon={FileText} label="Word Count">
                <h3 className="text-3xl font-bold">
                  {wordCount}
                </h3>

                <p className={`mt-2 text-xs ${muted}`}>
                  Words in submitted text
                </p>
              </StatCard>
            </div>

            {/* Review Status */}
            <div
              className={`mt-5 flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
                dark
                  ? "border-white/10 bg-[#120f1d]"
                  : "border-[#ece7f5] bg-[#fcfbfe]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    reviewRequired
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-emerald-500/10 text-emerald-500"
                  }`}
                >
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h3 className={`text-sm font-bold ${heading}`}>
                    Review Status
                  </h3>

                  <p className={`mt-1 text-xs ${muted}`}>
                    {reviewRequired
                      ? "Manual verification is recommended."
                      : "No manual review has been flagged."}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
                  reviewRequired
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-emerald-500/10 text-emerald-500"
                }`}
              >
                {reviewRequired ? "Review Required" : "No Review Needed"}
              </span>
            </div>

            {/* Matched Keywords */}
            <div className={`mt-5 rounded-2xl border p-5 sm:p-6 ${innerPanel}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eaff] text-[#7044c5] dark:bg-[#302447] dark:text-[#c8afff]">
                  <Search size={19} />
                </div>

                <div>
                  <h3 className={`text-base font-bold ${heading}`}>
                    Matched Keywords
                  </h3>

                  <p className={`mt-1 text-xs ${muted}`}>
                    Keywords detected during text analysis.
                  </p>
                </div>
              </div>

              {matchedKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.map((keyword, index) => (
                    <span
                      key={`${keyword}-${index}`}
                      className="rounded-lg border border-[#e5d9fa] bg-[#f7f2ff] px-3 py-2 text-xs font-semibold text-[#7044c5] dark:border-[#574078] dark:bg-[#302447] dark:text-[#d0bbff]"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${muted}`}>
                  No matching keywords were identified.
                </p>
              )}
            </div>

            {/* Emotion Categories */}
            <div className={`mt-5 rounded-2xl border p-5 sm:p-6 ${innerPanel}`}>
              <div className="mb-5">
                <h3 className={`text-base font-bold ${heading}`}>
                  Emotion Categories
                </h3>

                <p className={`mt-1 text-xs ${muted}`}>
                  Available emotion classification categories.
                  The highlighted category is the detected result.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {emotionCategories.map((item) => {
                  const active =
                    item.name.toLowerCase() ===
                    String(emotion).toLowerCase();

                  const Icon = item.icon;

                  return (
                    <div
                      key={item.name}
                      className={`rounded-xl border p-4 text-center transition ${
                        active
                          ? "border-[#9872d4] bg-[#f5efff] dark:border-[#8059c8] dark:bg-[#302447]"
                          : dark
                            ? "border-white/10 bg-white/[0.02]"
                            : "border-[#ece7f5] bg-white"
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                      >
                        <Icon size={21} />
                      </div>

                      <p className={`mt-3 text-sm font-bold ${heading}`}>
                        {item.name}
                      </p>

                      {active && (
                        <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wider text-[#8059c8]">
                          Detected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Translation Information */}
            <div className={`mt-5 rounded-2xl border p-5 sm:p-6 ${innerPanel}`}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eaff] text-[#7044c5] dark:bg-[#302447] dark:text-[#c8afff]">
                  <Globe size={19} />
                </div>

                <div>
                  <h3 className={`text-base font-bold ${heading}`}>
                    Translation Information
                  </h3>

                  <p className={`mt-1 text-xs ${muted}`}>
                    Original and translated text status.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${muted}`}>
                    Detected Source Language
                  </p>

                  <p className={`text-lg font-bold ${heading}`}>
                    {detectedLanguage}
                  </p>
                </div>

                <div>
                  <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${muted}`}>
                    Translation Status
                  </p>

                  <p
                    className={`text-lg font-bold ${
                      translatedText ? "text-emerald-500" : heading
                    }`}
                  >
                    {translatedText ? "Translated" : "Not Translated"}
                  </p>
                </div>
              </div>

              {translatedText && (
                <div
                  className={`mt-5 rounded-xl border p-4 ${
                    dark
                      ? "border-white/10 bg-white/5"
                      : "border-[#ece7f5] bg-white"
                  }`}
                >
                  <p className={`mb-2 text-xs font-semibold ${muted}`}>
                    TRANSLATED TEXT
                  </p>

                  <p className={`text-sm leading-7 ${heading}`}>
                    {translatedText}
                  </p>
                </div>
              )}

              <p className={`mt-4 flex items-start gap-2 text-xs leading-5 ${muted}`}>
                <Info size={15} className="mt-0.5 shrink-0" />
                Language detection does not automatically translate text.
                Translation is a separate operation.
              </p>
            </div>

            {/* Analysis Engine */}
            <div className={`mt-5 rounded-2xl border p-5 sm:p-6 ${innerPanel}`}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eaff] text-[#7044c5] dark:bg-[#302447] dark:text-[#c8afff]">
                  <Cpu size={19} />
                </div>

                <div>
                  <h3 className={`text-base font-bold ${heading}`}>
                    Analysis Engine
                  </h3>

                  <p className={`mt-1 text-xs ${muted}`}>
                    Processing technology information.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${muted}`}>
                    Analysis Method
                  </p>

                  <p className={`text-lg font-bold ${heading}`}>
                    {analysisMethod}
                  </p>
                </div>

                <div>
                  <p className={`mb-2 text-xs font-semibold uppercase tracking-wider ${muted}`}>
                    Model Type
                  </p>

                  <p className={`text-lg font-bold ${heading}`}>
                    Local Node.js Processing
                  </p>
                </div>
              </div>

              <div
                className={`mt-5 flex items-center gap-2 rounded-xl px-4 py-3 ${
                  dark
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <ShieldCheck size={17} />

                <span className="text-xs font-semibold">
                  No paid OpenAI API required
                </span>
              </div>
            </div>

            {/* Submitted Text */}
            <div className={`mt-5 rounded-2xl border p-5 sm:p-6 ${innerPanel}`}>
              <div className="mb-3 flex items-center gap-2">
                <MessageSquareText size={18} className="text-[#8059c8]" />

                <h3 className={`text-sm font-bold ${heading}`}>
                  Analyzed Input Text
                </h3>
              </div>

              <p className={`whitespace-pre-wrap break-words text-sm leading-7 ${muted}`}>
                {originalText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIAnalysis;