const FieldReport = require('../models/FieldReport');

// @desc    Submit a new field assessment report
// @route   POST /api/field-reports
// @access  Private (Responder/Admin)
exports.submitFieldReport = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.responder = req.user.id;

        const report = await FieldReport.create(req.body);

        res.status(201).json({
            success: true,
            data: report
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get all field reports
// @route   GET /api/field-reports
// @access  Private (Admin/Responder)
exports.getFieldReports = async (req, res, next) => {
    try {
        let reports = await FieldReport.find()
            .populate({
                path: 'responder',
                select: 'name organizationName'
            })
            .sort('-createdAt');

        // If user is an admin, only show reports from responders in their organization
        if (req.user.role === 'admin') {
            reports = reports.filter(r => r.responder && r.responder.organizationName === req.user.organizationName);
        }

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get reports assigned to/made by the current user
// @route   GET /api/field-reports/my
// @access  Private (Responder)
exports.getMyFieldReports = async (req, res, next) => {
    try {
        const reports = await FieldReport.find({ responder: req.user.id }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Update field report status
// @route   PUT /api/field-reports/:id/status
// @access  Private (Admin/Superadmin)
exports.updateFieldReportStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const report = await FieldReport.findById(req.params.id);

        if (!report) {
            return res.status(404).json({ success: false, error: 'Report not found' });
        }

        report.status = status;
        await report.save();

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
