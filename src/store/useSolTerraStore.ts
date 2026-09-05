import { create } from 'zustand';
import { 
  ActivePage, 
  AssetCategory, 
  InfrastructureAsset, 
  SimulationConfig, 
  TelemetryState, 
  ProposedScenario, 
  AlertItem, 
  MaintenanceTask, 
  CommunityProject, 
  WeatherScenarioType,
  ThemeMode 
} from '../types/solterra';
import { 
  INITIAL_ASSETS, 
  calculateTelemetry, 
  calculateSolarIrradianceFactor 
} from '../services/simulationEngine';

interface SolTerraState {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  
  // Theme Switching
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  
  // Mapbox & Token Configuration
  mapboxToken: string;
  setMapboxToken: (token: string) => void;
  
  // Infrastructure Assets
  assets: InfrastructureAsset[];
  selectedAsset: InfrastructureAsset | null;
  setSelectedAsset: (asset: InfrastructureAsset | null) => void;
  selectedCategory: AssetCategory;
  setSelectedCategory: (cat: AssetCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: 'health' | 'generation' | 'capacity' | 'name';
  setSortBy: (sort: 'health' | 'generation' | 'capacity' | 'name') => void;
  
  // Layer Filtering
  activeLayers: string[];
  toggleLayer: (layerName: string) => void;
  
  // Simulation Controls & Telemetry
  simulationConfig: SimulationConfig;
  setSimulatedHour: (hour: number) => void;
  togglePlaySimulation: () => void;
  setSpeedMultiplier: (speed: number) => void;
  setWeatherScenario: (scenario: WeatherScenarioType) => void;
  setCloudCover: (percent: number) => void;
  setUrbanGrowth: (zoneId: string, value: number) => void;
  toggleGridConstraint: (constraint: 'microgridIslanding' | 'peakShaving' | 'curtailmentPrevention') => void;
  advanceSimulationTick: (deltaSeconds: number) => void;
  telemetry: TelemetryState;
  
  // Camera & Navigation
  cameraFocus: [number, number] | null;
  setCameraFocus: (coords: [number, number] | null) => void;
  viewMode3D: boolean;
  setViewMode3D: (is3D: boolean) => void;
  
  // Alerts & Maintenance
  alerts: AlertItem[];
  acknowledgeAlert: (id: string) => void;
  maintenanceTasks: MaintenanceTask[];
  updateMaintenanceTaskStatus: (id: string, status: MaintenanceTask['status']) => void;
  
  // Scenarios & What-If Planning
  scenario: ProposedScenario;
  addProposedAsset: (asset: Omit<InfrastructureAsset, 'id' | 'isProposed'>) => void;
  toggleScenarioActive: () => void;
  resetScenario: () => void;
  
  // Community Hub
  communityProjects: CommunityProject[];
  joinCommunityProject: (id: string) => void;
  
  // Modals & Panels
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const INITIAL_CONFIG: SimulationConfig = {
  simulatedHour: 12.0, // 12:00 PM Midday
  isPlaying: false,
  speedMultiplier: 1,
  targetDate: 'May 26, 2026',
  weatherScenario: 'average',
  cloudCoverPercent: 24,
  ambientTemperature: 28, // °C
  aqi: 38,
  urbanGrowth: {
    'Zone 01': 13.0,
    'Zone 02': 13.9,
    'Zone 03': 5.0,
    'Zone 04': 18.2,
    'Zone 05': 8.5
  },
  gridConstraints: {
    microgridIslanding: true,
    peakShaving: false,
    curtailmentPrevention: true
  }
};

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-01',
    title: 'High Panel Temperature',
    message: 'PV-210 Rooftop array operating at 54.8°C (+12°C above baseline)',
    severity: 'warning',
    assetId: 'PV-210',
    timestamp: '11:42 AM',
    acknowledged: false
  },
  {
    id: 'alt-02',
    title: 'Low Battery Reserve Alert',
    message: 'SP-118 Smart Pole battery dropped below 15% overnight discharge threshold',
    severity: 'critical',
    assetId: 'SP-118',
    timestamp: '06:15 AM',
    acknowledged: false
  },
  {
    id: 'alt-03',
    title: 'Scheduled Inverter Inspection Due',
    message: 'SF-042 Solar Flower annual tracking servo maintenance overdue',
    severity: 'info',
    assetId: 'SF-042',
    timestamp: 'Yesterday',
    acknowledged: true
  },
  {
    id: 'alt-04',
    title: 'Peak Demand Predicted',
    message: 'Industrial zone afternoon cooling surge expected between 14:00 - 16:00',
    severity: 'warning',
    timestamp: '10:00 AM',
    acknowledged: false
  }
];

