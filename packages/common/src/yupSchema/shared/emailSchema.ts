import * as yup from "yup";

export const emailSchema: (
  emailError: string,
  minError: string,
  maxError: string
) => any = (emailError: string, minError: string, maxError: string) =>
  yup
    .string()
    .min(7, minError)
    .max(255, maxError)
    .email(emailError)
    .required();
