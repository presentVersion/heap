/**
 * Official Central Electricity Authority (CEA) Renewable Energy Generation & Transmission Dataset
 * Extracted from:
 * 1. Monthly Renewable Energy Generation Report (August 2026 - CEA)
 * 2. Operation Performance Monitoring Division Daily Report (Sept 24, 2026)
 * 3. Report on Resource Adequacy Plan for the State of Andhra Pradesh (2024-25 to 2031-32)
 * 4. EV Public Charging Stations Monthly Power Consumption Report (March 2026)
 */

export const ENERGYMAP_API_KEY = "iea_live_j7t85OUPfXwliuqL25ErlIJHlXG8de-l";

export interface RenewablePlantData {
  id: string;
  name: string;
  state: string;
  region: 'Northern' | 'Western' | 'Southern' | 'Eastern';
  type: 'solar' | 'wind';
  capacityMw: number;
  augustGenMu: number; // August 2026 Generation in Million Units
  cumulativeGenMu: number; // April-August 2026
  status: 'active' | 'optimal';
  coordinates: [number, number]; // [lng, lat]
  modelScale: number;
  farmClusterSize: number; // Number of 3D models to spawn in the farm bunch
  farmRadiusMeters: number; // Spread radius in meters for the bunch
  description: string;
}

export interface DemandCenter {
  id: string;
  name: string;
  state: string;
  coordinates: [number, number];
  peakDemandMw: number;
  evChargingMuMonth: number; // March 2026 from CEA EV Report
  evChargingMuAnnual: number;
  primaryDiscom: string;
}

export interface TransmissionLine {
  id: string;
  name: string;
  voltage: string; // e.g. "765 kV HVDC", "400 kV D/C"
  sourceId: string;
  targetId: string;
  fromName: string;
  toName: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  flowMw: number;
  capacityMw: number;
  corridor: string;
}

