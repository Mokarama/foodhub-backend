"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.createCategory = void 0;
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
const createCategory = async (req, res) => {
    try {
        const category = await prisma_client_1.default.category.create({
            data: { name: req.body.name },
        });
        res.status(201).json(category);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    const categories = await prisma_client_1.default.category.findMany();
    res.json(categories);
};
exports.getCategories = getCategories;
//# sourceMappingURL=category.controller.js.map