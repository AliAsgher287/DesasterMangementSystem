const User = require('../models/User');

// @desc    Get all organizations (admin users)
// @route   GET /api/super-admin/organizations
// @access  Private (Super Admin)
exports.getAllOrganizations = async (req, res, next) => {
    try {
        const organizations = await User.find({ role: 'admin' }).select('name organizationName email location contactNumber status _id');

        res.status(200).json({
            success: true,
            count: organizations.length,
            data: organizations
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
// @desc    Verify or reject an organization
// @route   PUT /api/super-admin/verify/:id
// @access  Private (Super Admin)
exports.verifyOrganization = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['verified', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Please provide a valid status (verified or rejected)' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'Organization not found' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
