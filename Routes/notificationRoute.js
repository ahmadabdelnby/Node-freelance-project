const express = require('express');
const authenticate = require('../middleware/authenticationMiddle')
const {
  getUserNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authenticate, getUserNotifications);
router.put('/:id/read', authenticate, markAsRead);
router.delete('/:id', authenticate, deleteNotification);

module.exports = router;