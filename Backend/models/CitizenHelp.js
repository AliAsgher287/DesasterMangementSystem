const mongoose = require('mongoose');

const CitizenHelpSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please add a description of your situation'],
        trim: true
    },
    severity: {
        type: Number,
        min: 1,
        max: 5
    },
    helpTypes: {
        type: [String],
        enum: ['Food', 'Medical', 'Shelter', 'Rescue', 'Other'],
        required: [true, 'Please specify the type of help needed']
    },
    isInjured: {
        type: Boolean,
        default: false
    },
    isImmediateDanger: {
        type: Boolean,
        default: false
    },
    peopleAffected: {
        type: Number,
        default: 1
    },
    contactNumber: {
        type: String,
        required: [true, 'Please add a contact number']
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

module.exports = mongoose.model('CitizenHelp', CitizenHelpSchema);