// ── 1. Solar & Wind Power Stations with exact geographic coordinates ───
export const RENEWABLE_PLANTS: RenewablePlantData[] = [
  // ── SOLAR POWER STATIONS ──
  {
    id: 'bhadla-solar',
    name: 'Bhadla Solar Park',
    state: 'Rajasthan',
    region: 'Northern',
    type: 'solar',
    capacityMw: 2245,
    augustGenMu: 1340.62,
    cumulativeGenMu: 6850.40,
    status: 'optimal',
    coordinates: [71.9167, 27.5333],
    modelScale: 1.8,
    farmClusterSize: 28,
    farmRadiusMeters: 1400,
    description: 'World largest solar park in Thar Desert. August 2026: 1,340.6 MU output across Phase I-IV.'
  },
  {
    id: 'nokh-solar',
    name: 'Nokh Solar Park',
    state: 'Rajasthan',
    region: 'Northern',
    type: 'solar',
    capacityMw: 735,
    augustGenMu: 108.83,
    cumulativeGenMu: 590.98,
    status: 'active',
    coordinates: [71.8500, 27.5600],
    modelScale: 1.6,
    farmClusterSize: 18,
    farmRadiusMeters: 900,
    description: 'NTPC flagship ultra-mega solar project in Pokhran tehsil, Jaisalmer district.'
  },
  {
    id: 'bikaner-solar',
    name: 'Bikaner Solar Complex',
    state: 'Rajasthan',
    region: 'Northern',
    type: 'solar',
    capacityMw: 1000,
    augustGenMu: 186.45,
    cumulativeGenMu: 874.75,
    status: 'optimal',
    coordinates: [73.3100, 28.0100],
    modelScale: 1.7,
    farmClusterSize: 22,
    farmRadiusMeters: 1100,
    description: 'SJVN 1,000 MW mega solar park feeding Northern and Western inter-state regional grid.'
  },
  {
    id: 'fatehgarh-solar',
    name: 'Fatehgarh Solar Hub',
    state: 'Rajasthan',
    region: 'Northern',
    type: 'solar',
    capacityMw: 1800,
    augustGenMu: 1434.20,
    cumulativeGenMu: 7210.15,
    status: 'optimal',
    coordinates: [71.2100, 26.7900],
    modelScale: 1.7,
    farmClusterSize: 24,
    farmRadiusMeters: 1200,
    description: 'AREH5 & MAL QCA major central pooling substation handling over 1.4 BU/month.'
  },
  {
    id: 'khavda-solar',
    name: 'Khavda Renewable Energy Park',
    state: 'Gujarat',
    region: 'Western',
    type: 'solar',
    capacityMw: 2650,
    augustGenMu: 194.37,
    cumulativeGenMu: 1577.16,
    status: 'optimal',
    coordinates: [69.7500, 23.8300],
    modelScale: 2.0,
    farmClusterSize: 32,
    farmRadiusMeters: 1600,
    description: 'Great Rann of Kutch mega park. World largest hybrid renewable cluster.'
  },
  {
    id: 'charanka-solar',
    name: 'Charanka Solar Park',
    state: 'Gujarat',
    region: 'Western',
    type: 'solar',
    capacityMw: 790,
    augustGenMu: 15.76,
    cumulativeGenMu: 106.98,
    status: 'active',
    coordinates: [71.2100, 23.9000],
    modelScale: 1.5,
    farmClusterSize: 16,
    farmRadiusMeters: 750,
    description: 'Patan district pioneer solar park with multi-developer photovoltaic installation.'
  },
  {
    id: 'kurnool-solar',
    name: 'Kurnool Ultra Mega Solar Park',
    state: 'Andhra Pradesh',
    region: 'Southern',
    type: 'solar',
    capacityMw: 1000,
    augustGenMu: 284.44,
    cumulativeGenMu: 1430.20,
    status: 'optimal',
    coordinates: [78.2700, 15.6680],
    modelScale: 1.8,
    farmClusterSize: 26,
    farmRadiusMeters: 1250,
    description: 'Gani Sakunala plateau solar park in Kurnool, integrated with Pinnapuram PSP.'
  },
  {
    id: 'anantapuram-solar',
    name: 'Anantapuram Solar Park (NP Kunta)',
    state: 'Andhra Pradesh',
    region: 'Southern',
    type: 'solar',
    capacityMw: 1500,
    augustGenMu: 71.70,
    cumulativeGenMu: 369.19,
    status: 'active',
    coordinates: [78.1100, 14.1500],
    modelScale: 1.7,
    farmClusterSize: 20,
    farmRadiusMeters: 1000,
    description: 'Nambulapulakunta ultra mega solar plant contracted with APTRANSCO.'
  },
  {
    id: 'pavagada-solar',
    name: 'Pavagada Solar Park (Shakti Sthala)',
    state: 'Karnataka',
    region: 'Southern',
    type: 'solar',
    capacityMw: 2050,
    augustGenMu: 215.30,
    cumulativeGenMu: 1180.50,
    status: 'optimal',
    coordinates: [77.2700, 14.1000],
    modelScale: 1.9,
    farmClusterSize: 28,
    farmRadiusMeters: 1400,
    description: 'Tumakuru district 13,000-acre solar park powering southern regional grid.'
  },
  {
    id: 'koppal-solar',
    name: 'Koppal & Gadag Solar Cluster',
    state: 'Karnataka',
    region: 'Southern',
    type: 'solar',
    capacityMw: 650,
    augustGenMu: 125.47,
    cumulativeGenMu: 650.10,
    status: 'active',
    coordinates: [76.1500, 15.3400],
    modelScale: 1.6,
    farmClusterSize: 18,
    farmRadiusMeters: 900,
    description: 'Tpsaurya, Kleio and Serentica hybrid solar cluster in central Karnataka.'
  },
  {
    id: 'rewa-solar',
    name: 'Rewa Ultra Mega Solar',
    state: 'Madhya Pradesh',
    region: 'Western',
    type: 'solar',
    capacityMw: 750,
    augustGenMu: 88.50,
    cumulativeGenMu: 450.20,
    status: 'optimal',
    coordinates: [81.3000, 24.5300],
    modelScale: 1.6,
    farmClusterSize: 18,
    farmRadiusMeters: 900,
    description: 'Supplies 24% of power to Delhi Metro Rail Corporation (DMRC) via interstate line.'
  },
  {
    id: 'tuticorin-solar',
    name: 'Tuticorin & Ettayapuram Solar',
    state: 'Tamil Nadu',
    region: 'Southern',
    type: 'solar',
    capacityMw: 230,
    augustGenMu: 42.19,
    cumulativeGenMu: 206.89,
    status: 'active',
    coordinates: [77.9900, 9.1500],
    modelScale: 1.5,
    farmClusterSize: 16,
    farmRadiusMeters: 800,
    description: 'NTPC Ettayapuram high-irradiance coastal plain utility-scale photovoltaic park.'
  },
  {
    id: 'ramagundam-solar',
    name: 'Ramagundam Floating Solar',
    state: 'Telangana',
    region: 'Southern',
    type: 'solar',
    capacityMw: 210,
    augustGenMu: 40.27,
    cumulativeGenMu: 178.23,
    status: 'optimal',
    coordinates: [79.5100, 18.7600],
    modelScale: 1.5,
    farmClusterSize: 16,
    farmRadiusMeters: 700,
    description: 'India premier floating photovoltaic plant on NTPC Ramagundam reservoir.'
  },

  // ── WIND POWER FARMS ──
  {
    id: 'jaisalmer-wind',
    name: 'Jaisalmer Wind Park',
    state: 'Rajasthan',
    region: 'Northern',
    type: 'wind',
    capacityMw: 1064,
    augustGenMu: 235.15,
    cumulativeGenMu: 1120.40,
    status: 'optimal',
    coordinates: [70.9000, 26.9100],
    modelScale: 2.2,
    farmClusterSize: 14,
    farmRadiusMeters: 1600,
    description: 'Major desert wind corridor comprising Adani Hybrid 1-4 & ONGC turbines.'
  },
  {
    id: 'kutch-wind',
    name: 'Kutch & Dayapar Wind Hub',
    state: 'Gujarat',
    region: 'Western',
    type: 'wind',
    capacityMw: 1740,
    augustGenMu: 455.90,
    cumulativeGenMu: 2150.80,
    status: 'optimal',
    coordinates: [69.6600, 23.2400],
    modelScale: 2.3,
    farmClusterSize: 16,
    farmRadiusMeters: 1800,
    description: 'Dayapar, Bhuj, Alfanar & Apraava high-capacity turbine farms in coastal Gujarat.'
  },
  {
    id: 'ratadiya-wind',
    name: 'Ratadiya Wind Farm',
    state: 'Gujarat',
    region: 'Western',
    type: 'wind',
    capacityMw: 300,
    augustGenMu: 196.77,
    cumulativeGenMu: 920.45,
    status: 'active',
    coordinates: [69.8500, 23.1800],
    modelScale: 2.0,
    farmClusterSize: 10,
    farmRadiusMeters: 1200,
    description: 'AWEK1L & AWEKFL high-capacity onshore wind array with 196.77 MU August generation.'
  },
  {
    id: 'gadag-wind',
    name: 'Gadag & Koppal Wind Complex',
    state: 'Karnataka',
    region: 'Southern',
    type: 'wind',
    capacityMw: 850,
    augustGenMu: 444.60,
    cumulativeGenMu: 1890.30,
    status: 'optimal',
    coordinates: [75.6300, 15.4200],
    modelScale: 2.1,
    farmClusterSize: 12,
    farmRadiusMeters: 1500,
    description: 'Deccan plateau wind farm cluster including Greeninfra, Ostro, and Rsrpl Gadag.'
  },
  {
    id: 'hiriyur-wind',
    name: 'Hiriyur Wind Project',
    state: 'Karnataka',
    region: 'Southern',
    type: 'wind',
    capacityMw: 400,
    augustGenMu: 243.19,
    cumulativeGenMu: 1020.15,
    status: 'active',
    coordinates: [76.6200, 13.9400],
    modelScale: 2.0,
    farmClusterSize: 10,
    farmRadiusMeters: 1300,
    description: 'Chitradurga wind pass corridor generating over 240 MU in August 2026.'
  },
  {
    id: 'muppandal-wind',
    name: 'Muppandal Wind Farm (Kanyakumari)',
    state: 'Tamil Nadu',
    region: 'Southern',
    type: 'wind',
    capacityMw: 1500,
    augustGenMu: 412.30,
    cumulativeGenMu: 1980.50,
    status: 'optimal',
    coordinates: [77.5500, 8.2500],
    modelScale: 2.3,
    farmClusterSize: 16,
    farmRadiusMeters: 1800,
    description: 'India largest operational wind farm located in the high-speed Palakkad/Aralvaimozhi gap.'
  },
  {
    id: 'savlaperi-wind',
    name: 'Savlaperi & Tuticorin Wind Farm',
    state: 'Tamil Nadu',
    region: 'Southern',
    type: 'wind',
    capacityMw: 650,
    augustGenMu: 327.82,
    cumulativeGenMu: 1450.20,
    status: 'active',
    coordinates: [78.1300, 8.7600],
    modelScale: 2.0,
    farmClusterSize: 12,
    farmRadiusMeters: 1400,
    description: 'JSW Savlaperi (210 MU) and Betam Tuticorin (120 MU) Gulf of Mannar wind zone.'
  },
  {
    id: 'patoda-wind',
    name: 'Patoda & Osmanabad Wind Project',
    state: 'Maharashtra',
    region: 'Western',
    type: 'wind',
    capacityMw: 420,
    augustGenMu: 118.38,
    cumulativeGenMu: 560.10,
    status: 'active',
    coordinates: [75.7000, 18.9000],
    modelScale: 1.9,
    farmClusterSize: 10,
    farmRadiusMeters: 1200,
    description: 'Beed and Osmanabad ridge line turbine installation feeding Maharashtra state grid.'
  },
  {
    id: 'dewas-wind',
    name: 'Dewas & Indore Wind Farm',
    state: 'Madhya Pradesh',
    region: 'Western',
    type: 'wind',
    capacityMw: 380,
    augustGenMu: 100.48,
    cumulativeGenMu: 490.80,
    status: 'active',
    coordinates: [76.0500, 22.9600],
    modelScale: 1.9,
    farmClusterSize: 9,
    farmRadiusMeters: 1100,
    description: 'Malwa plateau wind generator providing clean energy to central industrial belt.'
  },
  {
    id: 'kurnool-wind',
    name: 'Kurnool Wind Energy Cluster',
    state: 'Andhra Pradesh',
    region: 'Southern',
    type: 'wind',
    capacityMw: 350,
    augustGenMu: 80.14,
    cumulativeGenMu: 380.20,
    status: 'active',
    coordinates: [78.0383, 15.8287],
    modelScale: 2.0,
    farmClusterSize: 8,
    farmRadiusMeters: 1100,
    description: 'Amgreen Kurnool turbine array supplying local district grid and EV mobility corridor.'
  }
];

