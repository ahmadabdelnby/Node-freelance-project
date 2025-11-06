const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByReviewer,
  getReviewsByReviewee,
  getReviewsByContract,
  updateReviewById,
  deleteReviewById,
} = require("../Controllers/ReviewController");

/**
 * @swagger
 * /Freelancing/api/v1/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contract
 *               - reviewer
 *               - reviewee
 *               - rating
 *               - comment
 *             properties:
 *               contract:
 *                 type: string
 *                 description: Contract ID
 *               reviewer:
 *                 type: string
 *                 description: Reviewer user ID
 *               reviewee:
 *                 type: string
 *                 description: Reviewee user ID
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 description: Review comment
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error or duplicate review
 *       500:
 *         description: Server error
 */
router.post("/", createReview);

/**
 * @swagger
 * /Freelancing/api/v1/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", getAllReviews);

/**
 * @swagger
 * /Freelancing/api/v1/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getReviewById);

/**
 * @swagger
 * /Freelancing/api/v1/reviews/reviewer/{reviewerId}:
 *   get:
 *     summary: Get all reviews by a specific reviewer
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reviewer user ID
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/reviewer/:reviewerId", getReviewsByReviewer);

/**
 * @swagger
 * /Freelancing/api/v1/reviews/reviewee/{revieweeId}:
 *   get:
 *     summary: Get all reviews received by a specific user
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: revieweeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reviewee user ID
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/reviewee/:revieweeId", getReviewsByReviewee);

/**
 * @swagger
 * /Freelancing/api/v1/reviews/contract/{contractId}:
 *   get:
 *     summary: Get all reviews for a specific contract
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract ID
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/contract/:contractId", getReviewsByContract);

/**
 * @swagger
 * /Freelancing/api/v1/reviews/{id}:
 *   put:
 *     summary: Update review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put("/:id", updateReviewById);

/**
 * @swagger
 * /Freelancing/api/v1/reviews/{id}:
 *   delete:
 *     summary: Delete review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteReviewById);

module.exports = router;
