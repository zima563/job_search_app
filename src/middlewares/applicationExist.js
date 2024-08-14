import { applicationModel } from "../../dataBases/models/application.model.js";
import { apiError } from "../utils/apiError.js";

export const applicationExist = async (req, res, next) => {
  let app = await applicationModel.findOne({
    jobId: req.body.jobId,
    userId: req.user._id,
  });
  if (app) return next(new apiError("you apply this application before", 409));
  next();
};
