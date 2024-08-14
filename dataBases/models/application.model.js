import mongoose from "mongoose";
import { model } from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema(
  {
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: "job",
      required: true
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true
    },
    date: Date,
    userTechSkills: [
      {
        type: String,
        trim: true,
        lowercase: true
      },
    ],
    userSoftSkills: [
      {
        type: String,
        trim: true,
        lowercase: true
      },
    ],
    userResume: {
      type: String,
    },
  },
  { timestamps: true }
);

schema.post("save", function () {
  this.populate("userId", "-_id");
});

export const applicationModel = model("application", schema);
