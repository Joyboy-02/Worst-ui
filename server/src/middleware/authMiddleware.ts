import { Request, Response, NextFunction } from 'express';
import { supabase, isSupabaseConfigured, localDb } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    chaos_tolerance_score: number;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // Default fallback user for testing without friction if unauthenticated
  const fallbackUser = {
    id: '00000000-0000-0000-0000-000000000001',
    username: 'existential_farmer_99',
    chaos_tolerance_score: 42,
  };

  if (!token) {
    req.user = fallbackUser;
    return next();
  }

  // If using Supabase and a real JWT is provided
  if (isSupabaseConfigured && supabase && !token.startsWith('mock-token-')) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        req.user = fallbackUser;
        return next();
      }

      // Query profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      req.user = {
        id: user.id,
        username: profile?.username || user.email?.split('@')[0] || 'anonymous_sufferer',
        chaos_tolerance_score: profile?.chaos_tolerance_score ?? 100,
      };
      return next();
    } catch (err) {
      req.user = fallbackUser;
      return next();
    }
  }

  // Local/mock token support: mock-token-<userId> or base64
  if (token.startsWith('mock-token-')) {
    const userId = token.replace('mock-token-', '');
    const profile = await localDb.getProfile(userId);
    if (profile) {
      req.user = {
        id: profile.id,
        username: profile.username,
        chaos_tolerance_score: profile.chaos_tolerance_score,
      };
    } else {
      req.user = fallbackUser;
    }
    return next();
  }

  req.user = fallbackUser;
  next();
};
