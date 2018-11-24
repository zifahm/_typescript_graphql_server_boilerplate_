import * as yup from "yup";
export declare const passwordNotLongEnough = "password must be at least 8 characters long";
export declare const invalidEmail = "must be a valid email";
export declare const invalidLogin = "invalid email or password";
export declare const registerSchema: yup.ObjectSchema<{}>;
export declare const loginSchema: yup.ObjectSchema<{}>;
export declare const changePasswordSchema: yup.ObjectSchema<{}>;
