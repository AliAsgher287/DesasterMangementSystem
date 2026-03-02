const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const clearData = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Model names (based on mongoose.model('Name', ...))
        const collections = ['users', 'resources', 'requests', 'tasks', 'fieldreports', 'citizenhelps', 'disasters'];

        for (const collection of collections) {
            try {
                await mongoose.connection.db.collection(collection).deleteMany({});
                console.log(`Cleared collection: ${collection}`);
            } catch (error) {
                console.error(`Error clearing ${collection}: ${error.message}`);
            }
        }

        console.log('All requested collections cleared successfully.');
        process.exit();
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

clearData();
