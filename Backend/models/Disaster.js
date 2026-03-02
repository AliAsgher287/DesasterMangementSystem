const mongoose = require('mongoose');

const DisasterSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Please add a disaster type'],
        enum: ['Flood', 'Earthquake', 'Wildfire', 'Storm', 'Epidemic', 'Other']
    },
    title: {
        type: String,
        required: [true, 'Please add a disaster title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    severity: {
        type: String,
        enum: ['Critical', 'High', 'Medium', 'Low'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Active', 'Resolved'],
        default: 'Active'
    },
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Disaster', DisasterSchema);
