"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRageClick = void 0;
const advisorySchema_1 = require("../schemas/advisorySchema");
const supabase_1 = require("../config/supabase");
const logRageClick = async (req, res) => {
    try {
        const parsed = advisorySchema_1.rageClickSchema.safeParse(req.body);
        const elementId = parsed.success ? parsed.data.elementId : 'unidentified_button_of_rage';
        const userId = req.user?.id || null;
        if (supabase_1.isSupabaseConfigured && supabase_1.supabase) {
            await supabase_1.supabase.from('rage_clicks').insert({
                user_id: userId,
                element_id: elementId,
            });
        }
        else {
            await supabase_1.localDb.createRageClick(elementId, userId);
        }
        const totalRage = await supabase_1.localDb.getRageClicksCount();
        res.status(200).json({
            status: "recorded",
            empathyLevel: 0,
            systemObservation: "Your rapid clicking has been fed into the soil nutrient model as pure kinetic despair.",
            elementTargeted: elementId,
            totalFrustrationVector: totalRage,
        });
    }
    catch (err) {
        res.status(200).json({
            status: "recorded",
            empathyLevel: 0,
            fallbackNote: "Even the telemetry server lacks sympathy.",
        });
    }
};
exports.logRageClick = logRageClick;
