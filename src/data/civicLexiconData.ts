export interface CivicLexiconTerm {
  id: string;
  term: string;
  internationalStandard: string; // e.g. 'OECD Civic Space', 'UN-Habitat Urban Standard', 'Smart Cities World Alliance', 'Bloomberg Philanthropies'
  category: 'Urban Stewardship' | 'Resolution & Workflow' | 'Community Trust' | 'Infrastructure Resiliency' | 'Civic Tech & Data';
  tagline: string;
  modernUrbanistMeaning: string; // Gen Z / modern progressive urbanist framing
  plainSeniorMeaning: string; // Senior-friendly, clear, plain-language translation
  cityscapeUsageExample: string;
  badgeCode: string;
  iconName: string;
  colorTone: string;
}

export const CIVIC_LEXICON_CATALOG: CivicLexiconTerm[] = [
  {
    id: 'ground-truth',
    term: 'Ground Truth Verification',
    internationalStandard: 'UN-Habitat Urban Observatories Benchmark',
    category: 'Community Trust',
    tagline: 'Hyperlocal physical proof validated by on-site neighbors',
    modernUrbanistMeaning: 'Direct peer-to-peer validation from community members physically standing at the site, bypassing bureaucratic lag with photographic proof.',
    plainSeniorMeaning: 'When you or your neighbor confirm in person that a street repair is truly completed.',
    cityscapeUsageExample: '“This street repair has reached 100% Ground Truth Verification with 4 neighbor confirmations.”',
    badgeCode: 'GROUND_TRUTH',
    iconName: 'ShieldCheck',
    colorTone: '#006D5B'
  },
  {
    id: 'loop-closure',
    term: 'Loop Closure Protocol',
    internationalStandard: 'OECD Digital Government & Accountability Framework',
    category: 'Resolution & Workflow',
    tagline: 'End-to-end transparent completion with mutual sign-off',
    modernUrbanistMeaning: 'The entire resolution lifecycle from neighbor drop to municipal dispatch and final community sign-off—zero dead ends, zero ghosting.',
    plainSeniorMeaning: 'A clear guarantee that when you report an issue, the city team fixes it and shows you the before-and-after photos.',
    cityscapeUsageExample: '“Loop Closure achieved: Public Works repaired the drainage grating on 4th Ave and confirmed with ward stewards.”',
    badgeCode: 'LOOP_CLOSURE',
    iconName: 'CheckCircle2',
    colorTone: '#0A2540'
  },
  {
    id: 'public-realm-stewardship',
    term: 'Public Realm Stewardship',
    internationalStandard: 'Charter of Public Space (Biennial of Public Space)',
    category: 'Urban Stewardship',
    tagline: 'Active co-ownership and collective care of shared streets',
    modernUrbanistMeaning: 'Moving beyond passive residency into active, proud co-ownership of public commons, sidewalks, parks, and shared transit nodes.',
    plainSeniorMeaning: 'Looking after our neighborhood streets, parks, and footpaths so everyone can walk safely.',
    cityscapeUsageExample: '“Earned the Public Realm Steward badge for safeguarding Elm Street pedestrian walkways.”',
    badgeCode: 'STEWARDSHIP',
    iconName: 'Sparkles',
    colorTone: '#B45309'
  },
  {
    id: 'civic-pulse',
    term: 'Civic Pulse Index',
    internationalStandard: 'ISO 37120 Sustainable Cities & Communities Index',
    category: 'Civic Tech & Data',
    tagline: 'Real-time vitality and infrastructure health telemetry',
    modernUrbanistMeaning: 'Live telemetry reflecting how quickly a neighborhood identifies, upvotes, and mobilizes around urban improvements.',
    plainSeniorMeaning: 'A simple score showing how active and well-cared-for our ward is today.',
    cityscapeUsageExample: '“Ward 7 Civic Pulse is running at an optimal 94% response health this week.”',
    badgeCode: 'CIVIC_PULSE',
    iconName: 'Activity',
    colorTone: '#006D5B'
  },
  {
    id: 'hyperlocal-dispatch',
    term: 'Hyperlocal Crew Mobilization',
    internationalStandard: 'Smart Cities Council Urban Operations Standard',
    category: 'Resolution & Workflow',
    tagline: 'Direct routing to dedicated neighborhood field technicians',
    modernUrbanistMeaning: 'Smart algorithmic dispatch matching local public works specialists to hazards within their specific 15-minute ward perimeter.',
    plainSeniorMeaning: 'Sending the nearest city repair crew straight to the street where help is needed.',
    cityscapeUsageExample: '“Hyperlocal Dispatch assigned Asphalt Crew #4 to the pothole on 8th Street within 18 minutes.”',
    badgeCode: 'HYPERLOCAL_DISPATCH',
    iconName: 'Truck',
    colorTone: '#B45309'
  },
  {
    id: 'community-endorsement',
    term: 'Community Endorsement (Civic Vouch)',
    internationalStandard: 'European Citizen Science Association Consensus Model',
    category: 'Community Trust',
    tagline: 'Decentralized consensus signaling urgent neighborhood priority',
    modernUrbanistMeaning: 'Upvoting a local report to signal high communal impact, elevating urgency without filling out redundant forms.',
    plainSeniorMeaning: 'Tapping “I See This Too” to tell the city that many neighbors care about getting this fixed.',
    cityscapeUsageExample: '“Received 38 Community Endorsements, automatically raising the repair queue priority to urgent.”',
    badgeCode: 'COMMUNITY_VOUCH',
    iconName: 'Flame',
    colorTone: '#C25E10'
  },
  {
    id: 'infrastructure-resilience',
    term: 'Infrastructure Resilience Score (IRS)',
    internationalStandard: 'Rockefeller Foundation 100 Resilient Cities Framework',
    category: 'Infrastructure Resiliency',
    tagline: 'Structural durability and preventative readiness rating',
    modernUrbanistMeaning: 'Comprehensive health index measuring how well streets, storm drains, and energy grids withstand extreme weather and heavy urban transit.',
    plainSeniorMeaning: 'A rating that shows if our street drains and roads are strong enough for heavy rains.',
    cityscapeUsageExample: '“Post-repair Infrastructure Resilience Score improved from 62% to 96% after culvert reinforcement.”',
    badgeCode: 'RESILIENCE_SCORE',
    iconName: 'Shield',
    colorTone: '#006D5B'
  },
  {
    id: 'micro-ward-vanguard',
    term: 'Micro-Ward Vanguard',
    internationalStandard: 'Bloomberg Philanthropies Mayors Challenge Standard',
    category: 'Urban Stewardship',
    tagline: 'High-reputation community leaders driving local change',
    modernUrbanistMeaning: 'Top-tier civic contributors who lead neighborhood cleanups, verify complex work orders, and mentor new residents.',
    plainSeniorMeaning: 'Dedicated neighbors who spend time making our street safer and friendlier for all ages.',
    cityscapeUsageExample: '“Neighbor Tariq has attained Micro-Ward Vanguard status with 1,200 verified civic contributions.”',
    badgeCode: 'WARD_VANGUARD',
    iconName: 'Award',
    colorTone: '#B45309'
  },
  {
    id: 'civic-equity-parity',
    term: 'Civic Equity Parity',
    internationalStandard: 'Global Covenant of Mayors Equity & Climate Matrix',
    category: 'Civic Tech & Data',
    tagline: 'Fair, balanced public works distribution across every sector',
    modernUrbanistMeaning: 'Algorithmic safeguards ensuring public funding and rapid repair crews are distributed equitably across all demographic sectors.',
    plainSeniorMeaning: 'Making sure every neighborhood gets the same fast, high-quality city services regardless of location.',
    cityscapeUsageExample: '“Civic Equity Parity verified: Ward 4 received matching public works investment this quarter.”',
    badgeCode: 'EQUITY_PARITY',
    iconName: 'Scale',
    colorTone: '#0A2540'
  },
  {
    id: 'open-commons-telemetry',
    term: 'Open Commons Telemetry',
    internationalStandard: 'Open Contracting Partnership & Open Data Charter',
    category: 'Civic Tech & Data',
    tagline: '100% transparent public records and resolution timelines',
    modernUrbanistMeaning: 'Public, tamper-proof tracking of municipal expenditure, repair turnaround times, and crew allocations in real time.',
    plainSeniorMeaning: 'Clear, open records showing how our city funds are spent and how long repairs take.',
    cityscapeUsageExample: '“Open Commons Telemetry active: 100% of municipal work order logs are visible to the public.”',
    badgeCode: 'OPEN_COMMONS',
    iconName: 'Eye',
    colorTone: '#006D5B'
  },
  {
    id: 'civic-karma-ledger',
    term: 'Civic Karma Ledger',
    internationalStandard: 'World Economic Forum Collaborative Governance Metric',
    category: 'Community Trust',
    tagline: 'Verified track record of positive neighborhood contributions',
    modernUrbanistMeaning: 'A transparent reputation score reflecting high-impact civic actions like photo submissions, status confirmations, and volunteer zone adoption.',
    plainSeniorMeaning: 'Community honor points that show how much you help make your neighborhood a better place.',
    cityscapeUsageExample: '“Your Civic Karma Ledger is currently at +840 points, ranking in the top 5% of community stewards.”',
    badgeCode: 'KARMA_LEDGER',
    iconName: 'HeartHandshake',
    colorTone: '#B45309'
  },
  {
    id: 'sensory-wayfinding-audit',
    term: 'Sensory Wayfinding & Spatial Audit',
    internationalStandard: 'WHO Age-Friendly Cities & Universal Design Guidelines',
    category: 'Urban Stewardship',
    tagline: 'Accessible sidewalk clearance, lighting, and tactile signage',
    modernUrbanistMeaning: 'Proactive neighborhood audits assessing curb cuts, wheelchair ramps, lighting contrast, and tactile paving for senior and disabled residents.',
    plainSeniorMeaning: 'Checking that sidewalks, ramps, and lights are safe and easy for elders and strollers to navigate.',
    cityscapeUsageExample: '“Completed Sensory Wayfinding Audit for Central Mall bus stop: High-contrast tactile markers requested.”',
    badgeCode: 'SPATIAL_AUDIT',
    iconName: 'Compass',
    colorTone: '#006D5B'
  }
];
