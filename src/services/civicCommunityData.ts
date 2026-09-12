import { CivicProposal, CommunityFeedPost, SustainabilityChallenge, CivicNotification } from '../types/solterra';

export const INITIAL_CIVIC_PROPOSALS: CivicProposal[] = [
  {
    id: 'prop-01',
    title: 'Rooftop Solar Collective Kurnool',
    category: 'Solar Energy',
    location: 'Zone 04, Residential South, Kurnool',
    zone: 'Zone 04',
    coordinates: [78.0365, 15.8190],
    description: 'Community-pooled residential rooftop installation across 140 households in Zone 04 to create a distributed virtual power plant (VPP).',
    proposedIntervention: 'Installation of standardized 3.5 kW Tier-1 monocrystalline solar PV arrays on 140 residential rooftops with micro-inverters and centralized smart metering connected to the local distribution transformer.',
    expectedBenefit: {
      cleanEnergyKw: 490,
      annualGenerationMwh: 715.4,
      co2AvoidedTons: 586.6,
      waterSavedLiters: 92000,
      benefitedCitizens: 680,
      estimatedCostLakhs: 98.5
    },
    supportingDocuments: [
      { name: 'KMC_Rooftop_Solar_Feasibility_Study.pdf', size: '2.4 MB', type: 'application/pdf' },
      { name: 'APCPDCL_Grid_Interconnection_Approval.pdf', size: '1.1 MB', type: 'application/pdf' },
      { name: 'Neighborhood_Structural_Roof_Survey.pdf', size: '3.8 MB', type: 'application/pdf' }
    ],
    lifecycleStatus: 'Approved',
    submittedDate: 'Feb 14, 2026',
    submittedBy: {
      name: 'P. Venkat Rao',
      role: 'President, Zone 04 Residents Welfare Association',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    supportCount: 542,
    userVoted: false,
    governmentResponse: {
      authority: 'Kurnool Municipal Corporation (KMC) & APCPDCL',
      officialName: 'Dr. G. Rama Mohan, Commissioner KMC',
      reviewDate: 'March 18, 2026',
      status: 'sanctioned',
      officialRemarks: 'Technical grid study completed by APCPDCL. Approved under Kurnool Smart Green City Phase II with 40% municipal co-funding subsidy. Engineering procurement scheduled.'
    },
    linkedAssetId: 'PV-210',
    timeline: [
      { stage: 'Proposed', date: 'Feb 14, 2026', notes: 'Submitted by Zone 04 RWA with 120 initial resident signatures.' },
      { stage: 'Community Review', date: 'Feb 28, 2026', notes: 'Public discussion held at Kurnool Town Hall; 542 citizens endorsed.' },
      { stage: 'Under Evaluation', date: 'March 05, 2026', notes: 'Transformer hosting capacity verified by municipal electrical inspector.' },
      { stage: 'Approved', date: 'March 18, 2026', notes: 'Formal municipal sanction letter issued by Municipal Commissioner.' }
    ]
  },
  {
    id: 'prop-02',
    title: 'Tungabhadra Riverfront Algae Bio-Junctions',
    category: 'Bio-Junctions',
    location: 'Zone 02, Basaveswara Circle & Riverfront',
    zone: 'Zone 02',
    coordinates: [78.04509, 15.83183],
    description: 'Decentralized runoff catchment and micro-algae biological carbon capture monuments replacing conventional concrete traffic circle islands.',
    proposedIntervention: 'Erection of a 26-meter diameter biometric algae photobioreactor monument at Basaveswara Circle with integrated solar canopy and bio-filter loop treating riverbank storm runoff.',
    expectedBenefit: {
      cleanEnergyKw: 15,
      annualGenerationMwh: 28.5,
      co2AvoidedTons: 142.8,
      waterSavedLiters: 650000,
      benefitedCitizens: 24000,
      estimatedCostLakhs: 145.0
    },
    supportingDocuments: [
      { name: 'Algae_Photobioreactor_Engineering_Specs.pdf', size: '5.2 MB', type: 'application/pdf' },
      { name: 'Tungabhadra_Hydrology_Runoff_Assessment.pdf', size: '4.1 MB', type: 'application/pdf' }
    ],
    lifecycleStatus: 'Under Construction',
    submittedDate: 'Nov 10, 2025',
    submittedBy: {
      name: 'Ananya Deshmukh',
      role: 'Lead Urban Ecologist, Eco-Kurnool Initiative',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    supportCount: 420,
    userVoted: false,
    governmentResponse: {
      authority: 'Andhra Pradesh Urban Infrastructure Fund (APUIF)',
      officialName: 'K. Srinivasa Rao, Executive Engineer',
      reviewDate: 'Jan 12, 2026',
      status: 'budget_allocated',
      officialRemarks: 'Project sanctioned under Urban Ecology Innovation budget. Structural foundations completed. Glass cylinder bioreactor modules being assembled on site.'
    },
    linkedAssetId: 'BJ-07',
    timeline: [
      { stage: 'Proposed', date: 'Nov 10, 2025', notes: 'Civic proposal submitted with 3D model render and water quality data.' },
      { stage: 'Community Review', date: 'Dec 02, 2025', notes: '420 community endorsements recorded.' },
      { stage: 'Approved', date: 'Jan 12, 2026', notes: 'Sanctioned by Municipal Council.' },
      { stage: 'Planned', date: 'Feb 01, 2026', notes: 'Contractor appointed for civil foundations.' },
      { stage: 'Under Construction', date: 'April 02, 2026', notes: 'Foundation poured; biometric tower structural rib installation underway.' }
    ]
  },
  {
    id: 'prop-03',
    title: 'Central Auto-Rickshaw Solar EV Depot',
    category: 'EV/Mobility',
    location: 'Zone 01 & Zone 03 Hub, Railway Station Rd',
    zone: 'Zone 01',
    coordinates: [78.03836, 15.82874],
    description: 'Shared solar-canopy fast charging depot with battery swap racks dedicated to local auto-rickshaw drivers and delivery e-cargo fleets.',
    proposedIntervention: 'Deployment of 12 dual-gun CCS2 60kW DC fast chargers sheltered by an elevated 120 kW bifacial solar canopy structure with integrated 200 kWh buffer battery storage.',
    expectedBenefit: {
      cleanEnergyKw: 120,
      annualGenerationMwh: 184.0,
      co2AvoidedTons: 290.4,
      benefitedCitizens: 1200,
      estimatedCostLakhs: 82.0
    },
    supportingDocuments: [
      { name: 'Kurnool_Auto_Drivers_Union_MOU.pdf', size: '1.8 MB', type: 'application/pdf' },
      { name: 'EV_Canopy_Structural_Plan.dwg', size: '3.4 MB', type: 'application/dwg' }
    ],
    lifecycleStatus: 'Planned',
    submittedDate: 'Jan 05, 2026',
    submittedBy: {
      name: 'M. Shafiullah',
      role: 'Secretary, Kurnool Clean Drivers Association',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    supportCount: 615,
    userVoted: false,
    governmentResponse: {
      authority: 'District Transport Authority & KMC',
      officialName: 'S. Chandrasekhar, Joint Transport Commissioner',
      reviewDate: 'Feb 22, 2026',
      status: 'technical_feasibility_passed',
      officialRemarks: 'Land parcel cleared near Kurnool City Railway Station. Electrical substation feeder line confirmed by DISCOM. Awaiting final tender floating.'
    },
    linkedAssetId: 'EV-01',
    timeline: [
      { stage: 'Proposed', date: 'Jan 05, 2026', notes: 'Initial proposal by Auto-Rickshaw Union.' },
      { stage: 'Community Review', date: 'Jan 25, 2026', notes: 'Overwhelming support with 615 citizen and driver signatures.' },
      { stage: 'Under Evaluation', date: 'Feb 10, 2026', notes: 'DISCOM traffic impact and feeder capacity cleared.' },
      { stage: 'Approved', date: 'Feb 22, 2026', notes: 'Approved by District Administration.' },
      { stage: 'Planned', date: 'March 15, 2026', notes: 'Detailed Project Report (DPR) finalized.' }
    ]
  },
  {
    id: 'prop-04',
    title: 'Government Medical College Hospital Critical BESS Microgrid',
    category: 'Energy Storage',
    location: 'Zone 05, Educational & Health Enclave',
    zone: 'Zone 05',
    coordinates: [78.04152, 15.80846],
    description: 'Utility-scale Lithium Iron Phosphate (LFP) battery energy storage system to provide 100% resilient zero-emission backup for intensive care units and medical labs.',
    proposedIntervention: '1 MW / 4 MWh BESS containerized facility paired with 500 kW hospital rooftop solar, delivering sub-10ms seamless islanding during grid disturbances.',
    expectedBenefit: {
      cleanEnergyKw: 500,
      annualGenerationMwh: 730.0,
      co2AvoidedTons: 410.0,
      benefitedCitizens: 85000,
      estimatedCostLakhs: 320.0
    },
    supportingDocuments: [
      { name: 'Hospital_Critical_Load_Profile_Audit.pdf', size: '4.8 MB', type: 'application/pdf' },
      { name: 'LFP_Fire_Safety_Resilience_Certificate.pdf', size: '2.1 MB', type: 'application/pdf' }
    ],
    lifecycleStatus: 'Under Evaluation',
    submittedDate: 'March 01, 2026',
    submittedBy: {
      name: 'Dr. K. Sujatha',
      role: 'Superintendent, Kurnool General Hospital',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop'
    },
    supportCount: 310,
    userVoted: false,
    governmentResponse: {
      authority: 'AP Medical Services Corporation & AP Transco',
      officialName: 'N. Narayana, Chief Electrical Inspector',
      reviewDate: 'March 29, 2026',
      status: 'under_review',
      officialRemarks: 'Evaluating diesel generator abatement credit versus LFP capital outlay. Detailed load step response testing in progress.'
    },
    linkedAssetId: 'BESS-01',
    timeline: [
      { stage: 'Proposed', date: 'March 01, 2026', notes: 'Submitted by Medical Superintendent.' },
      { stage: 'Community Review', date: 'March 15, 2026', notes: '310 healthcare workers and citizens endorsed.' },
      { stage: 'Under Evaluation', date: 'March 29, 2026', notes: 'State health department technical review.' }
    ]
  },
  {
    id: 'prop-05',
    title: 'Historic Old City Street Smart Pole & Efficiency Retrofit',
    category: 'Energy Efficiency',
    location: 'Zone 03, Old Town Market Corridor',
    zone: 'Zone 03',
    coordinates: [78.02157, 15.82464],
    description: 'Replacing high-pressure sodium street lamps with smart LED adaptive dimming poles integrated with solar micro-batteries, environmental air quality sensors, and pedestrian cameras.',
    proposedIntervention: 'Replacement of 320 antiquated street fixtures with SolTerra SP-118 IoT smart poles with autonomous sun tracking and automatic twilight dimming schedules.',
    expectedBenefit: {
      cleanEnergyKw: 64,
      annualGenerationMwh: 93.4,
      co2AvoidedTons: 76.5,
      benefitedCitizens: 35000,
      estimatedCostLakhs: 48.0
    },
    supportingDocuments: [
      { name: 'Old_City_Lighting_Energy_Audit.pdf', size: '3.1 MB', type: 'application/pdf' }
    ],
    lifecycleStatus: 'Community Review',
    submittedDate: 'March 20, 2026',
    submittedBy: {
      name: 'T. Rameshwari',
      role: 'Merchant Chamber of Commerce Kurnool',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop'
    },
    supportCount: 188,
    userVoted: false,
    timeline: [
      { stage: 'Proposed', date: 'March 20, 2026', notes: 'Proposal filed with Old City merchants forum.' },
      { stage: 'Community Review', date: 'Current', notes: 'Open for citizen endorsements and public comments.' }
    ]
  },
  {
    id: 'prop-06',
    title: 'Tungabhadra Urban Wetlands Runoff Bio-Catchment',
    category: 'Rainwater',
    location: 'Zone 02, Northern Riverbank Marsh',
    zone: 'Zone 02',
    coordinates: [78.03457, 15.82681],
    description: 'Restoration of 4.5 hectares of degraded riverfront wetland into a constructed reed-bed biofiltration catchment system to mitigate monsoon flash flooding.',
    proposedIntervention: 'Terraced bioswales, native riparian reed planting, and automated solar water quality telemetry sensors feeding into Kurnool digital twin.',
    expectedBenefit: {
      waterSavedLiters: 12000000,
      co2AvoidedTons: 64.0,
      benefitedCitizens: 45000,
      estimatedCostLakhs: 65.0
    },
    supportingDocuments: [
      { name: 'Wetlands_Flood_Mitigation_Hydrology_Model.pdf', size: '6.4 MB', type: 'application/pdf' }
    ],
    lifecycleStatus: 'Proposed',
    submittedDate: 'April 04, 2026',
    submittedBy: {
      name: 'Dr. Vivek Anand',
      role: 'Department of Environmental Science, Rayalaseema University',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    },
    supportCount: 96,
    userVoted: false,
    timeline: [
      { stage: 'Proposed', date: 'April 04, 2026', notes: 'Citizen proposal submitted for review.' }
    ]
  }
];

export const INITIAL_COMMUNITY_FEED: CommunityFeedPost[] = [
  {
    id: 'feed-01',
    type: 'announcement',
    author: 'Kurnool Municipal Corporation (KMC)',
    authorRole: 'Official Civic Authority',
    authorBadge: 'Verified Authority',
    title: 'Public Hearing: Clean Energy Transition Masterplan 2028',
    content: 'All citizen cooperative leaders and neighborhood associations are invited to the Municipal Council Chambers on Friday, May 22 at 10:30 AM to review proposed microgrid tariff frameworks and subsidy approvals.',
    timestamp: '2 hours ago',
    likesCount: 84,
    commentsCount: 16
  },
  {
    id: 'feed-02',
    type: 'proposal_milestone',
    author: 'P. Venkat Rao',
    authorRole: 'Zone 04 Collective Representative',
    title: 'Rooftop Solar Collective Crosses 500 Citizen Endorsements!',
    content: 'Fantastic milestone! 542 Kurnool households have signed the joint petition. Municipal engineers verified our substation capacity today. Tender documentation begins next week.',
    timestamp: 'Yesterday at 4:15 PM',
    likesCount: 194,
    commentsCount: 42,
    linkedProposalId: 'prop-01'
  },
  {
    id: 'feed-03',
    type: 'construction_update',
    author: 'AP Urban Infrastructure Engineering Team',
    authorRole: 'Project Contractor',
    authorBadge: 'Verified Engineering',
    title: 'Basaveswara Circle Bio-Junction Civil Works Progressing on Schedule',
    content: 'The 26-meter civil base and foundation piling for the BJ-07 biometric algae tower has completed curing. Glass bioreactor delivery scheduled for May 26. Traffic diversions in place.',
    timestamp: '2 days ago',
    likesCount: 132,
    commentsCount: 28,
    linkedProposalId: 'prop-02'
  },
  {
    id: 'feed-04',
    type: 'citizen_event',
    author: 'Eco-Kurnool Youth Forum',
    authorRole: 'Community Organizer',
    title: 'Riverfront Water Quality Sensor Deployment Drive',
    content: 'Join 60 university volunteers this Saturday at 7:00 AM as we install IoT dissolved oxygen probes along the Tungabhadra riverfront to benchmark our digital twin water telemetry.',
    timestamp: '3 days ago',
    likesCount: 105,
    commentsCount: 19
  }
];

export const INITIAL_CHALLENGES: SustainabilityChallenge[] = [
  {
    id: 'chal-01',
    title: 'Kurnool 1,000 Rooftops Solar Sprint',
    category: 'Solar Energy',
    description: 'Pool residential solar rooftop applications across Kurnool to negotiate 35% bulk hardware discounts for participating homeowners.',
    targetMetric: 'Rooftops Pledged',
    currentProgress: 680,
    targetGoal: 1000,
    participantsCount: 680,
    deadline: 'June 30, 2026',
    rewardBadge: 'Solar Pioneer Medal',
    userJoined: true
  },
  {
    id: 'chal-02',
    title: 'Peak-Hour Grid Flex Citizen Pledge',
    category: 'Grid Flexibility',
    description: 'Shift high-energy appliances (AC pre-cooling, washing, EV charging) outside the 18:30 - 21:30 evening peak hours to alleviate thermal stress on local transformers.',
    targetMetric: 'Household Megawatt Hours Shifted',
    currentProgress: 84.5,
    targetGoal: 150.0,
    participantsCount: 1420,
    deadline: 'July 15, 2026',
    rewardBadge: 'Grid Guardian Badge',
    userJoined: false
  },
  {
    id: 'chal-03',
    title: 'Tungabhadra River Basin Catchment Cleanup',
    category: 'Rainwater & Ecology',
    description: 'Clear urban plastics and silt blockages from storm runoff channels ahead of the monsoon to maximize bio-retention wetland capacity.',
    targetMetric: 'Liters Water Treated Capacity',
    currentProgress: 750000,
    targetGoal: 1000000,
    participantsCount: 380,
    deadline: 'May 31, 2026',
    rewardBadge: 'Water Steward Laureate',
    userJoined: false
  }
];

export const INITIAL_CIVIC_NOTIFICATIONS: CivicNotification[] = [
  {
    id: 'notif-01',
    title: 'Government Sanction Approved',
    message: 'KMC has approved the Zone 04 Rooftop Solar Collective with municipal subsidy allocation.',
    date: 'March 18, 2026',
    type: 'authority_response',
    read: false,
    linkedProposalId: 'prop-01'
  },
  {
    id: 'notif-02',
    title: 'New Milestone in Zone 01 EV Depot',
    message: 'Detailed project report for Railway Station EV Charging Depot finalized.',
    date: 'March 15, 2026',
    type: 'proposal_update',
    read: true,
    linkedProposalId: 'prop-03'
  },
  {
    id: 'notif-03',
    title: 'Upcoming Municipal Hearing',
    message: 'Public hearing scheduled for May 22 on Clean Energy Transition Masterplan 2028.',
    date: 'Yesterday',
    type: 'system',
    read: false
  }
];
