const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a resource name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Food', 'Water', 'Medical', 'Shelter', 'Tools', 'SOPs', 'Other']
    },
    quantity: {
        type: Number,
        required: [true, 'Please add a quantity'],
        default: 0
    },
    unit: {
        type: String,
        required: [true, 'Please add a unit (e.g., kg, liters, boxes)']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    organizationName: {
        type: String,
        required: [true, 'Please add an organization name']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Out of Stock'],
        default: 'Available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resource', ResourceSchema);
