import log4js from "log4js";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { ReviewSaveDto } from "src/dto/review/reviewSaveDto";
import { checkBookExist } from "src/helpers/api";
import {
  createReview,
  listReviewsByBookId,
  totalReviewsByBookId,
} from "src/services/review";
import HttpError from "src/helpers/HttpError";

export const saveReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = new ReviewSaveDto(req.body);
    const bookId = review.book_id;

    if (!bookId) {
      log4js.getLogger().warn("Missing book_id in review data");
      throw HttpError(
        httpStatus.BAD_REQUEST,
        "Missing required parameter: book_id"
      );
    }

    const bookExists = await checkBookExist(bookId);
    if (bookExists) {
      const id = await createReview(review);
      res.status(httpStatus.CREATED).send({
        id,
      });
      log4js.getLogger().info("Review created");
    } else {
      log4js.getLogger().warn("Book not found for id:", review.book_id);
      throw HttpError(404, `Book not found`);
    }
  } catch (err) {
    log4js.getLogger().error("Error in creating review.", err);
    next(err);
  } finally {
    return;
  }
};

export const getReviesByBookId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { book_id, size = "10", from = "0" } = req.query;

    if (!book_id) {
      throw HttpError(
        httpStatus.BAD_REQUEST,
        "Missing required parameter: book_id"
      );
    }

    const reviews = await listReviewsByBookId({
      book_id: book_id.toString(),
      size: size.toString(),
      from: from.toString(),
    });

    res.status(httpStatus.OK).send(reviews);
  } catch (err) {
    next(err);
  } finally {
    return;
  }
};

export const getTotalReviesByBookId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ids } = req.body;
    const result = await totalReviewsByBookId(ids);
    res.status(httpStatus.OK).send(result);
  } catch (err) {
    next(err);
  } finally {
    return;
  }
};
