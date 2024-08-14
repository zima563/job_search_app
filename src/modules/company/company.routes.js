import express from "express";
import { protectRoutes } from "../../middlewares/authentication.js";
import { allowedTo } from "../../middlewares/authorization.js";
import { validation } from "../../middlewares/validation.js";
import { addCompanyVal, updateCompanyVal } from "./company.validator.js";
import {
  GetAllApplications,
  addCompany,
  deleteCompany,
  getCompanyData,
  searchCompany,
  updateCompany,
} from "./company.controller.js";
import { companyExist } from "../../middlewares/companyExists.js";
import { paramsIdVal } from "../../utils/idValidator.js";
import { check_hr } from "../../middlewares/check_hr.js";

const companyRouter = express.Router();

companyRouter
  .route("/addCompany")
  .post(
    protectRoutes,
    allowedTo("Company_HR"),
    validation(addCompanyVal),
    companyExist,
    addCompany
  );
companyRouter
  .route("/applications/:id")
  .get(protectRoutes, allowedTo("Company_HR"),check_hr, GetAllApplications);
companyRouter
  .route("/:id")
  .get(
    protectRoutes,
    allowedTo("Company_HR"),
    validation(paramsIdVal),
    getCompanyData
  )
  .put(
    protectRoutes,
    allowedTo("Company_HR"),
    validation(updateCompanyVal),
    companyExist,
    updateCompany
  )
  .delete(
    protectRoutes,
    allowedTo("Company_HR"),
    validation(paramsIdVal),
    deleteCompany
  );

companyRouter
  .route("/")
  .get(protectRoutes, allowedTo("user", "Company_HR"), searchCompany);



export { companyRouter };
