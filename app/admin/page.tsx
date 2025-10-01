"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, AlertCircle, MapPin, GraduationCap, Award, Download } from "lucide-react"

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("Aug 30, 2025 - Sep 29, 2025")
  const [examFilter, setExamFilter] = useState("All Exams")
  const [isLoading, setIsLoading] = useState(false)

  const stats = [
    {
      title: "Total Searches",
      value: "12,543",
      change: "+20.1% from last month",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "border-l-blue-500",
    },
    {
      title: "Unique Users",
      value: "8,234",
      change: "+15.3% from last month",
      icon: <Users className="w-6 h-6" />,
      color: "border-l-cyan-500",
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "Searches with results",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "border-l-green-500",
    },
    {
      title: "Zero Results",
      value: "732",
      change: "5.8% of all searches",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "border-l-yellow-500",
    },
  ]

  const rankBandData = [
    { range: "<5k", searches: 450, avgResults: 45 },
    { range: "5-10k", searches: 380, avgResults: 38 },
    { range: "10-20k", searches: 520, avgResults: 52 },
    { range: "20-30k", searches: 290, avgResults: 29 },
    { range: "30-40k", searches: 160, avgResults: 16 },
    { range: "40-50k", searches: 120, avgResults: 12 },
    { range: ">50k", searches: 80, avgResults: 8 },
  ]

  const stateData = [
    { state: "Maharashtra", searches: 1000, zeroResults: 50, avgResults: 950 },
    { state: "Karnataka", searches: 850, zeroResults: 50, avgResults: 800 },
    { state: "Tamil Nadu", searches: 750, zeroResults: 50, avgResults: 700 },
    { state: "Delhi", searches: 650, zeroResults: 150, avgResults: 500 },
    { state: "Gujarat", searches: 550, zeroResults: 70, avgResults: 480 },
  ]

  // New analytics data as per PRD requirements
  const specializationData = [
    { specialization: "General Medicine", searches: 1200, zeroResults: 60, avgResults: 1140 },
    { specialization: "Pediatrics", searches: 950, zeroResults: 95, avgResults: 855 },
    { specialization: "Dermatology", searches: 800, zeroResults: 160, avgResults: 640 },
    { specialization: "Radiology", searches: 700, zeroResults: 70, avgResults: 630 },
    { specialization: "Anesthesiology", searches: 650, zeroResults: 65, avgResults: 585 },
  ]

  const courseData = [
    { course: "MD/MS", searches: 8500, zeroResults: 425, avgResults: 8075 },
    { course: "DNB", searches: 4043, zeroResults: 307, avgResults: 3736 },
  ]

  const categoryData = [
    { category: "General", searches: 4500, zeroResults: 225, avgResults: 4275 },
    { category: "OBC", searches: 3800, zeroResults: 190, avgResults: 3610 },
    { category: "SC", searches: 2500, zeroResults: 125, avgResults: 2375 },
    { category: "ST", searches: 1200, zeroResults: 60, avgResults: 1140 },
    { category: "EWS", searches: 543, zeroResults: 132, avgResults: 411 },
  ]

  const refreshData = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time analytics and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>{dateRange}</option>
            </select>
          </div>
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>{examFilter}</option>
            <option>NEET-PG</option>
            <option>NEET-SS</option>
          </select>
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            <BarChart3 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-700">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white rounded-lg border-l-4 ${stat.color} p-6 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rank Band Distribution Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Rank Band Distribution</h3>
          <p className="text-gray-600 text-sm mb-6">Search volume by rank ranges</p>

          <div className="space-y-4">
            {rankBandData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-sm text-gray-600">{item.range}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-slate-700 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.searches / 600) * 100}%` }}
                    >
                      <span className="text-white text-xs font-medium">{item.searches}</span>
                    </div>
                  </div>
                  <div className="w-12 bg-cyan-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{item.avgResults}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-700 rounded"></div>
              <span className="text-gray-600">Searches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded"></div>
              <span className="text-gray-600">Avg Results</span>
            </div>
          </div>
        </div>

        {/* Top States Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Top States by Searches</h3>
          <p className="text-gray-600 text-sm mb-6">Most active regions</p>

          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Y-axis labels */}
              <text x="20" y="20" className="text-xs fill-gray-500">
                1000
              </text>
              <text x="20" y="70" className="text-xs fill-gray-500">
                750
              </text>
              <text x="20" y="120" className="text-xs fill-gray-500">
                500
              </text>
              <text x="20" y="170" className="text-xs fill-gray-500">
                250
              </text>
              <text x="20" y="195" className="text-xs fill-gray-500">
                0
              </text>

              {/* Total Searches Line */}
              <polyline fill="none" stroke="#1e293b" strokeWidth="2" points="50,20 120,35 190,55 260,85 330,105" />

              {/* Avg Results Line */}
              <polyline fill="none" stroke="#22c55e" strokeWidth="2" points="50,25 120,40 190,60 260,100 330,115" />

              {/* Data points */}
              {[50, 120, 190, 260, 330].map((x, i) => (
                <g key={i}>
                  <circle cx={x} cy={20 + i * 20} r="3" fill="#1e293b" />
                  <circle cx={x} cy={25 + i * 22} r="3" fill="#22c55e" />
                </g>
              ))}
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-12 text-xs text-gray-500">
              {stateData.map((state) => (
                <span key={state.state}>{state.state}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-700 rounded-full"></div>
              <span className="text-gray-600">Total Searches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Avg Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics - New Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Specializations by Searches */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Top Specializations by Searches
          </h3>
          <p className="text-gray-600 text-sm mb-6">Most searched specializations with zero-result analysis</p>

          <div className="space-y-4">
            {specializationData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-600 truncate">{item.specialization}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.searches / 1200) * 100}%` }}
                    >
                      <span className="text-white text-xs font-medium">{item.searches}</span>
                    </div>
                  </div>
                  <div className="w-12 bg-red-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{item.zeroResults}</span>
                  </div>
                  <div className="w-12 bg-green-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{item.avgResults}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-gray-600">Searches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-600">Zero Results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">Avg Results</span>
            </div>
          </div>
        </div>

        {/* Top Categories by Searches */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top Categories by Searches
          </h3>
          <p className="text-gray-600 text-sm mb-6">Search distribution by category with zero-result analysis</p>

          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-600">{item.category}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.searches / 4500) * 100}%` }}
                    >
                      <span className="text-white text-xs font-medium">{item.searches}</span>
                    </div>
                  </div>
                  <div className="w-12 bg-red-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{item.zeroResults}</span>
                  </div>
                  <div className="w-12 bg-green-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{item.avgResults}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span className="text-gray-600">Searches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-600">Zero Results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">Avg Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Analysis */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Top Specialization by Course
        </h3>
        <p className="text-gray-600 text-sm mb-6">Course-wise search distribution with zero-result analysis</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courseData.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">{item.course}</h4>
                <span className="text-sm text-gray-500">{item.searches} searches</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Searches</span>
                  <span className="font-medium">{item.searches.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zero Results</span>
                  <span className="font-medium text-red-600">{item.zeroResults}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Results</span>
                  <span className="font-medium text-green-600">{item.avgResults}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-medium text-blue-600">
                    {((item.avgResults / item.searches) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
