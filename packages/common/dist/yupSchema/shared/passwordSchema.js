"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yup = require("yup");
exports.passwordSchema = function (minError, maxError) {
    return yup
        .string()
        .min(3, minError)
        .max(255, maxError)
        .required();
};
//# sourceMappingURL=passwordSchema.js.map