const express = require('express');
const router = express.Router();
const { deleteUserById, getAllUsers,getUserById,updateUserById } = require('../Controllers/userController');
const authentic = require('../middleware/authenticationMiddle');
const authorize = require('../middleware/authorizationMiddle');

/**
 * @swagger
 * /Freelancing/api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /Freelancing/api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /Freelancing/api/v1/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               profile_picture_url:
 *                 type: string
 *               country:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:id', authentic, updateUserById);

/**
 * @swagger
 * /Freelancing/api/v1/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/:id', authentic, authorize('admin'), deleteUserById);




module.exports = router;
