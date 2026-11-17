
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Database,
  CopyCheck,
  Copy,
  Tags,
  Languages,
  AlertCircle,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Clock3,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

import API from "../services/api";

// Chart colors
const chartColors = [
  "#5688F5",
  "#8B6CE8",
  "#20B99A",
  "#F2A54A",
  "#E879A8",
  "#36A6CE",
  "#7C9A54",
  "#D47B56",
  "#6478B8",
  "#B18A45",
  "#4EAFAD",
  "#A47BC5",
  "#82909F",
];

const sentimentColors = {
  Positive: "#20B99A",
  Neutral: "#5688F5",
  Negative: "#EF7777",
  Unknown: "#929BAA",
};

const emotionInfo = {
  Happy: { emoji: "😊", color: "#20B99A" },
  Sad: { emoji: "😢", color: "#5688F5" },
  Angry: { emoji: "😠", color: "#EF7777" },
  Worried: { emoji: "😟", color: "#E9A23B" },
  Fear: { emoji: "😨", color: "#9B7AE8" },
  Neutral: { emoji: "😐", color: "#82909F" },
  Uncertain: { emoji: "🤔", color: "#D18C49" },
  "Needs Review": { emoji: "🔎", color: "#D18C49" },
  Unknown: { emoji: "❔", color: "#929BAA" },
};

