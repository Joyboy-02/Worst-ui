import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { rageClickSchema } from '../schemas/advisorySchema';
import { supabase, isSupabaseConfigured, localDb } from '../config/supabase';

export const logRageClick = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parsed = rageClickSchema.safeParse(req.body);
    const elementId = parsed.success ? parsed.data.elementId : 'unidentified_button_of_rage';
    const userId = req.user?.id || null;

    if (isSupabaseConfigured && supabase) {
      await supabase.from('rage_clicks').insert({
        user_id: userId,
        element_id: elementId,
      });
    } else {
      await localDb.createRageClick(elementId, userId);
    }

    const totalRage = await localDb.getRageClicksCount();

    res.status(200).json({
      status: "recorded",
      empathyLevel: 0,
      systemObservation: "Your rapid clicking has been fed into the soil nutrient model as pure kinetic despair.",
      elementTargeted: elementId,
      totalFrustrationVector: totalRage,
    });
  } catch (err: any) {
    res.status(200).json({
      status: "recorded",
      empathyLevel: 0,
      fallbackNote: "Even the telemetry server lacks sympathy.",
    });
  }
};
