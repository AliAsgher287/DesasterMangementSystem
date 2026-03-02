const express = require('express');
const {
    createRequest,
    getIncomingRequests,
    getMyRequests,
    updateRequestStatus
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all request routes

router.post('/', createRequest);
router.get('/incoming', getIncomingRequests);
router.get('/my', getMyRequests);
router.put('/:id/status', updateRequestStatus);

module.exports = router;
