import { apiError } from "../utils/apiError.js";

export const catchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(new apiError(err, 500));
    });
  };
};
