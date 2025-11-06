"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"

interface FilterOption {
  label: string
  value: string
}

interface SearchBarProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filter: string, value: string) => void
}

export function SearchBar({ onSearch, onFilterChange }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  const filters = {
    industry: [
      { label: "Technology", value: "technology" },
      { label: "Finance", value: "finance" },
      { label: "Healthcare", value: "healthcare" },
      { label: "Education", value: "education" },
      { label: "Marketing", value: "marketing" },
    ],
    skill: [
      { label: "React", value: "react" },
      { label: "Python", value: "python" },
      { label: "Design", value: "design" },
      { label: "Marketing", value: "marketing" },
      { label: "Project Management", value: "project-management" },
    ],
    location: [
      { label: "Remote", value: "remote" },
      { label: "United States", value: "us" },
      { label: "Europe", value: "europe" },
      { label: "Asia", value: "asia" },
    ],
    projectType: [
      { label: "Full-time", value: "full-time" },
      { label: "Part-time", value: "part-time" },
      { label: "Contract", value: "contract" },
      { label: "Freelance", value: "freelance" },
    ],
    companySize: [
      { label: "1-10", value: "1-10" },
      { label: "11-50", value: "11-50" },
      { label: "51-200", value: "51-200" },
      { label: "201-500", value: "201-500" },
      { label: "500+", value: "500+" },
    ],
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-3 w-full flex justify-center">
        <div className="relative inline-block w-full max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for projects, freelancers, companies, or jobs"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </form>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <FilterDropdown
          label="Industry"
          options={filters.industry}
          isOpen={openFilter === "industry"}
          onToggle={() => setOpenFilter(openFilter === "industry" ? null : "industry")}
          onSelect={(value) => {
            onFilterChange?.("industry", value)
            setOpenFilter(null)
          }}
        />
        <FilterDropdown
          label="Skill"
          options={filters.skill}
          isOpen={openFilter === "skill"}
          onToggle={() => setOpenFilter(openFilter === "skill" ? null : "skill")}
          onSelect={(value) => {
            onFilterChange?.("skill", value)
            setOpenFilter(null)
          }}
        />
        <FilterDropdown
          label="Location"
          options={filters.location}
          isOpen={openFilter === "location"}
          onToggle={() => setOpenFilter(openFilter === "location" ? null : "location")}
          onSelect={(value) => {
            onFilterChange?.("location", value)
            setOpenFilter(null)
          }}
        />
        <FilterDropdown
          label="Project Type"
          options={filters.projectType}
          isOpen={openFilter === "projectType"}
          onToggle={() => setOpenFilter(openFilter === "projectType" ? null : "projectType")}
          onSelect={(value) => {
            onFilterChange?.("projectType", value)
            setOpenFilter(null)
          }}
        />
        <FilterDropdown
          label="Company Size"
          options={filters.companySize}
          isOpen={openFilter === "companySize"}
          onToggle={() => setOpenFilter(openFilter === "companySize" ? null : "companySize")}
          onSelect={(value) => {
            onFilterChange?.("companySize", value)
            setOpenFilter(null)
          }}
        />
      </div>
    </div>
  )
}

interface FilterDropdownProps {
  label: string
  options: FilterOption[]
  isOpen: boolean
  onToggle: () => void
  onSelect: (value: string) => void
}

function FilterDropdown({ label, options, isOpen, onToggle, onSelect }: FilterDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs font-medium text-gray-700"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-50">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

