"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captchaVerifySchema = exports.rageClickSchema = exports.advisorySchema = void 0;
const zod_1 = require("zod");
exports.advisorySchema = zod_1.z.object({
    cropName: zod_1.z.string().min(2, {
        message: "Crop name must be at least 2 characters long, or else the soil gods will be displeased and strike your fields with blight.",
    }),
    soilPh: zod_1.z.coerce.number().min(0, {
        message: "pH cannot be negative unless you're farming in an active volcano or battery acid.",
    }).max(14, {
        message: "pH cannot exceed 14. Even extraterrestrial crystalline moss cannot survive beyond 14.",
    }),
    npk: zod_1.z.object({
        nitrogen: zod_1.z.coerce.number().positive({
            message: "Nitrogen must be greater than zero. Soil without nitrogen is merely crushed nihilism.",
        }),
        phosphorus: zod_1.z.coerce.number().positive({
            message: "Phosphorus must be greater than zero. Plants require ATP to experience agony.",
        }),
        potassium: zod_1.z.coerce.number().positive({
            message: "Potassium must be greater than zero. Osmotic cellular balance cannot run on good intentions alone.",
        }),
    }),
});
exports.rageClickSchema = zod_1.z.object({
    elementId: zod_1.z.string().min(1, { message: "An element must be identified for suffering calibration." }),
    userId: zod_1.z.string().optional(),
});
exports.captchaVerifySchema = zod_1.z.object({
    solution: zod_1.z.string(),
    challengeId: zod_1.z.string(),
});
