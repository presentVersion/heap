import { 
  InfrastructureAsset, 
  SimulationConfig, 
  TelemetryState, 
  ProposedScenario,
  CityZone
} from '../types/solterra';

/**
 * Deterministic Solar Irradiance Factor (0.0 to 1.0) based on simulated hour (0-24)
 * Sunrise: 06:00, Peak: 12:30, Sunset: 18:30
 */
export function calculateSolarIrradianceFactor(hour: number, cloudCoverPercent: number): number {
  if (hour < 5.8 || hour > 18.5) return 0;
  
  // Sine curve normalized between sunrise and sunset
  const normalizedTime = (hour - 5.8) / (18.5 - 5.8);
  const rawIrradiance = Math.sin(normalizedTime * Math.PI);
  
  // Cloud cover attenuation (at 100% cloud cover, 25% diffuse light still reaches)
  const cloudAttenuation = 1 - (cloudCoverPercent / 100) * 0.75;
  
  return Math.max(0, Math.pow(rawIrradiance, 1.15) * cloudAttenuation);
}

/**
 * City consumption profile for Kurnool (MW)
 * Base night load -> morning commute ramp -> afternoon AC peak -> evening residential peak
 */
export function calculateCityConsumptionMw(hour: number, tempCelsius: number): number {
  const baseLoad = 120; // MW
  
  // Diurnal factors
  let timeFactor = 0;
  if (hour >= 0 && hour < 6) {
    timeFactor = 0.15 * Math.cos((hour / 6) * Math.PI * 0.5);
  } else if (hour >= 6 && hour < 12) {
    timeFactor = 0.4 + 0.35 * Math.sin(((hour - 6) / 6) * Math.PI * 0.5);
  } else if (hour >= 12 && hour < 17) {
    // Afternoon cooling peak
    const coolingDemand = Math.max(0, (tempCelsius - 24) * 0.03);
    timeFactor = 0.75 + coolingDemand + 0.1 * Math.sin(((hour - 12) / 5) * Math.PI);
  } else if (hour >= 17 && hour < 22) {
    // Evening residential peak
    timeFactor = 0.92 + 0.08 * Math.sin(((hour - 17) / 5) * Math.PI);
  } else {
    timeFactor = 0.45 * Math.cos(((hour - 22) / 2) * Math.PI * 0.5);
  }
  
  return +(baseLoad + timeFactor * 115).toFixed(1);
}

/**
 * Kurnool Initial Geographic Baseline Infrastructure Assets
 */
