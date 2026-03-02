const CitizenHelp = require('../models/CitizenHelp');

// @desc    Submit a public help request
// @route   POST /api/citizen-help
// @access  Public
exports.submitHelpRequest = async (req, res, next) => {
    try {
        const { description, contactNumber, helpTypes, isInjured, isImmediateDanger, peopleAffected } = req.body;

        // Automated Priority Calculation Logic
        let calculatedSeverity = 1;

        if (isImmediateDanger) {
            calculatedSeverity = 5;
        } else if (isInjured || helpTypes.includes('Rescue') || helpTypes.includes('Medical')) {
            calculatedSeverity = 4;
        } else if ((peopleAffected && peopleAffected > 5) || helpTypes.includes('Shelter')) {
            calculatedSeverity = 3;
        } else if (helpTypes.includes('Food') || (peopleAffected && peopleAffected > 1)) {
            calculatedSeverity = 2;
        }

        const request = await CitizenHelp.create({
            description,
            severity: calculatedSeverity,
            contactNumber,
            helpTypes,
            isInjured,
            isImmediateDanger,
            peopleAffected: peopleAffected || 1
        });

        res.status(201).json({
            success: true,
            data: request
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get all citizen help requests
// @route   GET /api/citizen-help
// @access  Private (Admin only)
exports.getCitizenHelpRequests = async (req, res, next) => {
    try {
        const requests = await CitizenHelp.find().sort('-createdAt');

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update citizen help request status
// @route   PUT /api/citizen-help/:id
// @access  Private (Admin only)
exports.updateHelpStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const request = await CitizenHelp.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        if (!request) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
