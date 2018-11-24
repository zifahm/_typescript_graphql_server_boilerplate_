import { ValidationError } from "yup";

export const formatYupErrors = (err: ValidationError) => {
  const errors: Array<{ path: string; message: string }> = [];
  err.inner.map(x => {
    errors.push({
      path: x.path,
      message: x.message
    });
  });

  return errors;
};