// ── 2. Major Energy Demand & Load Centers (from CEA EV Report March 2026) ───
export const DEMAND_CENTERS: DemandCenter[] = [
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR Hub',
    state: 'Delhi',
    coordinates: [77.2090, 28.6139],
    peakDemandMw: 7420,
    evChargingMuMonth: 36.41,
    evChargingMuAnnual: 435.31,
    primaryDiscom: 'BRPL / BYPL / Tata Power-DDL'
  },
  {
    id: 'mumbai-mmr',
    name: 'Mumbai Metropolitan Region',
    state: 'Maharashtra',
    coordinates: [72.8777, 19.0760],
    peakDemandMw: 5240,
    evChargingMuMonth: 42.23,
    evChargingMuAnnual: 386.62,
    primaryDiscom: 'AEML / BEST / MSEDCL'
  },
  {
    id: 'bengaluru-metro',
    name: 'Bengaluru Tech Corridor',
    state: 'Karnataka',
    coordinates: [77.5946, 12.9716],
    peakDemandMw: 4180,
    evChargingMuMonth: 18.97,
    evChargingMuAnnual: 214.70,
    primaryDiscom: 'BESCOM'
  },
  {
    id: 'hyderabad-metro',
    name: 'Hyderabad Cyberabad Region',
    state: 'Telangana',
    coordinates: [78.4867, 17.3850],
    peakDemandMw: 3650,
    evChargingMuMonth: 12.42,
    evChargingMuAnnual: 111.26,
    primaryDiscom: 'TGSPDCL / TGNPDCL'
  },
  {
    id: 'chennai-industrial',
    name: 'Chennai Industrial Belt',
    state: 'Tamil Nadu',
    coordinates: [80.2707, 13.0827],
    peakDemandMw: 4560,
    evChargingMuMonth: 3.16,
    evChargingMuAnnual: 35.55,
    primaryDiscom: 'TNPDCL'
  },
  {
    id: 'ahmedabad-gift',
    name: 'Ahmedabad & GIFT City',
    state: 'Gujarat',
    coordinates: [72.5714, 23.0225],
    peakDemandMw: 3310,
    evChargingMuMonth: 7.25,
    evChargingMuAnnual: 89.55,
    primaryDiscom: 'Torrent Power / UGVCL'
  },
  {
    id: 'vijayawada-amaravati',
    name: 'Vijayawada & Amaravati Hub',
    state: 'Andhra Pradesh',
    coordinates: [80.6480, 16.5062],
    peakDemandMw: 3100,
    evChargingMuMonth: 2.58,
    evChargingMuAnnual: 27.01,
    primaryDiscom: 'APSPDCL / APEPDCL'
  }
];

