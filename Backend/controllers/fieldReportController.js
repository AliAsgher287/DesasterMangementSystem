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
        const reports = await FieldReport.find()
            .populate({
                path: 'responder',
                select: 'name organizationName'
            })
            .sort('-createdAt');

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
