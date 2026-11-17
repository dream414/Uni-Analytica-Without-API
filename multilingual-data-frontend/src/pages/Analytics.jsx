
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Database,
  Copy,
  CheckCircle2,
  Tags,
  Search,
  BarChart3,
  Globe2,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertCircle,
  Languages,
  Smile,
  Frown,
  Meh,
} from "lucide-react";

import API from "../services/api";

// --------------------------------------------------
// COLORS
// --------------------------------------------------

const COLORS = [
  "#5278F5",
  "#19B99A",
  "#9B76E8",
  "#E7A33E",
  "#E879A8",
  "#35A6CE",
  "#D47B56",
  "#82965B",
];

const SENTIMENT_COLORS = {
  Positive: "#19B99A",
  Negative: "#EF7777",
  Neutral: "#5278F5",
  Unknown: "#929BAA",
};

const EMOTION_COLORS = {
  Happy: "#19B99A",
  Sad: "#5278F5",
  Angry: "#EF7777",
  Anger: "#EF7777",
  Fear: "#9B76E8",
  Worried: "#E7A33E",
  Neutral: "#82909F",
  Uncertain: "#D18C49",
  Unknown: "#929BAA",
  "Needs Review": "#D18C49",
};

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const getEntries = (data = {}) =>
  Object.entries(data).sort((a, b) => Number(b[1]) - Number(a[1]));

const getTotal = (data = {}) =>
  Object.values(data).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
  );

const formatNumber = (value) =>
  Number(value || 0).toLocaleString();

const percentage = (value, total) =>
  total > 0
    ? Number(((Number(value) / total) * 100).toFixed(1))
    : 0;

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

