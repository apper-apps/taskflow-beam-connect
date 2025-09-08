import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import CalendarView from "@/components/organisms/CalendarView";
import TaskModal from "@/components/organisms/TaskModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // day, week, month
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateTask = (selectedDate = null) => {
    setEditingTask(selectedDate ? { dueDate: selectedDate.toISOString() } : null);
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
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + direction);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatHeaderDate = () => {
    const options = viewMode === "month" 
      ? { year: 'numeric', month: 'long' }
      : { year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  const viewModeButtons = [
    { key: "day", label: "Day", icon: "Calendar" },
    { key: "week", label: "Week", icon: "CalendarDays" },
    { key: "month", label: "Month", icon: "CalendarRange" }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <Sidebar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          onCreateTask={() => handleCreateTask()}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        onCreateTask={() => handleCreateTask()}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Calendar Header */}
        <header className="bg-surface border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <ApperIcon name="Menu" size={20} />
              </Button>

              {/* Back to Dashboard */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center gap-2"
              >
                <ApperIcon name="ArrowLeft" size={16} />
                Dashboard
              </Button>

              <h1 className="text-xl font-semibold text-gray-900">Calendar</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Buttons */}
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                {viewModeButtons.map((mode) => (
                  <Button
                    key={mode.key}
                    variant={viewMode === mode.key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode(mode.key)}
                    className="flex items-center gap-1 min-w-0"
                  >
                    <ApperIcon name={mode.icon} size={16} />
                    <span className="hidden md:inline">{mode.label}</span>
                  </Button>
                ))}
              </div>

              {/* Mobile view selector */}
              <div className="sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const modes = ["day", "week", "month"];
                    const currentIndex = modes.indexOf(viewMode);
                    const nextIndex = (currentIndex + 1) % modes.length;
                    setViewMode(modes[nextIndex]);
                  }}
                  className="flex items-center gap-1"
                >
                  <ApperIcon name="CalendarDays" size={16} />
                  {viewMode}
                </Button>
              </div>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate(-1)}
                className="flex items-center gap-1"
              >
                <ApperIcon name="ChevronLeft" size={16} />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Today
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate(1)}
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>

            <div className="text-lg font-medium text-gray-900">
              {formatHeaderDate()}
            </div>

            <Button
              onClick={() => handleCreateTask()}
              size="sm"
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" size={16} />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </header>

        {/* Calendar Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <CalendarView
            currentDate={currentDate}
            viewMode={viewMode}
            activeFilter={activeFilter}
            onTaskEdit={handleEditTask}
            onTaskCreate={handleCreateTask}
            refreshTrigger={refreshTrigger}
          />
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

export default Calendar;