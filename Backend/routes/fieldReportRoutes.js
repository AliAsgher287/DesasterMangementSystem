const express = require('express');
const {
    submitFieldReport,
    getFieldReports,
    getMyFieldReports,
    updateFieldReportStatus
} = require('../controllers/fieldReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All routes protected

router.post('/', submitFieldReport); // Responders submit field reports
router.get('/', authorize('superadmin', 'admin'), getFieldReports); // Super Admin and Admin
router.get('/my', getMyFieldReports); // Responders see their own reports
router.put('/:id/status', authorize('admin', 'superadmin'), updateFieldReportStatus); // Update status

module.exports = router;
