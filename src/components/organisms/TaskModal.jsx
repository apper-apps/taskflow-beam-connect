import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";

const TaskModal = ({ 
  isOpen, 
  onClose, 
  task = null, 
  onTaskSaved 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    priority: "medium",
    dueDate: ""
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || "",
          categoryId: task.categoryId.toString(),
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
        });
      } else {
        setFormData({
          title: "",
          description: "",
          categoryId: "",
          priority: "medium",
          dueDate: ""
        });
      }
      setErrors({});
    }
  }, [isOpen, task]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      toast.error("Failed to load categories");
      console.error("Error loading categories:", err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        categoryId: parseInt(formData.categoryId),
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate + "T00:00:00").toISOString() : null
      };

      if (task) {
        await taskService.update(task.Id, taskData);
        toast.success("Task updated successfully! ✨");
      } else {
        await taskService.create(taskData);
        toast.success("Task created successfully! 🎉");
      }

      onTaskSaved();
      onClose();
    } catch (err) {
      toast.error(task ? "Failed to update task" : "Failed to create task");
      console.error("Error saving task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      categoryId: "",
      priority: "medium",
      dueDate: ""
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField 
              label="Task Title" 
              required
              error={errors.title}
            >
              <Input
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={!!errors.title}
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                placeholder="Add more details about this task..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField 
                label="Category" 
                required
                error={errors.categoryId}
              >
                <Select
                  value={formData.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  error={!!errors.categoryId}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.Id} value={category.Id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Priority">
                <Select
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Due Date">
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />
            </FormField>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ApperIcon name={task ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                )}
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;