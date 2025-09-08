import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";

const Sidebar = ({ activeFilter, onFilterChange, onCreateTask }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);
      
      setCategories(categoriesData);
      
      // Calculate task counts
      const counts = {
        all: tasksData.length,
        pending: tasksData.filter(t => !t.completed).length,
        completed: tasksData.filter(t => t.completed).length,
        overdue: tasksData.filter(t => 
          !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
        ).length,
        today: tasksData.filter(t => {
          if (!t.dueDate) return false;
          const today = new Date().toDateString();
          return new Date(t.dueDate).toDateString() === today;
        }).length,
        high: tasksData.filter(t => t.priority === "high" && !t.completed).length
      };
      
      // Category counts
      categoriesData.forEach(category => {
        counts[`category-${category.Id}`] = tasksData.filter(t => t.categoryId === category.Id).length;
      });
      
      setTaskCounts(counts);
    } catch (err) {
      setError("Failed to load sidebar data");
      console.error("Error loading sidebar data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filters = [
    { id: "all", label: "All Tasks", icon: "List", count: taskCounts.all },
    { id: "pending", label: "Pending", icon: "Clock", count: taskCounts.pending },
    { id: "completed", label: "Completed", icon: "CheckCircle", count: taskCounts.completed },
    { id: "overdue", label: "Overdue", icon: "AlertCircle", count: taskCounts.overdue },
    { id: "today", label: "Due Today", icon: "Calendar", count: taskCounts.today },
    { id: "high", label: "High Priority", icon: "Zap", count: taskCounts.high }
  ];

  if (loading) return <Loading type="skeleton" rows={4} className="p-4" />;
  if (error) return <Error message={error} onRetry={loadData} className="m-4" />;

  return (
    <div className="h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
            <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow Pro</h1>
            <p className="text-sm text-gray-500">Organize your day</p>
          </div>
        </div>
        
        <Button
          onClick={onCreateTask}
          variant="primary"
          className="w-full shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Filter by Status
          </h3>
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activeFilter === filter.id
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-3">
                <ApperIcon 
                  name={filter.icon} 
                  className={`w-4 h-4 ${
                    activeFilter === filter.id ? "text-white" : "text-gray-500"
                  }`} 
                />
                <span className="font-medium">{filter.label}</span>
              </div>
              {filter.count !== undefined && filter.count > 0 && (
                <Badge
                  variant={activeFilter === filter.id ? "secondary" : "outline"}
                  size="sm"
                  className={
                    activeFilter === filter.id 
                      ? "bg-white/20 text-white border-white/30" 
                      : ""
                  }
                >
                  {filter.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {categories.length > 0 && (
          <div className="mt-8 space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Categories
            </h3>
            {categories.map(category => (
              <button
                key={category.Id}
                onClick={() => onFilterChange(`category-${category.Id}`)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  activeFilter === `category-${category.Id}`
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <ApperIcon 
                    name={category.icon} 
                    className={`w-4 h-4 ${
                      activeFilter === `category-${category.Id}` ? "text-white" : "text-gray-500"
                    }`} 
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                {taskCounts[`category-${category.Id}`] > 0 && (
                  <Badge
                    variant={activeFilter === `category-${category.Id}` ? "secondary" : "outline"}
                    size="sm"
                    className={
                      activeFilter === `category-${category.Id}` 
                        ? "bg-white/20 text-white border-white/30" 
                        : ""
                    }
                  >
                    {taskCounts[`category-${category.Id}`]}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Stay organized, stay productive
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;