"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { Download, Mail } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface College {
  id: number;
  rank: number;
  name: string;
  location: string;
  state: string;
  specialization: string;
  course: string;
  category: string;
}

interface PredictorData {
  name: string;
  phone: string;
  email: string;
  rank: string;
  state: string;
  specialization: string;
  course: string;
  category: string;
  exam: string;
}

interface GroupCategory {
  group_name: string;
  category_type: string[];
}

interface LabeledValues {
  group: string;
  values: string[];
}

export default function Results() {
  const router = useRouter();
  const [userData, setPredictorData] = useState<PredictorData | null>(null);
  const [formData, setFormData] = useState<PredictorData | null>(null);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // API result and payload handed off from the landing page
  const [apiResult, setApiResult] = useState<any>(null);
  console.log("API RESULT =======", apiResult);
  const [apiForm, setApiForm] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  const [dropdownData, setDropdownData] = useState<GroupCategory[]>([]);
  console.log("Fetched group categories:==========", dropdownData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Searchable dropdown refs and state
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const courseDropdownRef = useRef<HTMLDivElement>(null);
  const specializationDropdownRef = useRef<HTMLDivElement>(null);

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState("");

  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");

  const [showSpecializationDropdown, setShowSpecializationDropdown] =
    useState(false);
  const [specializationSearch, setSpecializationSearch] = useState("");

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    const fetchGroupCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://127.0.0.1:8000/api/group-categories/"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: GroupCategory[] = await response.json();
        setDropdownData(result);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupCategories();
  }, []);

  // Dynamic options from API
  const stateGroup = dropdownData.find(
    (g) => g.group_name?.toLowerCase() === "state"
  );
  const stateData: LabeledValues = {
    group: "State",
    values: stateGroup?.category_type ?? [],
  };

  // Specialization options based on selected course (MD/MS or DNB)
  const specializationGroup = dropdownData.find(
    (g) =>
      g.group_name?.toLowerCase() === (formData?.course || "").toLowerCase()
  );
  const specializationData: LabeledValues = {
    group: "Specialization",
    values: specializationGroup?.category_type ?? [],
  };

  // Clear specialization if it doesn't belong to the selected course
  useEffect(() => {
    if (
      formData?.specialization &&
      dropdownData.length > 0 && // Only clear after dropdown data is loaded
      specializationData.values.length > 0 && // And specialization options are available
      !specializationData.values.includes(formData.specialization)
    ) {
      setFormData((prev) => (prev ? { ...prev, specialization: "" } : prev));
    }
  }, [formData?.course, dropdownData]);

  const categoryOptions = [
    "EWS",
    "EWS PwD",
    "OBC",
    "OBC PwD",
    "Open",
    "Open PwD",
    "SC",
    "SC PwD",
    "ST",
    "ST PwD",
  ];

  const courseOptions = ["MD/MS", "DNB"];

  // Sample college data
  const colleges: College[] = [
    {
      id: 1,
      rank: 2,
      name: "",
      location: "",
      state: "",
      specialization: "",
      course: "",
      category: "",
    },
  ];

  // Filter colleges function
  const filterColleges = (data: PredictorData) => {
    const userRank = Number.parseInt(data.rank) || 0;
    const filtered = colleges.filter((college) => {
      const matchesRank = college.rank >= userRank;
      const matchesState = !data.state || college.state === data.state;
      const matchesSpecialization =
        !data.specialization || college.specialization === data.specialization;
      const matchesCourse = college.course === data.course;
      const matchesCategory = college.category === data.category;

      return (
        matchesRank &&
        matchesState &&
        matchesSpecialization &&
        matchesCourse &&
        matchesCategory
      );
    });
    setFilteredColleges(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  useEffect(() => {
    // Get data from sessionStorage for legacy UI (filters)
    const storedData = sessionStorage.getItem("predictorData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setPredictorData(data);
      setFormData(data); // Initialize form data for existing filters/table
      filterColleges(data);
    } else {
      // Redirect to home if no data
      router.push("/");
    }

    // Also read API payload/result handed off from landing page
    const storedApiForm = sessionStorage.getItem("neetPgForm");
    const storedApiResult = sessionStorage.getItem("neetPgResult");
    if (storedApiForm) {
      try {
        setApiForm(JSON.parse(storedApiForm));
      } catch {}
    }
    if (storedApiResult) {
      try {
        setApiResult(JSON.parse(storedApiResult));
      } catch {}
    }
  }, [router]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(target)
      ) {
        setShowStateDropdown(false);
      }
      if (
        courseDropdownRef.current &&
        !courseDropdownRef.current.contains(target)
      ) {
        setShowCourseDropdown(false);
      }
      if (
        specializationDropdownRef.current &&
        !specializationDropdownRef.current.contains(target)
      ) {
        setShowSpecializationDropdown(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        setShowCategoryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof PredictorData, value: string) => {
    if (formData) {
      console.log(field, value, "=======formdata=======", formData);
      setFormData({ ...formData, [field]: value });
    }
  };

  // Handle update button click - call API and update server-side results
  const handleUpdateFilters = async () => {
    if (!formData) return;

    setApiLoading(true);

    // Build API payload from current formData
    const payload = {
      name: formData.name,
      phone_number: (formData as any).phone, // from landing page state
      email: formData.email,
      rank_no: Number(formData.rank),
      state: formData.state,
      allotment_category: "NEET_PG",
      qualifying_group_or_course: formData.course,
      specialization: formData.specialization,
      category: formData.category,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/allotment_tracker/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setApiResult(data);

      // persist for refresh / navigation parity
      sessionStorage.setItem("neetPgResult", JSON.stringify(data));
      sessionStorage.setItem("neetPgForm", JSON.stringify(payload));
    } catch (err) {
      console.error("NEET_PG API error (update)", err);
    } finally {
      setApiLoading(false);
    }

    // Keep local filter behavior too (optional)
    filterColleges(formData);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("NEET PG Seat Predictor Results", 14, 16);

    const tableData = (apiRows || currentColleges).map(
      (row: any, index: number) => [
        index + 1,
        row.rank_no || row.rank,
        row.allotted_institute || row.name,
        row.state,
        row.candidate_category || row.category,
      ]
    );

    autoTable(doc, {
      head: [["Sr. No", "Rank", "College", "State", "Category"]],
      body: tableData,
      startY: 22,
    });

    doc.save("NEET-PG-Results.pdf");
  };

  const handleSendEmail = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/send-results-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData?.email,
          results: apiRows || currentColleges,
        }),
      });

      if (!res.ok) throw new Error("Email failed");
      alert("Results sent to your email!");
    } catch (err) {
      console.error("Email error:", err);
      alert("Failed to send email.");
    }
  };

  

  const totalPages = Math.ceil(filteredColleges.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentColleges = filteredColleges.slice(startIndex, endIndex);

  // Prefer API results for table when available
  const apiRows: any[] | null = Array.isArray(apiResult?.filtered_results)
    ? apiResult.filtered_results
    : null;

  if (!userData || !formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="hidden sm:block">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Seat Predictor", href: "/" },
              { label: "NEET PG" },
            ]}
          />
        </div>

        {/* Main Heading */}
        <div className="mb-6 sm:mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            See which college you can get. One simple search.
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-600">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm">
                  Know which institute is waiting for you
                </span>
              </div>

              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm">
                  Collated as per previous year seat allotment data
                </span>
              </div>
            </div>

            <div className="hidden lg:flex flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-2 ">
              <div className="flex flex-col items-start">
                <div>
                  <span className="text-sm font-medium text-gray-700 mr-2">
                    Personal details
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <span>{userData.name || "Rajesh Das"}</span>
                  <span className="mx-1">•</span>
                  <span>{userData.phone}</span>
                  <span className="mx-1">•</span>
                  <span>{userData.email || "rajesh@example.com"}</span>
                  <span className="mx-1">•</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mb-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <Download size={14} />
            Download
          </button>
          <button
            onClick={handleSendEmail}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <Mail size={14} />
            Email
          </button>
        </div>

        {/* Filter Section - Responsive */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userData.exam === "NEET PG"
                  ? "NEET PG Rank"
                  : "NEET SS 2024 Rank"}
              </label>
              {/* <input
                type="number"
                value={formData.rank}
                onChange={(e) => handleInputChange("rank", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-transparent"
              /> */}

              <input
                type="number"
                placeholder={"NEET PG Rank"}
                value={formData.rank}
                onChange={(e) => handleInputChange("rank", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-transparent [appearance:textfield]              [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none"
              />
              {/* className="flex-1 w-full px-3 py-2 bg-gray-lite border-gray-300 
             focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent
             [appearance:textfield] 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none"
              /> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <div ref={stateDropdownRef} className="relative w-full">
                <div
                  onClick={() => setShowStateDropdown((prev) => !prev)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer text-sm focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-transparent"
                >
                  {formData.state || "All States"}
                </div>

                {showStateDropdown && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        value={stateSearch}
                        onChange={(e) => setStateSearch(e.target.value)}
                        placeholder="Search state..."
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none"
                      />
                    </div>

                    {stateData.values
                      .filter((state) =>
                        state.toLowerCase().includes(stateSearch.toLowerCase())
                      )
                      .map((state) => (
                        <div
                          key={state}
                          onClick={() => {
                            handleInputChange("state", state);
                            setShowStateDropdown(false);
                            setStateSearch("");
                          }}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {state}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <div ref={courseDropdownRef} className="relative w-full">
                <div
                  onClick={() => setShowCourseDropdown((prev) => !prev)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer text-sm focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-transparent"
                >
                  {formData.course || "Course"}
                </div>

                {showCourseDropdown && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {courseOptions
                      .filter((course) =>
                        course
                          .toLowerCase()
                          .includes(courseSearch.toLowerCase())
                      )
                      .map((course) => (
                        <div
                          key={course}
                          onClick={() => {
                            handleInputChange("course", course);
                            setShowCourseDropdown(false);
                            setCourseSearch("");
                          }}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {course}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <div ref={specializationDropdownRef} className="relative w-full">
                <div
                  onClick={() => setShowSpecializationDropdown((prev) => !prev)}
                  className={`px-3 py-2 bg-white border rounded-md cursor-pointer text-sm focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-transparent whitespace-nowrap overflow-hidden truncate ${
                    !formData.specialization
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  title={formData.specialization || specializationData.group}
                >
                  {formData.specialization || specializationData.group}
                </div>

                {showSpecializationDropdown && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        value={specializationSearch}
                        onChange={(e) =>
                          setSpecializationSearch(e.target.value)
                        }
                        placeholder="Search specialization..."
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none"
                      />
                    </div>

                    {specializationData.values
                      .filter((item) =>
                        item
                          .toLowerCase()
                          .includes(specializationSearch.toLowerCase())
                      )
                      .map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            handleInputChange("specialization", item);
                            setShowSpecializationDropdown(false);
                            setSpecializationSearch("");
                          }}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer break-words"
                        >
                          {item}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div ref={categoryDropdownRef} className="relative w-full">
                <div
                  onClick={() => setShowCategoryDropdown((prev) => !prev)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md cursor-pointer text-sm focus:outline-none focus:ring-1 focus:ring-slate-700 focus:border-transparent"
                >
                  {formData.category || "All Categories"}
                </div>

                {showCategoryDropdown && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {categoryOptions
                      .filter((c) =>
                        c.toLowerCase().includes(categorySearch.toLowerCase())
                      )
                      .map((c) => (
                        <div
                          key={c}
                          onClick={() => {
                            handleInputChange("category", c);
                            setShowCategoryDropdown(false);
                            setCategorySearch("");
                          }}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {c}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleUpdateFilters}
                disabled={apiLoading}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-60"
              >
                {apiLoading ? "Please wait..." : "Update"}
              </button>
            </div>
          </div>
        </div>

        {/* API Result (from server) */}
        {/* {apiResult && (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Server Result</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(apiResult, null, 2)}
            </pre>
          </div>
        )} */}

        {/* Results Table - Mobile Responsive */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium text-gray-900">
                Search Results ({filteredColleges.length} colleges found)
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {currentColleges.map((college, index) => (
                <div key={college.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-500">
                      #{startIndex + index + 1}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {college.rank.toLocaleString()}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {college.name}
                  </h4>
                  <div className="text-sm text-gray-500 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {college.location}
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-900">
                    {college.state}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr. No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank 
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    College 
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State 
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category 
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiRows
                  ? apiRows.map((row, index) => (
                      <tr
                        key={`${row.allotted_institute}-${row.rank_no}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Number(row.rank_no).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">
                            {row.allotted_institute}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row.candidate_category}
                        </td>
                      </tr>
                    ))
                  : currentColleges.map((college, index) => (
                      <tr key={college.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {college.rank.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{college.name}</div>
                          <div className="text-gray-500 flex items-center mt-1">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {college.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {college.state}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {college.category}
                        </td>
                      </tr>
                    ))}
              </tbody>

              {/* <tbody className="bg-white divide-y divide-gray-200">
                {(apiRows || currentColleges).map((row: any, index: number) => (
                  <tr
                    key={`row-${row.allotted_institute || row.name}-${
                      row.rank_no || row.rank
                    }-${index}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.rank_no || row.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.allotted_institute || row.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.candidate_category || row.category}
                    </td>
                  </tr>
                ))}
              </tbody> */}
            </table>
          </div>

          {/* Pagination - Responsive */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 flex items-center">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            {/* Main Heading 
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {startIndex + 1}-{Math.min(endIndex, filteredColleges.length)}{" "}
                  of {filteredColleges.length}
                </span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">Rows per page:</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="text-sm text-gray-700">
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
