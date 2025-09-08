import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, isPast, parseISO } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";

const CalendarView = ({ currentDate, viewMode, activeFilter, onTaskEdit, onTaskCreate, refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading calendar data:", err);
      setError("Failed to load calendar data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId) || { name: "Uncategorized", color: "#6B7280" };
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = parseISO(task.dueDate);
      const matchesDate = isSameDay(taskDate, date);
      
      if (!matchesDate) return false;
      
      // Apply active filter
      switch (activeFilter) {
        case "completed":
          return task.completed;
        case "pending":
          return !task.completed;
        case "overdue":
          return !task.completed && isPast(taskDate) && !isToday(taskDate);
        case "today":
          return isToday(taskDate);
        case "high":
          return task.priority === "high" && !task.completed;
        default:
          return true;
      }
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const weeks = [];
    let currentWeekStart = startDate;

    while (currentWeekStart <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const day = addDays(currentWeekStart, i);
        week.push(day);
      }
      weeks.push(week);
      currentWeekStart = addDays(currentWeekStart, 7);
    }

    return (
      <div className="bg-surface rounded-lg border border-gray-200 overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const dayTasks = getTasksForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);

              return (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`min-h-[120px] p-2 border-r border-b border-gray-200 ${
                    !isCurrentMonth ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                  } cursor-pointer transition-colors`}
                  onClick={() => onTaskCreate(day)}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    !isCurrentMonth ? 'text-gray-400' : 
                    isDayToday ? 'text-primary' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </div>

                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => {
                      const category = getCategoryById(task.categoryId);
                      return (
                        <div
                          key={task.Id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskEdit(task);
                          }}
                          className={`text-xs p-1 rounded truncate cursor-pointer hover:shadow-sm transition-shadow ${
                            task.completed ? 'bg-gray-100 text-gray-500 line-through' : 
                            `bg-${getPriorityColor(task.priority)}/10 text-${getPriorityColor(task.priority)}`
                          }`}
                          style={{
                            borderLeft: `3px solid ${category.color}`,
                          }}
                        >
                          {task.title}
                        </div>
                      );
                    })}
                    
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500 px-1">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="bg-surface rounded-lg border border-gray-200 overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day.toISOString()} className="p-4 text-center border-r border-gray-200 last:border-r-0">
              <div className={`text-sm font-medium ${isToday(day) ? 'text-primary' : 'text-gray-600'}`}>
                {format(day, 'EEE')}
              </div>
              <div className={`text-xl font-semibold mt-1 ${isToday(day) ? 'text-primary' : 'text-gray-900'}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Week Content */}
        <div className="grid grid-cols-7 min-h-[500px]">
          {weekDays.map(day => {
            const dayTasks = getTasksForDate(day);

            return (
              <div
                key={day.toISOString()}
                className="p-4 border-r border-gray-200 last:border-r-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => onTaskCreate(day)}
              >
                <div className="space-y-2">
                  {dayTasks.map(task => {
                    const category = getCategoryById(task.categoryId);
                    return (
                      <Card
                        key={task.Id}
                        className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${
                          task.completed ? 'opacity-60' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskEdit(task);
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium ${
                              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {task.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant={getPriorityColor(task.priority)} size="sm">
                              {task.priority}
                            </Badge>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayTasks = getTasksForDate(currentDate).sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.title.localeCompare(b.title);
    });

    return (
      <div className="space-y-4">
        {/* Day Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h2>
              <p className="text-gray-600 mt-1">
                {dayTasks.length} tasks scheduled
              </p>
            </div>
            <Button
              onClick={() => onTaskCreate(currentDate)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" size={16} />
              Add Task
            </Button>
          </div>
        </Card>

        {/* Tasks */}
        {dayTasks.length === 0 ? (
          <Empty
            title="No tasks for this day"
            description="Click 'Add Task' to create a new task for this date"
            icon="Calendar"
          />
        ) : (
          <div className="space-y-3">
            {dayTasks.map(task => {
              const category = getCategoryById(task.categoryId);
              return (
                <Card
                  key={task.Id}
                  className={`p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 ${
                    task.completed ? 'opacity-60' : ''
                  }`}
                  style={{ borderLeftColor: category.color }}
                  onClick={() => onTaskEdit(task)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-medium ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" size="sm">
                          {category.name}
                        </Badge>
                        <Badge variant={getPriorityColor(task.priority)} size="sm">
                          {task.priority} priority
                        </Badge>
                        {task.completed && (
                          <Badge variant="success" size="sm">
                            <ApperIcon name="Check" size={12} />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.dueDate && (
                        <div className="text-sm text-gray-500">
                          {format(parseISO(task.dueDate), 'h:mm a')}
                        </div>
                      )}
                      <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="h-full">
      {viewMode === "month" && renderMonthView()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "day" && renderDayView()}
    </div>
  );
};

export default CalendarView;