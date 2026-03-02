const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a task title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a task description']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    priority: {
        type: String,
        enum: ['Critical', 'High', 'Medium', 'Low'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    assignedResponders: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    assignedResources: [{
        resourceId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Resource'
        },
        name: String,
        quantity: Number,
        unit: String
    }],
    organization: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    sourceRef: {
        type: mongoose.Schema.ObjectId, // Link to CitizenHelp or FieldReport
        required: false
    },
    sourceType: {
        type: String,
        enum: ['CitizenHelp', 'FieldReport', 'Manual'],
        default: 'Manual'
    },
    disasterRef: {
        type: mongoose.Schema.ObjectId,
        ref: 'Disaster',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);
