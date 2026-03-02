const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Resource = require('./models/Resource');
const User = require('./models/User');

const dumpAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('--- ALL RESOURCES ---');
        const resources = await Resource.find();
        console.log(JSON.stringify(resources, null, 2));

        console.log('--- ALL USERS ---');
        const users = await User.find();
        console.log(JSON.stringify(users, null, 2));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

dumpAll();
