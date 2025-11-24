const category = require('../Models/Categories');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const foundCategory = await category.findById(id);
        if (!foundCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(foundCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Create a new category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new category({ name, description });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update category by ID
const updateCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await category.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Delete category by ID
const deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategoryById,
    deleteCategoryById,
};