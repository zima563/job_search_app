import { jobModel } from "../../dataBases/models/job.model.js";
import { apiError } from "../utils/apiError.js";

export const check_hr = async (req, res, next) => {
  let job = await jobModel.findOne({
    _id: req.params.id,
    addedBy: req.user._id,
  });
  if (!job) return next(new apiError("you not allow to get this api"));
  next();
};
