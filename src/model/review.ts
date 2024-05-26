import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  text: string;
  book_id: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema(
  {
    text: {
      required: true,
      type: String,
    },
    book_id: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    timezone: "UTC",
  }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
