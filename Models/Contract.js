//ahmed-dev branch

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contractSchema = new Schema({
    // Reference to the job
    job: { 
        type: Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    // Reference to the client
    client: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Reference to the freelancer
    freelancer: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Reference to the winning proposal
    proposal: { 
        type: Schema.Types.ObjectId, 
        ref: 'Proposal', 
        required: true 
    },
    // The final agreed-upon price (if fixed) or hourly rate (if hourly)
    agreedAmount: { 
        type: Number, 
        required: true 
    },
    // To know if the agreedAmount is fixed or hourly
    budgetType: {
        type: String,
        enum: ['hourly', 'fixed'],
        required: true
    },
    status: { 
        type: String, 
        enum: ['active', 'paused', 'completed', 'terminated'], 
        default: 'active' 
    }
}, { 
    // Automatically adds createdAt and updatedAt fields
    timestamps: true 
});

module.exports = mongoose.model('Contract', contractSchema);