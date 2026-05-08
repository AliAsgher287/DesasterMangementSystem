const express = require('express');
const { getGlobalStats, getOrganizations } = require('../controllers/publicController');

const router = express.Router();

router.route('/stats').get(getGlobalStats);
router.route('/organizations').get(getOrganizations);

module.exports = router;
