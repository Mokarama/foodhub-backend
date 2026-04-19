const express = require("express");
const router = express.Router();
const { getAllFoodImages } = require("../controllers/foodImage.controller");

router.get("/images", getAllFoodImages);

module.exports = router;
