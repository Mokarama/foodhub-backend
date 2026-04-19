import { Request, Response } from "express";
import prisma from "../utils/prisma-client";

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await prisma.category.create({
            data: { name: req.body.name },
        });
        res.status(201).json(category);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
    const categories = await prisma.category.findMany();
    res.json(categories);
};