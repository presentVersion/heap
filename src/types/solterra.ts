export type ThemeMode = 'dark-obsidian' | 'midnight-blue' | 'emerald-matrix' | 'slate-cyber';

export type AssetType = 
  | 'solar_flower'
  | 'smart_pole'
  | 'solar_canopy'
  | 'ev_station'
  | 'bio_junction'
  | 'battery_system'
  | 'rooftop_solar'
  | 'wind_turbine';

export type AssetCategory = 
  | 'all'
  | 'solar'
  | 'storage'
  | 'mobility'
  | 'bio'
  | 'water'
  | 'smart_poles';

export type AssetStatus = 'active' | 'warning' | 'critical' | 'offline';

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: AssetType;
  category: AssetCategory;
  status: AssetStatus;
  health: number; // 0 to 100
  coordinates: [number, number]; // [lng, lat]
  altitude?: number;
  rotation?: number;
  scale?: number;
  zone: string; // e.g., 'Zone 01', 'Zone 04'
  zoneName: string;
  capacityKw: number;
  currentPowerKw: number;
  todayGenerationKwh: number;
  efficiency: number; // percentage
  co2AvoidedKg: number;
  
  // Specific sensor/telemetry attributes
  sunExposurePercent?: number;
  panelTemperature?: number; // °C
  trackingAngle?: number; // degrees
  batteryStorageKwh?: number;
  batterySocPercent?: number;
  evPlugsAvailable?: number;
  evPlugsTotal?: number;
  aqi?: number;
  biomassKg?: number;
  waterLevelPercent?: number;
  installedDate: string;
  modelUrl?: string;
  isProposed?: boolean; // Highlighted for What-If Scenarios
}

export interface CityZone {
  id: string;
  name: string;
  renewablePercent: number;
  generationMwh: number;
  health: number;
  populationDensity: number;
  weaknessScore: number; // 0 to 10
  coordinates: [number, number][];
}

export interface TelemetryState {
  totalGenerationMwh: number;
  totalConsumptionMwh: number;
  renewableSharePercent: number;
  storageLevelMwh: number;
  storageCapacityMwh: number;
  storageSocPercent: number;
  co2AvoidedTons: number;
  activeAssetsCount: number;
  totalAssetsCount: number;
  warningAssetsCount: number;
  criticalAssetsCount: number;
  offlineAssetsCount: number;
  avgHealthScore: number;
  peakDemandMw: number;
  gridImportMw: number;
  gridExportMw: number;
  evChargingLoadMw: number;
  cityScore: number; // 0 - 100
  energyFlow: {
    solarKw: number;
    batteryKw: number;
    buildingsKw: number;
    evChargingKw: number;
    gridKw: number;
  };
  energyMix: {
    solarMwh: number;
    biomassMwh: number;
    windMwh: number;
    hydroMwh: number;
    gridMwh: number;
  };
}

export type WeatherScenarioType = 'optimistic' | 'average' | 'pessimistic';

export interface SimulationConfig {
  simulatedHour: number; // 0.0 to 24.0 (e.g. 12.5 = 12:30 PM)
  isPlaying: boolean;
  speedMultiplier: number; // 1x, 2x, 5x, 10x
  targetDate: string;
  weatherScenario: WeatherScenarioType;
  cloudCoverPercent: number;
  ambientTemperature: number;
  aqi: number;
  urbanGrowth: { [zoneId: string]: number };
  gridConstraints: {
    microgridIslanding: boolean;
    peakShaving: boolean;
    curtailmentPrevention: boolean;
  };
}

export interface MaintenanceTask {
  id: string;
  assetId: string;
  assetName: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  detectedTime: string;
  recommendedAction: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved';
  assignedTo?: string;
  estimatedHours: number;
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  assetId?: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface ProposedScenario {
  id: string;
  name: string;
  targetDate: string;
  proposedAssets: InfrastructureAsset[];
  projectedCityScore: number;
  projectedRenewableShare: number;
  projectedCo2Reduction: number;
  estimatedEnergyCost: number;
  systemWeaknessMw: number;
  isActive: boolean;
}

export interface CommunityProject {
  id: string;
  name: string;
  category: string;
  description: string;
  membersCount: number;
  energyGeneratedMwh: number;
  waterSavedLiters: number;
  progressPercent: number;
  status: 'active' | 'upcoming' | 'completed';
  organizer: string;
  location: string;
  badge: string;
}

export type ActivePage = 
  | 'citytwin'
  | 'analytics'
  | 'assets'
  | 'simulation'
  | 'maintenance'
  | 'copilot'
  | 'reports'
  | 'community'
  | 'settings';
