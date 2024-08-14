import express from "express";
import { validation } from "../../middlewares/validation.js";
import {
  GetAllAccountsRecoveryEmailVal,
  UpdatePasswordVal,
  forgetPasswordVal,
  resettingPasswordVal,
  signInVal,
  signupVal,
  updateAccountVal,
} from "./user.validator.js";
import {
  GetAllAccountsRecoveryEmail,
  UpdatePassword,
  deleteAccount,
  forgetPassword,
  getProfileData,
  getUserAccountData,
  logout,
  resettingPassword,
  signIn,
  signup,
  updateAccount,
} from "./user.controller.js";
import { emailExist } from "../../middlewares/emailExist.js";
import { protectRoutes } from "../../middlewares/authentication.js";
import { allowedTo } from "../../middlewares/authorization.js";

const userRouter = express.Router();

userRouter.route("/signUp").post(validation(signupVal), emailExist, signup);
userRouter.route("/signIn").post(validation(signInVal), signIn);
userRouter
  .route("/GetAllAccountsRecoveryEmail")
  .get(validation(GetAllAccountsRecoveryEmailVal), GetAllAccountsRecoveryEmail);

userRouter
  .route("/logOut")
  .patch(protectRoutes, allowedTo("user", "Company_HR"), logout);

userRouter
  .route("/forgettingPassword")
  .post(validation(forgetPasswordVal), forgetPassword);
userRouter
  .route("/resettingPassword")
  .post(validation(resettingPasswordVal), resettingPassword);
userRouter
  .route("/updateAccount")
  .put(
    protectRoutes,
    allowedTo("user", "Company_HR"),
    validation(updateAccountVal),
    emailExist,
    updateAccount
  );
userRouter
  .route("/deleteAccount")
  .delete(protectRoutes, allowedTo("user", "Company_HR"), deleteAccount);
userRouter
  .route("/getUserAccountData")
  .get(protectRoutes, allowedTo("user", "Company_HR"), getUserAccountData);
userRouter
  .route("/getProfileData/:id")
  .get(protectRoutes, allowedTo("user", "Company_HR"), getProfileData);
userRouter
  .route("/UpdatePassword")
  .patch(
    protectRoutes,
    allowedTo("user", "Company_HR"),
    validation(UpdatePasswordVal),
    UpdatePassword
  );

export { userRouter };
