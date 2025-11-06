const Review = require("../Models/review.model");

// Create a new review
const createReview = async (req, res) => {
  try {
    const { contract, reviewer, reviewee, rating, comment } = req.body;

    // Check if review already exists for this contract and reviewer
    const existingReview = await Review.findOne({ contract, reviewer });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this contract" });
    }

    const newReview = new Review({
      contract,
      reviewer,
      reviewee,
      rating,
      comment,
    });

    await newReview.save();
    res
      .status(201)
      .json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("reviewer", "username email first_name last_name")
      .populate("reviewee", "username email first_name last_name")
      .populate("contract");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get review by ID
const getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId)
      .populate("reviewer", "username email first_name last_name")
      .populate("reviewee", "username email first_name last_name")
      .populate("contract");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get reviews by reviewer ID
const getReviewsByReviewer = async (req, res) => {
  try {
    const reviewerId = req.params.reviewerId;
    const reviews = await Review.find({ reviewer: reviewerId })
      .populate("reviewee", "username email first_name last_name")
      .populate("contract");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by reviewer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get reviews by reviewee ID (reviews received by a user)
const getReviewsByReviewee = async (req, res) => {
  try {
    const revieweeId = req.params.revieweeId;
    const reviews = await Review.find({ reviewee: revieweeId })
      .populate("reviewer", "username email first_name last_name")
      .populate("contract");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by reviewee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get reviews by contract ID
const getReviewsByContract = async (req, res) => {
  try {
    const contractId = req.params.contractId;
    const reviews = await Review.find({ contract: contractId })
      .populate("reviewer", "username email first_name last_name")
      .populate("reviewee", "username email first_name last_name");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by contract:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update review by ID
const updateReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const updatedData = req.body;

    // Prevent updating contract, reviewer, and reviewee
    delete updatedData.contract;
    delete updatedData.reviewer;
    delete updatedData.reviewee;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete review by ID
const deleteReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  getReviewsByReviewer,
  getReviewsByReviewee,
  getReviewsByContract,
  updateReviewById,
  deleteReviewById,
};
