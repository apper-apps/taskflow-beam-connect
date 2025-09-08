import categoriesData from "@/services/mockData/categories.json";

// Create a copy to prevent mutations
let categories = [...categoriesData];

const addDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

const categoryService = {
  async getAll() {
    await addDelay();
    return [...categories].sort((a, b) => a.order - b.order);
  },

  async getById(id) {
    await addDelay();
    const category = categories.find(c => c.Id === parseInt(id));
    return category ? { ...category } : null;
  },

  async create(categoryData) {
    await addDelay();
    const maxId = categories.reduce((max, category) => Math.max(max, category.Id), 0);
    const newCategory = {
      Id: maxId + 1,
      name: categoryData.name,
      color: categoryData.color || "#8B5CF6",
      icon: categoryData.icon || "Folder",
      order: categories.length + 1
    };
    
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await addDelay();
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return null;
    
    categories[index] = {
      ...categories[index],
      ...categoryData,
      Id: parseInt(id)
    };
    
    return { ...categories[index] };
  },

  async delete(id) {
    await addDelay();
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return false;
    
    const deletedCategory = categories.splice(index, 1)[0];
    return { ...deletedCategory };
  }
};

export default categoryService;