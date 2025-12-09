const user = require('../Models/User');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose')
function generateToken(user) {
    return JWT.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

// Register a new user
const register = async (req, res) => {
    try {
        const {
            email,
            username,
            password,
            confirmPassword,
            first_name,
            last_name,
            profile_picture_url,
            phone_number,
            gender,
            birthdate,
            country,
            role,
            aboutMe,
            category,
            specialty,
            skills
        } = req.body;

        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Check if username already exists
        const existingUsername = await user.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already in use' });
        }

        const newUser = new user({
            email,
            username,
            password,
            confirmPassword,
            first_name,
            last_name,
            profile_picture_url,
            phone_number,
            gender,
            birthdate,
            country,
            role,
            aboutMe,
            category,
            specialty,
            skills: skills ? skills.map(skillId => ({ skillId })) : []
        });

        await newUser.save();
        const token = generateToken(newUser);
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                phone_number: newUser.phone_number,
                gender: newUser.gender,
                country: newUser.country,
                role: newUser.role,
                category: newUser.category,
                specialty: newUser.specialty
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await existingUser.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(existingUser);
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: existingUser._id,
                email: existingUser.email,
                username: existingUser.username,
                first_name: existingUser.first_name,
                last_name: existingUser.last_name,
                role: existingUser.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const Users = await user.find()
            .select('-password -confirmPassword')
            .populate('category', 'name')
            .populate('specialty', 'name')
            .populate('skills.skillId', 'name')
            .populate('contracts');
        res.json(Users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const User = await user.findById(userId)
            .select('-password -confirmPassword')
            .populate('category', 'name description')
            .populate('specialty', 'name description')
            .populate('skills.skillId', 'name category')
            .populate('contracts');
        if (!User) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(User);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
//delete a user by admin and self deletion (this needs authorizaion for role user too)
const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Check if the requesting user is admin or the same user
        const requestingUser = req.user; // comes from authentic middleware

        if (requestingUser.role !== 'admin' && requestingUser._id !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this user" });
        }

        const deletedUser = await user.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update user details / put and patch
const updateUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = { ...req.body };

        // Prevent direct password updates (should use separate change password endpoint)
        delete updatedData.password;
        delete updatedData.confirmPassword;

        // Handle skills array format
        if (updatedData.skills && Array.isArray(updatedData.skills)) {
            updatedData.skills = updatedData.skills.map(skillId =>
                typeof skillId === 'object' ? skillId : { skillId }
            );
        }

        const User = await user.findByIdAndUpdate(userId, updatedData, {
            new: true,
            runValidators: true
        })
            .select('-password -confirmPassword')
            .populate('category', 'name description')
            .populate('specialty', 'name description')
            .populate('skills.skillId', 'name category');

        if (!User) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(User);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(400).json({ message: error.message });
    }
}

const adminDashboard = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        res.status(200).json({
            message: 'Welcome to the admin dashboard',
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const userDashboard = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        res.status(200).json({
            message: 'Welcome to the user dashboard',
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('User dashboard error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const profile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Get full user details from database
        const userDetails = await user.findById(req.user.id)
            .select('-password -confirmPassword')
            .populate('category', 'name description')
            .populate('specialty', 'name description')
            .populate('skills.skillId', 'name category')
            .populate('contracts');

        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User profile retrieved successfully',
            user: userDetails
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

//delete a user by Admin
//there must be a token in the header with a role=admin
//in the body we will provide the user to be deleted id
//go fetch the db and delete it if exists
//handle every alternative scenario, like no token, no admin role, no user id in body etc.
const deleteUserByAdmin = async (req, res) => {

}

module.exports = {
    register,
    login,
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    adminDashboard,
    userDashboard,
    profile
}
