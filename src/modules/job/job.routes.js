import express from "express";
import { protectRoutes } from "../../middlewares/authentication.js";
import { allowedTo } from "../../middlewares/authorization.js";
import { validate } from "uuid";
import { validation } from "../../middlewares/validation.js";
import {
  ApplyToJobVal,
  UpdateJobVal,
  addJobVal,
  getSpecificJobVal,
} from "./job.validators.js";
import {
  ApplyToJob,
  UpdateJob,
  addJob,
  deleteJob,
  getAllJobs,
  getAllJobsWithFilter,
  getSpecificJob,
} from "./job.controller.js";
import { paramsIdVal } from "../../utils/idValidator.js";
import { uploadSingleFile } from "../services/fileUpload/upload.js";
import { applicationExist } from "../../middlewares/applicationExist.js";

const jobRouter = express.Router();

jobRouter
  .route("/addJob")
  .post(protectRoutes, allowedTo("Company_HR"), validation(addJobVal), addJob);
jobRouter
  .route("/getAllJobs")
  .get(protectRoutes, allowedTo("user", "Company_HR"), getAllJobs);
jobRouter
  .route("/getSpecificJob")
  .get(
    protectRoutes,
    allowedTo("user", "Company_HR"),
    // validation(getSpecificJobVal),
    getSpecificJob
  );
jobRouter
  .route("/getAllJobsWithFilter")
  .get(protectRoutes, allowedTo("user", "Company_HR"), getAllJobsWithFilter);
jobRouter
  .route("/:id")
  .put(
    protectRoutes,
    allowedTo("Company_HR"),
    validation(UpdateJobVal),
    UpdateJob
  )
  .delete(
    protectRoutes,
    allowedTo("Company_HR"),
    validation(paramsIdVal),
    deleteJob
  );

jobRouter.route("/ApplyToJob").post(
  protectRoutes,
  allowedTo("user"),
  uploadSingleFile("resume"),
  validation(ApplyToJobVal),
  // applicationExist, this middleware in otherwise we want to apply once for one job
  ApplyToJob
);

export { jobRouter };