function Analytics({ darkMode = false }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");

  const isDark = darkMode;

  const theme = {
    background: isDark ? "#111827" : "#FFFFFF",
    surface: isDark ? "#182235" : "#FFFFFF",
    subtle: isDark ? "#202D42" : "#F5F7FB",
    border: isDark ? "#2B3950" : "#E8ECF3",
    text: isDark ? "#F8FAFC" : "#172033",
    muted: isDark ? "#94A3B8" : "#8993A5",
  };

  // --------------------------------------------------
  // API
  // --------------------------------------------------

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/analytics");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load analytics."
        );
      }

      setAnalytics(response.data.data || {});
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Analytics API Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const categoryData = analytics?.categorySummary || {};
  const languageData = analytics?.languageSummary || {};
  const sentimentData = analytics?.sentimentSummary || {};
  const emotionData = analytics?.emotionSummary || {};
  const reviewData = analytics?.reviewSummary || {};

  const totalRecords = Number(analytics?.totalRecords || 0);
  const uniqueRecords = Number(analytics?.uniqueRecords || 0);
  const duplicateCount = Number(analytics?.duplicateCount || 0);

  const totalReviews =
    Number(reviewData.language || 0) +
    Number(reviewData.classification || 0) +
    Number(reviewData.textAnalysis || 0);

  const stats = [
    {
      label: "Total Records",
      value: totalRecords,
      icon: Database,
      color: "#5278F5",
    },
    {
      label: "Unique Records",
      value: uniqueRecords,
      icon: CheckCircle2,
      color: "#19B99A",
    },
    {
      label: "Duplicates",
      value: duplicateCount,
      icon: Copy,
      color: "#E7A33E",
    },
    {
      label: "Categories",
      value: Object.keys(categoryData).length,
      icon: Tags,
      color: "#9B76E8",
    },
  ];

  const tabs = [
    "Overview",
    "Categories",
    "Languages",
    "Sentiment",
    "Review Analysis",
  ];

  // --------------------------------------------------
  // STYLES
  // --------------------------------------------------

  const panelStyle = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 18,
  };

  // --------------------------------------------------
  // SECTION HEADER
  // --------------------------------------------------

  const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-7 text-center">
      <h2
        className="text-xl font-bold tracking-tight"
        style={{ color: theme.text }}
      >
        {title}
      </h2>

      <p
        className="mt-2 text-sm"
        style={{ color: theme.muted }}
      >
        {subtitle}
      </p>
    </div>
  );

  // --------------------------------------------------
  // METRIC STRIP
  // --------------------------------------------------

  const MetricStrip = () => (
    <div
      className="grid grid-cols-2 lg:grid-cols-4"
      style={panelStyle}
    >
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center px-4 py-7 text-center"
            style={{
              borderRight:
                index !== 3 && index !== 1
                  ? `1px solid ${theme.border}`
                  : undefined,
            }}
          >
            <div
              className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: `${item.color}15`,
                color: item.color,
              }}
            >
              <Icon size={21} />
            </div>

            <div
              className="text-3xl font-bold"
              style={{ color: theme.text }}
            >
              {loading ? "—" : formatNumber(item.value)}
            </div>

            <div
              className="mt-2 text-xs font-medium"
              style={{ color: theme.muted }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );

  // --------------------------------------------------
  // DISTRIBUTION
  // --------------------------------------------------

  const Distribution = ({
    title,
    subtitle,
    data,
    colorMap,
  }) => {
    const entries = getEntries(data);
    const total = getTotal(data);

    return (
      <div className="p-6 sm:p-8" style={panelStyle}>
        <SectionHeader title={title} subtitle={subtitle} />

        {loading ? (
          <div className="space-y-5 animate-pulse">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <div
                  className="mb-2 h-3 w-1/3 rounded"
                  style={{ background: theme.subtle }}
                />
                <div
                  className="h-2 rounded-full"
                  style={{ background: theme.subtle }}
                />
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div
              className="mb-7 flex flex-col items-center justify-center rounded-2xl py-6"
              style={{ background: theme.subtle }}
            >
              <span
                className="text-4xl font-bold"
                style={{ color: theme.text }}
              >
                {formatNumber(total)}
              </span>

              <span
                className="mt-2 text-xs font-medium uppercase tracking-widest"
                style={{ color: theme.muted }}
              >
                Total Records
              </span>
            </div>

            <div className="space-y-6">
              {entries.map(([name, value], index) => {
                const percent = percentage(value, total);

                const color = colorMap
                  ? colorMap[name] || "#929BAA"
                  : COLORS[index % COLORS.length];

                return (
                  <div key={name}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span
                        className="truncate text-sm font-semibold"
                        style={{ color: theme.text }}
                      >
                        {name}
                      </span>

                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className="text-xs"
                          style={{ color: theme.muted }}
                        >
                          {formatNumber(value)}
                        </span>

                        <span
                          className="w-12 text-right text-sm font-bold"
                          style={{ color }}
                        >
                          {percent}%
                        </span>
                      </div>
                    </div>

                    <div
                      className="h-2.5 overflow-hidden rounded-full"
                      style={{ background: theme.subtle }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${percent}%`,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  // --------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------

  const EmptyState = () => (
    <div className="flex min-h-40 flex-col items-center justify-center text-center">
      <Database size={32} color={theme.muted} />

      <p
        className="mt-3 text-sm font-semibold"
        style={{ color: theme.text }}
      >
        No data available
      </p>

      <p
        className="mt-1 text-xs"
        style={{ color: theme.muted }}
      >
        Data will appear here when records are available.
      </p>
    </div>
  );

  // --------------------------------------------------
  // CATEGORY TABLE
  // --------------------------------------------------

  const SummaryTable = ({ data, title }) => {
    const entries = useMemo(
      () =>
        getEntries(data).filter(([name]) =>
          name.toLowerCase().includes(search.toLowerCase())
        ),
      [data, search]
    );

    const total = getTotal(data);

    return (
      <div className="overflow-hidden" style={panelStyle}>
        <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: theme.border }}
        >
          <div>
            <h3
              className="text-lg font-bold"
              style={{ color: theme.text }}
            >
              {title}
            </h3>

            <p
              className="mt-1 text-xs"
              style={{ color: theme.muted }}
            >
              {entries.length} results available
            </p>
          </div>

          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{
              borderColor: theme.border,
              background: theme.subtle,
            }}
          >
            <Search size={16} color={theme.muted} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none sm:w-48"
              style={{ color: theme.text }}
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 p-6 animate-pulse">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-10 rounded-lg"
                style={{ background: theme.subtle }}
              />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="p-8">
            <EmptyState />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-left">
              <thead>
                <tr
                  className="text-xs uppercase tracking-wider"
                  style={{
                    background: theme.subtle,
                    color: theme.muted,
                  }}
                >
                  <th className="px-6 py-4">Category / Type</th>
                  <th className="px-6 py-4">Records</th>
                  <th className="px-6 py-4">Distribution</th>
                  <th className="px-6 py-4">Percentage</th>
                </tr>
              </thead>

              <tbody>
                {entries.map(([name, value]) => {
                  const percent = percentage(value, total);

                  return (
                    <tr
                      key={name}
                      className="border-t transition-colors hover:bg-black/[0.025]"
                      style={{ borderColor: theme.border }}
                    >
                      <td
                        className="px-6 py-4 text-sm font-semibold"
                        style={{ color: theme.text }}
                      >
                        {name}
                      </td>

                      <td
                        className="px-6 py-4 text-sm"
                        style={{ color: theme.text }}
                      >
                        {formatNumber(value)}
                      </td>

                      <td className="px-6 py-4">
                        <div
                          className="h-2 w-32 overflow-hidden rounded-full"
                          style={{ background: theme.subtle }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percent}%`,
                              background: "#5278F5",
                            }}
                          />
                        </div>
                      </td>

                      <td
                        className="px-6 py-4 text-sm font-bold"
                        style={{ color: "#5278F5" }}
                      >
                        {percent}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // --------------------------------------------------
  // REVIEW ANALYSIS
  // --------------------------------------------------

  const ReviewAnalysis = () => {
    const items = [
      {
        label: "Language Detection",
        value: Number(reviewData.language || 0),
        color: "#5278F5",
      },
      {
        label: "Classification",
        value: Number(reviewData.classification || 0),
        color: "#9B76E8",
      },
      {
        label: "Text Analysis",
        value: Number(reviewData.textAnalysis || 0),
        color: "#E7A33E",
      },
    ];

    return (
      <div className="mx-auto max-w-3xl p-6 sm:p-9" style={panelStyle}>
        <SectionHeader
          title="Manual Review Analysis"
          subtitle="Records flagged by the individual analysis services"
        />

        <div
          className="mb-8 rounded-2xl p-7 text-center"
          style={{ background: theme.subtle }}
        >
          <ShieldCheck
            size={28}
            className="mx-auto mb-3"
            color="#E7A33E"
          />

          <div
            className="text-4xl font-bold"
            style={{ color: theme.text }}
          >
            {loading ? "—" : formatNumber(totalReviews)}
          </div>

          <p
            className="mt-2 text-xs"
            style={{ color: theme.muted }}
          >
            Total Review Flags
          </p>
        </div>

        {items.map((item) => (
          <div key={item.label} className="mb-7">
            <div className="mb-3 flex items-center justify-between">
              <span
                className="text-sm font-semibold"
                style={{ color: theme.text }}
              >
                {item.label}
              </span>

              <span
                className="font-bold"
                style={{ color: item.color }}
              >
                {formatNumber(item.value)}
              </span>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full"
              style={{ background: theme.subtle }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${percentage(item.value, totalReviews)}%`,
                  background: item.color,
                }}
              />
            </div>
          </div>
        ))}

        <div
          className="mt-7 flex gap-3 rounded-xl p-4"
          style={{ background: theme.subtle }}
        >
          <AlertCircle
            size={19}
            className="shrink-0"
            color="#E7A33E"
          />

          <p
            className="text-xs leading-6"
            style={{ color: theme.muted }}
          >
            Review counts may overlap. One record can be flagged
            by more than one analysis service, so these counts
            do not necessarily represent unique records.
          </p>
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // TAB CONTENT
  // --------------------------------------------------

  const renderContent = () => {
    switch (activeTab) {
      case "Categories":
        return (
          <div className="space-y-8">
            <Distribution
              title="Issue Category Distribution"
              subtitle="Classification of university submissions"
              data={categoryData}
            />

            <SummaryTable
              data={categoryData}
              title="Category Breakdown"
            />
          </div>
        );

      case "Languages":
        return (
          <div className="space-y-8">
            <Distribution
              title="Language Distribution"
              subtitle="Languages detected in submitted records"
              data={languageData}
            />

            <SummaryTable
              data={languageData}
              title="Language Breakdown"
            />
          </div>
        );

      case "Sentiment":
        return (
          <div className="grid grid-cols-1 gap-7 xl:grid-cols-2">
            <Distribution
              title="Sentiment Analysis"
              subtitle="Positive, negative and neutral patterns"
              data={sentimentData}
              colorMap={SENTIMENT_COLORS}
            />

            <Distribution
              title="Emotion Analysis"
              subtitle="Detected emotional patterns"
              data={emotionData}
              colorMap={EMOTION_COLORS}
            />
          </div>
        );

      case "Review Analysis":
        return <ReviewAnalysis />;

      default:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-7 xl:grid-cols-2">
              <Distribution
                title="Issue Categories"
                subtitle="University issue classification"
                data={categoryData}
              />

              <Distribution
                title="Language Insights"
                subtitle="Detected languages in records"
                data={languageData}
              />
            </div>

            <div className="grid grid-cols-1 gap-7 xl:grid-cols-2">
              <Distribution
                title="Sentiment Overview"
                subtitle="Overall sentiment distribution"
                data={sentimentData}
                colorMap={SENTIMENT_COLORS}
              />

              <Distribution
                title="Emotion Overview"
                subtitle="Emotional patterns in submissions"
                data={emotionData}
                colorMap={EMOTION_COLORS}
              />
            </div>

            <SummaryTable
              data={categoryData}
              title="Category Overview"
            />
          </div>
        );
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div
      className="min-h-screen px-3 pb-12 pt-6 sm:px-6 lg:px-8"
      style={{
        background: isDark ? "#111827" : "#F7F9FC",
        color: theme.text,
      }}
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-9 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: isDark ? "#1D2A43" : "#EAF0FF",
              color: "#5278F5",
            }}
          >
            <BarChart3 size={27} />
          </div>

          <p
            className="mb-2 text-xs font-bold uppercase tracking-[3px]"
            style={{ color: "#5278F5" }}
          >
            Data Intelligence Center
          </p>

          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: theme.text }}
          >
            Analytics Workspace
          </h1>

          <p
            className="mx-auto mt-3 max-w-xl text-sm leading-7"
            style={{ color: theme.muted }}
          >
            Explore university data, language patterns,
            sentiment insights and classification results
            through a unified analytical workspace.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span
              className="flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold"
              style={{
                borderColor: theme.border,
                background: theme.surface,
                color: theme.muted,
              }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Backend Connected
            </span>

            <button
              onClick={loadAnalytics}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              style={{ background: "#5278F5" }}
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Analytics
            </button>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            className="mb-6 flex items-start gap-3 rounded-xl border p-4"
            style={{
              background: isDark ? "#3B2028" : "#FFF1F2",
              borderColor: "#EF7777",
            }}
          >
            <AlertCircle color="#EF7777" size={20} />

            <div>
              <p className="text-sm font-bold text-red-500">
                Analytics loading failed
              </p>

              <p className="mt-1 text-xs text-red-400">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* METRICS */}

        <MetricStrip />

        {/* NAVIGATION */}

        <div className="mt-10 mb-7">
          <div className="mb-5 text-center">
            <h2
              className="text-xl font-bold"
              style={{ color: theme.text }}
            >
              Explore Analytics
            </h2>

            <p
              className="mt-2 text-xs"
              style={{ color: theme.muted }}
            >
              Select an analytical view to explore your dataset
            </p>
          </div>

          <div
            className="flex flex-wrap justify-center gap-2 rounded-2xl p-2"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearch("");
                }}
                className="rounded-xl px-4 py-3 text-xs font-semibold transition-all sm:px-5"
                style={{
                  background:
                    activeTab === tab ? "#5278F5" : "transparent",
                  color:
                    activeTab === tab
                      ? "#FFFFFF"
                      : theme.muted,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}

        <div className="min-h-[400px]">
          {renderContent()}
        </div>

        {/* FOOTER */}

        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-center sm:flex-row"
          style={{ borderColor: theme.border }}
        >
          <div className="flex items-center gap-2">
            <Activity size={17} color="#5278F5" />

            <span
              className="text-xs font-bold"
              style={{ color: theme.text }}
            >
              MultiLingua AI Data Intelligence
            </span>
          </div>

          <p
            className="text-xs"
            style={{ color: theme.muted }}
          >
            Method: {analytics?.analysisMethod || "—"}
            {" · "}
            Last updated:{" "}
            {lastUpdated
              ? lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Not updated"}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Analytics;