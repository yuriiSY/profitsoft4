import bodyParser from "body-parser";
import express from "express";
import sinon from "sinon";
import chai from "chai";
import chaiHttp from "chai-http";
import reviewRouter from "src/routers/review";
import * as reviewService from "src/services/review";
import * as apiHelper from "src/helpers/api";

const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();

const app = express();

app.use(bodyParser.json({ limit: "1mb" }));
app.use("/", reviewRouter);

describe("Review controller", () => {
  afterEach(() => {
    sandbox.restore();
  });

  it("should return list of reviews for a book", (done) => {
    const reviews = [{ _id: "1", text: "Good book!" }];
    sandbox.stub(reviewService, "listReviewsByBookId").resolves(reviews);

    chai
      .request(app)
      .get("/")
      .query({ book_id: "1" })
      .end((_, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(reviews);
        done();
      });
  });
  it("should return the total number of reviews for a list of books", (done) => {
    const ids = ["1", "2"];
    const result = {
      "1": 0,
      "2": 0,
    };

    sandbox.stub(reviewService, "totalReviewsByBookId").resolves(result);

    chai
      .request(app)
      .post("/_counts")
      .send({ ids })
      .end((_, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(result);
        done();
      });
  });

  it("should create a review and return its ID", (done) => {
    const reviewData = { book_id: "1", text: "Great book!" };
    const reviewId = "1";

    sandbox.stub(apiHelper, "checkBookExist").resolves(true);
    sandbox.stub(reviewService, "createReview").resolves(reviewId);

    chai
      .request(app)
      .post("/")
      .send(reviewData)
      .end((_, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("id", reviewId);
        done();
      });
  });
});
