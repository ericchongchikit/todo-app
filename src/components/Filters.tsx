import React from "react";
import { FilterType } from "../types";

interface FiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const Filters: React.FC<FiltersProps> = ({ currentFilter, onFilterChange }) => {
  const filters: FilterType[] = ["all", "active", "completed"];

  return (
    <div className="filters">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-btn ${currentFilter === filter ? "active" : ""}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default Filters;
