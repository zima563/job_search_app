import joi from "joi";

const signupVal = joi.object({
  firstName: joi.string().trim().required().min(2).max(15),
  lastName: joi.string().trim().required().min(2).max(15),
  email: joi
    .string()
    .pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/)
    .required(),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
  rePassword: joi.valid(joi.ref("password")).required(),
  recoveryEmail: joi
    .string()
    .pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/)
    .required(),
  DOB: joi
    .string()
    .pattern(/^\d{4}-\d{1,2}-\d{1,2}$/)
    .trim()
    .required(),
  mobileNumber: joi
    .string()
    .pattern(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)
    .required(),
});

const signInVal = joi.object({
  email: joi.string().trim().email().when("mobileNumber",{
    is: joi.exist(),
    then: joi.optional(),
    otherwise: joi.required()
  }),
  mobileNumber: joi.string().pattern(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required(),
});

const updateAccountVal = joi.object({
  firstName: joi.string().trim().min(2).max(15),
  lastName: joi.string().trim().min(2).max(15),
  email: joi.string().pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/),
  recoveryEmail: joi.string().pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/),
  DOB: joi
    .string()
    .pattern(/^\d{4}-\d{1,2}-\d{1,2}$/)
    .trim(),
  mobileNumber: joi.string().pattern(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/),
});

const forgetPasswordVal = joi.object({
  email: joi
    .string()
    .pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/)
    .required(),
});

const resettingPasswordVal = joi.object({
  email: joi
    .string()
    .pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/)
    .required(),
  otp: joi.string().trim().required(),
  newPassword: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
});

const UpdatePasswordVal = joi.object({
  currentPassword: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
  newPassword: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
  renewPassword: joi.valid(joi.ref("newPassword")).required(),
});

const GetAllAccountsRecoveryEmailVal = joi.object({
  recoveryEmail: joi
    .string()
    .pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/)
    .required(),
});

export {
  signInVal,
  signupVal,
  updateAccountVal,
  UpdatePasswordVal,
  forgetPasswordVal,
  resettingPasswordVal,
  GetAllAccountsRecoveryEmailVal,
};
