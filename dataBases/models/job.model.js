import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";
import { jobLocation } from "../../src/common/constant/joblocation.constant.js";
import { workTime } from "../../src/common/constant/workTime.constant.js";
import { seniorityLevel } from "../../src/common/constant/seniorityLevel.constant.js";

const schema = new Schema(
  {
    jobTitle: {
      type: String,
      trim: true,
      required: [true, "jobTitle is required"],
      minlength: [2, "too short jobTitle"],
      maxlength: [30, "too long jobTitle"],
    },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocation),
      trim: true,
      required: [true, "jobLocation is required"],
    },
    workingTime: {
      type: String,
      enum: Object.values(workTime),
      trim: true,
      required: [true, "workingTime is required"],
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevel),
      trim: true,
      required: [true, "seniorityLevel is required"],
    },
    jobDescription: {
      type: String,
      trim: true,
      required: [true, "jobDescription is required"],
      minlength: [10, "too short jobDescription"],
      maxlength: [100, "too long jobDescription"],
    },
    technicalSkills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    softSkills: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isDeleted:{
      type:Boolean,
      default: false,
    },
    addedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true
    },
    // company: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "company",
    //   required: true
    // },
  },
  { timestamps: true, toJSON: { virtuals: true }  }
);

schema.virtual("applications", {
  ref: "application",
  localField: "_id",
  foreignField: "jobId",
});

schema.pre("findOne", function () {
  this.populate("applications");
});

schema.pre("find", function () {
  this.populate("addedBy", "userName -_id");
});
export const jobModel = model("job", schema);
