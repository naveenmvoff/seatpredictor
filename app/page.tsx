"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

interface GroupCategory {
  group_name: string;
  category_type: string[];
}

interface LabeledValues {
  group: string;
  values: string[];
}

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("NEET PG");
  const [selectedCourse, setSelectedCourse] = useState("MD/MS");
  const [selectedCategory, setSelectedCategory] = useState("EWS");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    rank: "",
    state: "",
    specialization: "",
    qualifyingGroup: "",
  });
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState("");
  const [showSpecializationDropdown, setShowSpecializationDropdown] =
    useState(false);
  const [specializationSearch, setSpecializationSearch] = useState("");

  // Drop Down popup Close on outside click
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const specializationDropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownData, setDropdownData] = useState<GroupCategory[]>([]);
  // console.log("Fetched group categories:==========", dropdownData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State data derived from dropdownData (group_name: "state")
  const stateGroup = dropdownData.find(
    (g) => g.group_name?.toLowerCase() === "state"
  );
  const stateData: LabeledValues = {
    group: "State",
    values: stateGroup?.category_type ?? [],
  };

  // Specialization data derived from dropdownData based on selectedCourse (MD/MS or DNB)
  const specializationGroup = dropdownData.find(
    (g) => g.group_name?.toLowerCase() === selectedCourse.toLowerCase()
  );

  // NEET SS dropdown list: all group_name except MD/MS and DNB
  const ssGroupsData: LabeledValues = {
    group: "Group",
    values: dropdownData
      .filter(
        (g) => !["md/ms", "dnb"].includes((g.group_name || "").toLowerCase())
      )
      .map((g) => g.group_name),
  };

  // NEET SS specialization options based on selected group (qualifyingGroup)
  const ssSpecializationGroup = dropdownData.find(
    (g) => g.group_name === formData.qualifyingGroup
  );
  const ssSpecializationData: LabeledValues = {
    group: "Specialization",
    values: ssSpecializationGroup?.category_type ?? [],
  };

  // Unify specialization data depending on active tab
  const specializationData: LabeledValues =
    activeTab === "NEET PG"
      ? {
          group: "Specialization",
          values: specializationGroup?.category_type ?? [],
        }
      : ssSpecializationData;

  // If the selected specialization is not available for the current context, clear it
  useEffect(() => {
    if (
      formData.specialization &&
      !specializationData.values.includes(formData.specialization)
    ) {
      setFormData((prev) => ({ ...prev, specialization: "" }));
    }
  }, [selectedCourse, formData.qualifyingGroup, dropdownData, activeTab]);

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

  const handleSubmitNeetPG = (e: React.FormEvent) => {
    e.preventDefault();

    // Build the API-ready payload for NEET PG
    const NEET_PGData = {
      name: formData.name,
      phone_number: formData.phone,
      email: formData.email,
      rank_no: Number(formData.rank),
      state: formData.state,
      allotment_category: "NEET_PG",
      qualifying_group_or_course: selectedCourse,
      specialization: formData.specialization,
      category: selectedCategory,
    };

    // Log so it can be directly used as an API body
    console.log("NEET_PG", NEET_PGData);

    // Keep storing the original structure for the next page (if needed)
    const predictorData = {
      ...formData,
      course: selectedCourse,
      category: selectedCategory,
      exam: "NEET PG",
    };

    sessionStorage.setItem("predictorData", JSON.stringify(predictorData));
    router.push("/neet-pg");
  };

  const handleSubmitNeetSS = (e: React.FormEvent) => {
    e.preventDefault();

    // Build the API-ready payload for NEET SS
    const NEET_SSDATA = {
      name: formData.name,
      phone_number: formData.phone,
      email: formData.email,
      rank_no: Number(formData.rank),
      state: "", // state not needed for NEET SS submissions
      allotment_category: "NEET_SS",
      qualifying_group_or_course: formData.qualifyingGroup,
      specialization: formData.specialization,
      category: "",
    };

    // Log so it can be directly used as an API body
    console.log("NEET_SS", NEET_SSDATA);

    // Keep storing the original structure for the next page (if needed)
    const predictorData = {
      ...formData,
      course: "", // NEET SS doesn't have course selection
      category: "", // NEET SS doesn't have category selection
      exam: "NEET SS",
    };

    sessionStorage.setItem("predictorData", JSON.stringify(predictorData));
    router.push("/neet-ss");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      console.log("Clicked outside:", target);

      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(target)
      ) {
        setShowStateDropdown(false);
      }
      if (
        specializationDropdownRef.current &&
        !specializationDropdownRef.current.contains(target)
      ) {
        setShowSpecializationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="hidden sm:block">
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Seat Predictor" }]}
          />
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            See which college you can get. One simple search.
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-600 px-4">
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
              <span className="text-sm sm:text-base">
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
              <span className="text-sm sm:text-base">
                Collated as per previous year seat allotment data
              </span>
            </div>
          </div>
        </div>

        {/* Exam Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex bg-gray-50 rounded-lg p-1 w-full max-w-xs gap-0.5">
            <button
              onClick={() => setActiveTab("NEET PG")}
              className={`flex-1 px-4 sm:px-6 py-2 rounded-md text-sm transition-colors ${
                activeTab === "NEET PG"
                  ? "bg-[#dadada] text-gray-700 shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              NEET PG
            </button>
            <button
              onClick={() => setActiveTab("NEET SS")}
              className={`flex-1 px-4 sm:px-6 py-2 rounded-md text-sm transition-colors ${
                activeTab === "NEET SS"
                  ? "bg-[#dadada] text-gray-700 shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              NEET SS
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={
            activeTab === "NEET PG" ? handleSubmitNeetPG : handleSubmitNeetSS
          }
          className="max-w-6xl mx-auto bg-white border border-gray-100 p-4 rounded-3xl"
        >
          {/* Course Selection - Only show for NEET PG */}
          {activeTab === "NEET PG" && (
            <div className="mb-6">
              <div className="flex items-center space-x-6">
                <p className="text-sm font-bold text-gray-700">Course:</p>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="course"
                    value="MD/MS"
                    checked={selectedCourse === "MD/MS"}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">MD/MS</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="course"
                    value="DNB"
                    checked={selectedCourse === "DNB"}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">DNB</span>
                </label>
              </div>
            </div>
          )}

          {/* Form Fields - Single Horizontal Line */}
          <div className="flex flex-wrap items-center gap-1 mb-6">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="flex-1 min-w-[150px] px-3 py-2  bg-gray-lite border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="flex-1 min-w-[150px] px-3 py-2 bg-gray-lite border-gray-300 focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="flex-1 min-w-[150px] px-3 py-2 bg-gray-lite border-gray-300 focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent"
            />

            <input
              type="number"
              placeholder={
                activeTab === "NEET PG"
                  ? "NEET PG 2024 Rank"
                  : "NEET SS 2024 Rank"
              }
              value={formData.rank}
              onChange={(e) => handleInputChange("rank", e.target.value)}
              className="flex-1 min-w-[170px] px-3 py-2 bg-gray-lite border-gray-300 
             focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent
             [appearance:textfield] 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none"
            />

            {activeTab === "NEET PG" ? (
              <>
                {/* Searchable State Dropdown */}
                <div
                  ref={stateDropdownRef}
                  className="relative flex-1 min-w-[150px]"
                >
                  <div
                    onClick={() => setShowStateDropdown((prev) => !prev)}
                    className="px-3 py-2 bg-gray-lite border-gray-300 cursor-pointer text-sm focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent"
                  >
                    {formData.state || stateData.group}
                  </div>

                  {showStateDropdown && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {/* Search bar */}
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          value={stateSearch}
                          onChange={(e) => setStateSearch(e.target.value)}
                          placeholder="Search state..."
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none"
                        />
                      </div>

                      {/* Filtered state list */}
                      {stateData.values
                        .filter((state) =>
                          state
                            .toLowerCase()
                            .includes(stateSearch.toLowerCase())
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

                <div
                  ref={specializationDropdownRef}
                  className="relative flex-1 min-w-[180px]"
                >
                  <div
                    onClick={() =>
                      setShowSpecializationDropdown((prev) => !prev)
                    }
                    className="px-3 py-2 bg-gray-lite border-gray-300 cursor-pointer text-sm 
             focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent 
             whitespace-nowrap overflow-hidden truncate"
                    title={formData.specialization || specializationData.group} // Tooltip with full value
                  >
                    {formData.specialization || specializationData.group}
                  </div>

                  {showSpecializationDropdown && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {/* Search bar */}
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

                      {/* Filtered specialization list */}
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

                <button
                  type="submit"
                  className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-2 rounded-r-md font-medium transition-colors whitespace-nowrap"
                >
                  Submit
                </button>
              </>
            ) : (
              <>
                <div
                  ref={stateDropdownRef}
                  className="relative flex-1 min-w-[150px]"
                >
                  <div
                    onClick={() => setShowStateDropdown((prev) => !prev)}
                    className="px-3 py-2 bg-gray-lite border-gray-300 cursor-pointer text-sm focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent"
                  >
                    {formData.qualifyingGroup || ssGroupsData.group}
                  </div>

                  {showStateDropdown && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {/* Search bar */}
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          value={stateSearch}
                          onChange={(e) => setStateSearch(e.target.value)}
                          placeholder="Search group..."
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none"
                        />
                      </div>

                      {/* Filtered group list */}
                      {ssGroupsData.values
                        .filter((name) =>
                          name.toLowerCase().includes(stateSearch.toLowerCase())
                        )
                        .map((name) => (
                          <div
                            key={name}
                            onClick={() => {
                              handleInputChange("qualifyingGroup", name);
                              setShowStateDropdown(false);
                              setStateSearch("");
                            }}
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          >
                            {name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div
                  ref={specializationDropdownRef}
                  className="relative flex-1 min-w-[180px]"
                >
                  <div
                    onClick={() =>
                      setShowSpecializationDropdown((prev) => !prev)
                    }
                    className="px-3 py-2 bg-gray-lite border-gray-300 cursor-pointer text-sm 
             focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent 
             whitespace-nowrap overflow-hidden truncate"
                    title={formData.specialization || specializationData.group} // Tooltip with full value
                  >
                    {formData.specialization || specializationData.group}
                  </div>

                  {showSpecializationDropdown && (
                    <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {/* Search bar */}
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

                      {/* Filtered specialization list */}
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

                {/* <select
                  value={formData.qualifyingGroup}
                  onChange={(e) =>
                    handleInputChange("qualifyingGroup", e.target.value)
                  }
                  className="flex-1 min-w-[150px] px-3 py-2 bg-gray-lite border-gray-300 focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent"
                >
                  <option value="">Qualifying Group</option>
                  <option value="Group A">Group A</option>
                  <option value="Group B">Group B</option>
                  <option value="Group C">Group C</option>
                </select> */}

                <button
                  type="submit"
                  className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-2 rounded-r-md font-medium transition-colors whitespace-nowrap"
                >
                  Submit
                </button>
              </>
            )}
          </div>

          {/* Category Selection - Only show for NEET PG */}
          {activeTab === "NEET PG" && (
            <div className="mb-6">
              <div className="flex items-center flex-wrap gap-x-6 gap-y-3">
                <p className="text-sm font-bold text-gray-700">Category:</p>

                {[
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
                ].map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-radio-blue border-gray-300 focus:ring-1 focus:ring-radio-blue checked:bg-radio-blue checked:border-radio-blue"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </form>
      </main>

      <Footer />
    </div>
  );
}
