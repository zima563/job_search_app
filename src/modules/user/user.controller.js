import bcrypt from "bcrypt";

import { userModel } from "../../../dataBases/models/user.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";
import Jwt from "jsonwebtoken";
// Sign Up
const signup = catchError(async (req, res, next) => {
  let user = new userModel(req.body);
  await user.save();
  res.status(200).json({ msg: "success" });
});
// Sign In
const signIn = catchError(async (req, res, next) => {
  const { email , mobileNumber, password } = req.body;

  let user = await userModel.findOne({
    $or: [{ email }, { mobileNumber }],
  });

  if (user && bcrypt.compareSync(password , user.password)) {
    await userModel.findByIdAndUpdate(user._id, { status: "online" });

    let token = Jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    res.status(201).json({ msg: "success", token });
  }else{
    next(new apiError("email or password incorrect", 401));
  }
 
});
// update account.
const updateAccount = catchError(async (req, res, next) => {
  let user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  });
  user.userName = user.firstName + user.lastName;
  await user.save();
  !user && next(new apiError("not user found", 404));
  user && res.json({ msg: "success", user });
});
// Delete account
const deleteAccount = catchError(async (req, res, next) => {
  let user = await userModel.findByIdAndUpdate(req.user._id,{isDeleted:true},{new:true});
  !user && next(new apiError("not user found", 404));
  user && res.json({ msg: "success", user });
});
// Get user account data
const getUserAccountData = catchError(async (req, res, next) => {
   res.json({ msg: "success", user: req.user });
});
//Get profile data for another user
const getProfileData = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.params.id);
  !user && next(new apiError("not user found", 404));
  user && res.json({ msg: "success", user:{
    userName: user.userName,
    DOB : user.DOB,
    mobileNumber: user.mobileNumber,}
    
   });
});
// Update password
const UpdatePassword = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.user._id);
  if (user && bcrypt.compareSync(req.body.currentPassword, user.password)) {
    let token = Jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    await userModel.findByIdAndUpdate(req.user._id, {
      password: req.body.newPassword,
      passwordChangedAt: Date.now(),
    });
    return res.json({ msg: "success", token });
  }

  next(new apiError("password incorrect", 401));
});
// Forget password
const forgetPassword = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new apiError("not user found"));

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  res.status(200).json({ msg: "success", otp });
});
// Endpoint for resetting password using OTP
const resettingPassword = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new apiError("not user found"));

  if (user.otp !== req.body.otp || new Date() > user.otpExpiry)
    return next(new apiError("Invalid or expired OTP", 401));

  user.password = req.body.newPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.status(201).json({ msg: "password reset successfuly" });
});
// Get all accounts associated to a specific recovery Email
const GetAllAccountsRecoveryEmail = catchError(async (req, res, next) => {
  let users = await userModel.find({ recoveryEmail: req.body.recoveryEmail });
  if (!users) return next(new apiError("not users found", 404));
  res.status(200).json({ msg: "success", users });
});
// logout
const logout = catchError(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, {
    logoutAt: Date.now(),
    status: "offline",
  });
  res.status(200).json({ msg: "you logOut successfuly" });
});

export {
  signup,
  signIn,
  getUserAccountData,
  getProfileData,
  deleteAccount,
  updateAccount,
  forgetPassword,
  UpdatePassword,
  resettingPassword,
  GetAllAccountsRecoveryEmail,
  logout,
};
