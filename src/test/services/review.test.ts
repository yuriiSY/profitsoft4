import chai from "chai";
import sinon from "sinon";
import mongoSetup from "../mongoSetup";
import Review from "src/model/review";
import { ReviewSaveDto } from "src/dto/review/reviewSaveDto";
import * as reviewService from "src/services/review";

const { expect } = chai;

const sandbox = sinon.createSandbox();

const review1 = new Review({
  text: "Text message 1",
  book_id: "65",
});

const review2 = new Review({
  text: "Text message 2",
  book_id: "65",
});

describe("Review Service", () => {
  before(async () => {
    /**
     * The mongoSetup promise is resolved when the database is ready to be used.
     * After it is resolved we can save all the needed data.
     */
    await mongoSetup;

    await review1.save();
    await review2.save();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("listReviewsByBookId should return Review details if found", (done) => {
    const size = "1";
    const from = "0";
    const book_id = "65";
    reviewService
      .listReviewsByBookId({ book_id, size, from })
      .then((reviews) => {
        expect(reviews.length).to.equal(1);
        expect(reviews[0].text).to.eql(review2.text);
        done();
      })
      .catch((error: Error) => done(error));
  });

  it("totalReviewsByBookId should return Reviews count by book id", (done) => {
    const ids = ["67", "65", "62"];
    const counts = {
      "67": 0,
      "65": 2,
      "62": 0,
    };
    reviewService
      .totalReviewsByBookId(ids)
      .then((stat) => {
        expect(Object.keys(stat).length).to.equal(ids.length);
        expect(stat).to.eql(counts);
        done();
      })
      .catch((error: Error) => done(error));
  });

  it("createReview should create a new review and return its id", (done) => {
    const reviewDto: ReviewSaveDto = {
      text: "Text message",
      book_id: "65",
    };

    reviewService
      .createReview(reviewDto)
      .then(async (id: string) => {
        const review = await Review.findById(id);

        expect(review).to.exist;
        expect(review?.text).to.equal(reviewDto.text);
        expect(review?.book_id).to.equal(reviewDto.book_id);
        done();
      })
      .catch((error: Error) => done(error));
  });
});