// ── 3. High Voltage Green Energy Corridors (Transmission Lines) ───
export const TRANSMISSION_CORRIDORS: TransmissionLine[] = [
  {
    id: 'bhadla-delhi',
    name: 'Bhadla → Delhi NCR Green Corridor',
    voltage: '765 kV HVDC',
    sourceId: 'bhadla-solar',
    targetId: 'delhi-ncr',
    fromName: 'Bhadla Solar Park',
    toName: 'Delhi NCR Hub',
    fromCoords: [71.9167, 27.5333],
    toCoords: [77.2090, 28.6139],
    flowMw: 2150,
    capacityMw: 3000,
    corridor: 'Northern Inter-State Grid'
  },
  {
    id: 'khavda-mumbai',
    name: 'Khavda → Mumbai Green Energy Superhighway',
    voltage: '800 kV HVDC',
    sourceId: 'khavda-solar',
    targetId: 'mumbai-mmr',
    fromName: 'Khavda Mega Park',
    toName: 'Mumbai MMR Hub',
    fromCoords: [69.7500, 23.8300],
    toCoords: [72.8777, 19.0760],
    flowMw: 2400,
    capacityMw: 3500,
    corridor: 'Western High-Capacity Corridor'
  },
  {
    id: 'kutch-ahmedabad',
    name: 'Kutch Wind → Ahmedabad & GIFT City Line',
    voltage: '400 kV D/C',
    sourceId: 'kutch-wind',
    targetId: 'ahmedabad-gift',
    fromName: 'Kutch Wind Hub',
    toName: 'Ahmedabad & GIFT',
    fromCoords: [69.6600, 23.2400],
    toCoords: [72.5714, 23.0225],
    flowMw: 1350,
    capacityMw: 1800,
    corridor: 'Gujarat Intra-State GEC'
  },
  {
    id: 'kurnool-hyderabad',
    name: 'Kurnool → Hyderabad Inter-State Link',
    voltage: '765 kV D/C',
    sourceId: 'kurnool-solar',
    targetId: 'hyderabad-metro',
    fromName: 'Kurnool Ultra Mega Solar',
    toName: 'Hyderabad Cyberabad',
    fromCoords: [78.2700, 15.6680],
    toCoords: [78.4867, 17.3850],
    flowMw: 920,
    capacityMw: 1500,
    corridor: 'Southern Inter-State Link'
  },
  {
    id: 'kurnool-bengaluru',
    name: 'Kurnool & Anantapuram → Bengaluru Hub',
    voltage: '400 kV Quad D/C',
    sourceId: 'anantapuram-solar',
    targetId: 'bengaluru-metro',
    fromName: 'Anantapuram & Kurnool Complex',
    toName: 'Bengaluru Tech Corridor',
    fromCoords: [78.1100, 14.1500],
    toCoords: [77.5946, 12.9716],
    flowMw: 1420,
    capacityMw: 2000,
    corridor: 'Karnataka-AP Inter-Grid'
  },
  {
    id: 'pavagada-bengaluru',
    name: 'Pavagada → Bengaluru Clean Power Line',
    voltage: '400 kV D/C',
    sourceId: 'pavagada-solar',
    targetId: 'bengaluru-metro',
    fromName: 'Pavagada Solar Park',
    toName: 'Bengaluru Tech Corridor',
    fromCoords: [77.2700, 14.1000],
    toCoords: [77.5946, 12.9716],
    flowMw: 1850,
    capacityMw: 2200,
    corridor: 'BESCOM Renewable Feeder'
  },
  {
    id: 'muppandal-chennai',
    name: 'Muppandal & Tuticorin → Chennai Corridor',
    voltage: '765 kV HVDC',
    sourceId: 'muppandal-wind',
    targetId: 'chennai-industrial',
    fromName: 'Muppandal & Tuticorin Wind',
    toName: 'Chennai Industrial Belt',
    fromCoords: [77.5500, 8.2500],
    toCoords: [80.2707, 13.0827],
    flowMw: 1750,
    capacityMw: 2500,
    corridor: 'Tamil Nadu Green Energy Corridor'
  },
  {
    id: 'rewa-delhi',
    name: 'Rewa Solar → Delhi DMRC & Northern Grid',
    voltage: '400 kV Inter-Regional',
    sourceId: 'rewa-solar',
    targetId: 'delhi-ncr',
    fromName: 'Rewa Ultra Mega Solar',
    toName: 'Delhi DMRC Terminal',
    fromCoords: [81.3000, 24.5300],
    toCoords: [77.2090, 28.6139],
    flowMw: 480,
    capacityMw: 750,
    corridor: 'DMRC Clean Rail Corridor'
  },
  {
    id: 'kurnool-amaravati',
    name: 'Kurnool Grid → Vijayawada / Amaravati Capital Link',
    voltage: '400 kV D/C',
    sourceId: 'kurnool-solar',
    targetId: 'vijayawada-amaravati',
    fromName: 'Kurnool Generation Complex',
    toName: 'Vijayawada Hub',
    fromCoords: [78.2700, 15.6680],
    toCoords: [80.6480, 16.5062],
    flowMw: 880,
    capacityMw: 1400,
    corridor: 'APTRANSCO Backbone'
  }
];

// ── 4. National Aggregated Renewable Generation (August 2026 CEA Report) ──
export const ALL_INDIA_RE_AUGUST_2026 = {
  month: 'August 2026',
  totalGenerationMu: 59503.41,
  lastYearGenerationMu: 51375.07,
  yoyGrowthPercent: 15.82,
  reShareInTotalGeneration: 32.52,
  sources: [
    { name: 'Solar', generationMu: 18629.70, sharePercent: 31.31, color: '#f59e0b', growth: 47.45 },
    { name: 'Wind', generationMu: 17815.20, sharePercent: 29.94, color: '#38bdf8', growth: 38.17 },
    { name: 'Large Hydro', generationMu: 20711.37, sharePercent: 34.81, color: '#06b6d4', growth: -11.93 },
    { name: 'Small Hydro', generationMu: 1656.93, sharePercent: 2.78, color: '#10b981', growth: -0.18 },
    { name: 'Biomass & Bagasse', generationMu: 479.52, sharePercent: 0.81, color: '#8b5cf6', growth: 12.35 },
    { name: 'Waste to Energy / Others', generationMu: 210.69, sharePercent: 0.35, color: '#ec4899', growth: -15.83 },
  ],
  topStatesSolar: [
    { state: 'Rajasthan', mu: 6731.11 },
    { state: 'Gujarat', mu: 3339.63 },
    { state: 'Tamil Nadu', mu: 2256.19 },
    { state: 'Karnataka', mu: 1686.01 },
    { state: 'Andhra Pradesh', mu: 1161.63 },
    { state: 'Maharashtra', mu: 953.25 },
  ],
  topStatesWind: [
    { state: 'Gujarat', mu: 4759.22 },
    { state: 'Tamil Nadu', mu: 4722.32 },
    { state: 'Karnataka', mu: 2964.85 },
    { state: 'Maharashtra', mu: 1718.79 },
    { state: 'Andhra Pradesh', mu: 1661.57 },
    { state: 'Rajasthan', mu: 1162.02 },
  ],
  evChargingTopStates: [
    { state: 'Delhi', mu: 36.41, annualMu: 435.31 },
    { state: 'Maharashtra', mu: 42.23, annualMu: 386.62 },
    { state: 'Karnataka', mu: 18.97, annualMu: 214.70 },
    { state: 'Telangana', mu: 12.42, annualMu: 111.26 },
    { state: 'Gujarat', mu: 7.25, annualMu: 89.55 },
    { state: 'Tamil Nadu', mu: 3.16, annualMu: 35.55 },
    { state: 'Andhra Pradesh', mu: 2.58, annualMu: 27.01 },
  ]
};

// ── 5. Helper function to generate coordinate offsets for 3D model "bunches" ──
export function generateFarmBunchOffsets(
  center: [number, number],
  count: number,
  type: 'solar' | 'wind'
): Array<{ lng: number; lat: number; rotationY: number; scaleMod: number }> {
  const points: Array<{ lng: number; lat: number; rotationY: number; scaleMod: number }> = [];
  
  if (type === 'solar') {
    // Tightly packed neat rows of solar tables
    const cols = Math.ceil(Math.sqrt(count * 1.5));
    const rows = Math.ceil(count / cols);
    const spacingLng = 0.0035; // ~300 meters
    const spacingLat = 0.0028; // ~250 meters

    let added = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (added >= count) break;
        const lng = center[0] + (c - cols / 2) * spacingLng + (Math.sin(r + c) * 0.0003);
        const lat = center[1] + (r - rows / 2) * spacingLat + (Math.cos(r * 2) * 0.0002);
        points.push({
          lng,
          lat,
          rotationY: 0, // facing south
          scaleMod: 0.95 + (Math.sin(added) * 0.1)
        });
        added++;
      }
    }
  } else {
    // Wind turbines spaced out widely along ridgelines / staggered arrays
    const cols = Math.ceil(Math.sqrt(count * 1.2));
    const rows = Math.ceil(count / cols);
    const spacingLng = 0.0085; // ~850 meters to minimize wake effect
    const spacingLat = 0.0075;

    let added = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (added >= count) break;
        // Stagger every second row
        const stagger = (r % 2 === 1) ? spacingLng * 0.5 : 0;
        const lng = center[0] + (c - cols / 2) * spacingLng + stagger + ((c % 3 - 1) * 0.0008);
        const lat = center[1] + (r - rows / 2) * spacingLat + ((r % 2 - 0.5) * 0.0006);
        points.push({
          lng,
          lat,
          rotationY: (added * 37) % 360,
          scaleMod: 0.92 + (Math.sin(added * 1.5) * 0.15)
        });
        added++;
      }
    }
  }

  return points;
}

