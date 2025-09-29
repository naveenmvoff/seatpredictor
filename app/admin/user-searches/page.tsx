"use client";

import { useState, useEffect } from "react";

// Interface for user search data
interface UserSearchData {
  id: number;
  name: string;
  phone: string;
  email: string;
  exam: string;
  rank: string;
  category: string;
  state: string;
  specialization: string;
  course: string;
  searchTime: string;
  results: number;
  resultsBadge?: string;
}

// API endpoint function to fetch user data
// const fetchUserData = async (): Promise<UserSearchData[]> => {
//   try {
//     const response = await fetch('http://127.0.0.1:8000/admin/user-data', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     const data = await response.json()
//     console.log('Fetched user data:==========', data)

//     // Transform data and add resultsBadge based on results count
//     return data.map((item: UserSearchData) => ({
//       ...item,
//       resultsBadge: item.results === 0
//         ? "bg-red-100 text-red-800"
//         : "bg-green-100 text-green-800"
//     }))
//   } catch (error) {
//     console.error('Error fetching user data:', error)
//     throw error
//   }
// }

export default function UserSearches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("Aug 30, 2025 - Sep 29, 2025");
  const [examFilter, setExamFilter] = useState("All Exams");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [searchData, setSearchData] = useState<UserSearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (): Promise<UserSearchData[]> => {
    try {
      console.log("Fetching user data from API...");
      const response = await fetch("http://127.0.0.1:8000/admin/user-data", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      console.log("Fetched user data:==========", data);

      // Transform data and add resultsBadge
      return data.map((item: UserSearchData) => ({
        ...item,
        resultsBadge:
          item.results === 0
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800",
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserData();
      setSearchData(data);
      console.log("Data loaded into state:", data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      );
      console.error("Failed to load user data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Refresh function for manual reload
  const refreshData = () => {
    loadUserData();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            User Searches
          </h1>
          <p className="text-gray-600 mt-1">
            Track and analyze user search history
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-700">
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Filter search results by various criteria
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
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
          <h2 className="text-lg font-semibold text-gray-900">
            Search History
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {loading
              ? "Loading..."
              : `Showing ${searchData.length} search records`}
          </p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
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
              {loading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                      Loading user data...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-4 text-center text-red-500"
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-red-400 mr-2"></span>
                      Error: {error}
                    </div>
                  </td>
                </tr>
              ) : searchData.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No search records found.
                  </td>
                </tr>
              ) : (
                searchData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 text-sm">👤</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.name}
                        </div>
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
                      <span className="text-sm text-gray-900">
                        {record.exam}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {record.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {record.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {record.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {record.specialization}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {record.course}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {record.searchTime}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${record.resultsBadge}`}
                      >
                        {record.results === 0 ? "No Results" : record.results}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