const INITIAL_MAINTENANCE: MaintenanceTask[] = [
  {
    id: 'maint-101',
    assetId: 'PV-210',
    assetName: 'Rooftop Solar Array',
    issue: 'Inverter thermal throttling due to dust accumulation on heatsink',
    severity: 'high',
    detectedTime: 'May 26, 09:15 AM',
    recommendedAction: 'Clean inverter ventilation grid and inspect cooling fan',
    status: 'in_progress',
    assignedTo: 'Kurnool Field Team A',
    estimatedHours: 2.5
  },
  {
    id: 'maint-102',
    assetId: 'SF-042',
    assetName: 'Solar Flower',
    issue: 'Azimuth dual-axis tracker servo calibration offset (+3.5°)',
    severity: 'medium',
    detectedTime: 'May 25, 14:30 PM',
    recommendedAction: 'Re-zero GPS astronomical clock angle sensor',
    status: 'assigned',
    assignedTo: 'Rajesh K. (Senior Tech)',
    estimatedHours: 1.0
  },
  {
    id: 'maint-103',
    assetId: 'SP-118',
    assetName: 'Smart Pole',
    issue: 'LiFePO4 battery cell balance deviation',
    severity: 'critical',
    detectedTime: 'May 26, 06:15 AM',
    recommendedAction: 'Cell balancer diagnostic and firmware recalibration',
    status: 'pending',
    estimatedHours: 3.0
  },
  {
    id: 'maint-104',
    assetId: 'BJ-07',
    assetName: 'Bio-Junction',
    issue: 'Algae nutrient solution pH sensor drift (7.8 vs target 6.8)',
    severity: 'low',
    detectedTime: 'May 24, 11:00 AM',
    recommendedAction: 'Automatic dosing pump buffer refill',
    status: 'resolved',
    assignedTo: 'Eco-Team Beta',
    estimatedHours: 0.5
  }
];

const INITIAL_SCENARIO: ProposedScenario = {
  id: 'scen-2028',
  name: 'Vision 2028: Kurnool Microgrid Expansion',
  targetDate: 'June 1, 2028',
  proposedAssets: [
    {
      id: 'PROP-SF-101',
      name: 'Proposed Solar Flower Cluster',
      type: 'solar_flower',
      category: 'solar',
      status: 'active',
      health: 100,
      coordinates: [78.0410, 15.8200],
      zone: 'Zone 04',
      zoneName: 'Residential South Extension',
      capacityKw: 25.0,
      currentPowerKw: 22.8,
      todayGenerationKwh: 92.0,
      efficiency: 94.0,
      co2AvoidedKg: 42.0,
      installedDate: 'Proposed 2028',
      isProposed: true
    },
    {
      id: 'PROP-BT-102',
      name: 'Proposed 10MWh BESS Substation',
      type: 'battery_system',
      category: 'storage',
      status: 'active',
      health: 100,
      coordinates: [78.0320, 15.8280],
      zone: 'Zone 03',
      zoneName: 'Transport Hub Reserve',
      capacityKw: 5000.0,
      currentPowerKw: 120.0,
      todayGenerationKwh: 0,
      efficiency: 95.5,
      co2AvoidedKg: 85.0,
      batteryStorageKwh: 10000,
      batterySocPercent: 90,
      installedDate: 'Proposed 2028',
      isProposed: true
    }
  ],
  projectedCityScore: 94,
  projectedRenewableShare: 93.8,
  projectedCo2Reduction: 184.2,
  estimatedEnergyCost: 3.80,
  systemWeaknessMw: 14.2,
  isActive: false
};