// ── 6. Kurnool City Microgrid Distribution & Feeders (Local Transmission) ───
export interface CityFeederLine {
  id: string;
  name: string;
  voltage: string;
  fromName: string;
  toName: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  currentLoadKw: number;
  capacityKw: number;
  status: 'optimal' | 'high_flow';
}

export const CITY_MICROGRID_FEEDERS: CityFeederLine[] = [
  {
    id: 'umsp-to-kurnool-sub',
    name: 'Gani UMSP 132kV Step-Down Feeder',
    voltage: '132 kV',
    fromName: 'Gani Sakunala Solar Park',
    toName: 'Kurnool Central 132/33kV Substation',
    fromCoords: [78.2700, 15.6680],
    toCoords: [78.0450, 15.8280],
    currentLoadKw: 78000,
    capacityKw: 100000,
    status: 'optimal'
  },
  {
    id: 'sub-to-rajvihar-ev',
    name: 'Raj Vihar Arterial EV Feeder',
    voltage: '33 kV Dedicated',
    fromName: 'Kurnool Central Substation',
    toName: 'HPCL Raj Vihar EV Station',
    fromCoords: [78.0450, 15.8280],
    toCoords: [78.0372, 15.8276],
    currentLoadKw: 2400,
    capacityKw: 3500,
    status: 'optimal'
  },
  {
    id: 'sub-to-bellary-ev',
    name: 'Bellary Chowrasta Industrial Feeder',
    voltage: '33 kV Ring',
    fromName: 'Kurnool Central Substation',
    toName: 'IOCL Bellary Chowrasta EV Plaza',
    fromCoords: [78.0450, 15.8280],
    toCoords: [78.0245, 15.8235],
    currentLoadKw: 1850,
    capacityKw: 2500,
    status: 'optimal'
  },
  {
    id: 'sub-to-nh44-ev',
    name: 'NH-44 Highway Heavy Fleet Feed',
    voltage: '33 kV Express',
    fromName: 'Kurnool Central Substation',
    toName: 'BPCL Highway Oasis EV Plaza',
    fromCoords: [78.0450, 15.8280],
    toCoords: [78.0515, 15.8020],
    currentLoadKw: 3200,
    capacityKw: 4500,
    status: 'optimal'
  },
  {
    id: 'solar-flower-to-residential',
    name: 'Zone 04 Residential Micro-Loop',
    voltage: '11 kV Smart Grid',
    fromName: 'Basaveswara Solar Flower Hub',
    toName: 'BPCL C-Camp Basaveswara Hub',
    fromCoords: [78.04509, 15.83183],
    toCoords: [78.0465, 15.8305],
    currentLoadKw: 480,
    capacityKw: 800,
    status: 'optimal'
  },
  {
    id: 'riverfront-bio-pumping',
    name: 'Tungabhadra Eco Riverfront Feeder',
    voltage: '11 kV Eco Loop',
    fromName: 'Sri Ram Circle Bio-Junction',
    toName: 'IOCL River Promenade EV Station',
    fromCoords: [78.03457, 15.82681],
    toCoords: [78.0410, 15.8125],
    currentLoadKw: 340,
    capacityKw: 600,
    status: 'optimal'
  }
];

// ── 7. Detailed 3D EV Charging Stations Network at Petrol Bunks ───
export interface EVChargingStationItem {
  id: string;
  name: string;
  zone: string;
  location: string;
  petrolBunkBrand: string;
  coordinates: [number, number];
  plugsTotal: number;
  plugsAvailable: number;
  fastDcKw: number;
  currentDrawKw: number;
  energyTodayKwh: number;
  renewableSource: string;
  status: 'online' | 'busy' | 'full';
  pricePerKwh: string;
}

