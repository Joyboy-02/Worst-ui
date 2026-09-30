export interface CropAdvisoryData {
  cropHealthScore: number;
  primaryDiagnosis: string;
  actionableRecommendations: string[];
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH' | 'CATASTROPHIC';
}

export interface AdvisoryGenerationResponse {
  status: string;
  consultantDisgustLevel: number;
  existentialDreadIndex: string;
  metadataWrapper: {
    epochEntropy: number;
    soilNihilismVector: [string, string];
    warning: string;
  };
  advisoryId: string;
  data: CropAdvisoryData;
}

export interface StoredAdvisory {
  id: string;
  user_id: string;
  crop_name: string;
  soil_ph: number;
  npk_status: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  ai_raw_response: string;
  ai_parsed?: CropAdvisoryData;
  frustration_index: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  chaos_tolerance_score: number;
}
