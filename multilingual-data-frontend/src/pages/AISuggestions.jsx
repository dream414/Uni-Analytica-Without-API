
import { useEffect, useMemo, useState } from "react";
import {
  Lightbulb,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Target,
  Database,
  GraduationCap,
  BriefcaseBusiness,
  Users,
  Building2,
  Bus,
  ShieldCheck,
  ClipboardCheck,
  Sparkles,
  ArrowUpRight,
  Filter,
} from "lucide-react";

import API from "../services/api";

const iconMap = {
  Priority: Target,
  "Academic Improvement": GraduationCap,
  "Career Development": BriefcaseBusiness,
  "Student Support": Users,
  Infrastructure: Building2,
  "Student Facilities": Bus,
  "Data Quality": Database,
  "Data Review": ClipboardCheck,
};

const priorityStyles = {
  High: {
    badge: "bg-red-500/10 text-red-500 border-red-500/20",
    dot: "bg-red-500",
    label: "High Priority",
  },
  Medium: {
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    dot: "bg-amber-500",
    label: "Medium Priority",
  },
  Low: {
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    dot: "bg-emerald-500",
    label: "Low Priority",
  },
};

function AISuggestions({ darkMode = false }) {
  const [suggestions, setSuggestions] = useState([]);
  const [totalSuggestions, setTotalSuggestions] = useState(0);
  const [generatedBy, setGeneratedBy] = useState("Rule-Based Analysis");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const heading = darkMode ? "text-white" : "text-slate-900";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";

  const card = `rounded-2xl border ${
    darkMode
      ? "bg-[#19152a] border-white/10"
      : "bg-white border-slate-200"
  }`;

  const fetchSuggestions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await API.get("/suggestions");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load suggestions."
        );
      }

      const result = response.data.data || {};

      setSuggestions(
        Array.isArray(result.suggestions) ? result.suggestions : []
      );

      setTotalSuggestions(
        Number(result.totalSuggestions) || 0
      );

      setGeneratedBy(
        result.generatedBy || "Rule-Based Analysis"
      );
    } catch (err) {
      console.error("Suggestions Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch suggestions. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const highCount = suggestions.filter(
    (item) => item.priority === "High"
  ).length;

  const mediumCount = suggestions.filter(
    (item) => item.priority === "Medium"
  ).length;

  const lowCount = suggestions.filter(
    (item) => item.priority === "Low"
  ).length;

  const filteredSuggestions = useMemo(() => {
    if (activeFilter === "All") return suggestions;

    return suggestions.filter(
      (item) => item.priority === activeFilter
    );
  }, [suggestions, activeFilter]);

  const stats = [
    {
      title: "Total Suggestions",
      value: totalSuggestions,
      subtitle: "Generated insights",
      icon: Lightbulb,
      color: "text-violet-500",
      background: "bg-violet-500/10",
    },
    {
      title: "High Priority",
      value: highCount,
      subtitle: "Needs immediate attention",
      icon: AlertTriangle,
      color: "text-red-500",
      background: "bg-red-500/10",
    },
    {
      title: "Medium Priority",
      value: mediumCount,
      subtitle: "Recommended improvements",
      icon: TrendingUp,
      color: "text-amber-500",
      background: "bg-amber-500/10",
    },
    {
      title: "Low Priority",
      value: lowCount,
      subtitle: "Additional recommendations",
      icon: CheckCircle2,
      color: "text-emerald-500",
      background: "bg-emerald-500/10",
    },
  ];

  const filters = ["All", "High", "Medium", "Low"];

  const getIcon = (type) => {
    return iconMap[type] || Sparkles;
  };

  const getPriorityStyle = (priority) => {
    return (
      priorityStyles[priority] || {
        badge: "bg-slate-500/10 text-slate-500 border-slate-500/20",
        dot: "bg-slate-500",
        label: priority || "Unspecified",
      }
    );
  };

  const renderLoading = () => (
    <div className={`${card} flex min-h-[280px] flex-col items-center justify-center gap-4 p-8`}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-600" />
      <div className="text-center">
        <h3 className={`font-semibold ${heading}`}>
          Generating Suggestions
        </h3>
        <p className={`mt-2 text-sm ${muted}`}>
          Analyzing available university records...
        </p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className={`${card} flex flex-col items-center justify-center px-5 py-12 text-center`}>
      <div className="rounded-2xl bg-red-500/10 p-4 text-red-500">
        <AlertCircle size={30} />
      </div>

      <h3 className={`mt-5 text-lg font-bold ${heading}`}>
        Unable to Load Suggestions
      </h3>

      <p className={`mt-2 max-w-lg text-sm leading-6 ${muted}`}>
        {error}
      </p>

      <button
        onClick={() => fetchSuggestions()}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );

  const renderEmpty = () => (
    <div className={`${card} flex flex-col items-center justify-center px-5 py-14 text-center`}>
      <div className="rounded-2xl bg-violet-500/10 p-5 text-violet-500">
        <Lightbulb size={34} />
      </div>

      <h3 className={`mt-5 text-lg font-bold ${heading}`}>
        No Suggestions Available
      </h3>

      <p className={`mt-2 max-w-md text-sm leading-6 ${muted}`}>
        There are currently no suggestions to display. Add university
        records to your Google Sheet and refresh the analysis.
      </p>

      <button
        onClick={() => fetchSuggestions(true)}
        disabled={refreshing}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
      >
        <RefreshCw
          size={16}
          className={refreshing ? "animate-spin" : ""}
        />
        Refresh Suggestions
      </button>
    </div>
  );

  const renderSuggestion = (item, index) => {
    const Icon = getIcon(item.type);
    const priority = getPriorityStyle(item.priority);

    return (
      <article
        key={`${item.type}-${item.title}-${index}`}
        className={`${card} group min-w-0 overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-6`}
      >
        <div className="flex flex-col gap-5">
          {/* Card Header */}
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="shrink-0 rounded-xl bg-violet-500/10 p-3 text-violet-500">
                <Icon size={22} />
              </div>

              <div className="min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>
                  {item.type || "General Suggestion"}
                </p>

                <h3 className={`mt-2 text-base font-bold leading-6 ${heading}`}>
                  {item.title}
                </h3>
              </div>
            </div>

            <span
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${priority.badge}`}
            >
              <span className={`h-2 w-2 rounded-full ${priority.dot}`} />
              {item.priority || "N/A"}
            </span>
          </div>

          {/* Description */}
          <div className="min-w-0">
            <p className={`text-sm leading-7 ${muted}`}>
              {item.description}
            </p>
          </div>

          {/* Related Information */}
          <div className="grid grid-cols-1 gap-3 border-t border-slate-200/10 pt-5 sm:grid-cols-2">
            <div className="min-w-0 rounded-xl bg-slate-500/5 p-4">
              <div className="flex items-center gap-2">
                <Database size={15} className="shrink-0 text-violet-500" />
                <span className={`text-xs font-medium ${muted}`}>
                  Related Category
                </span>
              </div>

              <p className={`mt-2 break-words text-sm font-semibold ${heading}`}>
                {item.relatedCategory || "Not specified"}
              </p>
            </div>

            <div className="min-w-0 rounded-xl bg-slate-500/5 p-4">
              <div className="flex items-center gap-2">
                <Target size={15} className="shrink-0 text-violet-500" />
                <span className={`text-xs font-medium ${muted}`}>
                  Related Records
                </span>
              </div>

              <p className={`mt-2 text-lg font-bold ${heading}`}>
                {Number(item.relatedRecords) || 0}
              </p>
            </div>
          </div>

          {/* Recommendation Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`text-xs ${muted}`}>
              Recommendation #{index + 1}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-500">
              Suggested Action
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="w-full min-w-0 space-y-7 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="shrink-0 rounded-2xl bg-violet-600/10 p-4 text-violet-500">
            <Lightbulb size={27} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className={`text-2xl font-bold ${heading}`}>
                AI Suggestions
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-500">
                <Sparkles size={13} />
                Insights
              </span>
            </div>

            <p className={`mt-2 max-w-2xl text-sm leading-6 ${muted}`}>
              Actionable recommendations based on university feedback,
              issue categories and data quality analysis.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchSuggestions(true)}
          disabled={loading || refreshing}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh Suggestions"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className={`${card} min-w-0 p-5 transition hover:shadow-md`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${muted}`}>
                    {stat.title}
                  </p>

                  <h2 className={`mt-3 text-3xl font-bold ${heading}`}>
                    {loading ? "—" : stat.value}
                  </h2>

                  <p className={`mt-2 text-xs leading-5 ${muted}`}>
                    {stat.subtitle}
                  </p>
                </div>

                <div className={`shrink-0 rounded-2xl p-3 ${stat.background} ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analysis Information */}
      <div className={`${card} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-xl bg-blue-500/10 p-3 text-blue-500">
            <ShieldCheck size={21} />
          </div>

          <div className="min-w-0">
            <h3 className={`text-sm font-bold ${heading}`}>
              Analysis Information
            </h3>

            <p className={`mt-1 text-sm leading-6 ${muted}`}>
              Suggestions are generated using the analysis results
              returned by your backend.
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-xl border border-slate-200/10 px-4 py-3">
          <p className={`text-xs ${muted}`}>
            Generation Method
          </p>
          <p className={`mt-1 text-sm font-semibold ${heading}`}>
            {generatedBy}
          </p>
        </div>
      </div>

      {/* Suggestions Heading and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className={`text-xl font-bold ${heading}`}>
            Recommendations
          </h2>
          <p className={`mt-1 text-sm ${muted}`}>
            Review suggested actions based on detected university issues.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`mr-1 inline-flex items-center gap-2 text-xs font-semibold ${muted}`}>
            <Filter size={15} />
            Filter:
          </span>

          {filters.map((filter) => {
            const selected = activeFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  selected
                    ? "bg-violet-600 text-white"
                    : darkMode
                      ? "bg-white/5 text-slate-300 hover:bg-white/10"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggestions Content */}
      {loading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : suggestions.length === 0 ? (
        renderEmpty()
      ) : filteredSuggestions.length === 0 ? (
        <div className={`${card} px-5 py-12 text-center`}>
          <Filter size={28} className="mx-auto text-violet-500" />
          <h3 className={`mt-4 font-bold ${heading}`}>
            No {activeFilter} Priority Suggestions
          </h3>
          <p className={`mt-2 text-sm ${muted}`}>
            Try selecting another priority filter.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className={`text-sm ${muted}`}>
              Showing{" "}
              <span className={`font-bold ${heading}`}>
                {filteredSuggestions.length}
              </span>{" "}
              of{" "}
              <span className={`font-bold ${heading}`}>
                {totalSuggestions}
              </span>{" "}
              suggestions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
            {filteredSuggestions.map((item, index) =>
              renderSuggestion(item, index)
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AISuggestions;