export const EV_CHARGING_STATIONS: EVChargingStationItem[] = [
  {
    id: 'ev-bellary-chowrasta',
    name: 'IOCL Bellary Chowrasta EV Plaza',
    zone: 'Zone 03 · Bellary Flyover Junction',
    location: 'Indian Oil Petrol Bunk, Bellary Chowrasta, Kurnool',
    petrolBunkBrand: 'Indian Oil (IOCL)',
    coordinates: [78.0245, 15.8235],
    plugsTotal: 6,
    plugsAvailable: 4,
    fastDcKw: 120,
    currentDrawKw: 185.0,
    energyTodayKwh: 1180.2,
    renewableSource: 'Solar Canopy & Battery Buffer',
    status: 'online',
    pricePerKwh: '₹ 8.20'
  },
  {
    id: 'ev-raj-vihar',
    name: 'HPCL Raj Vihar Circle EV Hub',
    zone: 'Zone 01 · Central City',
    location: 'HP Petrol Pump, Raj Vihar Circle, Kurnool',
    petrolBunkBrand: 'Hindustan Petroleum (HPCL)',
    coordinates: [78.0372, 15.8276],
    plugsTotal: 8,
    plugsAvailable: 6,
    fastDcKw: 180,
    currentDrawKw: 240.5,
    energyTodayKwh: 1420.8,
    renewableSource: '100% Gani Solar Park Direct PPA',
    status: 'online',
    pricePerKwh: '₹ 8.50'
  },
  {
    id: 'ev-nh44-expressway',
    name: 'BPCL Highway Oasis 240kW EV Plaza',
    zone: 'Zone 02 · NH-44 Bypass',
    location: 'BPCL 24/7 Highway Fuel Outlet, NH-44 Expressway, Kurnool',
    petrolBunkBrand: 'Bharat Petroleum (BPCL)',
    coordinates: [78.0515, 15.8020],
    plugsTotal: 12,
    plugsAvailable: 9,
    fastDcKw: 240,
    currentDrawKw: 480.0,
    energyTodayKwh: 2840.5,
    renewableSource: 'Kurnool Wind & Solar Hybrid',
    status: 'online',
    pricePerKwh: '₹ 9.00'
  },
  {
    id: 'ev-collectorate-green',
    name: 'IOCL Swarna Collectorate EV Hub',
    zone: 'Zone 05 · Civic Complex',
    location: 'Indian Oil Swarna Petrol Bunk, Collectorate Road, Kurnool',
    petrolBunkBrand: 'Indian Oil (IOCL)',
    coordinates: [78.0318, 15.8190],
    plugsTotal: 4,
    plugsAvailable: 3,
    fastDcKw: 60,
    currentDrawKw: 58.2,
    energyTodayKwh: 340.6,
    renewableSource: 'Solar Flower Dual-Axis Tracker',
    status: 'online',
    pricePerKwh: '₹ 7.50'
  },
  {
    id: 'ev-basaveswara-square',
    name: 'BPCL C-Camp Basaveswara EV Station',
    zone: 'Zone 04 · Commercial Hub',
    location: 'Bharat Petroleum Retail Outlet, Basaveswara Circle / C-Camp',
    petrolBunkBrand: 'Bharat Petroleum (BPCL)',
    coordinates: [78.0465, 15.8305],
    plugsTotal: 6,
    plugsAvailable: 2,
    fastDcKw: 90,
    currentDrawKw: 195.4,
    energyTodayKwh: 890.0,
    renewableSource: 'Bio-Junction & Rooftop Array',
    status: 'busy',
    pricePerKwh: '₹ 7.80'
  },
  {
    id: 'ev-tungabhadra-river',
    name: 'IOCL River Promenade EV Station',
    zone: 'Zone 02 · Waterfront',
    location: 'Indian Oil Petrol Pump, Tungabhadra Old Bridge Approach Road',
    petrolBunkBrand: 'Indian Oil (IOCL)',
    coordinates: [78.0410, 15.8125],
    plugsTotal: 6,
    plugsAvailable: 5,
    fastDcKw: 100,
    currentDrawKw: 85.0,
    energyTodayKwh: 520.4,
    renewableSource: 'Riverfront Micro-Hydro & Solar PPA',
    status: 'online',
    pricePerKwh: '₹ 8.00'
  },
  {
    id: 'ev-umsp-depot',
    name: 'Nayara Orvakal Solar Highway EV Plaza',
    zone: 'Solar Corridor Highway',
    location: 'Nayara Energy Petrol Bunk, Kurnool-Gani Solar Park Highway',
    petrolBunkBrand: 'Nayara Energy',
    coordinates: [78.2180, 15.6920],
    plugsTotal: 8,
    plugsAvailable: 7,
    fastDcKw: 150,
    currentDrawKw: 90.0,
    energyTodayKwh: 760.0,
    renewableSource: 'Direct 1000MW Solar Park Inverter Tap',
    status: 'online',
    pricePerKwh: '₹ 6.50'
  }
];

// ── 8. Official CEA Daily Generation & Outage Report Dataset (24/09/2026) ───
export interface CEADailyStationReport {
  station: string;
  state: string;
  region: 'Northern' | 'Western' | 'Southern' | 'Eastern' | 'North Eastern' | 'Bhutan';
  sector: 'State Sector' | 'Central Sector' | 'Private Sector';
  fuelType: 'THERMAL' | 'HYDRO' | 'NUCLEAR' | 'THER (GT)' | 'SOLAR' | 'WIND';
  monitoredCapMw: number;
  todayProgramMu: number;
  todayActualMu: number;
  aprilTillDateProgMu: number;
  aprilTillDateActualMu: number;
  coalStockDays: number | null;
  outageMw: number;
  remarks: string;
}

