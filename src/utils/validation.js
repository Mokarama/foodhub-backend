// Backend validation utility functions

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateName = (name) => {
    return name && name.trim().length >= 2;
};

const validatePrice = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
};

const validateRating = (rating) => {
    const num = parseInt(rating);
    return num >= 1 && num <= 5;
};

const validateQuantity = (quantity) => {
    const num = parseInt(quantity);
    return !isNaN(num) && num > 0;
};

const validateAddress = (address) => {
    return address && address.trim().length >= 5;
};

const validateOrderStatus = (status) => {
    const validStatuses = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];
    return validStatuses.includes(status);
};

const validateRole = (role) => {
    const validRoles = ["CUSTOMER", "PROVIDER", "ADMIN"];
    return validRoles.includes(role);
};

module.exports = {
    validateEmail,
    validatePassword,
    validateName,
    validatePrice,
    validateRating,
    validateQuantity,
    validateAddress,
    validateOrderStatus,
    validateRole,
};
