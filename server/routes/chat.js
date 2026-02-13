const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth'); // Assuming auth middleware exists and is named 'protect'

router.post('/', protect, chatController.sendMessage);
router.get('/history', protect, chatController.getHistory);
router.delete('/history', protect, chatController.clearHistory);

module.exports = router;