export const INITIAL_ASSETS: InfrastructureAsset[] = [
  {
    id: 'SF-042',
    name: 'Solar Flower',
    type: 'solar_flower',
    category: 'solar',
    status: 'active',
    health: 98,
    coordinates: [78.0373, 15.8281],
    altitude: 0,
    rotation: 45,
    scale: 1.0,
    zone: 'Zone 04',
    zoneName: 'Residential South',
    capacityKw: 5.2,
    currentPowerKw: 4.72,
    todayGenerationKwh: 18.42,
    efficiency: 91.4,
    co2AvoidedKg: 8.7,
    sunExposurePercent: 87,
    panelTemperature: 38.6,
    trackingAngle: 24,
    installedDate: 'Apr 12, 2026'
  },
  {
    id: 'SP-118',
    name: 'Smart Pole',
    type: 'smart_pole',
    category: 'smart_poles',
    status: 'active',
    health: 96,
    coordinates: [78.0425, 15.8340],
    altitude: 0,
    rotation: 12,
    scale: 1.0,
    zone: 'Zone 02',
    zoneName: 'Main Arterial Road',
    capacityKw: 3.1,
    currentPowerKw: 2.85,
    todayGenerationKwh: 12.1,
    efficiency: 89.0,
    co2AvoidedKg: 5.4,
    batteryStorageKwh: 8.5,
    batterySocPercent: 72,
    aqi: 38,
    installedDate: 'Feb 18, 2026'
  },
  {
    id: 'SC-021',
    name: 'Solar Canopy',
    type: 'solar_canopy',
    category: 'solar',
    status: 'active',
    health: 94,
    coordinates: [78.0310, 15.8220],
    altitude: 0,
    rotation: 90,
    scale: 1.0,
    zone: 'Zone 01',
    zoneName: 'Transit Hub Parking',
    capacityKw: 12.4,
    currentPowerKw: 11.2,
    todayGenerationKwh: 42.8,
    efficiency: 89.6,
    co2AvoidedKg: 20.3,
    sunExposurePercent: 92,
    panelTemperature: 41.2,
    trackingAngle: 0,
    installedDate: 'Jan 10, 2026'
  },
  {
    id: 'EV-014',
    name: 'EV Fast Station',
    type: 'ev_station',
    category: 'mobility',
    status: 'active',
    health: 92,
    coordinates: [78.0345, 15.8255],
    altitude: 0,
    rotation: 0,
    scale: 1.0,
    zone: 'Zone 03',
    zoneName: 'Transport Hub',
    capacityKw: 150.0,
    currentPowerKw: 42.8,
    todayGenerationKwh: 0,
    efficiency: 94.2,
    co2AvoidedKg: 38.5,
    evPlugsAvailable: 4,
    evPlugsTotal: 6,
    installedDate: 'Mar 05, 2026'
  },
  // ---------------------------------------------------------------
  // MESHY MODEL: Real Kurnool City Roundabout/Circle Locations
  // The meshy-model.glb replaces statues at traffic roundabouts
  // ---------------------------------------------------------------
  {
    id: 'BJ-07',
    name: 'Basaveswara Circle Monument',
    type: 'bio_junction',
    category: 'bio',
    status: 'active',
    health: 97,
    // Basaveswara / K. Vijaya Bhaskar Reddy Circle, Kurnool
    coordinates: [78.04509, 15.83183],
    altitude: 0,
    rotation: 0,
    scale: 2.5,
    zone: 'Zone 02',
    zoneName: 'Basaveswara Circle, Kurnool City',
    capacityKw: 18.0,
    currentPowerKw: 16.4,
    todayGenerationKwh: 64.2,
    efficiency: 93.5,
    co2AvoidedKg: 31.2,
    biomassKg: 18.4,
    waterLevelPercent: 82,
    aqi: 38,
    installedDate: 'May 01, 2026'
  },
  {
    id: 'BJ-08',
    name: 'Bellary Chowrasta Monument',
    type: 'bio_junction',
    category: 'bio',
    status: 'active',
    health: 95,
    // Bellary Chowrasta - major landmark intersection in Kurnool
    coordinates: [78.02157, 15.82464],
    altitude: 0,
    rotation: 45,
    scale: 2.5,
    zone: 'Zone 01',
    zoneName: 'Bellary Chowrasta, Kurnool City',
    capacityKw: 16.0,
    currentPowerKw: 14.2,
    todayGenerationKwh: 56.8,
    efficiency: 91.2,
    co2AvoidedKg: 27.4,
    biomassKg: 14.2,
    waterLevelPercent: 76,
    aqi: 42,
    installedDate: 'May 15, 2026'
  },
  {
    id: 'BJ-09',
    name: 'Sri Ram Circle Monument',
    type: 'bio_junction',
    category: 'bio',
    status: 'active',
    health: 99,
    // Sri Ram Circle, Kurnool
    coordinates: [78.03457, 15.82681],
    altitude: 0,
    rotation: 90,
    scale: 2.5,
    zone: 'Zone 03',
    zoneName: 'Sri Ram Circle, Kurnool',
    capacityKw: 20.0,
    currentPowerKw: 18.1,
    todayGenerationKwh: 72.4,
    efficiency: 95.0,
    co2AvoidedKg: 35.1,
    biomassKg: 20.8,
    waterLevelPercent: 88,
    aqi: 34,
    installedDate: 'Apr 20, 2026'
  },
  {
    id: 'BJ-10',
    name: 'Raj Vihar Circle Monument',
    type: 'bio_junction',
    category: 'bio',
    status: 'warning',
    health: 88,
    // Raj Vihar Circle, Kurnool
    coordinates: [78.03836, 15.82874],
    altitude: 0,
    rotation: 180,
    scale: 2.5,
    zone: 'Zone 02',
    zoneName: 'Raj Vihar Circle, Kurnool',
    capacityKw: 15.0,
    currentPowerKw: 11.8,
    todayGenerationKwh: 47.2,
    efficiency: 85.6,
    co2AvoidedKg: 22.9,
    biomassKg: 12.0,
    waterLevelPercent: 65,
    aqi: 48,
    installedDate: 'Mar 10, 2026'
  },
  {
    id: 'BJ-11',
    name: 'Chennamma Circle Monument',
    type: 'bio_junction',
    category: 'bio',
    status: 'active',
    health: 96,
    // Chennamma Circle, Kurnool
    coordinates: [78.02591, 15.81489],
    altitude: 0,
    rotation: 135,
    scale: 2.5,
    zone: 'Zone 03',
    zoneName: 'Chennamma Circle, Kurnool',
    capacityKw: 14.0,
    currentPowerKw: 12.9,
    todayGenerationKwh: 51.6,
    efficiency: 92.1,
    co2AvoidedKg: 25.0,
    biomassKg: 13.6,
    waterLevelPercent: 80,
    aqi: 36,
    installedDate: 'Apr 08, 2026'
  },
  {
    id: 'BJ-12',
    name: 'CCamp Circle Monument',
    type: 'bio_junction',
    category: 'bio',
    status: 'active',
    health: 98,
    // CCamp Circle, Kurnool
    coordinates: [78.04152, 15.80846],
    altitude: 0,
    rotation: 225,
    scale: 2.5,
    zone: 'Zone 04',
    zoneName: 'CCamp Circle, Kurnool',
    capacityKw: 17.5,
    currentPowerKw: 15.8,
    todayGenerationKwh: 61.2,
    efficiency: 94.0,
    co2AvoidedKg: 29.8,
    biomassKg: 16.5,
    waterLevelPercent: 85,
    aqi: 35,
    installedDate: 'Apr 18, 2026'
  },
  // ---------------------------------------------------------------
  // SOLAR PANEL MODELS: Real Kurnool Ultra Mega Solar Park (900 MW)
  // Located in Gani & Sakunala villages, Kurnool District
  // ---------------------------------------------------------------
  {
    id: 'UMSP-01',
    name: 'Kurnool Ultra Mega Solar - Greenko Phase',
    type: 'rooftop_solar',
    category: 'solar',
    status: 'active',
    health: 98,
    // Greenko phase: 15.6634° N, 78.2573° E
    coordinates: [78.2573, 15.6634],
    altitude: 0,
    rotation: 0,
    scale: 8.0,
    zone: 'Zone 06',
    zoneName: 'Kurnool Ultra Mega Solar Park - Greenko',
    capacityKw: 210000,
    currentPowerKw: 195800,
    todayGenerationKwh: 762000,
    efficiency: 93.2,
    co2AvoidedKg: 362000,
    sunExposurePercent: 95,
    panelTemperature: 43.0,
    installedDate: 'Jan 15, 2017'
  },
  {
    id: 'UMSP-02',
    name: 'Kurnool Ultra Mega Solar - Azure Power Phase',
    type: 'solar_canopy',
    category: 'solar',
    status: 'active',
    health: 96,
    // Azure Power phase: 15.6550° N, 78.2770° E
    coordinates: [78.2770, 15.6550],
    altitude: 0,
    rotation: 15,
    scale: 8.0,
    zone: 'Zone 06',
    zoneName: 'Kurnool Ultra Mega Solar Park - Azure Power',
    capacityKw: 130000,
    currentPowerKw: 122400,
    todayGenerationKwh: 477000,
    efficiency: 94.2,
    co2AvoidedKg: 226000,
    sunExposurePercent: 94,
    panelTemperature: 44.5,
    installedDate: 'Mar 20, 2017'
  },
  {
    id: 'UMSP-03',
    name: 'Kurnool Ultra Mega Solar - SBG Cleantech Phase',
    type: 'rooftop_solar',
    category: 'solar',
    status: 'active',
    health: 97,
    // SBG Cleantech phase: 15.6765° N, 78.2901° E
    coordinates: [78.2901, 15.6765],
    altitude: 0,
    rotation: 30,
    scale: 8.0,
    zone: 'Zone 06',
    zoneName: 'Kurnool Ultra Mega Solar Park - SBG Cleantech',
    capacityKw: 100000,
    currentPowerKw: 94600,
    todayGenerationKwh: 368000,
    efficiency: 94.6,
    co2AvoidedKg: 174000,
    sunExposurePercent: 96,
    panelTemperature: 42.8,
    installedDate: 'May 10, 2017'
  },
  {
    id: 'UMSP-04',
    name: 'Kurnool Ultra Mega Solar - Main Array',
    type: 'rooftop_solar',
    category: 'solar',
    status: 'active',
    health: 99,
    // Main park center: 15.6724° N, 78.2592° E
    coordinates: [78.2592, 15.6724],
    altitude: 0,
    rotation: 0,
    scale: 10.0,
    zone: 'Zone 06',
    zoneName: 'Kurnool Ultra Mega Solar Park - Main (900 MW)',
    capacityKw: 900000,
    currentPowerKw: 842500,
    todayGenerationKwh: 3281000,
    efficiency: 93.6,
    co2AvoidedKg: 1558000,
    sunExposurePercent: 97,
    panelTemperature: 43.5,
    installedDate: 'Oct 01, 2017'
  },
  // ---------------------------------------------------------------
  // CITY ASSETS: Battery & Wind
  // ---------------------------------------------------------------
  {
    id: 'BT-09',
    name: 'Central Battery BESS',
    type: 'battery_system',
    category: 'storage',
    status: 'active',
    health: 93,
    coordinates: [78.0385, 15.8235],
    altitude: 0,
    rotation: 270,
    scale: 1.0,
    zone: 'Zone 01',
    zoneName: 'Microgrid Substation',
    capacityKw: 2500.0,
    currentPowerKw: 46.2,
    todayGenerationKwh: 0,
    efficiency: 92.8,
    co2AvoidedKg: 45.0,
    batteryStorageKwh: 92400,
    batterySocPercent: 78,
    installedDate: 'Nov 14, 2025'
  },
  {
    id: 'PV-210',
    name: 'Rooftop Solar Array',
    type: 'rooftop_solar',
    category: 'solar',
    status: 'warning',
    health: 78,
    coordinates: [78.0490, 15.8270],
    altitude: 0,
    rotation: 15,
    scale: 1.0,
    zone: 'Zone 05',
    zoneName: 'Public School Cluster',
    capacityKw: 20.5,
    currentPowerKw: 14.8,
    todayGenerationKwh: 8.3,
    efficiency: 65.2,
    co2AvoidedKg: 7.9,
    sunExposurePercent: 76,
    panelTemperature: 54.8,
    installedDate: 'Dec 03, 2025'
  },
  {
    id: 'WT-03',
    name: 'Urban Wind Turbine',
    type: 'wind_turbine',
    category: 'solar', // grouped in renewable
    status: 'active',
    health: 90,
    coordinates: [78.0520, 15.8360],
    altitude: 0,
    rotation: 120,
    scale: 1.0,
    zone: 'Zone 05',
    zoneName: 'Ridge Park High Ground',
    capacityKw: 25.0,
    currentPowerKw: 19.6,
    todayGenerationKwh: 58.4,
    efficiency: 88.1,
    co2AvoidedKg: 28.0,
    installedDate: 'Feb 28, 2026'
  }
];

