"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const provider_controller_1 = require("../controllers/provider.controller");
router.get("/", provider_controller_1.getAllProviders);
router.get("/:id", provider_controller_1.getProviderById);
exports.default = router;
//# sourceMappingURL=provider.routes.js.map