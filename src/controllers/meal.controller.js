const mealService = require("../services/meal.service");
const { validatePrice, validateName } = require("../utils/validation");

// Create Meal
exports.createMeal = async (req, res) => {
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

    if (!validateName(name)) {
      return res.status(400).json({ message: "Meal name must be at least 2 characters" });
    }

    if (!validatePrice(price)) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    const payload = { ...req.body, image };
    const meal = await mealService.createMeal(req.user.userId, payload);
    res.status(201).json(meal);
  } catch (err) {
    console.error("Create meal error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get All Meals (supports ?categoryId=X&minPrice=Y&maxPrice=Z)
exports.getMeals = async (req, res) => {
  try {
    const { categoryId, minPrice, maxPrice } = req.query;
    const meals = await mealService.getMeals({ categoryId, minPrice, maxPrice });
    res.json(meals);
  } catch (err) {
    console.error("Get meals error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get Single Meal
exports.getSingleMeal = async (req, res) => {
  try {
    const meal = await mealService.getMealById(req.params.id);
    res.json(meal);
  } catch (err) {
    const status = err.message === "Meal not found" ? 404 : 500;
    console.error("Get single meal error:", err);
    res.status(status).json({ message: err.message });
  }
};

// Update Meal
exports.updateMeal = async (req, res) => {
  try {
    const { name, price, description, image, categoryId } = req.body;

    // Validation
    if (name && !validateName(name)) {
      return res.status(400).json({ message: "Meal name must be at least 2 characters" });
    }

    if (price && !validatePrice(price)) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    const meal = await mealService.updateMeal(req.params.id, req.body);
    res.json(meal);
  } catch (err) {
    console.error("Update meal error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete Meal
exports.deleteMeal = async (req, res) => {
  try {
    await mealService.deleteMeal(req.params.id);
    res.json({ message: "Meal deleted" });
  } catch (err) {
    console.error("Delete meal error:", err);
    res.status(500).json({ message: err.message });
  }
};
