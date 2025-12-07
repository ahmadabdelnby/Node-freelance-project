const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');

// GET /api/admin/collections
router.get('/collections', adminController.getCollections);

// GET all documents in a specific collection
router.get('/:collectionName', adminController.getCollectionDocs);


module.exports = router;