const INITIAL_COMMUNITY_PROJECTS: CommunityProject[] = [
  {
    id: 'proj-01',
    name: 'Rooftop Solar Collective Kurnool',
    category: 'Solar Energy',
    description: 'Community-pooled residential rooftop installation across 140 households in Zone 04.',
    membersCount: 384,
    energyGeneratedMwh: 142.5,
    waterSavedLiters: 45000,
    progressPercent: 78,
    status: 'active',
    organizer: 'Kurnool Clean Energy Trust',
    location: 'Zone 04, Residential South',
    badge: 'Trending'
  },
  {
    id: 'proj-02',
    name: 'Tungabhadra Rainwater & Bio-Junctions',
    category: 'Water & Bio-Ecology',
    description: 'Decentralized runoff catchment and micro-algae biological carbon capture along the riverfront.',
    membersCount: 245,
    energyGeneratedMwh: 28.4,
    waterSavedLiters: 650000,
    progressPercent: 62,
    status: 'active',
    organizer: 'Eco-Kurnool Initiative',
    location: 'Zone 02, Riverfront',
    badge: 'High Impact'
  },
  {
    id: 'proj-03',
    name: 'Community EV Micro-Fleet Charging',
    category: 'Clean Mobility',
    description: 'Shared solar-canopy charging depot prioritizing local auto-rickshaws and delivery e-bikes.',
    membersCount: 512,
    energyGeneratedMwh: 64.1,
    waterSavedLiters: 12000,
    progressPercent: 91,
    status: 'active',
    organizer: 'Urban Mobility Forum',
    location: 'Zone 01 & Zone 03 Hub',
    badge: 'Near Target'
  },
  {
    id: 'proj-04',
    name: 'School Microgrid & STEM Lab',
    category: 'Education & Resilience',
    description: 'Interactive renewable telemetry monitor & student battery workshop for government high schools.',
    membersCount: 180,
    energyGeneratedMwh: 18.2,
    waterSavedLiters: 18000,
    progressPercent: 45,
    status: 'upcoming',
    organizer: 'Andhra Green Schools',
    location: 'Zone 05, Educational Zone',
    badge: 'New'
  }
];

