import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema(
  {
    companyName: {
      type: String,
      trim: true,
      unique: [true, "companyName must be required"],
      required: [true, "firstName is required"],
      minlength: [2, "too short firstName"],
      maxlength: [15, "too long firstName"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "description is required"],
      minlength: [10, "too short description"],
      maxlength: [1500, "too long description"],
    },
    industry: {
      type: String,
      trim: true,
      required: [true, "industry is required"],
      minlength: [2, "too short industry"],
      maxlength: [30, "too long industry"],
    },
    address: {
      type: String,
      trim: true,
      unique: [true, "address must be unique"],
      required: [true, "address is required"],
    },
    numberOfEmployees: {
      max: {type:Number},
      min: {type:Number}
    },
    companyEmail: {
      type: String,
      trim: true,
      unique: [true, "companyEmail must be unique"],
      required: [true, "companyEmail is required"],
    },
    isDeleted:{
      type:Boolean,
      default: false,
    },
    companyHR: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

schema.virtual("myJobs", {
  ref: "job",
  localField: "companyHR",
  foreignField: "addedBy",
});

schema.pre("findOne", function () {
  this.populate("myJobs");
});

schema.pre("find", function () {
  this.populate("companyHR", "userName -_id");
});
export const companyModel = model("company", schema);
