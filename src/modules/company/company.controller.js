import { applicationModel } from "../../../dataBases/models/application.model.js";
import { companyModel } from "../../../dataBases/models/company.model.js";
import { jobModel } from "../../../dataBases/models/job.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
// Add company
const addCompany = catchError(async (req, res, next) => {
  let company = new companyModel(req.body);
  company.companyHR = req.user._id;
  await company.save();
  res.status(200).json({ msg: "success", company });
});
// Update company data
const updateCompany = catchError(async (req, res, next) => {
  let company = await companyModel.findOneAndUpdate(
    { _id: req.params.id, companyHR: req.user._id },
    req.body,
    { new: true }
  );
  !company && next(new apiError("not company found", 404));
  company && res.json({ msg: "success", company });
});
// Delete company data
const deleteCompany = catchError(async (req, res, next) => {
  let company = await companyModel.findOneAndUpdate({
    _id: req.params.id,
    companyHR: req.user._id,
  },{
    isDeleted: true,
  },{new:true});
  !company && next(new apiError("not company found", 404));
  company && res.json({ msg: "success", company });
});
// Get company data
const getCompanyData = catchError(async (req, res, next) => {
  let company = await companyModel.findById(req.params.id);
  if(company.isDeleted) return next(new apiError("not company found", 404));
  !company && next(new apiError("not company found", 404));
  company && res.json({ msg: "success", company });
});
// Search for a company with a name.
const searchCompany = catchError(async (req, res, next) => {
  let countDocuments = await companyModel.countDocuments();
  let apiFeatures = new ApiFeatures(companyModel.find({}), req.query)
    .paginate(countDocuments)
    .search();
  const { mongooseQuery, paginationResult } = apiFeatures;
  let company = await mongooseQuery;
  const searchOfCompany = company.filter( company => company.isDeleted==false);
  res.json({ msg: "success", paginationResult, searchOfCompany });
});
// Get all applications for specific Jobs
const GetAllApplications = catchError(async (req, res, next) => {
  let apps = await applicationModel
    .find({ jobId: req.params.id })
    .populate("userId", "-_id");
  res.json({ msg: "sucess", apps });
});


export {
  addCompany,
  updateCompany,
  deleteCompany,
  getCompanyData,
  searchCompany,
  GetAllApplications,
};


