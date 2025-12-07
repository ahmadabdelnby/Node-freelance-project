const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxLength: 255,
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: 'Please enter a valid email address'
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
        validate: {
            validator: function (username) {
                return /^[a-zA-Z0-9_]+$/.test(username);
            },
            message: 'Username can only contain letters, numbers, and underscores'
        }
    },
    password: {
        type: String,
        required: true,
        maxLength: 15
    },
    confirmPassword: {
        type: String,
        required: true,
        maxLength: 15,
        validate: {
            validator: function (confirmPassword) {
                return confirmPassword === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    first_name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    profile_picture_url: {
        type: String,
        default: null,
        maxLength: 255
    },
    phone_number: {
        type: String,
        default: null,
        required: true,
        trim: true,
        maxLength: 20
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
        default: null
    },
    birthdate: {
        type: Date,
        default: null
    },
    country: {
        type: String,
        required: true,
        default: null,
        trim: true,
        maxLength: 100
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    } , 
    aboutMe: {
        type: String,
        default: null,
        minLength: 500,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    specialty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty'
    },
    skills: [
        {
            skillId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Skill'
            }
        }
    ],
    contracts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contract'
        }
    ],
    rehireRate: {
        type: Number,
        default: 0
    },
    completedJobs: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
//module.exports = mongoose.model('User', userSchema);