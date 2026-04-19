"use strict";
// Backend validation utility functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRole = exports.validateOrderStatus = exports.validateAddress = exports.validateQuantity = exports.validateRating = exports.validatePrice = exports.validateName = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePassword = (password) => {
    return password && password.length >= 6;
};
exports.validatePassword = validatePassword;
const validateName = (name) => {
    return name && name.trim().length >= 2;
};
exports.validateName = validateName;
const validatePrice = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
};
exports.validatePrice = validatePrice;
const validateRating = (rating) => {
    const num = parseInt(rating);
    return num >= 1 && num <= 5;
};
exports.validateRating = validateRating;
const validateQuantity = (quantity) => {
    const num = parseInt(quantity);
    return !isNaN(num) && num > 0;
};
exports.validateQuantity = validateQuantity;
const validateAddress = (address) => {
    return address && address.trim().length >= 5;
};
exports.validateAddress = validateAddress;
const validateOrderStatus = (status) => {
    const validStatuses = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];
    return validStatuses.includes(status);
};
exports.validateOrderStatus = validateOrderStatus;
const validateRole = (role) => {
    const validRoles = ["CUSTOMER", "PROVIDER", "ADMIN"];
    return validRoles.includes(role);
};
exports.validateRole = validateRole;
//# sourceMappingURL=validation.js.map