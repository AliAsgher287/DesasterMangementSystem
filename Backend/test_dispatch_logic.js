const mongoose = require('mongoose');
const Task = require('./models/Task');
const Resource = require('./models/Resource');
require('dotenv').config();

async function testLogic() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Create dummy resources
        const res1 = await Resource.create({
            name: 'Test Water',
            category: 'Water',
            quantity: 100,
            unit: 'liters',
            location: 'Vault 1',
            organizationName: 'TestOrg',
            owner: new mongoose.Types.ObjectId()
        });

        const res2 = await Resource.create({
            name: 'Test Milk',
            category: 'Food',
            quantity: 50,
            unit: 'liters',
            location: 'Vault 2',
            organizationName: 'TestOrg',
            owner: new mongoose.Types.ObjectId()
        });

        console.log(`Created test resources: ${res1._id}, ${res2._id}`);

        // 2. Simulate req.body
        const body = {
            title: 'Multi-Resource Test',
            description: 'Testing multiple resources',
            location: 'Test Zone',
            organization: res1.owner,
            assignedResources: [
                { resourceId: res1._id, name: res1.name, quantity: 10, unit: res1.unit },
                { resourceId: res2._id, name: res2.name, quantity: 5, unit: res2.unit }
            ]
        };

        // 3. Simulate Task creation
        const task = await Task.create(body);
        console.log(`Task created with ${task.assignedResources.length} resources`);
        console.log('Task Resources:', JSON.stringify(task.assignedResources, null, 2));

        // 4. Simulate deduction loop
        for (const item of body.assignedResources) {
            console.log(`Deducting item: ${item.name} | ID: ${item.resourceId}`);
            if (item.resourceId) {
                const resource = await Resource.findById(item.resourceId);
                if (resource) {
                    console.log(`Before: ${resource.quantity}`);
                    resource.quantity = Math.max(0, resource.quantity - item.quantity);
                    await resource.save();
                    console.log(`After: ${resource.quantity}`);
                }
            }
        }

        // 5. Cleanup
        await Task.findByIdAndDelete(task._id);
        await Resource.findByIdAndDelete(res1._id);
        await Resource.findByIdAndDelete(res2._id);
        console.log('Cleanup done');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testLogic();
