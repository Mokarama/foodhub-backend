// Backend validation utility functions

export const validateEmail = (email: any): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: any): boolean => {
    return password && password.length >= 6;
};

export const validateName = (name: any): boolean => {
    return name && name.trim().length >= 2;
};

export const validatePrice = (price: any): boolean => {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
};

export const validateRating = (rating: any): boolean => {
    const num = parseInt(rating);
    return num >= 1 && num <= 5;
};

export const validateQuantity = (quantity: any): boolean => {
    const num = parseInt(quantity);
    return !isNaN(num) && num > 0;
};

export const validateAddress = (address: any): boolean => {
    return address && address.trim().length >= 5;
};

export const validateOrderStatus = (status: any): boolean => {
    const validStatuses = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];
    return validStatuses.includes(status);
};

export const validateRole = (role: any): boolean => {
    const validRoles = ["CUSTOMER", "PROVIDER", "ADMIN"];
    return validRoles.includes(role);
};