export const CEA_DAILY_GENERATION_24_09_2026: CEADailyStationReport[] = [
  // ── DELHI ──
  { station: 'PRAGATI CCGT-III', state: 'Delhi', region: 'Northern', sector: 'State Sector', fuelType: 'THER (GT)', monitoredCapMw: 1500, todayProgramMu: 7.04, todayActualMu: 13.73, aprilTillDateProgMu: 1223.96, aprilTillDateActualMu: 1586.67, coalStockDays: null, outageMw: 0, remarks: 'Operating above schedule' },
  { station: 'PRAGATI CCPP', state: 'Delhi', region: 'Northern', sector: 'State Sector', fuelType: 'THER (GT)', monitoredCapMw: 330.4, todayProgramMu: 3.60, todayActualMu: 3.81, aprilTillDateProgMu: 639.40, aprilTillDateActualMu: 673.28, coalStockDays: null, outageMw: 104.6, remarks: 'Normal operations' },
  { station: 'I.P.CCPP', state: 'Delhi', region: 'Northern', sector: 'State Sector', fuelType: 'THER (GT)', monitoredCapMw: 270, todayProgramMu: 0.83, todayActualMu: 0.80, aprilTillDateProgMu: 143.92, aprilTillDateActualMu: 168.80, coalStockDays: null, outageMw: 120.0, remarks: 'Partial outage' },

  // ── HARYANA ──
  { station: 'PANIPAT TPS', state: 'Haryana', region: 'Northern', sector: 'State Sector', fuelType: 'THERMAL', monitoredCapMw: 710, todayProgramMu: 7.63, todayActualMu: 14.99, aprilTillDateProgMu: 2047.12, aprilTillDateActualMu: 2284.06, coalStockDays: 1, outageMw: 0, remarks: 'Critical coal stock: 1 day' },
  { station: 'RAJIV GANDHI TPS', state: 'Haryana', region: 'Northern', sector: 'State Sector', fuelType: 'THERMAL', monitoredCapMw: 1200, todayProgramMu: 19.50, todayActualMu: 19.59, aprilTillDateProgMu: 2954.00, aprilTillDateActualMu: 3002.33, coalStockDays: 2, outageMw: 0, remarks: 'Stable generation' },
  { station: 'MAHATMA GANDHI TPS', state: 'Haryana', region: 'Northern', sector: 'Private Sector', fuelType: 'THERMAL', monitoredCapMw: 1320, todayProgramMu: 21.74, todayActualMu: 17.61, aprilTillDateProgMu: 3654.76, aprilTillDateActualMu: 4060.06, coalStockDays: 3, outageMw: 660, remarks: 'Unit 1 Electrical Fault' },
  { station: 'INDIRA GANDHI STPP', state: 'Haryana', region: 'Northern', sector: 'Central Sector', fuelType: 'THERMAL', monitoredCapMw: 1500, todayProgramMu: 24.49, todayActualMu: 23.37, aprilTillDateProgMu: 4211.76, aprilTillDateActualMu: 4311.57, coalStockDays: 5, outageMw: 0, remarks: 'Unit 2 Boiler Aux Problem' },

  // ── HIMACHAL PRADESH (HYDRO) ──
  { station: 'NATHPA JHAKRI HPS', state: 'Himachal Pradesh', region: 'Northern', sector: 'Central Sector', fuelType: 'HYDRO', monitoredCapMw: 1500, todayProgramMu: 33.50, todayActualMu: 19.09, aprilTillDateProgMu: 5171.00, aprilTillDateActualMu: 4594.10, coalStockDays: null, outageMw: 500, remarks: 'Major peaking plant' },
  { station: 'KARCHAM WANGTOO HPS', state: 'Himachal Pradesh', region: 'Northern', sector: 'Private Sector', fuelType: 'HYDRO', monitoredCapMw: 1045, todayProgramMu: 19.57, todayActualMu: 10.56, aprilTillDateProgMu: 3266.68, aprilTillDateActualMu: 2929.93, coalStockDays: null, outageMw: 0, remarks: 'Operating normally' },
  { station: 'DEHAR HPS', state: 'Himachal Pradesh', region: 'Northern', sector: 'Central Sector', fuelType: 'HYDRO', monitoredCapMw: 990, todayProgramMu: 10.00, todayActualMu: 8.76, aprilTillDateProgMu: 1720.00, aprilTillDateActualMu: 1719.19, coalStockDays: null, outageMw: 330, remarks: 'Beas-Sutlej link' },
  { station: 'KOLDAM', state: 'Himachal Pradesh', region: 'Northern', sector: 'Central Sector', fuelType: 'HYDRO', monitoredCapMw: 800, todayProgramMu: 12.00, todayActualMu: 7.94, aprilTillDateProgMu: 2467.00, aprilTillDateActualMu: 2172.48, coalStockDays: null, outageMw: 800, remarks: 'Full unit inspection' },
  { station: 'BHAKRA RIGHT HPS', state: 'Himachal Pradesh', region: 'Northern', sector: 'Central Sector', fuelType: 'HYDRO', monitoredCapMw: 785, todayProgramMu: 10.53, todayActualMu: 10.17, aprilTillDateProgMu: 1461.72, aprilTillDateActualMu: 1553.55, coalStockDays: null, outageMw: 0, remarks: 'High reservoir flow' },

  // ── GUJARAT ──
  { station: 'MUNDRA UMTPP', state: 'Gujarat', region: 'Western', sector: 'Private Sector', fuelType: 'THERMAL', monitoredCapMw: 4000, todayProgramMu: 47.67, todayActualMu: 61.12, aprilTillDateProgMu: 7799.08, aprilTillDateActualMu: 12155.34, coalStockDays: 0, outageMw: 800, remarks: 'Unit 5 HRH Line Leakage' },
  { station: 'ADANI MUNDRA TPP I & II', state: 'Gujarat', region: 'Western', sector: 'Private Sector', fuelType: 'THERMAL', monitoredCapMw: 2640, todayProgramMu: 43.47, todayActualMu: 44.76, aprilTillDateProgMu: 7014.28, aprilTillDateActualMu: 7038.10, coalStockDays: 0, outageMw: 0, remarks: 'Base load import coal' },
  { station: 'SARDAR SAROVAR RBPH', state: 'Gujarat', region: 'Western', sector: 'State Sector', fuelType: 'HYDRO', monitoredCapMw: 1200, todayProgramMu: 26.27, todayActualMu: 11.73, aprilTillDateProgMu: 2168.48, aprilTillDateActualMu: 1024.87, coalStockDays: null, outageMw: 0, remarks: 'Riverbed powerhouse' },
  { station: 'KAKRAPARA NUCLEAR', state: 'Gujarat', region: 'Western', sector: 'Central Sector', fuelType: 'NUCLEAR', monitoredCapMw: 1840, todayProgramMu: 35.57, todayActualMu: 42.20, aprilTillDateProgMu: 5813.68, aprilTillDateActualMu: 7125.28, coalStockDays: null, outageMw: 0, remarks: 'High capacity factor 98%' },

  // ── ANDHRA PRADESH ──
  { station: 'DAMODARAM SANJEEVAIAH TPS', state: 'Andhra Pradesh', region: 'Southern', sector: 'State Sector', fuelType: 'THERMAL', monitoredCapMw: 2400, todayProgramMu: 35.00, todayActualMu: 36.69, aprilTillDateProgMu: 6005.00, aprilTillDateActualMu: 6297.23, coalStockDays: 5, outageMw: 0, remarks: 'Krishnapatnam coastal supercritical' },
  { station: 'DR. N. TATA RAO TPS', state: 'Andhra Pradesh', region: 'Southern', sector: 'State Sector', fuelType: 'THERMAL', monitoredCapMw: 2560, todayProgramMu: 47.38, todayActualMu: 37.18, aprilTillDateProgMu: 7507.12, aprilTillDateActualMu: 7602.22, coalStockDays: 2, outageMw: 210, remarks: 'Unit 4 Tube Leakage' },
  { station: 'RAYALASEEMA TPS', state: 'Andhra Pradesh', region: 'Southern', sector: 'State Sector', fuelType: 'THERMAL', monitoredCapMw: 1650, todayProgramMu: 29.27, todayActualMu: 22.92, aprilTillDateProgMu: 4720.48, aprilTillDateActualMu: 4700.94, coalStockDays: 3, outageMw: 210, remarks: 'Unit 3 Water Wall Leakage' },
  { station: 'PINNAPURAM PSP & HPS', state: 'Andhra Pradesh', region: 'Southern', sector: 'Private Sector', fuelType: 'HYDRO', monitoredCapMw: 1680, todayProgramMu: 0.00, todayActualMu: 10.40, aprilTillDateProgMu: 0.00, aprilTillDateActualMu: 1801.72, coalStockDays: null, outageMw: 0, remarks: 'Kurnool Integrated Renewable Storage' },
  { station: 'SRISAILAM HPS', state: 'Andhra Pradesh', region: 'Southern', sector: 'State Sector', fuelType: 'HYDRO', monitoredCapMw: 770, todayProgramMu: 7.33, todayActualMu: 0.00, aprilTillDateProgMu: 580.92, aprilTillDateActualMu: 73.68, coalStockDays: null, outageMw: 110, remarks: 'Water conservation mode' },
  { station: 'SIMHADRI STPS', state: 'Andhra Pradesh', region: 'Southern', sector: 'Central Sector', fuelType: 'THERMAL', monitoredCapMw: 2000, todayProgramMu: 32.63, todayActualMu: 31.68, aprilTillDateProgMu: 5597.12, aprilTillDateActualMu: 6279.03, coalStockDays: 5, outageMw: 0, remarks: 'NTPC coastal station' },

  // ── RAJASTHAN ──
  { station: 'RAJASTHAN A.P.S. (RAWATBHATA)', state: 'Rajasthan', region: 'Northern', sector: 'Central Sector', fuelType: 'NUCLEAR', monitoredCapMw: 1780, todayProgramMu: 33.14, todayActualMu: 40.30, aprilTillDateProgMu: 8180.42, aprilTillDateActualMu: 6710.31, coalStockDays: null, outageMw: 0, remarks: 'Unit 7 online at 15.54 MU/day' },
  { station: 'SURATGARH STPS', state: 'Rajasthan', region: 'Northern', sector: 'State Sector', fuelType: 'THERMAL', monitoredCapMw: 1320, todayProgramMu: 22.16, todayActualMu: 23.55, aprilTillDateProgMu: 3274.85, aprilTillDateActualMu: 3929.03, coalStockDays: 3, outageMw: 0, remarks: 'Operating normally' },
  { station: 'CHHABRA-II TPP', state: 'Rajasthan', region: 'Northern', sector: 'State Sector', fuelType: 'THERMAL', monitoredCapMw: 1320, todayProgramMu: 23.79, todayActualMu: 23.18, aprilTillDateProgMu: 3671.96, aprilTillDateActualMu: 3988.75, coalStockDays: 4, outageMw: 0, remarks: 'Stable output' },

  // ── TAMIL NADU ──
  { station: 'KUDANKULAM NUCLEAR', state: 'Tamil Nadu', region: 'Southern', sector: 'Central Sector', fuelType: 'NUCLEAR', monitoredCapMw: 2000, todayProgramMu: 40.76, todayActualMu: 48.86, aprilTillDateProgMu: 6818.24, aprilTillDateActualMu: 8018.25, coalStockDays: null, outageMw: 0, remarks: '100% capacity factor' },
  { station: 'TUTICORIN TPS', state: 'Tamil Nadu', region: 'Southern', sector: 'State Sector', fuelType: 'THERMAL', monitoredCapMw: 1050, todayProgramMu: 11.80, todayActualMu: 14.03, aprilTillDateProgMu: 2524.20, aprilTillDateActualMu: 2385.06, coalStockDays: 6, outageMw: 420, remarks: 'Unit 1 & 2 Cable/Aux problems' },

  // ── MAHARASHTRA ──
  { station: 'CHANDRAPUR STPS', state: 'Maharashtra', region: 'Western', sector: 'State Sector', fuelType: 'THERMAL', monitoredCapMw: 2920, todayProgramMu: 44.14, todayActualMu: 50.92, aprilTillDateProgMu: 7501.69, aprilTillDateActualMu: 7766.87, coalStockDays: 5, outageMw: 0, remarks: 'Major state baseload' },
  { station: 'KOYNA I-IV HPS', state: 'Maharashtra', region: 'Western', sector: 'State Sector', fuelType: 'HYDRO', monitoredCapMw: 1956, todayProgramMu: 7.67, todayActualMu: 2.23, aprilTillDateProgMu: 1489.60, aprilTillDateActualMu: 1872.97, coalStockDays: null, outageMw: 0, remarks: 'Peaking hydro generation' },
  { station: 'TARAPUR NUCLEAR', state: 'Maharashtra', region: 'Western', sector: 'Central Sector', fuelType: 'NUCLEAR', monitoredCapMw: 1400, todayProgramMu: 26.63, todayActualMu: 28.69, aprilTillDateProgMu: 3834.12, aprilTillDateActualMu: 3973.08, coalStockDays: null, outageMw: 0, remarks: 'India oldest atomic station' }
];

