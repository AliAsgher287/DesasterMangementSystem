const express = require('express');
const {
    getResources,
    getGlobalResources,
    addResource,
    updateResource,
    deleteResource
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all resource routes

router.get('/global', getGlobalResources); // Must be before /:id
router.get('/', getResources);
router.post('/', addResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

module.exports = router;
