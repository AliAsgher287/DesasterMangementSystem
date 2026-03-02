const express = require('express');
const {
    submitHelpRequest,
    getCitizenHelpRequests,
    updateHelpStatus
} = require('../controllers/citizenHelpController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', submitHelpRequest); // Public — citizens submit requests
router.get('/', protect, authorize('superadmin'), getCitizenHelpRequests); // Super Admin only
router.put('/:id', protect, authorize('superadmin'), updateHelpStatus); // Super Admin only

module.exports = router;
