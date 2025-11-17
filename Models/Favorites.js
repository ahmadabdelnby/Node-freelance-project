const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'itemModel' 
    },
    itemModel: {
        type: String,
        required: true,
        enum: ['User', 'Job', 'PortfolioItem'] 
    }
}, { 
    timestamps: true 
});

favoriteSchema.index({ user: 1, item: 1, itemModel: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);