"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yup = require("yup");
var emailSchema_1 = require("./shared/emailSchema");
var passwordSchema_1 = require("./shared/passwordSchema");
exports.passwordNotLongEnough = "password must be at least 8 characters long";
exports.invalidEmail = "must be a valid email";
exports.invalidLogin = "invalid email or password";
exports.registerSchema = yup.object().shape({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    email: emailSchema_1.emailSchema(exports.invalidEmail, exports.invalidEmail, exports.invalidEmail),
    password: passwordSchema_1.passwordSchema(exports.passwordNotLongEnough)
});
exports.loginSchema = yup.object().shape({
    email: emailSchema_1.emailSchema(exports.invalidLogin, exports.invalidLogin, exports.invalidLogin),
    password: passwordSchema_1.passwordSchema(exports.invalidLogin, exports.invalidLogin)
});
exports.changePasswordSchema = yup.object().shape({
    newPassword: passwordSchema_1.passwordSchema(exports.passwordNotLongEnough)
});
//# sourceMappingURL=user.js.map