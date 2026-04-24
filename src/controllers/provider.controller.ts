import { Request, Response } from "express";
import prisma from "../utils/prisma-client";

export const getAllProviders = async (req: Request, res: Response) => {
  try {
    const providers = await prisma.user.findMany({
      where: { role: "PROVIDER", status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        email: true,
        providerProfile: true,
      },
    });
    res.json(providers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getProviderById = async (req: Request, res: Response) => {
  try {
    const provider = await prisma.user.findUnique({
      where: { id: req.params.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        providerProfile: true,
        meals: {
          include: { category: true, reviews: true },
        },
      },
    }) as any;

    if (!provider || provider.meals === undefined) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(provider);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
