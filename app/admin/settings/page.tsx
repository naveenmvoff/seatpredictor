"use client"

import { useState } from "react"

export default function Settings() {
  const [neetPgYear, setNeetPgYear] = useState("2024 (Current)")
  const [neetSsYear, setNeetSsYear] = useState("2024 (Current)")
  const [dataSourcePriority, setDataSourcePriority] = useState("latest")
  const [automaticBackup, setAutomaticBackup] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log("Saving settings:", {
      neetPgYear,
      neetSsYear,
      dataSourcePriority,
      automaticBackup,
      emailNotifications,
    })
  }

  const handleResetToDefaults = () => {
    setNeetPgYear("2024 (Current)")
    setNeetSsYear("2024 (Current)")
    setDataSourcePriority("latest")
    setAutomaticBackup(true)
    setEmailNotifications(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure system preferences and data sources</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefaults}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <span>🔄</span>
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 flex items-center gap-2"
          >
            <span>💾</span>
            Save Changes
          </button>
        </div>
      </div>

      {/* Data Source Configuration */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-700">📊</span>
          <h2 className="text-lg font-semibold text-gray-900">Data Source Configuration</h2>
        </div>
        <p className="text-gray-600 text-sm mb-6">Set the active year for each exam type</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NEET-PG Active Year</label>
            <select
              value={neetPgYear}
              onChange={(e) => setNeetPgYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024 (Current)">2024 (Current)</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">This year's data will be served for NEET-PG searches</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NEET-SS Active Year</label>
            <select
              value={neetSsYear}
              onChange={(e) => setNeetSsYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024 (Current)">2024 (Current)</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">This year's data will be served for NEET-SS searches</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Data Source Priority</label>
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
                Always use latest uploaded data
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

      {/* System Settings */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-700">⚙️</span>
          <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
        </div>
        <p className="text-gray-600 text-sm mb-6">Configure system behavior and notifications</p>

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
  )
}
