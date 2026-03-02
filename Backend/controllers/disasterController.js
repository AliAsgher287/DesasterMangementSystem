const Disaster = require('../models/Disaster');

// @desc    Trigger a new disaster alert
// @route   POST /api/disasters
// @access  Private (Admin)
exports.triggerDisaster = async (req, res, next) => {
    try {
        // Add organization to req.body
        req.body.organization = req.user.id;

        const disaster = await Disaster.create(req.body);

        res.status(201).json({
            success: true,
            data: disaster
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get all active disasters for the organization
// @route   GET /api/disasters/active
// @access  Private (Admin)
exports.getActiveDisasters = async (req, res, next) => {
    try {
        const disasters = await Disaster.find({
            organization: req.user.id,
            status: 'Active'
        }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: disasters.length,
            data: disasters
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Resolve a disaster alert
// @route   PUT /api/disasters/:id/resolve
// @access  Private (Admin)
exports.resolveDisaster = async (req, res, next) => {
    try {
        let disaster = await Disaster.findById(req.params.id);

        if (!disaster) {
            return res.status(404).json({ success: false, error: 'Disaster alert not found' });
        }

        // Make sure user is organization admin
        if (disaster.organization.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this alert' });
        }

        disaster = await Disaster.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: disaster
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
