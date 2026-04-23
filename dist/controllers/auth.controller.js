"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
const validation_1 = require("../utils/validation");
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!(0, validation_1.validateName)(name)) {
            return res.status(400).json({ message: "Name must be at least 2 characters" });
        }
        if (!(0, validation_1.validateEmail)(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!(0, validation_1.validatePassword)(password)) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        if (!(0, validation_1.validateRole)(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const existingUser = await prisma_client_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_client_1.default.user.create({
            data: { name, email, password: hashedPassword, role },
        });
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (!(0, validation_1.validateEmail)(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const user = await prisma_client_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (user.status === "BANNED") {
            return res.status(403).json({ message: "Your account has been suspended" });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};
exports.login = login;
const me = async (req, res) => {
    try {
        const user = await prisma_client_1.default.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Failed to get user", error: error.message });
    }
};
exports.me = me;
//# sourceMappingURL=auth.controller.js.map