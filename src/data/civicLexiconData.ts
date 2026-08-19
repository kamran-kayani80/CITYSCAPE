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
    id: 'digital-public-goods',
    term: 'Digital Public Good (DPG)',
    internationalStandard: 'Digital Public Goods Alliance / UN Tech Roadmap',
    category: 'Civic Tech & Data',
    tagline: 'Open-source, non-rivalrous software serving humanity',
    modernUrbanistMeaning: 'Civic software designed with open code, high privacy standards, and public sovereignty that no single private monopoly controls.',
    plainSeniorMeaning: 'Free, transparent software built to help the whole community without selling your private data.',
    cityscapeUsageExample: '“Cityscape’s dispatch core is registered as a verified Digital Public Good for open civic governance.”',
    badgeCode: 'DPG_STANDARD',
    iconName: 'Code',
    colorTone: '#0A2540'
  },
  {
    id: 'participatory-budgeting',
    term: 'Participatory Budgeting Deliberation',
    internationalStandard: 'Decidim & Participatory Budgeting Project Global Standard',
    category: 'Resolution & Workflow',
    tagline: 'Direct resident voting on municipal capital improvements',
    modernUrbanistMeaning: 'Direct democracy protocol where residents propose, deliberate, and vote on how actual municipal tax dollars are allocated across their blocks.',
    plainSeniorMeaning: 'When the city asks neighbors to vote directly on which local park or sidewalk gets repaired first.',
    cityscapeUsageExample: '“Over 1,400 neighbors participated in the Ward 3 crosswalk lighting budget deliberation.”',
    badgeCode: 'PARTICIPATORY_BUDGET',
    iconName: 'Vote',
    colorTone: '#006D5B'
  },
  {
    id: 'tactical-urbanism',
    term: 'Tactical Urbanism Intervention',
    internationalStandard: 'NACTO Global Street Design Guide',
    category: 'Urban Stewardship',
    tagline: 'Low-cost, rapid-deployment neighborhood enhancements',
    modernUrbanistMeaning: 'Agile, short-term, scalable physical changes (such as pop-up planters, painted curb extensions, or bike corrals) tested before permanent installation.',
    plainSeniorMeaning: 'Quick, temporary street improvements like painted crosswalks and flower planters to slow down cars immediately.',
    cityscapeUsageExample: '“Neighbors organized a tactical urbanism planter installation to calm traffic near the elementary school.”',
    badgeCode: 'TACTICAL_URBANISM',
    iconName: 'Lightbulb',
    colorTone: '#B45309'
  },
  {
    id: '15-minute-city',
    term: '15-Minute City Proximity Matrix',
    internationalStandard: 'C40 Cities Climate Leadership Group & Carlos Moreno Framework',
    category: 'Urban Stewardship',
    tagline: 'Universal pedestrian access to daily essentials within a short walk',
    modernUrbanistMeaning: 'Hyper-accessible neighborhood urban planning ensuring groceries, healthcare, transit, and green spaces are within a 15-minute walk or roll.',
    plainSeniorMeaning: 'Designing our neighborhood so you can easily walk to the doctor, grocery store, and park in under 15 minutes.',
    cityscapeUsageExample: '“The new pedestrian curb ramps increased the district’s 15-Minute City Accessibility Score to 91%.”',
    badgeCode: '15_MIN_CITY',
    iconName: 'Compass',
    colorTone: '#006D5B'
  },
  {
    id: 'public-interest-technology',
    term: 'Public Interest Technology (PIT)',
    internationalStandard: 'Ford & MacArthur Foundation PIT-UN Global Charter',
    category: 'Civic Tech & Data',
    tagline: 'Engineering and digital design serving social justice and equity',
    modernUrbanistMeaning: 'Developing digital systems prioritizing public welfare, democratic accountability, civil liberties, and universal accessibility over corporate profit.',
    plainSeniorMeaning: 'Technology created with love and care to solve real neighborhood problems and make life easier for all residents.',
    cityscapeUsageExample: '“Cityscape’s senior-first high contrast UI is recognized as a premier Public Interest Tech implementation.”',
    badgeCode: 'PUBLIC_INTEREST_TECH',
    iconName: 'HeartHandshake',
    colorTone: '#B45309'
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
    id: 'algorithmic-transparency',
    term: 'Algorithmic Transparency Register',
    internationalStandard: 'EU AI Act & Open Government Partnership Guidelines',
    category: 'Civic Tech & Data',
    tagline: 'Fully explainable municipal triage and dispatch algorithms',
    modernUrbanistMeaning: 'Clear, auditable explanations of the math and rules used to prioritize repair queues, preventing systemic bias or redlining.',
    plainSeniorMeaning: 'A simple public guide explaining exactly how the city decides which street repairs get done first.',
    cityscapeUsageExample: '“Algorithmic Transparency Register confirms dispatch was prioritized solely by safety severity and neighbor vouch count.”',
    badgeCode: 'ALGO_TRANSPARENCY',
    iconName: 'FileCheck',
    colorTone: '#0A2540'
  },
  {
    id: 'sponge-city-capacity',
    term: 'Permeable Sponge City Capacity',
    internationalStandard: 'International Water Association (IWA) Sponge Cities Standard',
    category: 'Infrastructure Resiliency',
    tagline: 'Nature-based drainage absorption to prevent urban flash flooding',
    modernUrbanistMeaning: 'Ecological infrastructure incorporating bioswales, rain gardens, and permeable pavers to naturally absorb, filter, and reuse stormwater runoff.',
    plainSeniorMeaning: 'Green street gardens and porous pavements that soak up heavy rain like a sponge so our streets do not flood.',
    cityscapeUsageExample: '“Public Works added bioswale drains on Maple Ave, raising the block’s Sponge City Capacity by 40%.”',
    badgeCode: 'SPONGE_CITY',
    iconName: 'Droplet',
    colorTone: '#006D5B'
  },
  {
    id: 'desire-line-mapping',
    term: 'Pedestrian Desire Line Mapping',
    internationalStandard: 'Gehl Institute Public Life Diversity Protocol',
    category: 'Urban Stewardship',
    tagline: 'Mapping authentic footpaths chosen naturally by walkers',
    modernUrbanistMeaning: 'Observing and honoring the organic paths pedestrians carve across public spaces, using community foot traffic data to pave actual walkways.',
    plainSeniorMeaning: 'Noticing the natural walking paths people use across parks and paving them so everyone has an easy route.',
    cityscapeUsageExample: '“Desire line mapping prompted the city to pave the shortcut path connecting the senior center to the transit plaza.”',
    badgeCode: 'DESIRE_LINES',
    iconName: 'Route',
    colorTone: '#B45309'
  },
  {
    id: 'civic-data-dignity',
    term: 'Civic Data Sovereignty & Dignity',
    internationalStandard: 'Mozilla Civic Data Trust & Berkman Klein Center',
    category: 'Civic Tech & Data',
    tagline: 'Community ownership and strict privacy over civic sensor feeds',
    modernUrbanistMeaning: 'Ensuring data generated by residents (air quality monitors, GPS reports, street photos) remains in community trust rather than harvested for ads.',
    plainSeniorMeaning: 'Your photos and reports belong to our community, and the city will never sell your personal information.',
    cityscapeUsageExample: '“All neighborhood telemetry is protected under the Civic Data Dignity charter with zero third-party tracking.”',
    badgeCode: 'DATA_DIGNITY',
    iconName: 'Lock',
    colorTone: '#0A2540'
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
    id: 'climate-refuge-network',
    term: 'Climate Micro-Refuge Network',
    internationalStandard: 'UNDRR Sendai Disaster Risk Reduction Framework',
    category: 'Infrastructure Resiliency',
    tagline: 'Shaded cooling corridors, drinking fountains, and clean air zones',
    modernUrbanistMeaning: 'A distributed urban network of misting stations, tree canopies, hydration points, and clean air shelters protecting pedestrians during heatwaves.',
    plainSeniorMeaning: 'Shaded benches, water fountains, and air-conditioned community rooms to rest and cool down on hot summer days.',
    cityscapeUsageExample: '“Cityscape Map now pinpoints 18 climate micro-refuges with free cold drinking water along 5th Avenue.”',
    badgeCode: 'CLIMATE_REFUGE',
    iconName: 'SunMedium',
    colorTone: '#006D5B'
  },
  {
    id: 'frictionless-escalation',
    term: 'Frictionless Municipal Escalation',
    internationalStandard: 'GovTech Global & UK Government Digital Service (GDS)',
    category: 'Resolution & Workflow',
    tagline: 'Automated multi-agency handoff without redundant reporting',
    modernUrbanistMeaning: 'Intelligent backend routing that automatically transfers complex reports (e.g., fallen tree touching powerlines) between Power and Forestry.',
    plainSeniorMeaning: 'When an issue needs two different city crews, the system notifies both teams automatically without making you call twice.',
    cityscapeUsageExample: '“Frictionless escalation alerted both Public Works and Water Dept simultaneously for the broken hydrant.”',
    badgeCode: 'FRICTIONLESS_ESC',
    iconName: 'Workflow',
    colorTone: '#0A2540'
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
  },
  {
    id: 'self-sovereign-civic-id',
    term: 'Self-Sovereign Civic Identity (SSI)',
    internationalStandard: 'W3C Verifiable Credentials & EU Digital Identity Standard',
    category: 'Community Trust',
    tagline: 'Cryptographic proof of ward residency without exposing personal identity',
    modernUrbanistMeaning: 'Zero-knowledge credential systems allowing residents to prove they live in a specific council ward to vote on initiatives without giving away private names or addresses.',
    plainSeniorMeaning: 'A safe digital pass that proves you live in our neighborhood without revealing your home address or private details.',
    cityscapeUsageExample: '“Verified via Self-Sovereign Civic ID: Eligible to cast ballot in Ward 2 traffic calming initiative.”',
    badgeCode: 'CIVIC_SSI',
    iconName: 'KeyRound',
    colorTone: '#006D5B'
  }
];

