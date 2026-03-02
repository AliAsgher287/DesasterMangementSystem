const Resource = require('../models/Resource');

// @desc    Get resources (all for superadmin, own org for admin)
// @route   GET /api/resources
// @access  Private
exports.getResources = async (req, res, next) => {
    try {
        let resources;
        if (req.user.role === 'superadmin') {
            // Super admin sees ALL resources across all organizations
            resources = await Resource.find().sort('organizationName');
        } else if (req.user.role === 'donor') {
            // Donor sees only their own resources
            resources = await Resource.find({ owner: req.user.id });
        } else if (req.user.role === 'admin') {
            // Org admin sees ONLY their own organization's resources
            resources = await Resource.find({ organizationName: req.user.organizationName });
        } else {
            // Default: see only own resources (responders etc if applicable)
            resources = await Resource.find({ owner: req.user.id });
        }

        res.status(200).json({
            success: true,
            count: resources.length,
            data: resources
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Add resource
// @route   POST /api/resources
// @access  Private (Admin)
exports.addResource = async (req, res, next) => {
    try {
        // Only verified organizations (and individual donors) can add resources
        if (req.user.role === 'admin' && req.user.status !== 'verified') {
            return res.status(403).json({
                success: false,
                error: 'Your organization is pending verification. You cannot add resources yet.'
            });
        }

        req.body.owner = req.user.id;
        req.body.organizationName = req.user.organizationName || 'Individual Donor';

        const resource = await Resource.create(req.body);

        res.status(201).json({
            success: true,
            data: resource
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private
exports.updateResource = async (req, res, next) => {
    try {
        let resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ success: false, error: 'Resource not found' });
        }

        // Super admin can update any resource; others can only update their own
        if (req.user.role !== 'superadmin') {
            const isOwner = resource.owner.toString() === req.user.id;
            const isAdminOfSameOrg = req.user.role === 'admin' && resource.organizationName === req.user.organizationName;

            if (!isOwner && !isAdminOfSameOrg) {
                return res.status(401).json({ success: false, error: 'Not authorized to update' });
            }
        }

        resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: resource
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
exports.deleteResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ success: false, error: 'Resource not found' });
        }

        // Super admin can delete any resource; others can only delete their own
        if (req.user.role !== 'superadmin') {
            const isOwner = resource.owner.toString() === req.user.id;
            const isAdminOfOrg = req.user.role === 'admin' && resource.organizationName === req.user.organizationName;

            if (!isOwner && !isAdminOfOrg) {
                return res.status(401).json({ success: false, error: 'Not authorized to delete' });
            }
        }

        await resource.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
