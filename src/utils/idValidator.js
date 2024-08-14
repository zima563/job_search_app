import Joi from "joi";

export const paramsIdVal = Joi.object({
  id: Joi.string().length(24).hex().required(),
});
