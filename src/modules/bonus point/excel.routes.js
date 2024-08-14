import express from "express";
import { createExcelSheet } from "./excel.controllers.js";
import { protectRoutes } from "../../middlewares/authentication.js";
import { allowedTo } from "../../middlewares/authorization.js";

const excelRouter = express.Router();

excelRouter
  .route("/createExcelSheet")
  .get(protectRoutes, allowedTo("Company_HR"), createExcelSheet);

export { excelRouter };
