const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // Delete all organization admins (role: admin) and responders (role: responder)
        const result = await User.deleteMany({
            role: { $in: ['admin', 'responder'] }
        });

        console.log(`Successfully deleted ${result.deletedCount} users (admins and responders).`);

        process.exit();
    } catch (err) {
        console.error('Error during cleanup:', err.message);
        process.exit(1);
    }
};

cleanup();
