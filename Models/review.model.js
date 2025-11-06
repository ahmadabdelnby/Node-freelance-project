const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    contract: { type: Schema.Types.ObjectId, ref: "Contract", required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      minlength: [10, "Comment must be at least 10 characters"],
      maxlength: [500, "Comment cannot exceed 500 characters"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
reviewSchema.index({ contract: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ rating: 1 });

// Validation: Ensure reviewer is not the same as reviewee
reviewSchema.pre("save", function (next) {
  if (this.reviewer.equals(this.reviewee)) {
    next(new Error("Reviewer and reviewee cannot be the same user"));
  }
  next();
});

// Prevent duplicate reviews for the same contract
reviewSchema.index({ contract: 1, reviewer: 1 }, { unique: true });
module.exports = mongoose.model("Review", reviewSchema);
