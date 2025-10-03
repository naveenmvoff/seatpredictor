"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  AlertCircle,
  MapPin,
  GraduationCap,
  Award,
  Download,
} from "lucide-react";
import { dashboardApi, handleApiError } from "@/lib/api";
import DatePicker from "react-datepicker";

export default function AdminDashboard() {
  const today = new Date();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    today,
    today,
  ]);

  const [examFilter, setExamFilter] = useState("All Exams");
  const [isLoading, setIsLoading] = useState(false);

  const stats = [
    {
      title: "Total Searches",
      value: "12,543",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "border-l-blue-500",
    },
    {
      title: "Unique Users",
      value: "8,234",
      icon: <Users className="w-6 h-6" />,
      color: "border-l-cyan-500",
    },
    {
      title: "Success Results",
      value: "7,502",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "border-l-green-500",
    },
    {
      title: "Zero Results",
      value: "732",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "border-l-yellow-500",
    },
  ];

  const rankBandData = [
    { range: "<5k", searches: 450, avgResults: 45 },
    { range: "5-10k", searches: 380, avgResults: 38 },
    { range: "10-20k", searches: 520, avgResults: 52 },
    { range: "20-30k", searches: 290, avgResults: 29 },
    { range: "30-40k", searches: 160, avgResults: 16 },
    { range: "40-50k", searches: 120, avgResults: 12 },
    { range: ">50k", searches: 80, avgResults: 8 },
  ];

  const stateData = [
    { state: "Maharashtra", searches: 1000, zeroResults: 50, avgResults: 950 },
    { state: "Karnataka", searches: 850, zeroResults: 50, avgResults: 800 },
    { state: "Tamil Nadu", searches: 750, zeroResults: 50, avgResults: 700 },
    { state: "Delhi", searches: 650, zeroResults: 150, avgResults: 500 },
    { state: "Gujarat", searches: 550, zeroResults: 70, avgResults: 480 },
  ];

  // New analytics data as per PRD requirements
  const specializationData = [
    {
      specialization: "General Medicine",
      searches: 1200,
      zeroResults: 60,
      avgResults: 1140,
    },
    {
      specialization: "Pediatrics",
      searches: 950,
      zeroResults: 95,
      avgResults: 855,
    },
    {
      specialization: "Dermatology",
      searches: 800,
      zeroResults: 160,
      avgResults: 640,
    },
    {
      specialization: "Radiology",
      searches: 700,
      zeroResults: 70,
      avgResults: 630,
    },
    {
      specialization: "Anesthesiology",
      searches: 650,
      zeroResults: 65,
      avgResults: 585,
    },
  ];

  const courseData = [
    { course: "MD/MS", searches: 8500, zeroResults: 425, avgResults: 8075 },
    { course: "DNB", searches: 4043, zeroResults: 307, avgResults: 3736 },
  ];

  const categoryData = [
    { category: "General", searches: 4500, zeroResults: 225, avgResults: 4275 },
    { category: "OBC", searches: 3800, zeroResults: 190, avgResults: 3610 },
    { category: "SC", searches: 2500, zeroResults: 125, avgResults: 2375 },
    { category: "ST", searches: 1200, zeroResults: 60, avgResults: 1140 },
    { category: "EWS", searches: 543, zeroResults: 132, avgResults: 411 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time analytics and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center ">
            <DatePicker
              selectsRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => {
                setDateRange(update as [Date | null, Date | null]);
              }}
              dateFormat="MMM d, yyyy"
              isClearable={true}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 w-56"
              placeholderText="Select date range"
            />
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

          <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-700">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg border-l-4 ${stat.color} p-6 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Rank Band Distribution
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Search volume by rank ranges
          </p>

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
                      <span className="text-white text-xs font-medium">
                        {item.searches}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 bg-cyan-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {item.avgResults}
                    </span>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Top States by Searches
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Most active regions with zero-result analysis
          </p>

          <div className="space-y-4">
            {stateData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-600 truncate">
                  {item.state}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-indigo-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.searches / 1000) * 100}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        {item.searches}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 bg-red-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {item.zeroResults}
                    </span>
                  </div>
                  <div className="w-12 bg-green-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {item.avgResults}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-600 rounded"></div>
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

      {/* Additional Analytics - New Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Specializations by Searches */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Top Specializations by Searches
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Most searched specializations with zero-result analysis
          </p>

          <div className="space-y-4">
            {specializationData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-600 truncate">
                  {item.specialization}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.searches / 1200) * 100}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        {item.searches}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 bg-red-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {item.zeroResults}
                    </span>
                  </div>
                  <div className="w-12 bg-green-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {item.avgResults}
                    </span>
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
          <p className="text-gray-600 text-sm mb-6">
            Search distribution by category with zero-result analysis
          </p>

          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-600">
                  {item.category}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.searches / 4500) * 100}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        {item.searches}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 bg-red-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {item.zeroResults}
                    </span>
                  </div>
                  <div className="w-12 bg-green-500 h-6 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {item.avgResults}
                    </span>
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
        <p className="text-gray-600 text-sm mb-6">
          Course-wise search distribution with zero-result analysis
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courseData.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">{item.course}</h4>
                <span className="text-sm text-gray-500">
                  {item.searches} searches
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Searches</span>
                  <span className="font-medium">
                    {item.searches.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Zero Results</span>
                  <span className="font-medium text-red-600">
                    {item.zeroResults}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Results</span>
                  <span className="font-medium text-green-600">
                    {item.avgResults}
                  </span>
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
  );
}
