import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";

const TaskList = ({ 
  searchQuery = "",
  activeFilter = "all",
  onTaskEdit,
  onTaskCreate,
  refreshTrigger = 0
}) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.Id === taskId ? updatedTask : task
          )
        );
        
        toast.success(
          updatedTask.completed 
            ? "Task completed! Great job! 🎉" 
            : "Task marked as incomplete"
        );
      }
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error toggling task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const deletedTask = await taskService.delete(taskId);
      if (deletedTask) {
        setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId));
        toast.success("Task deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId);
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM dd");
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return "default";
    
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return "error";
    if (isToday(date)) return "warning";
    return "default";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    switch (activeFilter) {
      case "completed":
        return task.completed;
      case "pending":
        return !task.completed;
      case "overdue":
        return !task.completed && task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
      case "today":
        return task.dueDate && isToday(new Date(task.dueDate));
      case "high":
        return task.priority === "high" && !task.completed;
      default:
        return true;
    }
  });

  const highlightText = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="search-highlight">{part}</span>
      ) : part
    );
  };

  if (loading) return <Loading type="skeleton" rows={6} />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (filteredTasks.length === 0 && !searchQuery) {
    return <Empty onAction={onTaskCreate} />;
  }
  if (filteredTasks.length === 0 && searchQuery) {
    return (
      <Empty
        title="No tasks found"
        message={`No tasks match "${searchQuery}". Try adjusting your search.`}
        actionLabel="Clear Search"
        onAction={() => window.location.reload()}
        icon="Search"
      />
    );
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map(task => {
        const category = getCategoryById(task.categoryId);
        const dueDate = formatDueDate(task.dueDate);
        const dueDateColor = getDueDateColor(task.dueDate);
        const priorityColor = getPriorityColor(task.priority);

        return (
          <Card
            key={task.Id}
            className={`p-4 transition-all duration-300 ${
              task.completed ? "task-completed" : ""
            } border-l-4 priority-${task.priority}`}
            variant="default"
            hover={!task.completed}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.Id)}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-gray-900 mb-1 ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}>
                      {highlightText(task.title, searchQuery)}
                    </h3>
                    
                    {task.description && (
                      <p className={`text-sm text-gray-600 mb-3 ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}>
                        {highlightText(task.description, searchQuery)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {category && (
                        <Badge variant="outline" size="sm">
                          <ApperIcon name={category.icon} className="w-3 h-3 mr-1" />
                          {category.name}
                        </Badge>
                      )}
                      
                      <Badge variant={priorityColor} size="sm">
                        {task.priority}
                      </Badge>
                      
                      {dueDate && (
                        <Badge variant={dueDateColor} size="sm">
                          <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                          {dueDate}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTaskEdit(task)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.Id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TaskList;