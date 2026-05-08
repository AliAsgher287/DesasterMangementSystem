const express = require('express');
const {
    createRequest,
    getRequests,
    updateRequestStatus
} = require('../controllers/organizationRequestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createRequest)
    .get(getRequests);

router.route('/:id/status')
    .patch(updateRequestStatus);

module.exports = router;
