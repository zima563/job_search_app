import joi from "joi";

const addJobVal = joi.object({
  jobTitle: joi.string().trim().required().min(2).max(30),
  jobLocation: joi
    .string()
    .pattern(/^(onsite|remotely|hybrid)$/)
    .required(),
  workingTime: joi
    .string()
    .pattern(/^(part-time|full-time)$/)
    .required(),
  seniorityLevel: joi
    .string()
    .pattern(/^(Junior|Mid-Level|Senior|Team-Lead|CTO)$/)
    .required(),
  jobDescription: joi.string().trim().required().min(10).max(100),
  technicalSkills: joi.array().items(joi.string().trim()).required(),
  softSkills: joi.array().items(joi.string().trim()).required(),
});

const UpdateJobVal = joi.object({
  id: joi.string().length(24).hex().required(),

  jobTitle: joi.string().trim().min(2).max(30),
  jobLocation: joi.string().pattern(/^(onsite|remotely|hybrid)$/),
  workingTime: joi.string().pattern(/^(part-time|full-time)$/),
  seniorityLevel: joi
    .string()
    .pattern(/^(Junior|Mid-Level|Senior|Team-Lead|CTO)$/),
  jobDescription: joi.string().trim().min(10).max(100),
  technicalSkills: joi.array().items(joi.string().trim()),
  softSkills: joi.array().items(joi.string().trim()),
  addedBy: joi.string().length(24).hex(),
  company: joi.string().length(24).hex(),
});

const getSpecificJobVal = joi.object({
  companyName: joi.string().trim().required(),
});

const ApplyToJobVal = joi.object({
  jobId: joi.string().length(24).hex().required(),
  userTechSkills: joi.string().required().trim(),
  userSoftSkills: joi.string().required().trim(),
  userResume: joi
    .object({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().valid("application/pdf").required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
      size: joi.number().max(5242880).required(),
    })
    .required(),
});

export { addJobVal, getSpecificJobVal, ApplyToJobVal, UpdateJobVal };
