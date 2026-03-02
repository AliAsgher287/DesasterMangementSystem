const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Task = require('../models/Task');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // Find a superadmin or create a dummy one for the task
        const superadmin = await User.findOne({ role: 'superadmin' });
        if (!superadmin) {
            console.log('No superadmin found. Please register a superadmin first.');
            process.exit(1);
        }

        // Create a dummy org
        const dummyOrg = await User.create({
            name: 'Test Org',
            organizationName: 'Test Organization',
            email: `test_org_${Date.now()}@example.com`,
            password: 'password123',
            role: 'admin',
            location: 'Test City'
        });

        console.log('Created dummy organization:', dummyOrg.organizationName);

        const locations = ['North Sector', 'South Sector', 'East Gate'];
        const taskData = {
            title: 'Bulk Test Task',
            description: 'Testing decentralized distribution',
            priority: 'High',
            targetOrganizationId: dummyOrg._id,
            sourceType: 'Manual'
        };

        console.log(`Creating ${locations.length} tasks for organization...`);

        const createdTasks = [];
        for (const loc of locations) {
            const task = await Task.create({
                ...taskData,
                location: loc,
                organization: dummyOrg._id
            });
            createdTasks.push(task);
            console.log(`  - Task created at: ${loc}`);
        }

        console.log(`Verification successful! ${createdTasks.length} tasks created.`);

        // Cleanup dummy org and tasks
        await Task.deleteMany({ organization: dummyOrg._id });
        await User.findByIdAndDelete(dummyOrg._id);
        console.log('Cleanup complete.');

        process.exit();
    } catch (err) {
        console.error('Error during verification:', err.message);
        process.exit(1);
    }
};

verify();
