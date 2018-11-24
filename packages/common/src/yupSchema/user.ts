import * as yup from "yup";
import { emailSchema } from "./shared/emailSchema";
import { passwordSchema } from "./shared/passwordSchema";

export const passwordNotLongEnough =
  "password must be at least 8 characters long";
export const invalidEmail = "must be a valid email";
export const invalidLogin = "invalid email or password";

export const registerSchema = yup.object().shape({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  email: emailSchema(invalidEmail, invalidEmail, invalidEmail),
  password: passwordSchema(passwordNotLongEnough)
});

export const loginSchema = yup.object().shape({
  email: emailSchema(invalidLogin, invalidLogin, invalidLogin),
  password: passwordSchema(invalidLogin, invalidLogin)
});
export const changePasswordSchema = yup.object().shape({
  newPassword: passwordSchema(passwordNotLongEnough)
})