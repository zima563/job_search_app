import { applicationModel } from "../../../dataBases/models/application.model.js";
import { companyModel } from "../../../dataBases/models/company.model.js";
import { jobModel } from "../../../dataBases/models/job.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";
import { v2 as cloudinary } from "cloudinary";
import { ApiFeatures } from "../../utils/apiFeatures.js";

cloudinary.config({
  cloud_name: "dnrfbxmc3",
  api_key: "761547345853599",
  api_secret: "ygNBoAdLImnpdDE7EnecgqTyTM0",
});
//Add Job
const addJob = catchError(async (req, res, next) => {
  let job = new jobModel(req.body);
  job.addedBy = req.user._id;
  await job.save();
  res.status(200).json({ msg: "success", job });
});
//Update Job
const UpdateJob = catchError(async (req, res, next) => {
  let job = await jobModel.findOneAndUpdate(
    { _id: req.params.id, addedBy: req.user._id },
    req.body,
    { new: true }
  );
  !job && next(new apiError("not job found", 404));
  job && res.json({ msg: "success", job });
});
//Delete Job
const deleteJob = catchError(async (req, res, next) => {
  let job = await jobModel.findOneAndUpdate({
    _id: req.params.id,
    addedBy: req.user._id,
  }, {
    isDeleted: true,
  }, {
    new: true
  });
  !job && next(new apiError("not job found", 404));
  job && res.json({ msg: "success", job });
});
//Get all Jobs with their company’s information
const getAllJobs = catchError(async (req, res, next) => {
  let jobs = await jobModel.find({ isDeleted: false });
  res.status(200).json({ msg: "success", jobs });
});
//Get all Jobs for a specific company.
const getSpecificJob = catchError(async (req, res, next) => {
  // let company = await companyModel.find({ companyName: req.query.companyName }).populate([{ path: "companyHR", populate: [{ path: 'Jobs' }] }])
  let company = await companyModel.aggregate([
    { $match: { companyName: req.query.companyName } }, {
      $lookup: {
        from: "jobs",
        foreignField: 'addedBy',
        localField: 'companyHR',
        as: "jobs"
      }
    }, 
    { $project: {  jobs: 1 } }
  ]);
  return res.json({ company })
});
//Get all Jobs that match the following filters
const getAllJobsWithFilter = catchError(async (req, res, next) => {
  let countDocuments = await jobModel.countDocuments();
  let apiFeatures = new ApiFeatures(jobModel.find({isDeleted:false}), req.query)
    .paginate(countDocuments)
    .filter();
  const { mongooseQuery, paginationResult } = apiFeatures;
  let job = await mongooseQuery;
  res.json({ msg: "success", paginationResult, job });
});
//Apply to Job
const ApplyToJob = catchError(async (req, res, next) => {
  cloudinary.uploader.upload(req.file.path, async (error, result) => {
    let job = await jobModel.findById(req.body.jobId);
    if (!job) return next(new apiError("not job found", 404));
    let app = new applicationModel(req.body);
    app.userResume = result.secure_url;
    app.date = Date.now();
    app.userId = req.user._id;
    await app.save();
    res.status(200).json({ msg: "success", app });
  });
});

export {
  addJob,
  UpdateJob,
  deleteJob,
  getAllJobs,
  getSpecificJob,
  getAllJobsWithFilter,
  ApplyToJob,
};
