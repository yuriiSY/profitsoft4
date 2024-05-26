import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import HttpError from "./HttpError";

const validateBody = (schema: ObjectSchema) => {
  return (req: Request, _: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };
};

export default validateBody;
