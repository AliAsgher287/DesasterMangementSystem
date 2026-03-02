const express = require('express');
const {
    triggerDisaster,
    getActiveDisasters,
    resolveDisaster
} = require('../controllers/disasterController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .post(triggerDisaster);

router.route('/active')
    .get(getActiveDisasters);

router.route('/:id/resolve')
    .put(resolveDisaster);

module.exports = router;
