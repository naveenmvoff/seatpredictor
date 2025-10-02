"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw, CheckCircle, AlertCircle, Calendar, Database, Settings as SettingsIcon, Users, BarChart3 } from "lucide-react";
import { settingsApi, handleApiError } from "@/lib/api";

interface YearData {
  year: number;
  recordCount: number;
  lastUpload: string;
  isActive: boolean;
}

export default function Settings() {
  const [neetPgYear, setNeetPgYear] = useState("2024");
  const [neetSsYear, setNeetSsYear] = useState("2024");
  const [dataSourcePriority, setDataSourcePriority] = useState("specific");
  const [automaticBackup, setAutomaticBackup] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  // Mock data for available years
  const [neetPgYears, setNeetPgYears] = useState<YearData[]>([
    { year: 2024, recordCount: 45230, lastUpload: "2024-12-15", isActive: true },
    { year: 2023, recordCount: 42180, lastUpload: "2024-12-05", isActive: false },
    { year: 2022, recordCount: 38950, lastUpload: "2024-11-20", isActive: false },
  ]);

  const [neetSsYears, setNeetSsYears] = useState<YearData[]>([
    { year: 2024, recordCount: 12450, lastUpload: "2024-12-10", isActive: true },
    { year: 2023, recordCount: 11200, lastUpload: "2024-11-25", isActive: false },
    { year: 2022, recordCount: 9850, lastUpload: "2024-11-10", isActive: false },
  ]);

  // Load settings from API on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsApi.getSettings();
        
        // Update years data
        if (data.neet_pg?.years) {
          setNeetPgYears(data.neet_pg.years);
          setNeetPgYear(data.neet_pg.active_year?.toString() || "2024");
        }
        
        if (data.neet_ss?.years) {
          setNeetSsYears(data.neet_ss.years);
          setNeetSsYear(data.neet_ss.active_year?.toString() || "2024");
        }
        
        // Update system settings
        if (data.system_settings) {
          setDataSourcePriority(data.system_settings.data_source_priority || "specific");
          setAutomaticBackup(data.system_settings.automatic_backup || true);
          setEmailNotifications(data.system_settings.email_notifications || true);
        }
      } catch (error) {
        console.error('Error loading settings:', handleApiError(error));
      }
    };

    loadSettings();
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      // Save year settings
      await settingsApi.setActiveYear('NEET-PG', parseInt(neetPgYear));
      await settingsApi.setActiveYear('NEET-SS', parseInt(neetSsYear));
      
      // Update system settings
      await settingsApi.updateSettings({
        data_source_priority: dataSourcePriority,
        automatic_backup: automaticBackup,
        email_notifications: emailNotifications
      });

      // Update local state
      setNeetPgYears(prev => prev.map(year => ({
        ...year,
        isActive: year.year.toString() === neetPgYear
      })));

      setNeetSsYears(prev => prev.map(year => ({
        ...year,
        isActive: year.year.toString() === neetSsYear
      })));

      setSaveStatus("success");
      setSaveMessage("Settings saved successfully!");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(`Failed to save settings: ${handleApiError(error)}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setSaveStatus("idle");
        setSaveMessage("");
      }, 3000);
    }
  };

  const handleResetToDefaults = () => {
    setNeetPgYear("2024");
    setNeetSsYear("2024");
    setDataSourcePriority("specific");
    setAutomaticBackup(true);
    setEmailNotifications(true);
  };

  const setActiveYear = (examType: "NEET-PG" | "NEET-SS", year: string) => {
    if (examType === "NEET-PG") {
      setNeetPgYear(year);
    } else {
      setNeetSsYear(year);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure system preferences and data sources
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus !== "idle" && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          saveStatus === "success" 
            ? "bg-green-50 border border-green-200" 
            : "bg-red-50 border border-red-200"
        }`}>
          {saveStatus === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className={`text-sm ${
            saveStatus === "success" ? "text-green-800" : "text-red-800"
          }`}>
            {saveMessage}
          </span>
        </div>
      )}

      {/* Data Source Configuration */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Data Source Configuration
          </h2>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Set the active year for each exam type. Only one year can be active per exam.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* NEET-PG Year Management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-md font-medium text-gray-900">NEET-PG Active Year</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Currently Active
              </span>
            </div>
            
            <div className="space-y-3">
              {neetPgYears.map((yearData) => (
                <div
                  key={yearData.year}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    yearData.isActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveYear("NEET-PG", yearData.year.toString())}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="neet-pg-year"
                        checked={yearData.isActive}
                        onChange={() => setActiveYear("NEET-PG", yearData.year.toString())}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
          <div>
                        <div className="font-medium text-gray-900">{yearData.year}</div>
                        <div className="text-sm text-gray-500">
                          {yearData.recordCount.toLocaleString()} records
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        Last upload: {yearData.lastUpload}
                      </div>
                      {yearData.isActive && (
                        <div className="text-xs text-blue-600 font-medium">
                          Active
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEET-SS Year Management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-md font-medium text-gray-900">NEET-SS Active Year</h3>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Currently Active
              </span>
            </div>
            
            <div className="space-y-3">
              {neetSsYears.map((yearData) => (
                <div
                  key={yearData.year}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    yearData.isActive
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveYear("NEET-SS", yearData.year.toString())}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="neet-ss-year"
                        checked={yearData.isActive}
                        onChange={() => setActiveYear("NEET-SS", yearData.year.toString())}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
          <div>
                        <div className="font-medium text-gray-900">{yearData.year}</div>
                        <div className="text-sm text-gray-500">
                          {yearData.recordCount.toLocaleString()} records
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        Last upload: {yearData.lastUpload}
                      </div>
                      {yearData.isActive && (
                        <div className="text-xs text-green-600 font-medium">
                          Active
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Source Priority */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-md font-medium text-gray-900 mb-4">Data Source Priority</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="latest-data"
                  name="data-priority"
                  type="radio"
                  value="latest"
                  checked={dataSourcePriority === "latest"}
                  onChange={(e) => setDataSourcePriority(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              <label htmlFor="latest-data" className="ml-3 text-sm text-gray-700">
                Always use latest uploaded data (ignores year selection above)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="specific-year"
                  name="data-priority"
                  type="radio"
                  value="specific"
                  checked={dataSourcePriority === "specific"}
                  onChange={(e) => setDataSourcePriority(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              <label htmlFor="specific-year" className="ml-3 text-sm text-gray-700">
                  Use specific year selection above
                </label>
              </div>
          </div>
        </div>
      </div>

      {/* Data Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Data Overview</h2>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Current data statistics and health indicators
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">NEET-PG Records</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {neetPgYears.find(y => y.isActive)?.recordCount.toLocaleString() || "0"}
            </div>
            <div className="text-xs text-blue-700">
              Active: {neetPgYears.find(y => y.isActive)?.year || "None"}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">NEET-SS Records</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {neetSsYears.find(y => y.isActive)?.recordCount.toLocaleString() || "0"}
            </div>
            <div className="text-xs text-green-700">
              Active: {neetSsYears.find(y => y.isActive)?.year || "None"}
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Total Years</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {neetPgYears.length + neetSsYears.length}
            </div>
            <div className="text-xs text-purple-700">
              Available data years
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Total Records</span>
              </div>
            <div className="text-2xl font-bold text-orange-900">
              {(neetPgYears.find(y => y.isActive)?.recordCount || 0) + 
               (neetSsYears.find(y => y.isActive)?.recordCount || 0)}
              </div>
            <div className="text-xs text-orange-700">
              Currently active
            </div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Configure system behavior and notifications
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Automatic Backup</h3>
              <p className="text-sm text-gray-500">Automatically backup data every 24 hours</p>
            </div>
            <button
              onClick={() => setAutomaticBackup(!automaticBackup)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                automaticBackup ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  automaticBackup ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive email alerts for system events</p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                emailNotifications ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}