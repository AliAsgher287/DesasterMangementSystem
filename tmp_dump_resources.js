const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const Resource = require('../backend/models/Resource');

const dumpResources = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const resources = await Resource.find();
        console.log('--- RESOURCE DUMP ---');
        console.log(JSON.stringify(resources, null, 2));
        console.log('--- END DUMP ---');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

dumpResources();
