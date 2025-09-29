"use client"

import { useState } from "react"

export default function UserSearches() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState("Aug 30, 2025 - Sep 29, 2025")
  const [examFilter, setExamFilter] = useState("All Exams")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")

  const searchData = [
    {
      id: 1,
      name: "Rahul Sharma",
      phone: "+91 9876543210",
      email: "rahul.sharma@email.com",
      exam: "NEET-PG",
      rank: "5,234",
      category: "OBC",
      state: "Maharashtra",
      specialization: "General Medicine",
      course: "MD/MS",
      searchTime: "2024-12-20 10:30 AM",
      results: 42,
      resultsBadge: "bg-green-100 text-green-800",
    },
    {
      id: 2,
      name: "Priya Patel",
      phone: "+91 9876543211",
      email: "priya.patel@email.com",
      exam: "NEET-PG",
      rank: "12,450",
      category: "General",
      state: "Gujarat",
      specialization: "Pediatrics",
      course: "MD/MS",
      searchTime: "2024-12-20 09:45 AM",
      results: 28,
      resultsBadge: "bg-green-100 text-green-800",
    },
    {
      id: 3,
      name: "Amit Kumar",
      phone: "+91 9876543212",
      email: "amit.kumar@email.com",
      exam: "NEET-SS",
      rank: "890",
      category: "SC",
      state: "Delhi",
      specialization: "Cardiology",
      course: "DM/MCh",
      searchTime: "2024-12-20 09:15 AM",
      results: 15,
      resultsBadge: "bg-green-100 text-green-800",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      phone: "+91 9876543213",
      email: "sneha.reddy@email.com",
      exam: "NEET-PG",
      rank: "25,670",
      category: "OBC",
      state: "Telangana",
      specialization: "Radiology",
      course: "MD/MS",
      searchTime: "2024-12-20 08:30 AM",
      results: 0,
      resultsBadge: "bg-red-100 text-red-800",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Searches</h1>
          <p className="text-gray-600 mt-1">Track and analyze user search history</p>
        </div>
        <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-700">
          Export CSV
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <p className="text-gray-600 text-sm mb-6">Filter search results by various criteria</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Exams</option>
            <option>NEET-PG</option>
            <option>NEET-SS</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Categories</option>
            <option>General</option>
            <option>OBC</option>
            <option>SC</option>
            <option>ST</option>
          </select>
        </div>
      </div>

      {/* Search History Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Search History</h2>
          <p className="text-gray-600 text-sm mt-1">Showing 5 search records</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Search Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Results
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-600 text-sm">👤</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{record.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-gray-400">📞</span>
                        <span>{record.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">✉️</span>
                        <span className="text-blue-600">{record.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.exam}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.rank}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.state}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.specialization}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.course}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{record.searchTime}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${record.resultsBadge}`}>
                      {record.results === 0 ? "No Results" : record.results}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
