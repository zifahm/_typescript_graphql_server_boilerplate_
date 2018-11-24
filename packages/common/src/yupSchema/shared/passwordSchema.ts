import * as yup from "yup";

export const passwordSchema: (minError: string, maxError?: string) => any = (
  minError: string,
  maxError: string | undefined
) =>
  yup
    .string()
    .min(3, minError)
    .max(255, maxError)
    .required();
