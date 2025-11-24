const express = require('express');
const router = express.Router();
const { createSpecialty, getAllSpecialties, getSpecialtyById, updateSpecialtyById, deleteSpecialtyById } = require('../Controllers/specialtyController');
const authentic = require('../middleware/authenticationMiddle');
const authorize = require('../middleware/authorizationMiddle');

/**
 * @swagger
 * /Freelancing/api/v1/specialties:
 *   post:
 *     summary: Create a new specialty
 *     tags: [Specialties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Specialty created successfully
 */
router.post('/', authentic, authorize('admin'), createSpecialty);

/**
 * @swagger
 * /Freelancing/api/v1/specialties:
 *   get:
 *     summary: Get all specialties
 *     tags: [Specialties]
 *     responses:
 *       200:
 *         description: Specialties retrieved successfully
 */
router.get('/', getAllSpecialties);

/**
 * @swagger
 * /Freelancing/api/v1/specialties/{id}:
 *   get:
 *     summary: Get specialty by ID
 *     tags: [Specialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specialty retrieved successfully
 */
router.get('/:id', getSpecialtyById);

/**
 * @swagger
 * /Freelancing/api/v1/specialties/{id}:
 *   put:
 *     summary: Update specialty by ID
 *     tags: [Specialties]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Specialty updated successfully
 */
router.put('/:id', authentic, authorize('admin'), updateSpecialtyById);

/**
 * @swagger
 * /Freelancing/api/v1/specialties/{id}:
 *   delete:
 *     summary: Delete specialty by ID
 *     tags: [Specialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Specialty deleted successfully
 */
router.delete('/:id', authentic, authorize('admin'), deleteSpecialtyById);

module.exports = router;