function createGradient(entries, colors) {
  const total = entries.reduce(
    (sum, [, value]) => sum + Math.max(0, Number(value) || 0),
    0
  );

  if (!total) return "conic-gradient(#64748b 0% 100%)";

  let current = 0;

  const segments = entries.map(([, value], index) => {
    const percentage =
      (Math.max(0, Number(value) || 0) / total) * 100;

    const start = current;
    current += percentage;

    return `${colors[index % colors.length]} ${start}% ${current}%`;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

// Donut Chart
function DonutChart({
  data,
  colors,
  darkMode,
  centerLabel = "Records",
}) {
  const entries = Object.entries(data || {}).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  );

  const total = entries.reduce(
    (sum, [, value]) => sum + (Number(value) || 0),
    0
  );

  const gradient = createGradient(entries, colors);

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <div
        className="relative h-44 w-44 rounded-full transition-all duration-700"
        style={{
          background: total ? gradient : "#64748b",
        }}
      >
        <div
          className={`absolute inset-[18px] rounded-full flex flex-col items-center justify-center ${
            darkMode ? "bg-[#111827]" : "bg-white"
          }`}
        >
          <span
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {total}
          </span>

          <span
            className={`text-xs mt-1 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {centerLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

// Chart Legend
function ChartLegend({ data, colors, darkMode }) {
  const entries = Object.entries(data || {}).sort(
    (a, b) => Number(b[1]) - Number(a[1])
  );

  const total = entries.reduce(
    (sum, [, value]) => sum + (Number(value) || 0),
    0
  );

  return (
    <div className="space-y-3 min-w-0">
      {entries.map(([name, value], index) => {
        const percentage = total
          ? ((Number(value) / total) * 100).toFixed(1)
          : 0;

        return (
          <div
            key={name}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: colors[index % colors.length],
                }}
              />

              <span
                className={`text-xs sm:text-sm truncate ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
                title={name}
              >
                {name}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {percentage}%
              </span>

              <span
                className={`text-sm font-semibold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard({ darkMode = false }) {
  const [records, setRecords] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load Dashboard Data
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrors([]);

    const [dataResult, analyticsResult] =
      await Promise.allSettled([
        API.get("/data"),
        API.get("/analytics"),
      ]);

    const newErrors = [];

    if (dataResult.status === "fulfilled") {
      const response = dataResult.value.data?.data;

      setRecords(
        Array.isArray(response) ? response : []
      );
    } else {
      newErrors.push(
        "Google Sheets data could not be loaded."
      );

      console.error("Data API:", dataResult.reason);
    }

    if (analyticsResult.status === "fulfilled") {
      setAnalytics(
        analyticsResult.value.data?.data || null
      );
    } else {
      newErrors.push("Analytics could not be loaded.");

      console.error(
        "Analytics API:",
        analyticsResult.reason
      );
    }

    setErrors(newErrors);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Analytics Data
  const categorySummary = analytics?.categorySummary || {};
  const languageSummary = analytics?.languageSummary || {};
  const sentimentSummary = analytics?.sentimentSummary || {};
  const emotionSummary = analytics?.emotionSummary || {};
  const reviewSummary = analytics?.reviewSummary || {};

  const categoryEntries = useMemo(
    () =>
      Object.entries(categorySummary).sort(
        (a, b) => Number(b[1]) - Number(a[1])
      ),
    [categorySummary]
  );

  const totalReviewFlags =
    Number(reviewSummary.language || 0) +
    Number(reviewSummary.classification || 0) +
    Number(reviewSummary.textAnalysis || 0);

  const categoryColors = chartColors;

  const languageColors = [
    "#5688F5",
    "#20B99A",
    "#E9A23B",
    "#9B7AE8",
    "#E879A8",
  ];

  const sentimentEntries = Object.entries(
    sentimentSummary
  ).sort((a, b) => Number(b[1]) - Number(a[1]));

  const sentimentColorList = sentimentEntries.map(
    ([name]) => sentimentColors[name] || "#929BAA"
  );

  // Theme
  const cardClass = darkMode
    ? "bg-[#111827] border-slate-800"
    : "bg-white border-slate-200";

  const headingText = darkMode
    ? "text-white"
    : "text-slate-900";

  const mutedText = darkMode
    ? "text-slate-400"
    : "text-slate-500";

  const softBackground = darkMode
    ? "bg-slate-800/70"
    : "bg-slate-50";

  // Statistics
  const stats = [
    {
      title: "Total Records",
      value: analytics?.totalRecords ?? records.length,
      description: "Google Sheets submissions",
      icon: Database,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      label: "TOTAL",
    },
    {
      title: "Unique Records",
      value: analytics?.uniqueRecords ?? "—",
      description: "Non-duplicate submissions",
      icon: CopyCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      label: "UNIQUE",
    },
    {
      title: "Duplicate Records",
      value: analytics?.duplicateCount ?? "—",
      description: "Repeated submissions",
      icon: Copy,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      label: "REPEATED",
    },
    {
      title: "Issue Categories",
      value: categoryEntries.length || "—",
      description: "Detected categories",
      icon: Tags,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      label: "CATEGORIES",
    },
  ];

  const reviewItems = [
    {
      title: "Language Review",
      value: reviewSummary.language,
      icon: Languages,
    },
    {
      title: "Classification Review",
      value: reviewSummary.classification,
      icon: Tags,
    },
    {
      title: "Text Analysis Review",
      value: reviewSummary.textAnalysis,
      icon: BrainCircuit,
    },
  ];

  const totalEmotions = Object.values(
    emotionSummary
  ).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );

  return (
    <div className="space-y-7 pb-8">

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div
            className={`flex items-center gap-2 text-xs mb-3 ${mutedText}`}
          >
            Overview
            <span>/</span>
            <span className="text-blue-500">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-blue-500/10 items-center justify-center">
              <BarChart3
                size={23}
                className="text-blue-500"
              />
            </div>

            <div>
              <h1
                className={`text-2xl md:text-3xl font-bold tracking-tight ${headingText}`}
              >
                Dashboard Overview
              </h1>

              <p className={`text-sm mt-1 ${mutedText}`}>
                Monitor university issues and AI-powered data insights.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />

          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* API Errors */}
      {errors.map((error, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500"
        >
          <AlertCircle size={19} />
          {error}
        </div>
      ))}

      {/* Professional Statistics Overview */}
      <section
        className={`rounded-2xl border overflow-hidden shadow-sm ${
          darkMode
            ? "bg-[#111827] border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 md:px-6 pt-5 pb-4">
          <div>
            <h2 className={`text-base font-bold ${headingText}`}>
              Data Overview
            </h2>

            <p className={`text-xs mt-1 ${mutedText}`}>
              Key metrics from your university data
            </p>
          </div>

          <span className={`flex items-center gap-2 text-xs ${mutedText}`}>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live statistics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className={`relative px-5 md:px-6 py-5 transition-colors ${
                  darkMode
                    ? "hover:bg-slate-800/40"
                    : "hover:bg-slate-50"
                } ${
                  index > 0
                    ? darkMode
                      ? "border-t sm:border-t-0 sm:border-l border-slate-800"
                      : "border-t sm:border-t-0 sm:border-l border-slate-100"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`flex items-center gap-2.5 text-xs font-semibold ${mutedText}`}
                  >
                    <Icon
                      size={16}
                      className={stat.color}
                    />
                    {stat.title}
                  </div>

                  <span
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.bg}`}
                  >
                    <Icon
                      size={15}
                      className={stat.color}
                    />
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between gap-2">
                  <div>
                    <p
                      className={`text-3xl md:text-4xl font-bold tracking-tight tabular-nums ${headingText}`}
                    >
                      {loading ? "—" : stat.value}
                    </p>

                    <p className={`text-xs mt-2 ${mutedText}`}>
                      {stat.description}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-semibold tracking-wide px-2 py-1 rounded-md ${stat.bg} ${stat.color}`}
                  >
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* University Categories Donut */}
      <section
        className={`rounded-2xl border p-5 md:p-6 shadow-sm ${cardClass}`}
      >
        <div className="flex items-center gap-3 mb-7">
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Tags
              size={21}
              className="text-blue-500"
            />
          </div>

          <div>
            <h2 className={`font-bold ${headingText}`}>
              University Issue Categories
            </h2>

            <p className={`text-xs mt-1 ${mutedText}`}>
              Category distribution generated by classification service
            </p>
          </div>
        </div>

        {loading ? (
          <p className={`text-sm ${mutedText}`}>
            Loading category analytics...
          </p>
        ) : categoryEntries.length === 0 ? (
          <p className={`text-sm ${mutedText}`}>
            No category data available.
          </p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-8 items-center">
            <div className="flex flex-col items-center gap-3">
              <DonutChart
                data={categorySummary}
                colors={categoryColors}
                darkMode={darkMode}
                centerLabel="Issues"
              />

              <span className={`text-xs ${mutedText}`}>
                {categoryEntries.length} detected categories
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <ChartLegend
                data={categorySummary}
                colors={categoryColors}
                darkMode={darkMode}
              />
            </div>
          </div>
        )}
      </section>

      {/* Language and Sentiment Donuts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Language Distribution */}
        <section
          className={`rounded-2xl border p-5 md:p-6 shadow-sm ${cardClass}`}
        >
          <div className="flex items-center gap-3 mb-7">
            <div className="h-11 w-11 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Languages
                size={21}
                className="text-indigo-500"
              />
            </div>

            <div>
              <h2 className={`font-bold ${headingText}`}>
                Language Distribution
              </h2>

              <p className={`text-xs mt-1 ${mutedText}`}>
                Language detection results
              </p>
            </div>
          </div>

          {loading ? (
            <p className={`text-sm ${mutedText}`}>
              Loading...
            </p>
          ) : Object.keys(languageSummary).length === 0 ? (
            <p className={`text-sm ${mutedText}`}>
              No language data available.
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-7">
              <DonutChart
                data={languageSummary}
                colors={languageColors}
                darkMode={darkMode}
                centerLabel="Records"
              />

              <div className="flex-1 w-full">
                <ChartLegend
                  data={languageSummary}
                  colors={languageColors}
                  darkMode={darkMode}
                />
              </div>
            </div>
          )}
        </section>

        {/* Sentiment Analysis */}
        <section
          className={`rounded-2xl border p-5 md:p-6 shadow-sm ${cardClass}`}
        >
          <div className="flex items-center gap-3 mb-7">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp
                size={21}
                className="text-emerald-500"
              />
            </div>

            <div>
              <h2 className={`font-bold ${headingText}`}>
                Sentiment Analysis
              </h2>

              <p className={`text-xs mt-1 ${mutedText}`}>
                Positive, neutral and negative issue sentiment
              </p>
            </div>
          </div>

          {loading ? (
            <p className={`text-sm ${mutedText}`}>
              Loading...
            </p>
          ) : sentimentEntries.length === 0 ? (
            <p className={`text-sm ${mutedText}`}>
              No sentiment data available.
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-7">
              <DonutChart
                data={sentimentSummary}
                colors={sentimentColorList}
                darkMode={darkMode}
                centerLabel="Analyzed"
              />

              <div className="flex-1 w-full">
                <ChartLegend
                  data={sentimentSummary}
                  colors={sentimentColorList}
                  darkMode={darkMode}
                />
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Emotion Analysis */}
      <section
        className={`rounded-2xl border p-5 md:p-6 shadow-sm ${cardClass}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <BrainCircuit
                size={22}
                className="text-purple-500"
              />
            </div>

            <div>
              <h2 className={`font-bold ${headingText}`}>
                Emotion Analysis
              </h2>

              <p className={`text-xs mt-1 ${mutedText}`}>
                Emotion detection with visual indicators
              </p>
            </div>
          </div>

          <div
            className={`rounded-xl px-3 py-2 text-xs font-semibold ${softBackground} ${mutedText}`}
          >
            {totalEmotions} analyzed records
          </div>
        </div>

        {loading ? (
          <p className={`text-sm ${mutedText}`}>
            Loading emotion analysis...
          </p>
        ) : Object.keys(emotionSummary).length === 0 ? (
          <p className={`text-sm ${mutedText}`}>
            No emotion data available.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Object.entries(emotionSummary)
              .sort((a, b) => Number(b[1]) - Number(a[1]))
              .map(([name, count]) => {
                const info = emotionInfo[name] || {
                  emoji: "💭",
                  color: "#929BAA",
                };

                const percentage = totalEmotions
                  ? (Number(count) / totalEmotions) * 100
                  : 0;

                return (
                  <div
                    key={name}
                    className={`rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 ${
                      darkMode
                        ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                        : "bg-slate-50 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-3xl"
                        role="img"
                        aria-label={name}
                      >
                        {info.emoji}
                      </span>

                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: info.color,
                        }}
                      />
                    </div>

                    <p className={`text-sm font-semibold mt-4 ${headingText}`}>
                      {name}
                    </p>

                    <div className="flex items-end justify-between mt-2">
                      <span className={`text-2xl font-bold ${headingText}`}>
                        {count}
                      </span>

                      <span className={`text-xs ${mutedText}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div
                      className={`mt-3 h-1.5 rounded-full overflow-hidden ${
                        darkMode ? "bg-slate-700" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: info.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {/* Manual Review */}
      <section
        className={`rounded-2xl border p-5 md:p-6 shadow-sm ${cardClass}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <ShieldCheck
                size={21}
                className="text-orange-500"
              />
            </div>

            <div>
              <h2 className={`font-bold ${headingText}`}>
                Manual Review Summary
              </h2>

              <p className={`text-xs mt-1 ${mutedText}`}>
                Records flagged by analysis services
              </p>
            </div>
          </div>

          <span className="rounded-xl bg-orange-500/10 text-orange-500 px-3 py-2 text-xs font-semibold">
            {loading ? "..." : totalReviewFlags} Total Review Flags
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reviewItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`rounded-xl p-4 ${softBackground}`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-medium ${mutedText}`}>
                    {item.title}
                  </p>

                  <Icon
                    size={19}
                    className="text-orange-500"
                  />
                </div>

                <p className={`text-2xl font-bold mt-3 ${headingText}`}>
                  {loading ? "..." : item.value ?? 0}
                </p>

                <p className={`text-xs mt-1 ${mutedText}`}>
                  Flagged records
                </p>
              </div>
            );
          })}
        </div>

        <p className={`text-xs mt-4 ${mutedText}`}>
          One record may be flagged by multiple services, so review counts can overlap.
        </p>
      </section>

      {/* Recent University Records */}
      <section
        className={`rounded-2xl border overflow-hidden shadow-sm ${cardClass}`}
      >
        {/* Records Header */}
        <div className="px-5 md:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <MessageSquare
                size={21}
                className="text-blue-500"
              />
            </div>

            <div>
              <h2 className={`text-base font-bold ${headingText}`}>
                Recent University Records
              </h2>

              <p className={`text-xs mt-1 ${mutedText}`}>
                Latest submissions received from Google Sheets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-3 py-2 rounded-lg font-medium ${
                darkMode
                  ? "bg-slate-800 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {records.length} Total Records
            </span>

            <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Synced
            </span>
          </div>
        </div>

        <div
          className={`border-t ${
            darkMode ? "border-slate-800" : "border-slate-100"
          }`}
        />

        {loading ? (
          <div className="px-6 py-12 text-center">
            <RefreshCw
              size={22}
              className="animate-spin mx-auto text-blue-500 mb-3"
            />

            <p className={`text-sm ${mutedText}`}>
              Loading university records...
            </p>
          </div>
        ) : records.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Database
              size={28}
              className={`mx-auto mb-3 ${mutedText}`}
            />

            <p className={`text-sm font-medium ${headingText}`}>
              No records available
            </p>

            <p className={`text-xs mt-1 ${mutedText}`}>
              University submissions will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr
                    className={
                      darkMode
                        ? "bg-slate-800/50"
                        : "bg-slate-50/80"
                    }
                  >
                    <th
                      className={`w-16 px-6 py-4 text-[10px] uppercase tracking-wider font-bold ${mutedText}`}
                    >
                      #
                    </th>

                    <th
                      className={`px-5 py-4 text-[10px] uppercase tracking-wider font-bold ${mutedText}`}
                    >
                      University
                    </th>

                    <th
                      className={`px-5 py-4 text-[10px] uppercase tracking-wider font-bold ${mutedText}`}
                    >
                      Issue Category
                    </th>

                    <th
                      className={`px-5 py-4 text-[10px] uppercase tracking-wider font-bold ${mutedText}`}
                    >
                      Issue Description
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {records
                    .slice(-5)
                    .reverse()
                    .map((record, index) => (
                      <tr
                        key={record._id || index}
                        className={`border-t transition-colors ${
                          darkMode
                            ? "border-slate-800 hover:bg-slate-800/40"
                            : "border-slate-100 hover:bg-blue-50/40"
                        }`}
                      >
                        <td
                          className={`px-6 py-5 text-xs font-semibold ${mutedText}`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                                darkMode
                                  ? "bg-blue-500/10"
                                  : "bg-blue-50"
                              }`}
                            >
                              <Database
                                size={16}
                                className="text-blue-500"
                              />
                            </div>

                            <span
                              className={`text-sm font-semibold ${headingText}`}
                            >
                              {record["University Name"] || "Not provided"}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex max-w-[220px] rounded-lg px-3 py-1.5 text-[11px] leading-5 font-medium ${
                              darkMode
                                ? "bg-blue-500/10 text-blue-300"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {record["University Issue Category"] || "Not provided"}
                          </span>
                        </td>

                        <td
                          className={`px-5 py-5 text-sm ${mutedText}`}
                        >
                          <div className="max-w-md line-clamp-2 leading-6">
                            {record["Describe Your Issue"] || "No description provided"}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div
              className={`px-5 md:px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                darkMode
                  ? "border-slate-800 bg-slate-900/40"
                  : "border-slate-100 bg-slate-50/50"
              }`}
            >
              <p className={`text-xs ${mutedText}`}>
                Showing latest {Math.min(records.length, 5)} records
              </p>

              <p className={`text-xs flex items-center gap-2 ${mutedText}`}>
                <Clock3 size={13} />
                Updated with latest available data
              </p>
            </div>
          </>
        )}
      </section>

      {/* Dashboard Footer */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t pt-5 ${
          darkMode
            ? "border-slate-800"
            : "border-slate-200"
        }`}
      >
        <div>
          <p
            className={`flex items-center gap-2 text-sm font-semibold ${headingText}`}
          >
            <Sparkles
              size={16}
              className="text-blue-500"
            />

            MultiLingua AI Data Intelligence System
          </p>

          <p className={`text-xs mt-1 ${mutedText}`}>
            Analysis Method: {analytics?.analysisMethod || "—"}
          </p>
        </div>

        <div className={`flex items-center gap-2 text-xs ${mutedText}`}>
          <Clock3 size={14} />

          Last updated:{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Not updated"}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;