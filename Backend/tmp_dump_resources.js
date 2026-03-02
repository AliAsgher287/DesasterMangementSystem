const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const Resource = require('./models/Resource');

const dumpResources = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- RESOURCE DUMP ---');
        const resources = await Resource.find();
        console.log(JSON.stringify(resources, null, 2));
        console.log('--- END DUMP ---');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

dumpResources();
