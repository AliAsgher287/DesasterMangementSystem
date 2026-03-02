const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Create a new task (Dispatch)
// @route   POST /api/tasks
// @access  Private (Admin, SuperAdmin)
exports.createTask = async (req, res, next) => {
    try {
        // SuperAdmin can specify a target organizationId; Admin uses their own ID
        if (req.user.role === 'superadmin') {
            // SuperAdmin must provide targetOrganizationId in body
            if (!req.body.targetOrganizationId) {
                return res.status(400).json({ success: false, error: 'Please provide targetOrganizationId for the task' });
            }
            req.body.organization = req.body.targetOrganizationId;
        } else {
            req.body.organization = req.user.id;
        }

        const task = await Task.create(req.body);

        // Update source status if from CitizenHelp or FieldReport
        if (req.body.sourceRef) {
            if (req.body.sourceType === 'CitizenHelp') {
                const CitizenHelp = require('../models/CitizenHelp');
                await CitizenHelp.findByIdAndUpdate(req.body.sourceRef, { status: 'Actioned' });
            } else if (req.body.sourceType === 'FieldReport') {
                const FieldReport = require('../models/FieldReport');
                await FieldReport.findByIdAndUpdate(req.body.sourceRef, { status: 'Actioned' });
            }
        }

        // Deduct inventory if resources were assigned
        if (req.body.assignedResources && req.body.assignedResources.length > 0) {
            const Resource = require('../models/Resource');
            for (const item of req.body.assignedResources) {
                if (item.resourceId) {
                    const resource = await Resource.findById(item.resourceId);
                    if (resource) {
                        const deduction = Number(item.quantity) || 0;
                        resource.quantity = Math.max(0, resource.quantity - deduction);
                        if (resource.quantity === 0) resource.status = 'Out of Stock';
                        await resource.save();
                    }
                }
            }
        }

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Create bulk tasks (Decentralized distribution)
// @route   POST /api/tasks/bulk
// @access  Private (SuperAdmin)
exports.bulkCreateTasks = async (req, res, next) => {
    try {
        if (req.user.role !== 'superadmin') {
            return res.status(401).json({ success: false, error: 'Only SuperAdmin can perform bulk dispatch' });
        }

        const { locations, targetOrganizationId, ...otherData } = req.body;

        if (!locations || !Array.isArray(locations) || locations.length === 0) {
            return res.status(400).json({ success: false, error: 'Please provide at least one location' });
        }

        if (!targetOrganizationId) {
            return res.status(400).json({ success: false, error: 'Please provide targetOrganizationId' });
        }

        const createdTasks = [];
        for (const loc of locations) {
            const taskData = {
                ...otherData,
                location: loc,
                organization: targetOrganizationId
            };
            const task = await Task.create(taskData);
            createdTasks.push(task);
        }

        // Update source status once if exists
        if (req.body.sourceRef) {
            if (req.body.sourceType === 'CitizenHelp') {
                const CitizenHelp = require('../models/CitizenHelp');
                await CitizenHelp.findByIdAndUpdate(req.body.sourceRef, { status: 'Actioned' });
            } else if (req.body.sourceType === 'FieldReport') {
                const FieldReport = require('../models/FieldReport');
                await FieldReport.findByIdAndUpdate(req.body.sourceRef, { status: 'Actioned' });
            }
        }

        res.status(201).json({
            success: true,
            count: createdTasks.length,
            data: createdTasks
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private (Admin, SuperAdmin)
exports.getTasks = async (req, res, next) => {
    try {
        let tasks;
        if (req.user.role === 'superadmin') {
            // Super admin sees all tasks from all organizations
            tasks = await Task.find()
                .populate({ path: 'assignedResponders', select: 'name email' })
                .populate({ path: 'organization', select: 'name organizationName' })
                .sort('-createdAt');
        } else {
            tasks = await Task.find({ organization: req.user.id })
                .populate({ path: 'assignedResponders', select: 'name email' })
                .sort('-createdAt');
        }

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get tasks assigned to the current responder
// @route   GET /api/tasks/my
// @access  Private (Responder)
exports.getMyTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ assignedResponders: req.user.id })
            .populate({ path: 'organization', select: 'organizationName' })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private (Responder/Admin/SuperAdmin)
exports.updateTaskStatus = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        const isAssigned = task.assignedResponders.includes(req.user.id);
        const isOwner = task.organization.toString() === req.user.id;
        const isSuperAdmin = req.user.role === 'superadmin';

        if (!isAssigned && !isOwner && !isSuperAdmin) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
            new: true,
            runValidators: true
        });

        // If task is completed, update source status
        if (req.body.status === 'Completed' && task.sourceRef) {
            if (task.sourceType === 'CitizenHelp') {
                const CitizenHelp = require('../models/CitizenHelp');
                await CitizenHelp.findByIdAndUpdate(task.sourceRef, { status: 'Resolved' });
            } else if (task.sourceType === 'FieldReport') {
                const FieldReport = require('../models/FieldReport');
                await FieldReport.findByIdAndUpdate(task.sourceRef, { status: 'Resolved' });
            }
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get list of available responders in organization
// @route   GET /api/tasks/responders
// @access  Private (Admin, SuperAdmin)
exports.getAvailableResponders = async (req, res, next) => {
    try {
        let responders;
        if (req.user.role === 'superadmin') {
            // SuperAdmin can filter by orgId query param, or get all responders
            const orgId = req.query.orgId;
            if (orgId) {
                const org = await User.findById(orgId);
                if (!org) {
                    return res.status(404).json({ success: false, error: 'Organization not found' });
                }
                responders = await User.find({
                    role: 'responder',
                    organizationName: { $regex: new RegExp(`^${org.organizationName}$`, 'i') }
                }).select('name email contactNumber _id');
            } else {
                responders = await User.find({ role: 'responder' }).select('name email contactNumber organizationName _id');
            }
        } else {
            const admin = await User.findById(req.user.id);
            const selection = req.user.role === 'superadmin' ? 'name email contactNumber organizationName _id' : 'name email _id';
            responders = await User.find({
                role: 'responder',
                organizationName: { $regex: new RegExp(`^${admin.organizationName}$`, 'i') }
            }).select(selection);
        }

        res.status(200).json({
            success: true,
            count: responders.length,
            data: responders
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Assign responders and resources to a task
// @route   PUT /api/tasks/:id/assign
// @access  Private (Admin, SuperAdmin)
exports.assignResponders = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Check if user is SuperAdmin or the owner Organization
        const isOwner = task.organization.toString() === req.user.id;
        const isSuperAdmin = req.user.role === 'superadmin';

        if (!isOwner && !isSuperAdmin) {
            return res.status(401).json({ success: false, error: 'Not authorized to assign responders to this task' });
        }

        const { responderIds, assignedResources } = req.body;

        if (responderIds && !Array.isArray(responderIds)) {
            return res.status(400).json({ success: false, error: 'Please provide an array of responder IDs' });
        }

        // Handle resource deduction if assignedResources are provided
        if (assignedResources && Array.isArray(assignedResources)) {
            const Resource = require('../models/Resource');
            for (const item of assignedResources) {
                if (item.resourceId) {
                    const resource = await Resource.findById(item.resourceId);
                    if (!resource) {
                        return res.status(404).json({ success: false, error: `Resource ${item.resourceId} not found` });
                    }

                    const quantityToDeduct = Number(item.quantity) || 0;
                    if (resource.quantity < quantityToDeduct) {
                        return res.status(400).json({
                            success: false,
                            error: `Insufficient quantity for ${resource.name}. Available: ${resource.quantity}, Requested: ${quantityToDeduct}`
                        });
                    }

                    // Deduct inventory
                    resource.quantity -= quantityToDeduct;
                    if (resource.quantity === 0) resource.status = 'Out of Stock';
                    await resource.save();
                }
            }
        }

        const updateData = {};
        if (responderIds) updateData.assignedResponders = responderIds;
        if (assignedResources) {
            // Merge or replace assigned resources? 
            // The user wants it to be deducted when assigned. 
            // If they update the assignment, we might need a more complex logic to "return" resources.
            // For now, let's just push new assignments or replace them.
            // The prompt says "when it is assigned to the responder it is diducted fron organiztaion dashoard"
            updateData.assignedResources = assignedResources;
        }

        task = await Task.findByIdAndUpdate(req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate({ path: 'assignedResponders', select: 'name email' });

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};
