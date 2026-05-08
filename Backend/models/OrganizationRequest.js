const mongoose = require('mongoose');

const OrganizationRequestSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organizationName: {
        type: String,
        required: true
    },
    requestType: {
        type: String,
        required: [true, 'Please specify the request type'],
        enum: [
            'Resource shortage',
            'Need ambulance',
            'Need rescue team',
            'Need medical staff',
            'Need food/water supplies',
            'Shelter full / need shelter support',
            'Need urgent approval',
            'Technical issue',
            'Staff shortage',
            'Vehicle breakdown',
            'General inquiry',
            'Other'
        ]
    },
    message: {
        type: String,
        required: [true, 'Please provide a message detailing your request']
    },
    location: {
        type: String,
        required: [true, 'Please provide the location']
    },
    affectedPeople: {
        type: Number,
        default: 0
    },
    resourceNeeded: {
        type: String
    },
    priority: {
        type: String,
        enum: ['Urgent', 'High', 'Medium', 'Normal', 'Pending Analysis'],
        default: 'Pending Analysis'
    },
    aiScore: {
        type: Number,
        default: 0
    },
    aiReasoning: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('OrganizationRequest', OrganizationRequestSchema);
