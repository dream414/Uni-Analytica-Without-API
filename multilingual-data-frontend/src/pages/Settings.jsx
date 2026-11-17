
import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Palette,
  Bell,
  Shield,
  Database,
  Moon,
  Sun,
  Save,
  RotateCcw,
  Lock,
  Globe,
  Clock,
  Check,
  Monitor,
} from "lucide-react";

const defaultSettings = {
  language: "English",
  timezone: "Asia/Karachi",
  dateFormat: "DD/MM/YYYY",
  emailNotifications: true,
  analysisNotifications: true,
  systemNotifications: false,
  autoRefresh: true,
  refreshInterval: "5",
  saveHistory: true,
  darkMode: false,
};

const defaultProfile = {
  name: "",
  email: "",
  role: "Administrator",
};

function Settings({ darkMode = false, onToggleDarkMode }) {
  const [activeTab, setActiveTab] = useState("General");
  const [settings, setSettings] = useState(defaultSettings);
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = JSON.parse(
        localStorage.getItem("multilingua-settings")
      );
      const savedProfile = JSON.parse(
        localStorage.getItem("multilingua-profile")
      );

      if (savedSettings) {
        setSettings((prev) => ({ ...prev, ...savedSettings }));
      }

      if (savedProfile) {
        setProfile((prev) => ({ ...prev, ...savedProfile }));
      }
    } catch {
      console.error("Unable to load settings");
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateProfile = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(
      "multilingua-settings",
      JSON.stringify(settings)
    );

    localStorage.setItem(
      "multilingua-profile",
      JSON.stringify(profile)
    );

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem(
      "multilingua-settings",
      JSON.stringify(defaultSettings)
    );
    setSaved(false);
  };

  const tabs = [
    { name: "General", icon: SettingsIcon },
    { name: "Profile", icon: User },
    { name: "Appearance", icon: Palette },
    { name: "Notifications", icon: Bell },
    { name: "Privacy & Security", icon: Shield },
    { name: "Data Preferences", icon: Database },
  ];

  const inputClass = `w-full min-w-0 rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-violet-500/30 ${
    darkMode
      ? "bg-[#171326] border-white/10 text-white"
      : "bg-white border-slate-200 text-slate-800"
  }`;

  const cardClass = `rounded-2xl border p-5 sm:p-6 md:p-7 ${
    darkMode
      ? "bg-[#19152a] border-white/10"
      : "bg-white border-slate-200"
  }`;

  const mutedText = darkMode
    ? "text-slate-400"
    : "text-slate-500";

  const headingText = darkMode
    ? "text-white"
    : "text-slate-900";

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-violet-600" : "bg-slate-400"
      }`}
      aria-label="Toggle setting"
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );

  const SettingRow = ({
    title,
    description,
    checked,
    onChange,
  }) => (
    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h4 className={`text-sm font-semibold ${headingText}`}>
          {title}
        </h4>
        <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
          {description}
        </p>
      </div>

      <div className="flex shrink-0 items-center sm:pl-5">
        <Toggle checked={checked} onChange={onChange} />
      </div>
    </div>
  );

  const Field = ({ label, children }) => (
    <div className="flex min-w-0 flex-col gap-2">
      <label className={`text-sm font-semibold ${headingText}`}>
        {label}
      </label>
      {children}
    </div>
  );

  const SectionHeading = ({ title, description }) => (
    <div className="mb-6">
      <h2 className={`text-lg font-bold ${headingText}`}>
        {title}
      </h2>
      <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
        {description}
      </p>
    </div>
  );

  const renderGeneral = () => (
    <div className="space-y-6">
      <div className={cardClass}>
        <SectionHeading
          title="Regional Settings"
          description="Manage your language, timezone and date preferences."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Application Language">
            <select
              className={`${inputClass} cursor-pointer`}
              value={settings.language}
              onChange={(e) =>
                updateSetting("language", e.target.value)
              }
            >
              <option>English</option>
              <option>Urdu</option>
              <option>Sindhi</option>
              <option>Arabic</option>
            </select>
          </Field>

          <Field label="Timezone">
            <select
              className={`${inputClass} cursor-pointer`}
              value={settings.timezone}
              onChange={(e) =>
                updateSetting("timezone", e.target.value)
              }
            >
              <option value="Asia/Karachi">
                Pakistan (UTC+05:00)
              </option>
              <option value="UTC">UTC</option>
              <option value="Asia/Dubai">Dubai (UTC+04:00)</option>
              <option value="Europe/London">London</option>
            </select>
          </Field>

          <Field label="Date Format">
            <select
              className={`${inputClass} cursor-pointer`}
              value={settings.dateFormat}
              onChange={(e) =>
                updateSetting("dateFormat", e.target.value)
              }
            >
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <SectionHeading
          title="Application Preferences"
          description="Configure how your application behaves."
        />

        <div className="divide-y divide-slate-200/10">
          <SettingRow
            title="Automatic Data Refresh"
            description="Automatically refresh dashboard data."
            checked={settings.autoRefresh}
            onChange={(v) => updateSetting("autoRefresh", v)}
          />

          <div className="border-t border-slate-200/10 py-5">
            <Field label="Refresh Interval">
              <select
                className={inputClass}
                value={settings.refreshInterval}
                onChange={(e) =>
                  updateSetting("refreshInterval", e.target.value)
                }
              >
                <option value="1">Every 1 minute</option>
                <option value="5">Every 5 minutes</option>
                <option value="10">Every 10 minutes</option>
                <option value="30">Every 30 minutes</option>
              </select>
            </Field>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className={cardClass}>
        <SectionHeading
          title="Profile Information"
          description="Manage your personal account information."
        />

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-2xl font-bold text-white">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="min-w-0">
            <h3 className={`font-bold ${headingText}`}>
              {profile.name || "Your Name"}
            </h3>
            <p className={`mt-1 text-sm ${mutedText}`}>
              {profile.role}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Full Name">
            <input
              className={inputClass}
              type="text"
              placeholder="Enter your name"
              value={profile.name}
              onChange={(e) =>
                updateProfile("name", e.target.value)
              }
            />
          </Field>

          <Field label="Email Address">
            <input
              className={inputClass}
              type="email"
              placeholder="Enter your email"
              value={profile.email}
              onChange={(e) =>
                updateProfile("email", e.target.value)
              }
            />
          </Field>

          <Field label="Account Role">
            <input
              className={`${inputClass} opacity-70`}
              value={profile.role}
              readOnly
            />
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <SectionHeading
          title="Account Security"
          description="Account security options for your profile."
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="rounded-xl bg-violet-500/10 p-3 text-violet-500">
              <Lock size={20} />
            </div>
            <div className="min-w-0">
              <h4 className={`font-semibold ${headingText}`}>
                Password
              </h4>
              <p className={`mt-1 text-sm leading-6 ${mutedText}`}>
                Password management is not connected to the backend yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div className={cardClass}>
        <SectionHeading
          title="Appearance"
          description="Customize the visual appearance of your workspace."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              if (darkMode && onToggleDarkMode) onToggleDarkMode();
              updateSetting("darkMode", false);
            }}
            className={`flex min-w-0 items-center gap-4 rounded-2xl border p-5 text-left transition ${
              !darkMode
                ? "border-violet-500 bg-violet-500/5"
                : "border-slate-200/20"
            }`}
          >
            <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
              <Sun size={23} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={`font-semibold ${headingText}`}>
                Light Mode
              </h4>
              <p className={`mt-1 text-sm ${mutedText}`}>
                Bright and clean interface
              </p>
            </div>
            {!darkMode && (
              <Check size={20} className="shrink-0 text-violet-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!darkMode && onToggleDarkMode) onToggleDarkMode();
              updateSetting("darkMode", true);
            }}
            className={`flex min-w-0 items-center gap-4 rounded-2xl border p-5 text-left transition ${
              darkMode
                ? "border-violet-500 bg-violet-500/5"
                : "border-slate-200/20"
            }`}
          >
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
              <Moon size={23} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={`font-semibold ${headingText}`}>
                Dark Mode
              </h4>
              <p className={`mt-1 text-sm ${mutedText}`}>
                Comfortable dark interface
              </p>
            </div>
            {darkMode && (
              <Check size={20} className="shrink-0 text-violet-600" />
            )}
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200/10 p-4">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-violet-500" />
            <div className="min-w-0">
              <h4 className={`text-sm font-semibold ${headingText}`}>
                Theme Preference
              </h4>
              <p className={`mt-1 text-sm ${mutedText}`}>
                Current theme: {darkMode ? "Dark" : "Light"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className={cardClass}>
        <SectionHeading
          title="Notification Preferences"
          description="Choose which notifications you want to receive."
        />

        <div className="divide-y divide-slate-200/10">
          <SettingRow
            title="Email Notifications"
            description="Receive important updates through email."
            checked={settings.emailNotifications}
            onChange={(v) => updateSetting("emailNotifications", v)}
          />

          <SettingRow
            title="Analysis Notifications"
            description="Get notified when AI analysis is completed."
            checked={settings.analysisNotifications}
            onChange={(v) => updateSetting("analysisNotifications", v)}
          />

          <SettingRow
            title="System Notifications"
            description="Receive system and maintenance updates."
            checked={settings.systemNotifications}
            onChange={(v) => updateSetting("systemNotifications", v)}
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className={cardClass}>
        <SectionHeading
          title="Privacy & Security"
          description="Manage your data privacy preferences."
        />

        <div className="divide-y divide-slate-200/10">
          <SettingRow
            title="Save Analysis History"
            description="Keep previous analysis results available in your workspace."
            checked={settings.saveHistory}
            onChange={(v) => updateSetting("saveHistory", v)}
          />
        </div>
      </div>

      <div className={cardClass}>
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
            <Shield size={22} />
          </div>
          <div className="min-w-0">
            <h3 className={`font-semibold ${headingText}`}>
              Privacy Information
            </h3>
            <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
              Your preferences are currently stored in this browser.
              Password and account security operations require backend
              integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataPreferences = () => (
    <div className="space-y-6">
      <div className={cardClass}>
        <SectionHeading
          title="Data Preferences"
          description="Control how your workspace handles saved preferences."
        />

        <div className="rounded-xl border border-slate-200/10 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <Database size={22} className="shrink-0 text-violet-500" />
              <div className="min-w-0">
                <h4 className={`font-semibold ${headingText}`}>
                  Local Preferences
                </h4>
                <p className={`mt-1 text-sm leading-6 ${mutedText}`}>
                  Settings and profile preferences are saved in browser
                  local storage.
                </p>
              </div>
            </div>
            <span className="w-fit shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
              Browser Storage
            </span>
          </div>
        </div>
      </div>

      <div className={`${cardClass} border-red-500/20`}>
        <h3 className="font-bold text-red-500">
          Reset Preferences
        </h3>
        <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
          Restore application preferences to their default values.
        </p>

        <button
          type="button"
          onClick={resetSettings}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
        >
          <RotateCcw size={17} />
          Reset Settings
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "General":
        return renderGeneral();
      case "Profile":
        return renderProfile();
      case "Appearance":
        return renderAppearance();
      case "Notifications":
        return renderNotifications();
      case "Privacy & Security":
        return renderPrivacy();
      case "Data Preferences":
        return renderDataPreferences();
      default:
        return renderGeneral();
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-600/10 p-3 text-violet-500">
              <SettingsIcon size={24} />
            </div>
            <div className="min-w-0">
              <h1 className={`text-2xl font-bold ${headingText}`}>
                Settings
              </h1>
              <p className={`mt-1 text-sm ${mutedText}`}>
                Manage your account and application preferences.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={resetSettings}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              darkMode
                ? "border-white/10 hover:bg-white/5"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={saveSettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700"
          >
            {saved ? <Check size={17} /> : <Save size={17} />}
            {saved ? "Saved Successfully" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className={`${cardClass} h-fit`}>
          <h3 className={`mb-5 px-2 text-xs font-bold uppercase tracking-wider ${mutedText}`}>
            Settings Menu
          </h3>

          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;

              return (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex w-full min-w-0 items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                      : darkMode
                        ? "text-slate-300 hover:bg-white/5"
                        : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="min-w-0 flex-1 whitespace-normal leading-5">
                    {tab.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 space-y-6">
          <div className={`${cardClass} !p-5 sm:!p-7`}>
            <div className="mb-6 flex items-center gap-3 border-b border-slate-200/10 pb-5">
              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-500">
                {(() => {
                  const Icon =
                    tabs.find((tab) => tab.name === activeTab)?.icon ||
                    SettingsIcon;
                  return <Icon size={21} />;
                })()}
              </div>

              <div className="min-w-0">
                <h2 className={`text-lg font-bold ${headingText}`}>
                  {activeTab}
                </h2>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  Configure your {activeTab.toLowerCase()} preferences.
                </p>
              </div>
            </div>

            {renderContent()}
          </div>

          <div className={`${cardClass} !p-5 sm:!p-6`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="shrink-0 rounded-xl bg-blue-500/10 p-3 text-blue-500">
                  <Shield size={20} />
                </div>
                <div className="min-w-0">
                  <h4 className={`text-sm font-bold ${headingText}`}>
                    Your workspace, your preferences
                  </h4>
                  <p className={`mt-1 text-xs leading-5 ${mutedText}`}>
                    Remember to save your changes after editing settings.
                  </p>
                </div>
              </div>

              {saved && (
                <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-500">
                  <Check size={16} />
                  Changes saved
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;