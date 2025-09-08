import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FilterButtons from "@/components/molecules/FilterButtons";

const Header = ({ 
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onMenuToggle,
  onCreateTask
}) => {
const quickFilters = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "today", label: "Today" },
    { value: "high", label: "Priority" }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
            
            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
              <p className="text-sm text-gray-500">Manage your daily activities</p>
            </div>
          </div>

          <Button
            onClick={onCreateTask}
            variant="primary"
            className="hidden sm:flex shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Task
          </Button>

          <Button
            onClick={onCreateTask}
            variant="primary"
            size="sm"
            className="sm:hidden"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onSearch={onSearchChange}
            placeholder="Search tasks..."
            className="w-full"
          />

          <div className="overflow-x-auto">
            <FilterButtons
              filters={quickFilters}
              activeFilter={activeFilter}
              onFilterChange={onFilterChange}
              className="min-w-max"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;