export const CITY_ZONES: CityZone[] = [
  {
    id: 'zone-01',
    name: 'Zone 01 (Central & Microgrid)',
    renewablePercent: 91,
    generationMwh: 42.3,
    health: 96,
    populationDensity: 13.0,
    weaknessScore: 2.1,
    coordinates: [[78.030, 15.820], [78.040, 15.820], [78.040, 15.826], [78.030, 15.826]]
  },
  {
    id: 'zone-02',
    name: 'Zone 02 (Riverfront & Eco-Corridor)',
    renewablePercent: 84,
    generationMwh: 38.1,
    health: 91,
    populationDensity: 13.9,
    weaknessScore: 3.4,
    coordinates: [[78.040, 15.826], [78.050, 15.826], [78.050, 15.835], [78.040, 15.835]]
  },
  {
    id: 'zone-03',
    name: 'Zone 03 (Transport Hub)',
    renewablePercent: 63,
    generationMwh: 21.4,
    health: 74,
    populationDensity: 5.0,
    weaknessScore: 6.8,
    coordinates: [[78.028, 15.824], [78.036, 15.824], [78.036, 15.832], [78.028, 15.832]]
  },
  {
    id: 'zone-04',
    name: 'Zone 04 (Residential South)',
    renewablePercent: 78,
    generationMwh: 34.6,
    health: 86,
    populationDensity: 18.2,
    weaknessScore: 4.5,
    coordinates: [[78.032, 15.815], [78.045, 15.815], [78.045, 15.822], [78.032, 15.822]]
  },
  {
    id: 'zone-05',
    name: 'Zone 05 (Highlands & Institutional)',
    renewablePercent: 87,
    generationMwh: 39.8,
    health: 92,
    populationDensity: 8.5,
    weaknessScore: 2.8,
    coordinates: [[78.045, 15.822], [78.056, 15.822], [78.056, 15.838], [78.045, 15.838]]
  }
];

