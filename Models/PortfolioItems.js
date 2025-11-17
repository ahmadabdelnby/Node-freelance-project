const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioItemSchema = new Schema({

    freelancer: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    projectUrl: {
        type: String
    },
    skills: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Skill',
            required: true
        }
    ],
    dateCompleted: {
        type: Date,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);