"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "Forbidden: Access denied",
                });
            }
            next();
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
};
exports.default = roleMiddleware;
//# sourceMappingURL=role.middleware.js.map