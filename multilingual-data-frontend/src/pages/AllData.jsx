
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Database,
  Search,
  RefreshCw,
  Filter,
  Building2,
  Tags,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  FileSearch,
  ChevronDown,
  Layers3,
  Sparkles,
} from "lucide-react";

import API from "../services/api";

function AllData({ darkMode = false }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  const theme = {
    pageText: darkMode ? "text-white" : "text-slate-900",
    muted: darkMode ? "text-slate-400" : "text-slate-500",
    surface: darkMode
      ? "bg-[#151225] border-white/[0.08]"
      : "bg-white border-slate-200/80",
    softSurface: darkMode
      ? "bg-[#1d1930]"
      : "bg-[#f8f7fc]",
    input: darkMode
      ? "bg-[#1d1930] border-white/10 text-white placeholder:text-slate-500"
      : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400",
    divider: darkMode ? "border-white/[0.08]" : "border-slate-100",
    purpleText: darkMode ? "text-purple-300" : "text-[#7044c5]",
    purpleBg: darkMode ? "bg-purple-500/15" : "bg-[#f1ebff]",
  };

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/data");
      const data = response.data?.data;

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("All Data API Error:", err);
      setError("Unable to load records from Google Sheets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        records
          .map((record) => record["University Issue Category"])
          .filter(Boolean)
      ),
    ].sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return records.filter((record) => {
      const university = String(
        record["University Name"] || ""
      ).toLowerCase();

      const category = String(
        record["University Issue Category"] || ""
      ).toLowerCase();

      const description = String(
        record["Describe Your Issue"] || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        university.includes(searchValue) ||
        category.includes(searchValue) ||
        description.includes(searchValue);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        record["University Issue Category"] === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [records, search, selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / recordsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * recordsPerPage;

  const currentRecords = filteredRecords.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All Categories");
    setCurrentPage(1);
  };

  const hasFilters =
    search.trim() !== "" ||
    selectedCategory !== "All Categories";

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-7 pb-8">

      {/* Page Header */}
      <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

        <div className="min-w-0">
          <div className={`flex items-center gap-2 text-xs mb-4 ${theme.muted}`}>
            <span>Workspace</span>
            <span className="text-slate-400">/</span>
            <span className={theme.purpleText}>All Data</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6336bd] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Database size={25} className="text-white" />
            </div>

            <div className="min-w-0">
              <h1 className={`text-2xl md:text-[30px] font-bold tracking-tight ${theme.pageText}`}>
                All University Data
              </h1>

              <p className={`text-sm mt-1 ${theme.muted}`}>
                Explore, search and review university issue submissions.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadRecords}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2.5 min-h-[44px] px-5 rounded-xl bg-[#7044c5] hover:bg-[#6035b3] text-white text-sm font-semibold shadow-md shadow-purple-500/15 transition-all duration-200 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </header>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Section */}
      <section className={`rounded-2xl border ${theme.surface} overflow-hidden`}>
        <div className="grid grid-cols-1 sm:grid-cols-2">

          <div className="flex items-center gap-4 p-5 md:p-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.purpleBg}`}>
              <Layers3 size={22} className={theme.purpleText} />
            </div>

            <div>
              <p className={`text-xs font-medium ${theme.muted}`}>
                Total Records
              </p>

              <p className={`text-2xl font-bold mt-1 ${theme.pageText}`}>
                {loading ? "—" : records.length}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-4 p-5 md:p-6 border-t sm:border-t-0 sm:border-l ${theme.divider}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.purpleBg}`}>
              <FileSearch size={22} className={theme.purpleText} />
            </div>

            <div>
              <p className={`text-xs font-medium ${theme.muted}`}>
                Matching Records
              </p>

              <p className={`text-2xl font-bold mt-1 ${theme.purpleText}`}>
                {loading ? "—" : filteredRecords.length}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Data Section */}
      <section className={`rounded-2xl border ${theme.surface} overflow-hidden`}>

        {/* Section Heading */}
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={17} className={theme.purpleText} />
                <h2 className={`text-base font-bold ${theme.pageText}`}>
                  University Submissions
                </h2>
              </div>

              <p className={`text-xs mt-2 ${theme.muted}`}>
                Browse and manage all submitted university issues.
              </p>
            </div>

            <span className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${theme.purpleBg} ${theme.purpleText}`}>
              <Database size={13} />
              Google Sheets
            </span>
          </div>
        </div>

        {/* Search and Filter Toolbar */}
        <div className={`px-5 md:px-6 py-4 border-y ${theme.divider} ${theme.softSurface}`}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">

            {/* Search */}
            <div className={`flex items-center gap-3 flex-1 min-w-0 h-12 px-4 rounded-xl border ${theme.input} focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/10 transition`}>
              <Search
                size={18}
                className="shrink-0 text-purple-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search university, category or issue..."
                className="w-full min-w-0 bg-transparent outline-none text-sm"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="shrink-0 p-1 rounded-md text-slate-400 hover:text-purple-500 hover:bg-purple-500/10"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className={`flex items-center gap-3 h-12 px-4 rounded-xl border lg:w-[270px] ${theme.input}`}>
              <Filter
                size={17}
                className="shrink-0 text-purple-500"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 min-w-0 w-full bg-transparent outline-none text-sm cursor-pointer"
              >
                <option value="All Categories">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className={`shrink-0 pointer-events-none ${theme.muted}`}
              />
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-sm font-semibold text-purple-600 hover:bg-purple-500/10 transition"
              >
                <X size={15} />
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
            <p className={`text-xs ${theme.muted}`}>
              {hasFilters ? "Filtered results" : "Showing all submissions"}
            </p>

            <p className={`text-xs font-semibold ${theme.purpleText}`}>
              {loading ? "Loading..." : `${filteredRecords.length} results`}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <RefreshCw
              size={27}
              className="animate-spin text-purple-500 mb-4"
            />

            <p className={`text-sm font-medium ${theme.pageText}`}>
              Loading university records
            </p>

            <p className={`text-xs mt-2 ${theme.muted}`}>
              Connecting to your data source...
            </p>
          </div>

        ) : error ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <AlertCircle size={30} className="text-red-500 mb-3" />
            <p className={`text-sm font-semibold ${theme.pageText}`}>
              Unable to display records
            </p>
            <button
              onClick={loadRecords}
              className="mt-3 text-sm font-semibold text-purple-500 hover:underline"
            >
              Try again
            </button>
          </div>

        ) : currentRecords.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center px-5 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${theme.purpleBg}`}>
              <FileSearch size={27} className={theme.purpleText} />
            </div>

            <h3 className={`text-base font-bold ${theme.pageText}`}>
              No records found
            </h3>

            <p className={`text-sm mt-2 max-w-sm ${theme.muted}`}>
              No submissions match your current search or category selection.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 px-4 py-2 rounded-lg bg-[#7044c5] hover:bg-[#6035b3] text-white text-sm font-semibold transition"
            >
              Clear Filters
            </button>
          </div>

        ) : (
          <>
            {/* Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left border-collapse">

                <thead>
                  <tr className={darkMode ? "bg-white/[0.025]" : "bg-[#faf9fd]"}>
                    <th className={`w-16 px-6 py-4 text-[10px] uppercase tracking-wider font-bold ${theme.muted}`}>
                      No.
                    </th>

                    <th className={`px-5 py-4 text-[10px] uppercase tracking-wider font-bold ${theme.muted}`}>
                      University
                    </th>

                    <th className={`px-5 py-4 text-[10px] uppercase tracking-wider font-bold ${theme.muted}`}>
                      Issue Category
                    </th>

                    <th className={`px-5 py-4 text-[10px] uppercase tracking-wider font-bold ${theme.muted}`}>
                      Issue Description
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentRecords.map((record, index) => (
                    <tr
                      key={record._id || `${startIndex}-${index}`}
                      className={`border-t transition-colors duration-150 ${
                        darkMode
                          ? "border-white/[0.06] hover:bg-purple-500/[0.05]"
                          : "border-slate-100 hover:bg-purple-50/50"
                      }`}
                    >
                      <td className={`px-6 py-5 text-xs font-semibold ${theme.muted}`}>
                        {String(startIndex + index + 1).padStart(2, "0")}
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${theme.purpleBg}`}>
                            <Building2
                              size={17}
                              className={theme.purpleText}
                            />
                          </div>

                          <span className={`text-sm font-semibold ${theme.pageText}`}>
                            {record["University Name"] || "Not provided"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <span className={`inline-flex items-center gap-2 max-w-[240px] rounded-lg px-3 py-2 text-xs leading-5 font-semibold ${
                          darkMode
                            ? "bg-purple-500/10 text-purple-300"
                            : "bg-[#f2edff] text-[#7044c5]"
                        }`}>
                          <Tags size={13} className="shrink-0" />
                          <span className="break-words">
                            {record["University Issue Category"] || "Not provided"}
                          </span>
                        </span>
                      </td>

                      <td className={`px-5 py-5 text-sm ${theme.muted}`}>
                        <p className="max-w-lg line-clamp-2 leading-6">
                          {record["Describe Your Issue"] || "No description provided"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={`px-5 md:px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${theme.divider} ${theme.softSurface}`}>
              <p className={`text-xs ${theme.muted}`}>
                Showing{" "}
                <span className={`font-bold ${theme.pageText}`}>
                  {startIndex + 1}–{Math.min(startIndex + recordsPerPage, filteredRecords.length)}
                </span>{" "}
                of{" "}
                <span className={`font-bold ${theme.pageText}`}>
                  {filteredRecords.length}
                </span>{" "}
                records
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition disabled:opacity-35 disabled:cursor-not-allowed ${
                    darkMode
                      ? "border-white/10 hover:bg-purple-500/15"
                      : "border-slate-200 hover:bg-purple-50"
                  }`}
                >
                  <ChevronLeft size={17} />
                </button>

                <span className={`text-xs px-3 ${theme.muted}`}>
                  Page{" "}
                  <span className={`font-bold ${theme.purpleText}`}>
                    {safePage}
                  </span>{" "}
                  of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition disabled:opacity-35 disabled:cursor-not-allowed ${
                    darkMode
                      ? "border-white/10 hover:bg-purple-500/15"
                      : "border-slate-200 hover:bg-purple-50"
                  }`}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t pt-5 ${theme.divider}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6336bd] flex items-center justify-center">
            <Database size={15} className="text-white" />
          </div>

          <div>
            <p className={`text-xs font-bold ${theme.pageText}`}>
              MultiLingua AI
            </p>
            <p className={`text-[10px] ${theme.muted}`}>
              Data Intelligence System
            </p>
          </div>
        </div>

        <p className={`text-xs ${theme.muted}`}>
          Data Source: Google Sheets
        </p>
      </footer>
    </div>
  );
}

export default AllData;