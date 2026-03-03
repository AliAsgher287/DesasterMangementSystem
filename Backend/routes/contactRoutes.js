const express = require('express');
const {
    submitContact,
    getContacts,
    updateContactStatus
} = require('../controllers/contactController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', submitContact);

// Protect these routes for Super Admin only
router.get('/', protect, authorize('superadmin'), getContacts);
router.put('/:id', protect, authorize('superadmin'), updateContactStatus);

module.exports = router;
