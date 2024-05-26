import Joi from "joi";

export const reviewSchema = Joi.object({
  text: Joi.string().required(),
  book_id: Joi.string().required(),
});
