const express = require('express');
const {
    submitFieldReport,
    getFieldReports,
    getMyFieldReports
} = require('../controllers/fieldReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All routes protected

router.post('/', submitFieldReport); // Responders submit field reports
router.get('/', authorize('superadmin'), getFieldReports); // Super Admin only
router.get('/my', getMyFieldReports); // Responders see their own reports

module.exports = router;
