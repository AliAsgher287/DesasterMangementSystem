const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const dumpData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- USER/ORG DUMP ---');
        const users = await User.find({ role: { $in: ['admin', 'superadmin'] } }).select('name organizationName email role');
        console.log(JSON.stringify(users, null, 2));
        console.log('--- END DUMP ---');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

dumpData();
