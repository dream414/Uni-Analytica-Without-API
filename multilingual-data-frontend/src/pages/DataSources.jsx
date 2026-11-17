
import { useCallback, useEffect, useState } from "react";
import {
  Database,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Layers3,
  Table2,
  ShieldCheck,
  ArrowUpRight,
  Activity,
  Server,
} from "lucide-react";

import API from "../services/api";

function DataSources({ darkMode = false }) {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState(null);

  const theme = {
    text: darkMode ? "text-white" : "text-slate-900",
    muted: darkMode ? "text-slate-400" : "text-slate-500",
    surface: darkMode
      ? "bg-[#151225] border-white/[0.08]"
      : "bg-white border-slate-200",
    soft: darkMode ? "bg-[#1d1930]" : "bg-[#f8f7fc]",
    divider: darkMode ? "border-white/[0.08]" : "border-slate-100",
    purple: darkMode ? "text-purple-300" : "text-[#7044c5]",
    purpleBg: darkMode ? "bg-purple-500/15" : "bg-[#f1ebff]",
  };

  const loadSource = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/data");
      const data = response.data?.data;

      if (!Array.isArray(data)) {
        throw new Error("Unexpected data response");
      }

      setRecords(data);
      setLastChecked(new Date());
    } catch (err) {
      console.error("Data Sources API Error:", err);
      setError("Unable to retrieve records from the data API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSource();
  }, [loadSource]);

  const dataFields = [
    {
      name: "University Name",
      description: "University associated with the submission",
    },
    {
      name: "University Issue Category",
      description: "Category assigned to the reported issue",
    },
    {
      name: "Describe Your Issue",
      description: "Original issue description submitted by the user",
    },
  ];

  const formatTime = (date) => {
    if (!date) return "Not checked yet";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-7 pb-8">

      {/* Header */}
      <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
        <div>
          <div className={`flex items-center gap-2 text-xs mb-4 ${theme.muted}`}>
            <span>Workspace</span>
            <span>/</span>
            <span className={theme.purple}>Data Sources</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6336bd] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Database size={25} className="text-white" />
            </div>

            <div>
              <h1 className={`text-2xl md:text-[30px] font-bold tracking-tight ${theme.text}`}>
                Data Sources
              </h1>

              <p className={`text-sm mt-1 ${theme.muted}`}>
                View your connected data source and retrieved records.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadSource}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2.5 min-h-[44px] px-5 rounded-xl bg-[#7044c5] hover:bg-[#6035b3] text-white text-sm font-semibold shadow-md shadow-purple-500/15 transition disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          {loading ? "Checking..." : "Check Data"}
        </button>
      </header>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
          <AlertCircle size={19} />
          {error}
        </div>
      )}

      {/* Source Overview */}
      <section className={`mt-8 rounded-2xl border overflow-hidden ${theme.surface}`}>
        <div className="p-5 md:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="flex items-center gap-8 pt-6">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#e9f7ed] flex items-center justify-center">
                <FileSpreadsheet size={25} className="text-[#269653]" />
              </div>

              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${theme.muted}`}>
                  Primary Data Source
                </p>

                <h2 className={`text-xl font-bold mt-1 ${theme.text}`}>
                  Google Sheets
                </h2>

                <p className={`text-sm mt-1 ${theme.muted}`}>
                  Spreadsheet-based university issue records
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${theme.soft}`}>
              {loading ? (
                <RefreshCw size={18} className="animate-spin text-purple-500" />
              ) : error ? (
                <AlertCircle size={19} className="text-red-500" />
              ) : (
                <CheckCircle2 size={19} className="text-emerald-500" />
              )}

              <div>
                <p className={`text-sm font-bold ${theme.text}`}>
                  {loading
                    ? "Checking data..."
                    : error
                    ? "Data unavailable"
                    : "Data retrieved"}
                </p>

                <p className={`text-xs mt-0.5 ${theme.muted}`}>
                  {loading
                    ? "Please wait"
                    : error
                    ? "Request failed"
                    : "API request successful"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-3 border-t ${theme.divider}`}>
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Layers3 size={16} className={theme.purple} />
              <p className={`text-xs font-medium ${theme.muted}`}>
                Retrieved Records
              </p>
            </div>

            <p className={`text-2xl font-bold ${theme.text}`}>
              {loading ? "—" : records.length}
            </p>
          </div>

          <div className={`p-5 md:p-6 border-t sm:border-t-0 sm:border-l ${theme.divider}`}>
            <div className="flex items-center gap-2 mb-2">
              <Table2 size={16} className={theme.purple} />
              <p className={`text-xs font-medium ${theme.muted}`}>
                Data Fields
              </p>
            </div>

            <p className={`text-2xl font-bold ${theme.text}`}>
              {dataFields.length}
            </p>
          </div>

          <div className={`p-5 md:p-6 border-t sm:border-t-0 sm:border-l ${theme.divider}`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock3 size={16} className={theme.purple} />
              <p className={`text-xs font-medium ${theme.muted}`}>
                Last API Check
              </p>
            </div>

            <p className={`text-lg font-bold ${theme.text}`}>
              {loading ? "Checking..." : formatTime(lastChecked)}
            </p>
          </div>
        </div>
      </section>

      {/* Source Details and Information */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Data Fields */}
        <section className={`xl:col-span-2 rounded-2xl border ${theme.surface} overflow-hidden`}>
          <div className="p-5 md:p-6">
            <div className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${theme.purpleBg}`}>
                <Table2 size={18} className={theme.purple} />
              </div>

              <div>
                <h2 className={`text-base font-bold ${theme.text}`}>
                  Available Data Fields
                </h2>

                <p className={`text-xs mt-1 ${theme.muted}`}>
                  Fields used by the current data interface
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {dataFields.map((field, index) => (
                <div
                  key={field.name}
                  className={`flex items-start gap-4 p-4 rounded-xl ${theme.soft}`}
                >
                  <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${theme.purpleBg} ${theme.purple}`}>
                    0{index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className={`text-sm font-semibold break-words ${theme.text}`}>
                      {field.name}
                    </p>

                    <p className={`text-xs mt-1 leading-5 ${theme.muted}`}>
                      {field.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Source Information */}
        <section className={`rounded-2xl border ${theme.surface} p-5 md:p-6`}>
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${theme.purpleBg}`}>
              <Server size={18} className={theme.purple} />
            </div>

            <h2 className={`text-base font-bold ${theme.text}`}>
              Source Information
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className={`text-xs ${theme.muted}`}>
                Source Name
              </p>
              <p className={`text-sm font-semibold mt-1 ${theme.text}`}>
                Google Sheets
              </p>
            </div>

            <div>
              <p className={`text-xs ${theme.muted}`}>
                Retrieval Endpoint
              </p>
              <p className={`text-sm font-semibold mt-1 ${theme.text}`}>
                GET /api/data
              </p>
            </div>

            <div>
              <p className={`text-xs ${theme.muted}`}>
                Integration Type
              </p>
              <p className={`text-sm font-semibold mt-1 ${theme.text}`}>
                Spreadsheet Integration
              </p>
            </div>

            <div>
              <p className={`text-xs ${theme.muted}`}>
                Current Result
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className={`w-2 h-2 rounded-full ${
                  loading
                    ? "bg-amber-400"
                    : error
                    ? "bg-red-500"
                    : "bg-emerald-500"
                }`} />

                <span className={`text-sm font-semibold ${theme.text}`}>
                  {loading
                    ? "Checking"
                    : error
                    ? "Unavailable"
                    : "Records available"}
                </span>
              </div>
            </div>
          </div>

          <div className={`mt-7 p-4 rounded-xl ${theme.purpleBg}`}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className={theme.purple} />
              <p className={`text-xs font-bold ${theme.purple}`}>
                Data Access
              </p>
            </div>

            <p className={`text-xs leading-5 mt-2 ${theme.muted}`}>
              Records are retrieved through your existing backend API. This page does not expose spreadsheet credentials.
            </p>
          </div>
        </section>
      </div>

      {/* Bottom Information */}
      <section className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border p-5 ${theme.surface}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.purpleBg}`}>
            <Activity size={19} className={theme.purple} />
          </div>

          <div>
            <p className={`text-sm font-bold ${theme.text}`}>
              Data Source Overview
            </p>
            <p className={`text-xs mt-1 ${theme.muted}`}>
              Review the current data retrieval result.
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 text-xs font-semibold ${theme.purple}`}>
          <span>View All Data</span>
          <ArrowUpRight size={15} />
        </div>
      </section>

      {/* Footer */}
      <footer className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t pt-5 ${theme.divider}`}>
        <p className={`text-xs font-semibold ${theme.text}`}>
          MultiLingua AI Data Intelligence System
        </p>

        <p className={`text-xs ${theme.muted}`}>
          Primary Source: Google Sheets
        </p>
      </footer>
    </div>
  );
}

export default DataSources;