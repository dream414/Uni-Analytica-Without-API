
import { useEffect, useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileDown,
  Download,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import API from "../services/api";

function Reports({ darkMode = false }) {
  const [totalRecords, setTotalRecords] = useState(null);
  const [loadingCount, setLoadingCount] = useState(true);
  const [downloading, setDownloading] = useState("");
  const [message, setMessage] = useState(null);

  const theme = {
    card: darkMode
      ? "bg-[#191627] border-white/10"
      : "bg-white border-slate-200",
    text: darkMode ? "text-white" : "text-slate-900",
    muted: darkMode ? "text-slate-400" : "text-slate-500",
    subtle: darkMode ? "bg-white/[0.04]" : "bg-slate-50",
  };

  const fetchRecordCount = async () => {
    try {
      setLoadingCount(true);

      const response = await API.get("/analytics");

      if (response.data.success) {
        const analytics = response.data.data;
        setTotalRecords(analytics.totalRecords ?? 0);
      }
    } catch (error) {
      console.error("Record Count Error:", error);
      setTotalRecords(null);
    } finally {
      setLoadingCount(false);
    }
  };

  useEffect(() => {
    fetchRecordCount();
  }, []);

  const reportTypes = [
    {
      id: "pdf",
      title: "PDF Report",
      description:
        "Download a formatted PDF report containing your complete processed dataset.",
      format: "PDF DOCUMENT",
      extension: ".pdf",
      icon: FileText,
      color: "text-rose-500",
      iconBg: darkMode ? "bg-rose-500/10" : "bg-rose-50",
      button:
        "bg-rose-600 hover:bg-rose-700 text-white",
      endpoint: "/export/pdf",
      filename: "multilingual-data-report.pdf",
    },
    {
      id: "excel",
      title: "Excel Report",
      description:
        "Export your complete records into an organized Excel spreadsheet.",
      format: "EXCEL WORKBOOK",
      extension: ".xlsx",
      icon: FileSpreadsheet,
      color: "text-emerald-500",
      iconBg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
      button:
        "bg-emerald-600 hover:bg-emerald-700 text-white",
      endpoint: "/export/excel",
      filename: "multilingual-data-report.xlsx",
    },
    {
      id: "csv",
      title: "CSV Report",
      description:
        "Download your records in CSV format for data sharing and further analysis.",
      format: "CSV FILE",
      extension: ".csv",
      icon: FileDown,
      color: "text-blue-500",
      iconBg: darkMode ? "bg-blue-500/10" : "bg-blue-50",
      button:
        "bg-blue-600 hover:bg-blue-700 text-white",
      endpoint: "/export/csv",
      filename: "multilingual-data-report.csv",
    },
  ];

  const downloadReport = async (report) => {
    try {
      setDownloading(report.id);
      setMessage(null);

      const response = await API.get(report.endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Detect JSON error responses returned as blobs
      if (blob.type.includes("application/json")) {
        const errorText = await blob.text();
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.message || "Report download failed"
        );
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = report.filename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setMessage({
        type: "success",
        text: `${report.title} downloaded successfully.`,
      });
    } catch (error) {
      console.error(`${report.title} Error:`, error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          `Unable to download ${report.title}.`,
      });
    } finally {
      setDownloading("");
    }
  };

  const handleRefresh = () => {
    setMessage(null);
    fetchRecordCount();
  };

  return (
    <div className="space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-xl ${theme.subtle}`}>
              <FileDown className="w-5 h-5 text-violet-500" />
            </div>
            <span className={`text-xs font-semibold tracking-wider ${theme.muted}`}>
              DATA MANAGEMENT
            </span>
          </div>

          <h1 className={`text-2xl md:text-3xl font-bold ${theme.text}`}>
            Reports
          </h1>

          <p className={`text-sm mt-2 ${theme.muted}`}>
            Generate and download reports from your processed multilingual data.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loadingCount}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
            theme.card
          } ${theme.text} disabled:opacity-50`}
        >
          <RefreshCw
            size={16}
            className={loadingCount ? "animate-spin" : ""}
          />
          Refresh Data
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className={`rounded-2xl border p-5 ${theme.card}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${theme.muted}`}>
                Total Available Records
              </p>

              <h2 className={`text-3xl font-bold mt-3 ${theme.text}`}>
                {loadingCount
                  ? "..."
                  : totalRecords === null
                  ? "N/A"
                  : totalRecords.toLocaleString()}
              </h2>

              <p className={`text-xs mt-2 ${theme.muted}`}>
                Records available in analytics
              </p>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${theme.card}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm ${theme.muted}`}>
                Available Export Formats
              </p>

              <h2 className={`text-3xl font-bold mt-3 ${theme.text}`}>
                03
              </h2>

              <p className={`text-xs mt-2 ${theme.muted}`}>
                PDF, Excel and CSV
              </p>
            </div>

            <div className="p-3 rounded-xl bg-violet-500/10">
              <FileDown className="w-6 h-6 text-violet-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Download Feedback */}
      {message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              : "bg-rose-500/10 border-rose-500/20 text-rose-500"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}

          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Export Section */}
      <div>
        <div className="mb-5">
          <h2 className={`text-lg font-bold ${theme.text}`}>
            Export Your Reports
          </h2>

          <p className={`text-sm mt-1 ${theme.muted}`}>
            Select a format to generate and download your complete dataset.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isDownloading = downloading === report.id;

            return (
              <div
                key={report.id}
                className={`rounded-2xl border p-5 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${theme.card}`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${report.iconBg}`}>
                    <Icon className={`w-7 h-7 ${report.color}`} />
                  </div>

                  <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${theme.subtle} ${theme.muted}`}>
                    {report.format}
                  </span>
                </div>

                <h3 className={`text-lg font-bold mt-5 ${theme.text}`}>
                  {report.title}
                </h3>

                <p className={`text-sm leading-6 mt-2 flex-1 ${theme.muted}`}>
                  {report.description}
                </p>

                <div className={`flex items-center gap-2 mt-5 pt-4 border-t ${
                  darkMode ? "border-white/10" : "border-slate-100"
                }`}>
                  <ShieldCheck size={15} className="text-emerald-500" />
                  <span className={`text-xs ${theme.muted}`}>
                    Processed dataset
                  </span>
                  <span className={`ml-auto text-xs font-semibold ${theme.text}`}>
                    {report.extension}
                  </span>
                </div>

                <button
                  onClick={() => downloadReport(report)}
                  disabled={Boolean(downloading) || totalRecords === 0}
                  className={`w-full mt-5 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${report.button}`}
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw size={17} className="animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Download size={17} />
                      Download {report.extension.toUpperCase().replace(".", "")}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information */}
      <div className={`rounded-2xl border p-5 ${theme.card}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Clock3 className="w-5 h-5 text-violet-500" />
          </div>

          <div>
            <h3 className={`font-semibold ${theme.text}`}>
              About Report Generation
            </h3>

            <p className={`text-sm leading-6 mt-2 ${theme.muted}`}>
              Reports are generated directly from your connected Google
              Sheets data. The backend cleans the available records and
              creates the selected file format when you download it.
              Each export contains the complete available dataset.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Reports;
