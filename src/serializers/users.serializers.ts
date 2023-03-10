import * as yup from "yup";
import { SchemaOf } from "yup";
import validator from "cpf-cnpj-validator";
const Joi = require("@hapi/joi").extend(validator);
import { IUserRequest, IUserRequestUpdate, IUserResponse } from "../interfaces/users.interfaces";
import { accountSchema } from "./balance.serializers";

const cpfSchema = Joi.document().cpf();

export const createUserSchema: SchemaOf<IUserRequest> = yup.object().shape({
  name: yup.string().max(150).required(),
  email: yup.string().email().max(150).required(),
  password: yup
    .string()
    .required("password is required")
    .matches(/[A-Z]/, "Must have at least 1 uppercase letter")
    .matches(/[a-z]/, "Must have at least 1 lowercase letter")
    .matches(/[(\d)]/, "Must have at least 1 number")
    .matches(/[!@#$%*()~^]/, "Must have at least 1 special character")
    .min(8, "Must be at least 8 digits long")
    .max(16, "Must be at most 16 digits long"),
  birthdate: yup
    .string()
    .transform((date) => date.replace(/[-]/g, "/"))
    .test("Date is Valid", "Date format is invalid, format is yyyy/mm/dd", (date) => {
      const insertDate = new Date(date);
      return !`${insertDate}`.toLowerCase().includes("invalid") && date.split("/")[0].length == 4;
    })
    .test("isValidBirthDay", "date must be after year 1900", (date) => {
      if (date) {
        const data = date!.split("/").map(Number);
        return data[0] > 1900;
      }
    })
    .test("isUnderAge", "client must be 18 years or older", (date) => {
      if (date) {
        const birthday = new Date(date);
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        return age >= 18;
      }
    })
    .required(),
  cpf: yup
    .string()
    .test("isValidCpf", "CPF number is not valid", (CPF) => {
      return !cpfSchema.validate(CPF).error;
    })
    .required(),
});

export const returnUserSchema: SchemaOf<IUserResponse> = yup.object().shape({
  id: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().required(),
  image: yup.string().nullable().notRequired(),
  birthdate: yup.string().required(),
  isActive: yup.boolean().required(),
  isAdmin: yup.boolean(),
  createdAt: yup.string().required(),
  updatedAt: yup.string().required(),
  account: accountSchema.required(),
});

export const updateUserSchema: SchemaOf<IUserRequestUpdate> = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  password: yup
    .string()
    .matches(/[A-Z]/, "Must have at least 1 uppercase letter")
    .matches(/[a-z]/, "Must have at least 1 lowercase letter")
    .matches(/[(\d)]/, "Must have at least 1 number")
    .matches(/[!@#$%*()~^]/, "Must have at least 1 special character")
    .min(8, "Must be at least 8 digits long")
    .max(16, "Must be at most 16 digits long"),
});
