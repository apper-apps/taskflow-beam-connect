import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import ProgressRing from "@/components/molecules/ProgressRing";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import taskService from "@/services/api/taskService";

const StatsOverview = ({ refreshTrigger = 0 }) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      const tasks = await taskService.getAll();
      const now = new Date();
      
      const newStats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length,
        overdue: tasks.filter(t => 
          !t.completed && t.dueDate && new Date(t.dueDate) < now
        ).length
      };
      
      setStats(newStats);
    } catch (err) {
      setError("Failed to load statistics");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  if (loading) return <Loading type="skeleton" rows={3} />;
  if (error) return <Error message={error} onRetry={loadStats} />;

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: "List",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: "CheckCircle",
      color: "bg-gradient-to-r from-success to-emerald-600",
      textColor: "text-success"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: "Clock",
      color: "bg-gradient-to-r from-warning to-orange-500",
      textColor: "text-warning"
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: "AlertCircle",
      color: "bg-gradient-to-r from-error to-red-600",
      textColor: "text-error"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Completion Overview */}
      <Card className="p-6" variant="gradient">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Today's Progress
            </h3>
            <p className="text-gray-600">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
          <ProgressRing percentage={completionPercentage} size="md" />
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <Card key={stat.title} className="p-4" variant="elevated">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center shadow-lg`}>
                <ApperIcon name={stat.icon} className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Insights */}
      {stats.total > 0 && (
        <Card className="p-6" variant="glass">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h4>
          <div className="space-y-3">
            {completionPercentage >= 80 && (
              <div className="flex items-center space-x-2 text-success">
                <ApperIcon name="TrendingUp" className="w-4 h-4" />
                <span className="text-sm font-medium">Great progress! You're almost done for today.</span>
              </div>
            )}
            
            {stats.overdue > 0 && (
              <div className="flex items-center space-x-2 text-error">
                <ApperIcon name="AlertTriangle" className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {stats.overdue} task{stats.overdue > 1 ? "s" : ""} overdue. Consider prioritizing them.
                </span>
              </div>
            )}
            
            {stats.pending > 0 && stats.overdue === 0 && (
              <div className="flex items-center space-x-2 text-info">
                <ApperIcon name="Target" className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {stats.pending} task{stats.pending > 1 ? "s" : ""} remaining. Keep going!
                </span>
              </div>
            )}
            
            {stats.completed === stats.total && stats.total > 0 && (
              <div className="flex items-center space-x-2 text-success">
                <ApperIcon name="PartyPopper" className="w-4 h-4" />
                <span className="text-sm font-medium">
                  All done! Time to celebrate your productivity! 🎉
                </span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StatsOverview;