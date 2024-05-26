import Review, { IReview } from "src/model/review";
import { ReviewSaveDto } from "src/dto/review/reviewSaveDto";
import { ReviewInfoDto } from "src/dto/review/reviewInfoDto";

export const createReview = async (
  reviewDto: ReviewSaveDto
): Promise<string> => {
  const review = await new Review(reviewDto).save();
  return review._id;
};

export const listReviewsByBookId = async ({
  book_id,
  size,
  from,
}: {
  book_id: string;
  size: string;
  from: string;
}): Promise<ReviewInfoDto[]> => {
  const reviews = await Review.find({
    book_id,
  })
    .sort({ createdAt: -1 })
    .limit(parseInt(size))
    .skip(parseInt(from));

  return reviews.map((review) => toInfoDto(review));
};

export const totalReviewsByBookId = async (
  ids: string[]
): Promise<{ [key: string]: number }> => {
  const counts = await Review.aggregate([
    {
      $match: { book_id: { $in: ids } },
    },
    {
      $group: {
        _id: "$book_id",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = counts.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {} as { [key: string]: number });

  ids.forEach((id) => {
    if (!result[id]) {
      result[id] = 0;
    }
  });

  return result;
};

const toInfoDto = (review: IReview): ReviewInfoDto => {
  return {
    _id: review._id,
    text: review.text,
  };
};
