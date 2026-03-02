const express = require('express');
const {
    createTask,
    bulkCreateTasks,
    getTasks,
    getMyTasks,
    updateTaskStatus,
    getAvailableResponders,
    assignResponders
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createTask);
router.post('/bulk', bulkCreateTasks);
router.get('/', getTasks);
router.get('/my', getMyTasks);
router.put('/:id/status', updateTaskStatus);
router.get('/responders', getAvailableResponders);
router.put('/:id/assign', assignResponders);

module.exports = router;
