
import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accent = "blue",
  trend,
  trendLabel,
  darkMode = false,
}) {
  const accents = {
    blue: {
      icon: "bg-blue-500/10 text-blue-500",
      line: "bg-blue-500",
      glow: "hover:border-blue-500/40",
    },
    purple: {
      icon: "bg-violet-500/10 text-violet-500",
      line: "bg-violet-500",
      glow: "hover:border-violet-500/40",
    },
    green: {
      icon: "bg-emerald-500/10 text-emerald-500",
      line: "bg-emerald-500",
      glow: "hover:border-emerald-500/40",
    },
    orange: {
      icon: "bg-orange-500/10 text-orange-500",
      line: "bg-orange-500",
      glow: "hover:border-orange-500/40",
    },
    rose: {
      icon: "bg-rose-500/10 text-rose-500",
      line: "bg-rose-500",
      glow: "hover:border-rose-500/40",
    },
  };

  const theme = accents[accent] || accents.blue;
  const isPositive = Number(trend) >= 0;
  const hasTrend = trend !== undefined && trend !== null;

  return (
    <article
      className={`
        group relative overflow-hidden rounded-2xl border
        p-5 transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        ${
          darkMode
            ? "bg-[#111827] border-slate-800 hover:bg-[#151f30]"
            : "bg-white border-slate-200 hover:shadow-slate-200/60"
        }
        ${theme.glow}
      `}
    >
      {/* Accent line */}
      <div
        className={`absolute top-0 left-0 h-[3px] w-full ${theme.line}`}
      />

      {/* Card header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </p>

          <div
            className={`mt-4 text-3xl sm:text-4xl font-bold tracking-tight tabular-nums ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {value ?? "—"}
          </div>
        </div>

        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}
          >
            <Icon size={21} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <p
          className={`text-xs leading-5 ${
            darkMode ? "text-slate-500" : "text-slate-500"
          }`}
        >
          {description}
        </p>

        {hasTrend && (
          <span
            className={`
              inline-flex items-center gap-1 rounded-lg
              px-2 py-1 text-[11px] font-semibold
              ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }
            `}
          >
            {isPositive ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}

            {Math.abs(Number(trend))}%
            {trendLabel && <span>{trendLabel}</span>}
          </span>
        )}
      </div>
    </article>
  );
}

export default StatCard;