// ── 9. Official CEA API Endpoints Registry (Matching cea.nic.in/api-for-central-electricity-authority-data) ──
export interface CEAEndpointSpec {
  endpoint: string;
  name: string;
  category: string;
  method: 'GET' | 'POST';
  description: string;
  frequency: 'Daily' | 'Monthly' | 'Hourly' | 'Annual';
  params: string[];
}

export const CEA_API_ENDPOINTS: CEAEndpointSpec[] = [
  {
    endpoint: '/api/v1/power-generation/daily-station-wise',
    name: 'Daily Station-Wise Generation Report',
    category: 'Generation',
    method: 'GET',
    frequency: 'Daily',
    description: 'Returns unit-wise and station-wise daily program, actual generation (MU), coal stocks, and forced outage reasons across all regions.',
    params: ['date', 'region', 'state', 'sector', 'fuel_type']
  },
  {
    endpoint: '/api/v1/renewable-energy/monthly-generation',
    name: 'Monthly Renewable Energy Generation (RES)',
    category: 'Renewables',
    method: 'GET',
    frequency: 'Monthly',
    description: 'State-wise and source-wise (Solar, Wind, Large Hydro, Small Hydro, Biomass, Bagasse, Waste-to-Energy) monthly injected energy.',
    params: ['month', 'year', 'state', 'source']
  },
  {
    endpoint: '/api/v1/installed-capacity/state-fuel-wise',
    name: 'All India Installed Capacity Composition',
    category: 'Capacity',
    method: 'GET',
    frequency: 'Monthly',
    description: 'Sector-wise and fuel-wise monitored and installed capacity (MW) as of the last day of the month.',
    params: ['as_on_date', 'state_id', 'sector']
  },
  {
    endpoint: '/api/v1/transmission-lines/corridor-power-flow',
    name: 'Inter-Regional Transmission Flow & ATC',
    category: 'Transmission',
    method: 'GET',
    frequency: 'Hourly',
    description: 'Real-time megawatt power transfer across 765kV/800kV Green Energy Corridors and Inter-State Transmission Systems (ISTS).',
    params: ['corridor_id', 'voltage_level', 'from_region', 'to_region']
  },
  {
    endpoint: '/api/v1/ev-public-charging/monthly-consumption',
    name: 'EV Public Charging Stations (PCS) Consumption',
    category: 'E-Mobility',
    method: 'GET',
    frequency: 'Monthly',
    description: 'State-wise and DISCOM-wise electricity consumption in MU for Light and Heavy Duty EV charging stations.',
    params: ['month', 'year', 'discom_code', 'state']
  },
  {
    endpoint: '/api/v1/resource-adequacy/hourly-demand-dispatch',
    name: 'Resource Adequacy & Unserved Energy Projections',
    category: 'Planning',
    method: 'GET',
    frequency: 'Annual',
    description: 'Long-term least-cost capacity expansion, PRM analysis, loss of load probability (LOLP), and energy not served (EENS).',
    params: ['state', 'projection_year', 'scenario']
  }
];

