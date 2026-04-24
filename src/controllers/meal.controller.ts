import { Request, Response } from "express";
// import mealService from "../services/meal.service";

import { validatePrice, validateName } from "../utils/validation";
import * as mealService from '../services/meal.service';
import { uploadBufferToCloudinary } from "../utils/cloudinary";

// Create Meal
export const createMeal = async (req: any, res: Response): Promise<any> => {
  try {
    const { name, price, description, categoryId } = req.body;
    let image = req.body.image;

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(req.file.buffer);
      image = uploadResult.secure_url;
    }

    // Validation
    if (!name || !price || !description || !image || !categoryId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validateName(name)) {
      return res.status(400).json({ message: "Meal name must be at least 2 characters" });
    }

    if (!validatePrice(price)) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    const payload = { ...req.body, image, price: parseFloat(price) };
    const meal = await mealService.createMeal(req.user.userId, payload);
    res.status(201).json(meal);
  } catch (err: any) {
    console.error("Create meal error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get All Meals (supports ?categoryId=X&minPrice=Y&maxPrice=Z)
export const getMeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId, minPrice, maxPrice } = req.query;
    const meals = await mealService.getMeals({ categoryId, minPrice, maxPrice });
    res.json(meals);
  } catch (err: any) {
    console.error("Get meals error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get Single Meal
export const getSingleMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const meal = await mealService.getMealById(req.params.id);
    res.json(meal);
  } catch (err: any) {
    const status = err.message === "Meal not found" ? 404 : 500;
    console.error("Get single meal error:", err);
    res.status(status).json({ message: err.message });
  }
};

// Update Meal
export const updateMeal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, price, description, categoryId } = req.body;
    let image = req.body.image;

    if ((req as any).file) {
      const uploadResult = await uploadBufferToCloudinary((req as any).file.buffer);
      image = uploadResult.secure_url;
    }

    // Validation
    if (name && !validateName(name)) {
      return res.status(400).json({ message: "Meal name must be at least 2 characters" });
    }

    if (price && !validatePrice(price)) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    const payload = { ...req.body };
    if (image) {
      payload.image = image;
    }
    if (payload.price !== undefined) {
      payload.price = parseFloat(payload.price);
    }
    const meal = await mealService.updateMeal(req.params.id, payload);
    res.json(meal);
  } catch (err: any) {
    console.error("Update meal error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete Meal
export const deleteMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    await mealService.deleteMeal(req.params.id);
    res.json({ message: "Meal deleted" });
  } catch (err: any) {
    console.error("Delete meal error:", err);
    res.status(500).json({ message: err.message });
  }
};