import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import StatsOverview from "@/components/organisms/StatsOverview";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleTaskSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setSearchQuery(""); // Clear search when changing filter
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <Sidebar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          onCreateTask={handleCreateTask}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        onCreateTask={handleCreateTask}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
<div className="flex items-center justify-between p-4 sm:px-6 bg-surface border-b border-gray-200">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            onMenuToggle={() => setIsMobileSidebarOpen(true)}
            onCreateTask={handleCreateTask}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/calendar")}
            className="flex items-center gap-2 ml-4"
          >
            <ApperIcon name="Calendar" size={16} />
            <span className="hidden sm:inline">Calendar</span>
          </Button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Stats Overview */}
              <div className="xl:col-span-1">
                <StatsOverview refreshTrigger={refreshTrigger} />
              </div>

              {/* Task List */}
              <div className="xl:col-span-3">
                <TaskList
                  searchQuery={searchQuery}
                  activeFilter={activeFilter}
                  onTaskEdit={handleEditTask}
                  onTaskCreate={handleCreateTask}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
};

export default Dashboard;