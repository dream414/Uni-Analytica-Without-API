
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import AllData from "./pages/AllData";
import DataSources from "./pages/DataSources";
import Translation from "./pages/Translation";
import AIAnalysis from "./pages/AIAnalysis";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import AISuggestions from "./pages/AISuggestions";
import Reports from "./pages/Reports";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard darkMode={darkMode} />;

      case "All Data":
        return <AllData darkMode={darkMode} />;

      case "Data Sources":
        return <DataSources darkMode={darkMode} />;

      case "Translation":
        return <Translation darkMode={darkMode} />;

      case "AI Analysis":
        return <AIAnalysis darkMode={darkMode} />;

      case "Analytics":
        return <Analytics darkMode={darkMode} />;

      case "Settings":
        return (
          <Settings
            darkMode={darkMode}
            onToggleDarkMode={toggleTheme}
          />
        );

      case "AI Suggestions":
        return <AISuggestions darkMode={darkMode} />;

      case "Reports":
        return <Reports darkMode={darkMode} />;

      default:
        return (
          <div
            className={`rounded-2xl border p-6 md:p-8 ${
              darkMode
                ? "bg-[#151225] border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <h1 className="text-2xl font-bold">
              {activePage}
            </h1>

            <p
              className={`text-sm mt-2 ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              This page will be developed next.
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`h-screen w-full flex overflow-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-[#100d1c] text-white"
          : "bg-[#f8f7fc] text-slate-900"
      }`}
    >
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen transition-transform duration-300
        md:relative md:translate-x-0 md:shrink-0
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          closeSidebar={() => setSidebarOpen(false)}
          darkMode={darkMode}
        />
      </div>

      {/* MAIN AREA */}
      <main className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">

        {/* NAVBAR */}
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          activePage={activePage}
        />

        {/* SCROLLABLE PAGE CONTENT */}
        <section className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
          {renderPage()}
        </section>

      </main>
    </div>
  );
}

export default App;
