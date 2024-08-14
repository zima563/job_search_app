import { companyModel } from "../../dataBases/models/company.model.js";
import { apiError } from "../utils/apiError.js";

export const companyExist = async (req, res, next) => {
  const { companyName , companyEmail } = req.body
  
  let companyExist = await companyModel.findOne({
    $or: [{ companyName },{ companyEmail }]
  })
  if (companyExist)
     return next(new apiError("company already exists"));
  next();
};
