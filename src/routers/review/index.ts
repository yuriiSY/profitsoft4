import express from "express";
import {
  saveReview,
  getReviesByBookId,
  getTotalReviesByBookId,
} from "src/controllers/reviews";
import validateBody from "src/helpers/validateBody";
import { reviewSchema } from "src/schemas/reviewSchemas";

const router = express.Router();

router.post("/", validateBody(reviewSchema), saveReview);
router.get("/", getReviesByBookId);
router.post("/_counts", getTotalReviesByBookId);

export default router;