export const useSolTerraStore = create<SolTerraState>((set, get) => {
  // Read token from environment or localStorage
  const envToken = (import.meta as any).env?.VITE_MAPBOX_TOKEN || '';
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('solterra_mapbox_token') || '' : '';
  const initialToken = storedToken || envToken;

  const initialTelemetry = calculateTelemetry(INITIAL_ASSETS, INITIAL_CONFIG, null);

  return {
    activePage: 'citytwin',
    setActivePage: (activePage) => set({ activePage }),

    theme: (typeof window !== 'undefined' ? (localStorage.getItem('solterra_theme') as ThemeMode) : null) || 'dark-obsidian',
    setTheme: (theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('solterra_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
      set({ theme });
    },
    
    mapboxToken: initialToken,
    setMapboxToken: (mapboxToken) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('solterra_mapbox_token', mapboxToken);
      }
      set({ mapboxToken });
    },
    
    assets: INITIAL_ASSETS,
    selectedAsset: null,
    setSelectedAsset: (selectedAsset) => {
      set({ selectedAsset });
      if (selectedAsset) {
        set({ cameraFocus: selectedAsset.coordinates });
      }
    },
    
    selectedCategory: 'all',
    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    searchQuery: '',
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    statusFilter: 'all',
    setStatusFilter: (statusFilter) => set({ statusFilter }),
    sortBy: 'health',
    setSortBy: (sortBy) => set({ sortBy }),
    
    activeLayers: ['All Layers', 'Renewable', 'Storage', 'Mobility', 'Infrastructure'],
    toggleLayer: (layerName) => {
      const current = get().activeLayers;
      if (layerName === 'All Layers') {
        set({ activeLayers: current.includes('All Layers') ? [] : ['All Layers', 'Renewable', 'Storage', 'Mobility', 'Infrastructure', 'Ecology', 'Water', 'Environment'] });
        return;
      }
      if (current.includes(layerName)) {
        set({ activeLayers: current.filter(l => l !== layerName && l !== 'All Layers') });
      } else {
        set({ activeLayers: [...current, layerName] });
      }
    },
    
    simulationConfig: INITIAL_CONFIG,
    setSimulatedHour: (simulatedHour) => {
      const config = { ...get().simulationConfig, simulatedHour };
      const telemetry = calculateTelemetry(get().assets, config, get().scenario);
      set({ simulationConfig: config, telemetry });
    },
    togglePlaySimulation: () => {
      const isPlaying = !get().simulationConfig.isPlaying;
      set(state => ({ simulationConfig: { ...state.simulationConfig, isPlaying } }));
    },
    setSpeedMultiplier: (speedMultiplier) => {
      set(state => ({ simulationConfig: { ...state.simulationConfig, speedMultiplier } }));
    },
    setWeatherScenario: (weatherScenario) => {
      let cloudCoverPercent = 24;
      let ambientTemperature = 28;
      if (weatherScenario === 'optimistic') {
        cloudCoverPercent = 8;
        ambientTemperature = 32;
      } else if (weatherScenario === 'pessimistic') {
        cloudCoverPercent = 75;
        ambientTemperature = 23;
      }
      const config = { ...get().simulationConfig, weatherScenario, cloudCoverPercent, ambientTemperature };
      const telemetry = calculateTelemetry(get().assets, config, get().scenario);
      set({ simulationConfig: config, telemetry });
    },
    setCloudCover: (cloudCoverPercent) => {
      const config = { ...get().simulationConfig, cloudCoverPercent };
      const telemetry = calculateTelemetry(get().assets, config, get().scenario);
      set({ simulationConfig: config, telemetry });
    },
    setUrbanGrowth: (zoneId, value) => {
      const urbanGrowth = { ...get().simulationConfig.urbanGrowth, [zoneId]: value };
      const config = { ...get().simulationConfig, urbanGrowth };
      const telemetry = calculateTelemetry(get().assets, config, get().scenario);
      set({ simulationConfig: config, telemetry });
    },
    toggleGridConstraint: (constraint) => {
      const gridConstraints = {
        ...get().simulationConfig.gridConstraints,
        [constraint]: !get().simulationConfig.gridConstraints[constraint]
      };
      const config = { ...get().simulationConfig, gridConstraints };
      const telemetry = calculateTelemetry(get().assets, config, get().scenario);
      set({ simulationConfig: config, telemetry });
    },
    advanceSimulationTick: (deltaSeconds) => {
      const { simulatedHour, speedMultiplier } = get().simulationConfig;
      // In 1x speed: 1 real second = 0.05 simulated hours (~3 min)
      let newHour = simulatedHour + (deltaSeconds * 0.08 * speedMultiplier);
      if (newHour >= 24) newHour = 0;
      
      const config = { ...get().simulationConfig, simulatedHour: +newHour.toFixed(2) };
      const telemetry = calculateTelemetry(get().assets, config, get().scenario);
      set({ simulationConfig: config, telemetry });
    },
    
    telemetry: initialTelemetry,
    
    cameraFocus: null,
    setCameraFocus: (cameraFocus) => set({ cameraFocus }),
    viewMode3D: true,
    setViewMode3D: (viewMode3D) => set({ viewMode3D }),
    
    alerts: INITIAL_ALERTS,
    acknowledgeAlert: (id) => {
      set(state => ({
        alerts: state.alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a)
      }));
    },
    
    maintenanceTasks: INITIAL_MAINTENANCE,
    updateMaintenanceTaskStatus: (id, status) => {
      set(state => ({
        maintenanceTasks: state.maintenanceTasks.map(t => t.id === id ? { ...t, status } : t)
      }));
    },
    
    scenario: INITIAL_SCENARIO,
    addProposedAsset: (newAssetData) => {
      const newAsset: InfrastructureAsset = {
        ...newAssetData,
        id: `PROP-${Date.now().toString().slice(-4)}`,
        isProposed: true,
        installedDate: 'Proposed (What-If)'
      };
      const updatedScenario: ProposedScenario = {
        ...get().scenario,
        proposedAssets: [...get().scenario.proposedAssets, newAsset],
        isActive: true
      };
      const telemetry = calculateTelemetry(get().assets, get().simulationConfig, updatedScenario);
      set({ scenario: updatedScenario, telemetry });
    },
    toggleScenarioActive: () => {
      const isActive = !get().scenario.isActive;
      const updatedScenario = { ...get().scenario, isActive };
      const telemetry = calculateTelemetry(get().assets, get().simulationConfig, updatedScenario);
      set({ scenario: updatedScenario, telemetry });
    },
    resetScenario: () => {
      const updatedScenario = { ...INITIAL_SCENARIO, isActive: false };
      const telemetry = calculateTelemetry(get().assets, get().simulationConfig, updatedScenario);
      set({ scenario: updatedScenario, telemetry });
    },
    
    communityProjects: INITIAL_COMMUNITY_PROJECTS,
    joinCommunityProject: (id) => {
      set(state => ({
        communityProjects: state.communityProjects.map(p => 
          p.id === id ? { ...p, membersCount: p.membersCount + 1 } : p
        )
      }));
    },
    
    isCopilotOpen: false,
    setIsCopilotOpen: (isCopilotOpen) => set({ isCopilotOpen }),
    isSettingsOpen: false,
    setIsSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen })
  };
});
