import tasksData from "@/services/mockData/tasks.json";

// Create a copy to prevent mutations
let tasks = [...tasksData];

const addDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

const taskService = {
  async getAll() {
    await addDelay();
    return [...tasks].sort((a, b) => a.order - b.order);
  },

  async getById(id) {
    await addDelay();
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await addDelay();
    const maxId = tasks.reduce((max, task) => Math.max(max, task.Id), 0);
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || "",
      categoryId: parseInt(taskData.categoryId),
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      order: tasks.length + 1
    };
    
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await addDelay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    tasks[index] = {
      ...tasks[index],
      ...taskData,
      Id: parseInt(id),
      categoryId: taskData.categoryId ? parseInt(taskData.categoryId) : tasks[index].categoryId
    };
    
    return { ...tasks[index] };
  },

  async delete(id) {
    await addDelay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return false;
    
    const deletedTask = tasks.splice(index, 1)[0];
    return { ...deletedTask };
  },

  async toggleComplete(id) {
    await addDelay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    tasks[index].completed = !tasks[index].completed;
    return { ...tasks[index] };
  },

  async updateOrder(id, newOrder) {
    await addDelay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) return null;
    
    tasks[index].order = newOrder;
    return { ...tasks[index] };
  },

  async getByCategory(categoryId) {
    await addDelay();
    return tasks
      .filter(t => t.categoryId === parseInt(categoryId))
      .map(t => ({ ...t }))
      .sort((a, b) => a.order - b.order);
  },

  async getByStatus(completed = false) {
    await addDelay();
    return tasks
      .filter(t => t.completed === completed)
      .map(t => ({ ...t }))
      .sort((a, b) => a.order - b.order);
  },

  async searchTasks(query) {
    await addDelay();
    const lowercaseQuery = query.toLowerCase();
    return tasks
      .filter(t => 
        t.title.toLowerCase().includes(lowercaseQuery) ||
        t.description.toLowerCase().includes(lowercaseQuery)
      )
      .map(t => ({ ...t }))
      .sort((a, b) => a.order - b.order);
  }
};

export default taskService;