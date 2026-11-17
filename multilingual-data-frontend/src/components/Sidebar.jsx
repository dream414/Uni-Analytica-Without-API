
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Database,
  Languages,
  BrainCircuit,
  ChartNoAxesCombined,
  FileText,
  Settings,
  Globe,
  Sparkles,
  Workflow,
  ChevronRight,
  BriefcaseBusiness,
  UserRound,
  MoreHorizontal,
} from "lucide-react";

const menuGroups = [
  {
    title: "MAIN MENU",
    items: [
      { name: "Dashboard", icon: LayoutDashboard },
      { name: "All Data", icon: Database },
      { name: "Data Sources", icon: Workflow },
    ],
  },
  {
    title: "AI & PROCESSING",
    items: [
      { name: "Translation", icon: Languages },
      { name: "AI Analysis", icon: BrainCircuit },
      { name: "Analytics", icon: ChartNoAxesCombined },
      { name: "AI Suggestions", icon: Sparkles },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Reports", icon: FileText },
      { name: "Settings", icon: Settings },
    ],
  },
];

function Sidebar({
  activePage,
  setActivePage,
  closeSidebar,
  darkMode,
}) {
  return (
    <aside
      className={`w-72 h-full flex flex-col overflow-hidden border-r transition-colors duration-300 ${
        darkMode
          ? "bg-[#111827] text-white border-slate-700"
          : "bg-white text-slate-800 border-slate-200"
      }`}
    >
      {/* BRAND SECTION */}
      <div
        className={`px-6 pt-8 pb-8 shrink-0 border-b ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Globe size={27} strokeWidth={2} />
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-[19px] font-extrabold tracking-tight whitespace-nowrap">
              MultiLingua<span className="text-indigo-500">.</span>
            </h1>

            <p
              className={`text-[11px] mt-2 tracking-[2px] font-semibold ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              AI INTELLIGENCE
            </p>
          </div>
        </div>
      </div>

      {/* WORKSPACE SECTION */}
      <div className="px-5 pt-9 pb-8 shrink-0">
        <div
          className={`min-h-[130px] p-5 rounded-2xl border flex flex-col justify-center ${
            darkMode
              ? "bg-indigo-500/10 border-indigo-400/20"
              : "bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100"
          }`}
        >
          <p
            className={`text-[11px] font-bold tracking-[1.7px] mb-4 text-center ${
              darkMode ? "text-indigo-300" : "text-indigo-500"
            }`}
          >
            WORKSPACE
          </p>

          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <BriefcaseBusiness size={23} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] font-bold">
                My Workspace
              </h3>

              <p
                className={`text-xs mt-2 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Intelligent Data Hub
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLLABLE NAVIGATION */}
      <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 pb-5 custom-scrollbar">
        {menuGroups.map((group, groupIndex) => (
          <div key={group.title} className="mb-7">

            <div className="flex items-center justify-center gap-3 px-3 mb-4">
              <div
                className={`flex-1 h-px ${
                  darkMode ? "bg-slate-700" : "bg-slate-200"
                }`}
              />

              <h3
                className={`text-[11px] font-extrabold tracking-[1.5px] whitespace-nowrap text-center ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {group.title}
              </h3>

              <div
                className={`flex-1 h-px ${
                  darkMode ? "bg-slate-700" : "bg-slate-200"
                }`}
              />
            </div>

            <div className="flex flex-col gap-2">
              {group.items.map((item, index) => {
                const Icon = item.icon;
                const active = activePage === item.name;

                return (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: groupIndex * 0.04 + index * 0.035,
                    }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActivePage(item.name);
                      closeSidebar?.();
                    }}
                    className={`w-full min-h-[52px] flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                        : darkMode
                          ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                          : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    <span className="w-8 h-8 shrink-0 flex items-center justify-center">
                      <Icon size={21} strokeWidth={2} />
                    </span>

                    <span className="flex-1 text-[15px] font-semibold">
                      {item.name}
                    </span>

                    {active && (
                      <ChevronRight size={19} strokeWidth={2.5} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* BOTTOM PROFILE - FIXED */}
      <div
        className={`shrink-0 p-5 border-t ${
          darkMode ? "border-slate-700" : "border-slate-100"
        }`}
      >
        <div
          className={`p-3 rounded-2xl flex items-center gap-3 ${
            darkMode ? "bg-slate-800" : "bg-slate-50"
          }`}
        >
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
            <UserRound size={21} />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate">
              Minahil Hani
            </h4>

            <p
              className={`text-xs mt-1 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Administrator
            </p>
          </div>

          <MoreHorizontal
            size={21}
            className={darkMode ? "text-slate-400" : "text-slate-500"}
          />
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 px-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />

          <span
            className={`text-xs font-semibold ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            All Systems Operational
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
