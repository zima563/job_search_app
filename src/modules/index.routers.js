import { globalError } from "../middlewares/globalError.js";
import { apiError } from "../utils/apiError.js";
import { excelRouter } from "./bonus point/excel.routes.js";
import { companyRouter } from "./company/company.routes.js";
import { jobRouter } from "./job/job.routes.js";
import { userRouter } from "./user/user.routes.js";
import axios from "axios"

export const bootStrap = (app) => {


  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/companies", companyRouter);
  app.use("/api/v1/jobs", jobRouter);
  app.use("/api/v1/app", excelRouter);

  app.use("*", (req, res, next) => {
    next(new apiError(`not found endPoint : ${req.originalUrl}`, 404));
  });
  app.use(globalError);
};
