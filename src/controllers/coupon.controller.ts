import { Request, Response } from "express";
// import prisma from "../utils/prisma-client.ts";
import prisma from "../utils/prisma-client";

export const validateCoupon = async (req: Request, res: Response): Promise<any> => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: "Coupon code is required" });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon code" });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ message: "This coupon is no longer active" });
        }

        if (coupon.expiry && new Date() > new Date(coupon.expiry)) {
            return res.status(400).json({ message: "This coupon has expired" });
        }

        return res.status(200).json({
            message: "Coupon applied successfully",
            discountType: coupon.discountType,
            value: coupon.value
        });
    } catch (error) {
        console.error("Coupon validation error:", error);
        return res.status(500).json({ message: "Failed to validate coupon" });
    }
};

export const createCoupon = async (req: Request, res: Response): Promise<any> => {
    try {
        const { code, discountType, value } = req.body;
        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discountType,
                value: parseFloat(value),
            }
        });
        return res.status(201).json(coupon);
    } catch (error) {
        return res.status(500).json({ message: "Error creating coupon", error });
    }
};