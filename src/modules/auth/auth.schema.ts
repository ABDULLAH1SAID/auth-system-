import Joi from "joi";
import { Gender } from "../../dB/models/user.model";

export const register = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  
  phone: Joi.string().pattern(/^\+?[0-9]{7,15}$/).optional(),
  address: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid(...Object.values(Gender)).optional(),
});

export const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const refreshToken = Joi.object({
  token: Joi.string().required(),
});

