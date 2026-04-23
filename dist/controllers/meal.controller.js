"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeal = exports.updateMeal = exports.getSingleMeal = exports.getMeals = exports.createMeal = void 0;
// import mealService from "../services/meal.service";
const validation_1 = require("../utils/validation");
const mealService = __importStar(require("../services/meal.service"));
// Create Meal
const createMeal = async (req, res) => {
    try {
        const { name, price, description, categoryId } = req.body;
        let image = req.body.image;
        if (req.file) {
            image = `/uploads/foods/${req.file.filename}`;
        }
        // Validation
        if (!name || !price || !description || !image || !categoryId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!(0, validation_1.validateName)(name)) {
            return res.status(400).json({ message: "Meal name must be at least 2 characters" });
        }
        if (!(0, validation_1.validatePrice)(price)) {
            return res.status(400).json({ message: "Price must be a positive number" });
        }
        const payload = { ...req.body, image, price: parseFloat(price) };
        const meal = await mealService.createMeal(req.user.userId, payload);
        res.status(201).json(meal);
    }
    catch (err) {
        console.error("Create meal error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.createMeal = createMeal;
// Get All Meals (supports ?categoryId=X&minPrice=Y&maxPrice=Z)
const getMeals = async (req, res) => {
    try {
        const { categoryId, minPrice, maxPrice } = req.query;
        const meals = await mealService.getMeals({ categoryId, minPrice, maxPrice });
        res.json(meals);
    }
    catch (err) {
        console.error("Get meals error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.getMeals = getMeals;
// Get Single Meal
const getSingleMeal = async (req, res) => {
    try {
        const meal = await mealService.getMealById(req.params.id);
        res.json(meal);
    }
    catch (err) {
        const status = err.message === "Meal not found" ? 404 : 500;
        console.error("Get single meal error:", err);
        res.status(status).json({ message: err.message });
    }
};
exports.getSingleMeal = getSingleMeal;
// Update Meal
const updateMeal = async (req, res) => {
    try {
        const { name, price, description, image, categoryId } = req.body;
        // Validation
        if (name && !(0, validation_1.validateName)(name)) {
            return res.status(400).json({ message: "Meal name must be at least 2 characters" });
        }
        if (price && !(0, validation_1.validatePrice)(price)) {
            return res.status(400).json({ message: "Price must be a positive number" });
        }
        const payload = { ...req.body };
        if (payload.price !== undefined) {
            payload.price = parseFloat(payload.price);
        }
        const meal = await mealService.updateMeal(req.params.id, payload);
        res.json(meal);
    }
    catch (err) {
        console.error("Update meal error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.updateMeal = updateMeal;
// Delete Meal
const deleteMeal = async (req, res) => {
    try {
        await mealService.deleteMeal(req.params.id);
        res.json({ message: "Meal deleted" });
    }
    catch (err) {
        console.error("Delete meal error:", err);
        res.status(500).json({ message: err.message });
    }
};
exports.deleteMeal = deleteMeal;
//# sourceMappingURL=meal.controller.js.map