"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviderById = exports.getAllProviders = void 0;
const prisma_client_1 = __importDefault(require("../utils/prisma-client"));
const getAllProviders = async (req, res) => {
    try {
        const providers = await prisma_client_1.default.user.findMany({
            where: { role: "PROVIDER", status: "ACTIVE" },
            select: {
                id: true,
                name: true,
                email: true,
                providerProfile: true,
            },
        });
        res.json(providers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAllProviders = getAllProviders;
const getProviderById = async (req, res) => {
    try {
        const provider = await prisma_client_1.default.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                name: true,
                email: true,
                providerProfile: true,
                meals: {
                    include: { category: true, reviews: true },
                },
            },
        });
        if (!provider || provider.meals === undefined) {
            return res.status(404).json({ message: "Provider not found" });
        }
        res.json(provider);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getProviderById = getProviderById;
//# sourceMappingURL=provider.controller.js.map