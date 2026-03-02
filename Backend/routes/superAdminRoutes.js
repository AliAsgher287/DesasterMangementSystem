const express = require('express');
const { getAllOrganizations, verifyOrganization } = require('../controllers/superAdminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('superadmin'));

router.get('/organizations', getAllOrganizations);
router.put('/verify/:id', verifyOrganization);

module.exports = router;
