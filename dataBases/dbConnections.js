import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/job_search_app").then(() => {
    console.log("database connection");
  });
};
