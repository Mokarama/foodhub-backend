const prisma = require("../utils/prisma-client");

exports.createCategory = async (req, res) => {
    try {
        const category = await prisma.category.create({
            data: { name: req.body.name },
        });
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCategories = async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json(categories);
};