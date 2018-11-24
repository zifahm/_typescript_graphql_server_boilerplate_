"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yup = require("yup");
exports.emailSchema = function (emailError, minError, maxError) {
    return yup
        .string()
        .min(7, minError)
        .max(255, maxError)
        .email(emailError)
        .required();
};
//# sourceMappingURL=emailSchema.js.map