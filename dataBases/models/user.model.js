import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { roles } from "../../src/common/constant/role.constant.js";
import { status } from "../../src/common/constant/status.const.js";


const schema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "firstName is required"],
      lowercase: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "lastName is required"],
      lowercase: true
    },
    email: {
      type: String,
      trim: true,
      unique: [true, "eamil must be unique"],
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    recoveryEmail: {
      type: String,
      trim: true,
      required: [true, "recoveryEmail is required"],
    },
    DOB: {
      type: Date,
      trim: true,
      required: [true, "DOB is required"],
    },
    mobileNumber: {
      type: String,
      trim: true,
      unique: [true, "mobileNumber must be unique"],
      required: [true, "mobileNumber is required"],
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.USER,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: status.OFFLINE,
    },
    isDeleted:{
      type:Boolean,
      default: false,
    },
    passwordChangedAt: Date,
    logoutAt: Date,
    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);
// todo userName virtual
schema.virtual("userName").get(function (){
  return this.firstName + " " + this.lastName
})
//job virtual 
schema.virtual("Jobs",{
  ref: "job",
  foreignField: "addedBy",
  localField: "_id"
})
//company virtual
schema.virtual("companyId",{
  ref: "company",
  foreignField: "companyHR",
  localField: "_id"
})
//application virtual
schema.virtual("applications",{
  ref: "application",
  foreignField: "userId",
  localField: "_id"
})

// mongoose middleware
schema.pre("save", function () {
  if (this.password) this.password = bcrypt.hashSync(this.password, 8);
});

schema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = bcrypt.hashSync(this._update.password, 8);
});

//model
export const userModel = model("user", schema);
