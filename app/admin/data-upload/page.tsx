"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Download, AlertCircle, CheckCircle, Upload, FileText, Calendar } from "lucide-react"
import { uploadApi, handleApiError } from "@/lib/api"

interface UploadError {
  row: number
  field: string
  error: string
}

interface UploadHistory {
  id: number
  fileName: string
  exam: string
  year: string
  records: string
  date: string
  status: "Success" | "Failed" | "Processing"
  statusBadge: string
  errorCount?: number
  errorReportUrl?: string
}

export default function DataUpload() {
  const [selectedExamType, setSelectedExamType] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [uploadMessage, setUploadMessage] = useState("")
  const [validationErrors, setValidationErrors] = useState<UploadError[]>([])
  const [showErrorReport, setShowErrorReport] = useState(false)

  const REQUIRED_HEADERS = [
    "ALLOTMENT_CATEGORY",
    "ALLOTMENT_YEAR", 
    "RANK_NO",
    "ALLOTTED_QUOTA",
    "ALLOTTED_INSTITUTE",
    "STATE",
    "QUALIFYING_GROUP_OR_COURSE",
    "SPECIALITY",
    "ALLOTTED_CATEGORY",
    "CANDIDATE_CATEGORY"
  ]

  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([])

  // Fetch upload history from API
  useEffect(() => {
    const fetchUploadHistory = async () => {
      try {
        const data = await uploadApi.getHistory()
        setUploadHistory(data.upload_history || [])
      } catch (error) {
        console.error('Error fetching upload history:', handleApiError(error))
        // Fallback to mock data
        setUploadHistory([
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
          }
        ])
      }
    }
    
    fetchUploadHistory()
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus("idle")
      setValidationErrors([])
      setUploadMessage("")
    }
  }

  const validateFile = (file: File): Promise<UploadError[]> => {
    return new Promise((resolve) => {
      // Simulate file validation
      setTimeout(() => {
        const errors: UploadError[] = []
        
        // Check file type
        const validTypes = ['.csv', '.xlsx', '.xls']
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        if (!validTypes.includes(fileExtension)) {
          errors.push({
            row: 0,
            field: 'file_type',
            error: 'Invalid file type. Please upload CSV or Excel files only.'
          })
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          errors.push({
            row: 0,
            field: 'file_size',
            error: 'File size too large. Maximum size is 10MB.'
          })
        }

        resolve(errors)
      }, 1000)
    })
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedExamType || !selectedYear) {
      setUploadStatus("error")
      setUploadMessage("Please select exam type, year, and file before uploading.")
      return
    }

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      // Validate file
      const errors = await validateFile(selectedFile)
      
      if (errors.length > 0) {
        setValidationErrors(errors)
        setUploadStatus("error")
        setUploadMessage(`Validation failed with ${errors.length} error(s).`)
        setIsUploading(false)
        return
      }

      // Upload to backend API
      const result = await uploadApi.uploadFile(selectedFile, selectedExamType, selectedYear)
      
      setUploadStatus("success")
      setUploadMessage(`Successfully uploaded ${selectedFile.name}. ${result.created_count} records imported.`)
      setSelectedFile(null)
      setSelectedExamType("")
      setSelectedYear("")
      
      // Refresh upload history
      const historyData = await uploadApi.getHistory()
      setUploadHistory(historyData.upload_history || [])

    } catch (error) {
      setUploadStatus("error")
      setUploadMessage(`Upload failed: ${handleApiError(error)}`)
      setIsUploading(false)
    }
  }

  const downloadErrorReport = (errorReportUrl: string) => {
    // Simulate error report download
    const link = document.createElement('a')
    link.href = errorReportUrl
    link.download = `error_report_${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Data Upload</h1>
        <p className="text-gray-600 mt-1">Import Excel/CSV files for NEET exams</p>
      </div>

      {/* Required Headers Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Required Column Headers
        </h3>
        <p className="text-sm text-blue-700 mb-3">Your Excel/CSV file must contain these exact column headers:</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {REQUIRED_HEADERS.map((header) => (
            <span key={header} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {header}
            </span>
          ))}
        </div>
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
                <Upload className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{selectedFile ? selectedFile.name : "Choose File"}</span>
              </label>
            </div>
            {selectedFile && (
              <p className="text-xs text-gray-500 mt-1">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>

        {/* Upload Status */}
        {uploadStatus !== "idle" && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
            uploadStatus === "success" 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            {uploadStatus === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm ${
              uploadStatus === "success" ? "text-green-800" : "text-red-800"
            }`}>
              {uploadMessage}
            </span>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Row {error.row}: {error.error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-4">
        <button
          onClick={handleUpload}
            disabled={!selectedFile || !selectedExamType || !selectedYear || isUploading}
          className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
          Upload File
              </>
            )}
          </button>

          {validationErrors.length > 0 && (
            <button
              onClick={() => setShowErrorReport(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Error Report
        </button>
          )}
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-white rounded-lg shadow-sm">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uploadHistory.map((upload) => (
                <tr key={upload.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                    <div className="text-sm font-medium text-gray-900">{upload.fileName}</div>
                    </div>
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
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Calendar className="w-3 h-3" />
                      {upload.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${upload.statusBadge}`}>
                      {upload.status === "Success" && (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Success
                        </>
                      )}
                      {upload.status === "Failed" && (
                        <>
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Failed
                        </>
                      )}
                      {upload.status === "Processing" && (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
                          Processing
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {upload.status === "Failed" && upload.errorReportUrl && (
                      <button
                        onClick={() => downloadErrorReport(upload.errorReportUrl!)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Error Report
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Report Modal */}
      {showErrorReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Error Report</h3>
              <button
                onClick={() => setShowErrorReport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                The following errors were found in your uploaded file:
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Row {error.row}: {error.error}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowErrorReport(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Simulate downloading error report
                    const csvContent = validationErrors.map(error => 
                      `${error.row},${error.field},${error.error}`
                    ).join('\n')
                    const blob = new Blob([csvContent], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `error_report_${Date.now()}.csv`
                    link.click()
                    URL.revokeObjectURL(url)
                    setShowErrorReport(false)
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
