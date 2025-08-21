const express = require('express');
const { getMessages, postMessage } = require('../controllers/chatController');
const router = express.Router();

router.get('/:roomId', getMessages);
router.post('/', postMessage);

module.exports = router;

