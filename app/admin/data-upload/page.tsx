"use client"

import type React from "react"

import { useState } from "react"

export default function DataUpload() {
  const [selectedExamType, setSelectedExamType] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const uploadHistory = [
    {
      id: 1,
      fileName: "NEET_PG_2024_Round1.csv",
      exam: "NEET-PG",
      year: "2024",
      records: "45,230",
      date: "2024-12-15",
      status: "Success",
      statusBadge: "bg-green-100 text-green-800",
    },
    {
      id: 2,
      fileName: "NEET_SS_2024_Data.xlsx",
      exam: "NEET-SS",
      year: "2024",
      records: "12,450",
      date: "2024-12-10",
      status: "Success",
      statusBadge: "bg-green-100 text-green-800",
    },
    {
      id: 3,
      fileName: "NEET_PG_2023_Final.csv",
      exam: "NEET-PG",
      year: "2023",
      records: "42,180",
      date: "2024-12-05",
      status: "Success",
      statusBadge: "bg-green-100 text-green-800",
    },
    {
      id: 4,
      fileName: "NEET_SS_2023_Corrected.xlsx",
      exam: "NEET-SS",
      year: "2023",
      records: "0",
      date: "2024-12-01",
      status: "Failed",
      statusBadge: "bg-red-100 text-red-800",
    },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile && selectedExamType && selectedYear) {
      // Handle file upload logic here
      console.log("Uploading:", { selectedFile, selectedExamType, selectedYear })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Data Upload</h1>
        <p className="text-gray-600 mt-1">Import Excel/CSV files for NEET exams</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload New Data</h2>
        <p className="text-gray-600 text-sm mb-6">Select exam type, year, and upload your Excel or CSV file</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Exam Type</option>
              <option value="NEET-PG">NEET-PG</option>
              <option value="NEET-SS">NEET-SS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Year</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
            <div className="relative">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-center gap-2"
              >
                <span className="text-gray-400">📁</span>
                <span className="text-gray-700">{selectedFile ? selectedFile.name : "Choose File"}</span>
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || !selectedExamType || !selectedYear}
          className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Upload File
        </button>
      </div>

      {/* Recent Uploads */}
      {/* <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
          <p className="text-gray-600 text-sm mt-1">History of previously uploaded files</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uploadHistory.map((upload) => (
                <tr key={upload.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{upload.fileName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{upload.exam}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{upload.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{upload.records}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{upload.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${upload.statusBadge}`}>
                      {upload.status === "Success" && "✅ Success"}
                      {upload.status === "Failed" && "❌ Failed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  )
}
