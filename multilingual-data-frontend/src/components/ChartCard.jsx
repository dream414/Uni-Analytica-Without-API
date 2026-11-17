
import React from "react";
import { MoreHorizontal } from "lucide-react";

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  darkMode = false,
  className = "",
  minHeight = "280px",
}) {
  return (
    <section
      className={`
        min-w-0 overflow-hidden rounded-2xl border
        transition-colors duration-200
        ${
          darkMode
            ? "bg-[#111827] border-slate-800"
            : "bg-white border-slate-200"
        }
        ${className}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex flex-wrap items-start justify-between gap-4
          border-b px-5 py-5 sm:px-6
          ${
            darkMode
              ? "border-slate-800"
              : "border-slate-100"
          }
        `}
      >
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <div
              className={`
                flex h-10 w-10 shrink-0 items-center
                justify-center rounded-xl
                ${
                  darkMode
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                }
              `}
            >
              <Icon size={19} strokeWidth={2} />
            </div>
          )}

          <div className="min-w-0">
            <h3
              className={`text-sm sm:text-base font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {title}
            </h3>

            {subtitle && (
              <p
                className={`mt-1 text-xs leading-5 ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action ? (
          <div className="shrink-0">{action}</div>
        ) : (
          <button
            type="button"
            aria-label={`More options for ${title}`}
            className={`
              flex h-8 w-8 shrink-0 items-center justify-center
              rounded-lg transition
              ${
                darkMode
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }
            `}
          >
            <MoreHorizontal size={19} />
          </button>
        )}
      </div>

      {/* Chart Content */}
      <div
        className="min-w-0 p-5 sm:p-6"
        style={{ minHeight }}
      >
        {children}
      </div>
    </section>
  );
}

export default ChartCard;