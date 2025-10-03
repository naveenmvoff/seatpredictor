"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  FileText,
} from "lucide-react";
import { userSearchesApi, handleApiError } from "@/lib/api";
import DatePicker from "react-datepicker";

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
  const today = new Date();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    today,
    today,
  ]);
  const [examFilter, setExamFilter] = useState("All Exams");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [resultsFilter, setResultsFilter] = useState("All Results");
  const [searchData, setSearchData] = useState<UserSearchData[]>([]);
  const [filteredData, setFilteredData] = useState<UserSearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchUserData = async (): Promise<UserSearchData[]> => {
    try {
      console.log("Fetching user data from API...");
      const data = await userSearchesApi.getEnhanced({
        page: 1,
        page_size: 50,
        search: searchQuery,
        exam_filter: examFilter,
        category_filter: categoryFilter,
        results_filter: resultsFilter,
      });

      console.log("Fetched user data:==========", data);

      // Transform data and add resultsBadge
      return data.data.map((item: any) => ({
        id: item.seqno,
        name: item.name,
        phone: item.phone_number || "",
        email: item.email || "",
        exam: item.exam_type || "Unknown",
        rank: item.rank_no?.toString() || "",
        category: item.category || "",
        state: item.state || "",
        specialization: item.specialization || "",
        course: item.qualifying_group_or_course || "",
        searchTime: item.search_time
          ? new Date(item.search_time).toLocaleString()
          : "",
        results: item.results_count || 0,
        resultsBadge: item.has_results
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800",
      }));
    } catch (error) {
      console.error("Error fetching user data:", handleApiError(error));
      return [];
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserData();
      setSearchData(data);
      setFilteredData(data);
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

  // Filter data based on current filters
  const applyFilters = () => {
    let filtered = [...searchData];

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.phone.includes(searchQuery)
      );
    }

    // Exam filter
    if (examFilter !== "All Exams") {
      filtered = filtered.filter((item) => item.exam === examFilter);
    }

    // Category filter
    if (categoryFilter !== "All Categories") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Results filter
    if (resultsFilter === "Has Results") {
      filtered = filtered.filter((item) => item.results > 0);
    } else if (resultsFilter === "Zero Results") {
      filtered = filtered.filter((item) => item.results === 0);
    }

    setFilteredData(filtered);
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, examFilter, categoryFilter, resultsFilter, searchData]);

  // Fetch user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Export to CSV function
  const exportToCSV = async () => {
    setIsExporting(true);

    try {
      await userSearchesApi.exportCsv({
        search_query: searchQuery,
        exam_filter: examFilter,
        category_filter: categoryFilter,
        results_filter: resultsFilter,
      });
    } catch (error) {
      console.error("Error exporting CSV:", handleApiError(error));
      alert(`Error exporting data: ${handleApiError(error)}`);
    } finally {
      setIsExporting(false);
    }
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
            onClick={exportToCSV}
            disabled={isExporting || filteredData.length === 0}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isExporting
              ? "Exporting..."
              : `Export CSV (${filteredData.length})`}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Filter search results by various criteria. Showing{" "}
          {filteredData.length} of {searchData.length} records.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* <div className="relative">
            <DatePicker
              selectsRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => {
                setDateRange(update as [Date | null, Date | null]);
              }}
              dateFormat="MMM d, yyyy"
              isClearable={true}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholderText="Select date range"
            />
          </div>   */}

          {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>

            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => {
                setDateRange(update as [Date | null, Date | null]);
              }}
              dateFormat="MMM d, yyyy"
              placeholderText="Select date range"
              shouldCloseOnSelect={false}
              customInput={
                <input
                  type="text"
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={
                    dateRange[0] && dateRange[1]
                      ? `${dateRange[0].toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })} - ${dateRange[1].toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : ""
                  }
                />
              }
            />
          </div> */}

          <div className="relative flex items-center">
            {/* Calendar Icon */}
            <div className="absolute left-0 pl-3 flex items-center text-gray-400">
              <Calendar className="w-4 h-4" />
            </div>

            {/* Date Picker with custom input */}
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => {
                setDateRange(update as [Date | null, Date | null]);
              }}
              dateFormat="MMM d, yyyy"
              shouldCloseOnSelect={false}
              customInput={
                <div className="w-full flex items-center">
                  <input
                    type="text"
                    readOnly
                    placeholder="Select date range"
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={
                      dateRange[0] && dateRange[1]
                        ? `${dateRange[0].toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })} - ${dateRange[1].toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}`
                        : ""
                    }
                  />
                  {/* Clear button */}
                  {dateRange[0] && dateRange[1] && (
                    <button
                      type="button"
                      onClick={() => setDateRange([null, null])}
                      className="absolute right-2 text-gray-400 hover:text-gray-600"
                    >
                      ✖
                    </button>
                  )}
                </div>
              }
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

          <select
            value={resultsFilter}
            onChange={(e) => setResultsFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Results</option>
            <option>Has Results</option>
            <option>Zero Results</option>
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
              : `Showing ${filteredData.length} of ${searchData.length} search records`}
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
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {searchData.length === 0
                      ? "No search records found."
                      : "No records match your filters."}
                  </td>
                </tr>
              ) : (
                filteredData.map((record) => (
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
