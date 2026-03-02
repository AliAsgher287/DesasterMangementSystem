const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Import all models
const User = require('../models/User');
const Resource = require('../models/Resource');
const Task = require('../models/Task');
const Disaster = require('../models/Disaster');
const CitizenHelp = require('../models/CitizenHelp');
const FieldReport = require('../models/FieldReport');
const Request = require('../models/Request');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const fullCleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        console.log('Clearing all collections...');

        const userCount = await User.deleteMany({});
        console.log(`- Deleted ${userCount.deletedCount} users.`);

        const resourceCount = await Resource.deleteMany({});
        console.log(`- Deleted ${resourceCount.deletedCount} resources.`);

        const taskCount = await Task.deleteMany({});
        console.log(`- Deleted ${taskCount.deletedCount} tasks.`);

        const disasterCount = await Disaster.deleteMany({});
        console.log(`- Deleted ${disasterCount.deletedCount} disasters.`);

        const citizenHelpCount = await CitizenHelp.deleteMany({});
        console.log(`- Deleted ${citizenHelpCount.deletedCount} citizen help requests.`);

        const fieldReportCount = await FieldReport.deleteMany({});
        console.log(`- Deleted ${fieldReportCount.deletedCount} field reports.`);

        const requestCount = await Request.deleteMany({});
        console.log(`- Deleted ${requestCount.deletedCount} other requests.`);

        console.log('\nSUCCESS: Database has been fully reset.');

        process.exit();
    } catch (err) {
        console.error('Error during full cleanup:', err.message);
        process.exit(1);
    }
};

fullCleanup();
