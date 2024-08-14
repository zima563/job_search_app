import Jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { catchError } from "./catchError.js";
import { userModel } from "../../dataBases/models/user.model.js";

export const protectRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;

  if (!token) return next(new apiError("not token provide", 401));

  let decoded = Jwt.verify(token, process.env.JWT_KEY);
  let user = await userModel.findById(decoded.userId);
  if (!user) return next(new apiError("user not founnd"));

  if (user.passwordChangedAt) {
    let timeOfChangePassword = parseInt(user?.passwordChangedAt / 1000);
    if (timeOfChangePassword > decoded.iat)
      return next(new apiError("invalid token..please login", 401));
  }
  if (user.logoutAt) {
    let timeOflogout = parseInt(user?.logoutAt / 1000);
    if (timeOflogout > decoded.iat)
      return next(new apiError("invalid token..please login", 401));
  }
  req.user = user;
  next();
});
