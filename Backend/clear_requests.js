/* eslint-env node */
const mongoose = require('mongoose');
const CitizenHelp = require('./models/CitizenHelp');
const OrganizationRequest = require('./models/OrganizationRequest');

mongoose.connect('mongodb://localhost:27017/warmhands').then(async () => {
    console.log("Connected to MongoDB.");
    
    try {
        await CitizenHelp.deleteMany({});
        console.log("Deleted all citizen help requests.");
    } catch(e) {
        console.log("Error deleting citizen help requests:", e.message);
    }

    try {
        await OrganizationRequest.deleteMany({});
        console.log("Deleted all organization requests.");
    } catch(e) {
        console.log("Error deleting organization requests:", e.message);
    }

    await mongoose.disconnect();
    console.log("Database cleared successfully.");
}).catch(err => {
    console.error("Failed to connect:", err);
});
