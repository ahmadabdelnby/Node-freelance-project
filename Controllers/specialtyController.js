const specialty = require('../Models/Specialties');

// Create a new specialty
const createSpecialty = async (req, res) => {
    try {
        const { name, description, Category } = req.body;
        const existingSpecialty = await specialty.findOne({ name });
        if (existingSpecialty) {
            return res.status(400).json({ message: 'Specialty already exists' });
        }
        const newSpecialty = new specialty({ name, description, Category });
        await newSpecialty.save();
        res.status(201).json(newSpecialty);
    } catch (error) {
        console.error('Error creating specialty:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Get all specialties
const getAllSpecialties = async (req, res) => {
    try {
        const specialties = await specialty.find().populate('Category', 'name description');
        res.json(specialties);
    } catch (error) {
        console.error('Error getting specialties:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Get a specialty by ID
const getSpecialtyById = async (req, res) => {
    try {
        const specialtyId = req.params.id;
        const foundSpecialty = await specialty.findById(specialtyId).populate('Category', 'name description');
        if (!foundSpecialty) {
            return res.status(404).json({ message: 'Specialty not found' });
        }
        res.json(foundSpecialty);
    } catch (error) {
        console.error('Error getting specialty:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Update a specialty by ID
const updateSpecialtyById = async (req, res) => {
    try {
        const specialtyId = req.params.id;
        const updatedData = req.body;
        const updatedSpecialty = await specialty.findByIdAndUpdate(
            specialtyId, 
            updatedData, 
            { new: true, runValidators: true }
        ).populate('Category', 'name description');
        if (!updatedSpecialty) {
            return res.status(404).json({ message: 'Specialty not found' });
        }
        res.json(updatedSpecialty);
    } catch (error) {
        console.error('Error updating specialty:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Delete a specialty by ID
const deleteSpecialtyById = async (req, res) => {
    try {
        const specialtyId = req.params.id;
        const deletedSpecialty = await specialty.findByIdAndDelete(specialtyId);
        if (!deletedSpecialty) {
            return res.status(404).json({ message: 'Specialty not found' });
        }
        res.json({ message: 'Specialty deleted successfully' });
    } catch (error) {
        console.error('Error deleting specialty:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Get specialties by category
const getSpecialtiesByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId; 
        const specialties = await specialty
            .find({ Category: categoryId }) 
        res.json(specialties);
    } catch (error) {
        console.error('Error getting specialties by category:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createSpecialty,
    getAllSpecialties,
    getSpecialtyById,
    updateSpecialtyById,
    deleteSpecialtyById,
    getSpecialtiesByCategory
};