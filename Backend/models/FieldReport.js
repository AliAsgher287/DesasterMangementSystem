const mongoose = require('mongoose');

const FieldReportSchema = new mongoose.Schema({
    responder: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: [true, 'Please add a location for the assessment']
    },
    priority: {
        type: String,
        enum: ['Critical', 'High', 'Medium', 'Low'],
        default: 'Medium'
    },
    description: {
        type: String,
        required: [true, 'Please add a description of the situational assessment']
    },
    resourcesNeeded: {
        type: String,
        required: [true, 'Please list any immediately required resources']
    },
    status: {
        type: String,
        enum: ['Pending', 'Actioned', 'Resolved'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FieldReport', FieldReportSchema);
