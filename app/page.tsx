"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

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

  const handleSubmitNeetPG = (e: React.FormEvent) => {
    e.preventDefault();
    // Store form data in sessionStorage and redirect to NEET PG page
    sessionStorage.setItem(
      "predictorData",
      JSON.stringify({
        ...formData,
        course: selectedCourse,
        category: selectedCategory,
        exam: "NEET PG",
      })
    );
    router.push("/neet-pg");
  };

  const handleSubmitNeetSS = (e: React.FormEvent) => {
    e.preventDefault();
    // Store form data in sessionStorage and redirect to NEET SS page
    sessionStorage.setItem(
      "predictorData",
      JSON.stringify({
        ...formData,
        course: "", // NEET SS doesn't have course selection
        category: "", // NEET SS doesn't have category selection
        exam: "NEET SS",
      })
    );
    router.push("/neet-ss");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
          onSubmit={activeTab === "NEET PG" ? handleSubmitNeetPG : handleSubmitNeetSS}
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
              className="flex-1 min-w-[200px] px-3 py-2 bg-gray-lite border-gray-300 
             focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent
             [appearance:textfield] 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none"
            />

            {activeTab === "NEET PG" ? (
              <>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="flex-1 min-w-[150px] px-3 py-2 bg-gray-lite border-gray-300 focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent"
                >
                  <option value="">State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Puducherry">Puducherry</option>
                </select>

                <select
                  value={formData.specialization}
                  onChange={(e) =>
                    handleInputChange("specialization", e.target.value)
                  }
                  className="flex-1 min-w-[150px] px-3 py-2 bg-gray-lite border-gray-300 focus:outline-none focus:ring-1 focus:ring-radio-blue focus:border-transparent"
                >
                  <option value="">Specialization</option>
                  <option value="M.D. (Anaesthesiology)">
                    M.D. (Anaesthesiology)
                  </option>
                  <option value="M.D. (General Medicine)">
                    M.D. (General Medicine)
                  </option>
                  <option value="M.S. (General Surgery)">
                    M.S. (General Surgery)
                  </option>
                  <option value="M.D. (Pediatrics)">M.D. (Pediatrics)</option>
                  <option value="M.D. (Radiology)">M.D. (Radiology)</option>
                </select>

                <button
                  type="submit"
                  className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-2 rounded-r-md font-medium transition-colors whitespace-nowrap"
                >
                  Submit
                </button>
              </>
            ) : (
              <>
                <select
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
                </select>

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
