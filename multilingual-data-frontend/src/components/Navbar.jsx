
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Sun,
  Moon,
  ChevronDown,
  GraduationCap,
  UserRound,
  Settings,
  LogOut,
  CheckCheck,
  X,
  Sparkles,
  Menu,
} from "lucide-react";

function Navbar({
  darkMode,
  toggleTheme,
  activePage = "Dashboard",
  onMenuClick,
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Analysis System Ready",
      message: "Your university issue analysis workspace is ready.",
      time: "Just now",
    },
    {
      id: 2,
      title: "Welcome to the Dashboard",
      message: "Explore insights and analyze university issues.",
      time: "Recently",
    },
  ];

  const bg = darkMode
    ? "bg-slate-950 text-white border-slate-800"
    : "bg-white text-slate-800 border-slate-200";

  const muted = darkMode ? "text-slate-400" : "text-slate-500";

  const dropdown = darkMode
    ? "bg-slate-900 border-slate-700 shadow-black/30"
    : "bg-white border-slate-200 shadow-slate-200/70";

  const hover = darkMode
    ? "hover:bg-slate-800"
    : "hover:bg-slate-100";

  return (
    <header
      className={`relative z-30 w-full min-h-[76px] shrink-0 px-3 sm:px-6 lg:px-8 flex items-center justify-between border-b transition-colors duration-300 ${bg}`}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3 min-w-0">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className={`md:hidden w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors ${hover}`}
        >
          <Menu size={23} />
        </button>

        {/* BRAND AND TITLE */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:flex w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 items-center justify-center shadow-lg shadow-violet-500/20">
            <GraduationCap size={24} className="text-white" />
          </div>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight truncate">
              University Issue Analysis System
            </h1>

            <div className={`hidden sm:flex items-center gap-1.5 text-xs mt-1 ${muted}`}>
              <Sparkles size={12} className="text-violet-500" />
              <span>AI-Powered Insights & Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">

        {/* THEME TOGGLE */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${hover}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={darkMode ? "sun" : "moon"}
              initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              {darkMode ? (
                <Sun size={21} className="text-amber-400" />
              ) : (
                <Moon size={21} className="text-slate-600" />
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* NOTIFICATIONS */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-colors ${hover}`}
          >
            <Bell size={21} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
          </motion.button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className={`absolute right-0 top-14 w-[min(340px,calc(100vw-32px))] rounded-2xl border shadow-xl overflow-hidden z-50 ${dropdown}`}
              >
                <div className="p-4 flex items-center justify-between border-b border-inherit">
                  <div>
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <p className={`text-xs mt-1 ${muted}`}>
                      Your latest updates
                    </p>
                  </div>

                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className={`p-1.5 rounded-lg ${hover}`}
                    aria-label="Close notifications"
                  >
                    <X size={17} />
                  </button>
                </div>

                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 flex gap-3 border-b border-inherit ${hover}`}
                  >
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                      <CheckCheck size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className={`text-xs mt-1 leading-relaxed ${muted}`}>
                        {item.message}
                      </p>
                      <p className="text-[11px] text-violet-500 mt-2">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}

                <div className={`p-3 text-center text-xs ${muted}`}>
                  You are all caught up
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            className={`flex items-center gap-2 sm:gap-3 rounded-xl p-1.5 sm:px-2 sm:py-1.5 transition-colors ${hover}`}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              M
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold leading-tight">Admin</p>
              <p className={`text-xs mt-1 ${muted}`}>Administrator</p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden md:block transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className={`absolute right-0 top-14 w-60 rounded-2xl border shadow-xl p-3 flex flex-col gap-2 z-50 ${dropdown}`}
              >
                <div className="px-3 py-3 border-b border-inherit mb-1 flex flex-col gap-1">
                  <p className="text-sm font-semibold leading-5">Admin</p>
                  <p className={`text-xs leading-5 ${muted}`}>
                    System Administrator
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setProfileOpen(false)}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${hover}`}
                  >
                    <UserRound size={18} className="shrink-0" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => setProfileOpen(false)}
                    className={`w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${hover}`}
                  >
                    <Settings size={18} className="shrink-0" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="pt-2 mt-1 border-t border-inherit">
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="w-full min-h-[44px] flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut size={18} className="shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
