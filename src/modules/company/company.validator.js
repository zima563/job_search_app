import joi from "joi";

const addCompanyVal = joi.object({
  companyName: joi.string().trim().required().min(2).max(15),
  description: joi.string().trim().required().min(10).max(1500),
  industry: joi.string().trim().required().min(2).max(30),
  address: joi.string().trim().required(),
  numberOfEmployees: joi.number().required().min(10).max(20),
  companyEmail: joi.string().trim().required(),
  companyHR: joi.string().length(24).hex(),
});

const updateCompanyVal = joi.object({
  id: joi.string().length(24).hex(),

  companyName: joi.string().trim().min(2).max(15),
  description: joi.string().trim().min(10).max(1500),
  industry: joi.string().trim().min(2).max(30),
  address: joi.string().trim(),
  numberOfEmployees: joi.number().min(10).max(20),
  companyEmail: joi.string().trim(),
  companyHR: joi.string().length(24).hex(),
});

export { addCompanyVal, updateCompanyVal };
