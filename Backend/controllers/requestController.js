const Request = require('../models/Request');
const Resource = require('../models/Resource');

// @desc    Create a resource request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res, next) => {
    try {
        const { resourceId, quantity, notes } = req.body;

        const resource = await Resource.findById(resourceId);

        if (!resource) {
            return res.status(404).json({ success: false, error: 'Resource not found' });
        }

        const request = await Request.create({
            resource: resourceId,
            requester: req.user.id,
            ownerOrganization: resource.organizationName,
            quantity,
            notes
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

// @desc    Get incoming requests for admin's org
// @route   GET /api/requests/incoming
// @access  Private
exports.getIncomingRequests = async (req, res, next) => {
    try {
        const requests = await Request.find({
            ownerOrganization: req.user.organizationName
        }).populate('resource requester');

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

// @desc    Get requests made by user
// @route   GET /api/requests/my
// @access  Private
exports.getMyRequests = async (req, res, next) => {
    try {
        const requests = await Request.find({ requester: req.user.id }).populate('resource');

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

// @desc    Approve or Reject request
// @route   PUT /api/requests/:id/status
// @access  Private
exports.updateRequestStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        let request = await Request.findById(req.params.id).populate('resource');

        if (!request) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        // Check if user belongs to the organization that owns the resource
        if (request.ownerOrganization !== req.user.organizationName) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this status' });
        }

        request.status = status;
        await request.save();

        // If approved, decrement resource quantity (optional, but good for real systems)
        if (status === 'Approved') {
            const resource = await Resource.findById(request.resource._id);
            if (resource) {
                resource.quantity -= request.quantity;
                if (resource.quantity < 0) resource.quantity = 0;
                if (resource.quantity === 0) resource.status = 'Out of Stock';
                await resource.save();
            }
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