/**
 * Complete City Simulation Calculation for a specific simulation state
 */
export function calculateTelemetry(
  assets: InfrastructureAsset[],
  config: SimulationConfig,
  activeScenario?: ProposedScenario | null
): TelemetryState {
  const { simulatedHour, cloudCoverPercent, ambientTemperature } = config;
  const solarFactor = calculateSolarIrradianceFactor(simulatedHour, cloudCoverPercent);
  
  // Combine base assets with any proposed scenario assets
  const combinedAssets = activeScenario?.isActive && activeScenario.proposedAssets.length > 0
    ? [...assets, ...activeScenario.proposedAssets]
    : assets;

  // Scale factors for city-wide aggregation (multiplying demo assets to represent city totals: ~2,349 assets)
  const cityScaleFactor = 2349 / Math.max(1, assets.length);
  
  let totalSolarKw = 0;
  let totalWindKw = 0;
  let totalBiomassKw = 0;
  let activeCount = 0;
  let warningCount = 0;
  let criticalCount = 0;
  let offlineCount = 0;
  let healthSum = 0;

  combinedAssets.forEach(asset => {
    healthSum += asset.health;
    if (asset.status === 'active') activeCount++;
    else if (asset.status === 'warning') warningCount++;
    else if (asset.status === 'critical') criticalCount++;
    else offlineCount++;

    const healthMultiplier = asset.health / 100;
    
    if (asset.type === 'solar_flower' || asset.type === 'solar_canopy' || asset.type === 'rooftop_solar' || asset.type === 'smart_pole') {
      totalSolarKw += asset.capacityKw * solarFactor * healthMultiplier * (asset.efficiency / 100);
    } else if (asset.type === 'wind_turbine') {
      // Wind has diurnal stability with slight afternoon breeze
      const windFactor = 0.65 + 0.25 * Math.sin((simulatedHour / 24) * Math.PI * 2);
      totalWindKw += asset.capacityKw * windFactor * healthMultiplier;
    } else if (asset.type === 'bio_junction') {
      totalBiomassKw += asset.capacityKw * 0.85 * healthMultiplier;
    }
  });

  const avgHealth = Math.round(healthSum / combinedAssets.length);
  
  // Total City Generation in MWh (normalized for the day up to current hour)
  const baseDailyGenerationMwh = 284.6;
  const timeProgress = simulatedHour / 24;
  
  // Peak midday multiplier
  const currentGenMultiplier = (totalSolarKw + totalWindKw + totalBiomassKw) / (assets.length * 15 || 1);
  const totalGenerationMwh = +(baseDailyGenerationMwh * (0.3 + 0.7 * currentGenMultiplier) * (activeScenario?.isActive ? 1.18 : 1.0)).toFixed(1);
  
  // City Consumption in MWh
  const totalConsumptionMwh = +(231.8 * (0.85 + 0.15 * Math.sin((simulatedHour / 24) * Math.PI * 2))).toFixed(1);
  
  // Storage Dynamics (92.4 MWh capacity baseline, 78% SoC)
  const storageCapacityMwh = 118.0;
  let storageSocPercent = 78;
  if (simulatedHour >= 8 && simulatedHour <= 16) {
    // Charging during solar peak
    storageSocPercent = Math.min(96, Math.round(65 + (simulatedHour - 8) * 3.8));
  } else if (simulatedHour > 16) {
    // Discharging into evening peak
    storageSocPercent = Math.max(42, Math.round(96 - (simulatedHour - 16) * 6.5));
  } else {
    // Night hold / early morning steady
    storageSocPercent = Math.round(42 + simulatedHour * 3.8);
  }
  const storageLevelMwh = +((storageCapacityMwh * (storageSocPercent / 100))).toFixed(1);

  // Renewable Share (%)
  const renewableSharePercent = +(Math.min(98.4, (totalGenerationMwh / (totalConsumptionMwh || 1)) * 72 * (activeScenario?.isActive ? 1.12 : 1.0))).toFixed(1);
  
  // Avoided CO2 in Tons (0.442 kg CO2 per kWh clean energy)
  const co2AvoidedTons = +(totalGenerationMwh * 0.442).toFixed(1);
  
  // Grid Import / Export (MW)
  const netDeficit = Math.max(0, (totalConsumptionMwh - totalGenerationMwh) * 0.12);
  const gridImportMw = +(netDeficit * (storageSocPercent < 50 ? 1.4 : 0.6)).toFixed(1);
  const gridExportMw = +(Math.max(0, (totalGenerationMwh - totalConsumptionMwh) * 0.08)).toFixed(1);
  
  // EV load
  const evChargingLoadMw = +(32.6 * (0.5 + 0.5 * Math.sin(((simulatedHour - 6) / 14) * Math.PI))).toFixed(1);

  // SolTerra City Score (87/100 baseline, enhanced by high renewable share and health)
  let cityScore = Math.round(
    (renewableSharePercent * 0.4) + 
    (avgHealth * 0.35) + 
    ((storageSocPercent / 100) * 15) + 
    (10 - (gridImportMw / 10))
  );
  if (activeScenario?.isActive) cityScore = Math.min(97, cityScore + 7);

  // Energy Flow node connections (kW instantaneous values matching screenshots)
  const energyFlow = {
    solarKw: +(142.8 * (0.3 + 0.7 * solarFactor)).toFixed(1),
    batteryKw: +(92.4 * (storageSocPercent / 100)).toFixed(1),
    buildingsKw: +(186.3 * (0.8 + 0.2 * Math.sin((simulatedHour / 24) * Math.PI * 2))).toFixed(1),
    evChargingKw: +(42.8 * (0.4 + 0.6 * (simulatedHour >= 9 && simulatedHour <= 19 ? 1.2 : 0.4))).toFixed(1),
    gridKw: +(gridImportMw * 0.85).toFixed(1)
  };

  // Energy Mix breakdown (MWh matching screenshot donut)
  const energyMix = {
    solarMwh: +(totalGenerationMwh * 0.62).toFixed(1),
    biomassMwh: +(totalGenerationMwh * 0.14).toFixed(1),
    windMwh: +(totalGenerationMwh * 0.14).toFixed(1),
    hydroMwh: +(totalGenerationMwh * 0.09).toFixed(1),
    gridMwh: +(totalConsumptionMwh * 0.09).toFixed(1)
  };

  return {
    totalGenerationMwh,
    totalConsumptionMwh,
    renewableSharePercent,
    storageLevelMwh,
    storageCapacityMwh,
    storageSocPercent,
    co2AvoidedTons,
    activeAssetsCount: Math.round(2172 * (activeScenario?.isActive ? 1.08 : 1.0)),
    totalAssetsCount: Math.round(2349 * (activeScenario?.isActive ? 1.08 : 1.0)),
    warningAssetsCount: 132,
    criticalAssetsCount: 27,
    offlineAssetsCount: 18,
    avgHealthScore: avgHealth,
    peakDemandMw: 42.8,
    gridImportMw,
    gridExportMw,
    evChargingLoadMw,
    cityScore,
    energyFlow,
    energyMix
  };
}
