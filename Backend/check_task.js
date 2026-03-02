const mongoose = require('mongoose');
const Task = require('./models/Task');
require('dotenv').config();

async function checkLastTask() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const lastTask = await Task.findOne().sort({ createdAt: -1 });
        if (lastTask) {
            console.log('--- LAST TASK ---');
            console.log('ID:', lastTask._id);
            console.log('Title:', lastTask.title);
            console.log('Assigned Resources:', JSON.stringify(lastTask.assignedResources, null, 2));
        } else {
            console.log('No tasks found.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkLastTask();
