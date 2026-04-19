const prisma = require("../utils/prisma-client");

exports.getAllFoodImages = async (req, res) => {
  try {
    const images = await prisma.foodImage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(images);
  } catch (err) {
    console.error("Get food images error:", err);
    res.status(500).json({ message: "Failed to fetch food images", error: err.message });
  }
};
