import { userModel } from "../../dataBases/models/user.model.js";
import { apiError } from "../utils/apiError.js";

export const emailExist = async (req, res, next) => {
  // let userEmail = await userModel.findOne({ email: req.body.email });
  // let userPhone = await userModel.findOne({
  //   mobileNumber: req.body.mobileNumber,
  // });

  // if (userEmail) return next(new apiError("email already exists", 409));
  // if (userPhone) return next(new apiError("mobileNumber already exists", 409));
  const { email , mobileNumber } = req.body;
  let userExist = await userModel.findOne({
    $or: [{email},{mobileNumber}],
  });

  if(userExist) return next(new apiError("user already exists", 409));
  next();
};
