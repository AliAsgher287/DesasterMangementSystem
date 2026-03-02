const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const CitizenHelp = require('../models/CitizenHelp');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testScenarios = [
    {
        name: 'Critical Danger (Multi)',
        data: { description: 'Help!', contactNumber: '123', helpTypes: ['Food', 'Medical'], isImmediateDanger: true },
        expectedSeverity: 5
    },
    {
        name: 'Medical & Food',
        data: { description: 'Injured & hungry', contactNumber: '456', helpTypes: ['Medical', 'Food'], isInjured: true },
        expectedSeverity: 4
    },
    {
        name: 'Shelter & Rescue',
        data: { description: 'Trapped', contactNumber: '789', helpTypes: ['Rescue', 'Shelter'] },
        expectedSeverity: 4
    },
    {
        name: 'Just Shelter',
        data: { description: 'Need house', contactNumber: '111', helpTypes: ['Shelter'], peopleAffected: 10 },
        expectedSeverity: 3
    },
    {
        name: 'Food & Other',
        data: { description: 'Hungry', contactNumber: '222', helpTypes: ['Food', 'Other'] },
        expectedSeverity: 2
    }
];

const verifyPriority = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        for (const scenario of testScenarios) {
            // Priority calculation logic from controller
            let calculatedSeverity = 1;
            const { isImmediateDanger, isInjured, helpTypes, peopleAffected } = scenario.data;

            if (isImmediateDanger) {
                calculatedSeverity = 5;
            } else if (isInjured || helpTypes.includes('Rescue') || helpTypes.includes('Medical')) {
                calculatedSeverity = 4;
            } else if ((peopleAffected && peopleAffected > 5) || helpTypes.includes('Shelter')) {
                calculatedSeverity = 3;
            } else if (helpTypes.includes('Food') || (peopleAffected && peopleAffected > 1)) {
                calculatedSeverity = 2;
            }

            console.log(`Test: ${scenario.name}`);
            console.log(`  - Expected: ${scenario.expectedSeverity}`);
            console.log(`  - Calculated: ${calculatedSeverity}`);

            if (calculatedSeverity === scenario.expectedSeverity) {
                console.log('  - Result: PASS\n');
            } else {
                console.log('  - Result: FAIL\n');
            }
        }

        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

verifyPriority();
