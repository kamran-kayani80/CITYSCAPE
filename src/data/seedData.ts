import { Report, Comment, UserProfile, Badge, UserBadge, IssueVerification, AdoptedZone } from '../types';

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-100',
    userName: 'Officer Sarah Chen',
    userEmail: 'sarah.chen@sfgov.org',
    isGuest: false,
    title: 'Fallen High-Voltage Power Line Blocking Intersection',
    description: 'Downed live electric cable sparking near 5th St crosswalk after heavy storm winds. Area cordoned off; immediate emergency utility repair needed for public safety!',
    category: 'EMERGENCY',
    status: 'OPEN',
    severity: 'CRITICAL',
    latitude: 37.7812,
    longitude: -122.4042,
    addressText: '5th St & Howard St, San Francisco, CA 94103',
    imageUrls: [
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80'
    ],
    upvotesCount: 45,
    verificationsCount: 6,
    officialNote: 'Emergency dispatch team notified. Fire Department unit on scene.',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    assignedWorker: 'Emergency Response Unit 1',
    aiForensics: {
      isAiGenerated: false,
      aiProbability: 4,
      riskLevel: 'LOW_RISK',
      detectedArtifacts: ['Real CMOS sensor noise profile verified', "Natural light scattering from sparking wire"],
      forensicAnalysis: 'Authentic camera capture verified with physical sensor noise and natural optical depth.',
      metadataAuthenticity: 'VERIFIED_REAL_CAMERA',
      sensorNoiseScore: 92,
      lightingConsistencyScore: 95,
      diffusionPatternScore: 3,
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'rep-101',
    userName: 'Elena Rostova',
    userEmail: 'elena.r@example.com',
    isGuest: false,
    title: 'Severe Asphalt Pothole on Market St & 4th',
    description: 'Deep pothole roughly 8 inches deep right in the rightmost bike/bus lane. Poses serious risk to cyclists and scooter riders during evening rush hour.',
    category: 'POTHOLE',
    status: 'OPEN',
    severity: 'HIGH',
    latitude: 37.7858,
    longitude: -122.4065,
    addressText: '788 Market St, San Francisco, CA 94102',
    imageUrls: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    upvotesCount: 24,
    verificationsCount: 2,
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(), // 14 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    assignedWorker: 'Public Works Crew B',
    aiForensics: {
      isAiGenerated: false,
      aiProbability: 6,
      riskLevel: 'LOW_RISK',
      detectedArtifacts: ['Consistent road grain', 'Natural asphalt fracture wear'],
      forensicAnalysis: 'Camera capture photo exhibits genuine road texture and authentic physical lighting.',
      metadataAuthenticity: 'VERIFIED_REAL_CAMERA',
      sensorNoiseScore: 89,
      lightingConsistencyScore: 91,
      diffusionPatternScore: 4,
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'rep-107-fake-ai',
    userName: 'Anonymous Bot / Fake Account',
    isGuest: true,
    title: '⚠️ Fake Massive Sinkhole Overlay (AI Generated Fake)',
    description: 'Exaggerated 15ft deep catastrophic road sinkhole. (CITYSCAPE AI Fraud Shield flagged this photo as a synthetic AI picture generated to mislead the public and cause panic).',
    category: 'POTHOLE',
    status: 'REJECTED',
    severity: 'CRITICAL',
    latitude: 37.7785,
    longitude: -122.4132,
    addressText: 'Civic Center Plaza, San Francisco, CA 94102',
    imageUrls: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    upvotesCount: 0,
    verificationsCount: 0,
    isFlaggedAsAiFake: true,
    aiForensics: {
      isAiGenerated: true,
      aiProbability: 96,
      riskLevel: 'HIGH_RISK_AI_SYNTHETIC',
      detectedArtifacts: [
        'Generative diffusion texture smoothing on road cracks',
        'Inconsistent directional shadows on surrounding pavement',
        'Absence of physical CMOS camera sensor noise',
        'Synthetic edge distortion near sinkhole boundary'
      ],
      forensicAnalysis: 'Forensic spectral analysis detected generative diffusion model signatures with 96% confidence. Image is a synthetic manipulation designed to simulate fake municipal damage.',
      metadataAuthenticity: 'SYNTHETIC_GENERATED',
      sensorNoiseScore: 8,
      lightingConsistencyScore: 19,
      diffusionPatternScore: 96,
      scannedAt: new Date().toISOString()
    },
    officialNote: 'REJECTED BY MUNICIPAL MODERATOR: Photo failed AI Fraud Shield authenticity verification. Misleading AI-generated picture detected.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'rep-102',
    userName: 'Marcus Vance',
    userEmail: 'marcus.v@example.com',
    isGuest: false,
    title: 'Broken Streetlight / Flickering Lamp at 18th & Valencia',
    description: 'The main overhead LED lamp is completely out, creating a dark safety blindspot near the pedestrian crosswalk and outdoor seating areas.',
    category: 'LIGHTING',
    status: 'IN_PROGRESS',
    severity: 'MEDIUM',
    latitude: 37.7618,
    longitude: -122.4217,
    addressText: '698 Valencia St, San Francisco, CA 94110',
    imageUrls: [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80'
    ],
    upvotesCount: 18,
    verificationsCount: 4,
    officialNote: 'City Electrician dispatched under Work Order #SF-88321. Replacement bulb and wiring check scheduled.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    assignedWorker: 'SF Power & Light Utility'
  },
  {
    id: 'rep-103',
    userName: 'Anonymous Neighbor',
    isGuest: true,
    title: 'Illegal Trash Dumping in Alleyway',
    description: 'Several discarded mattresses, wooden pallets, and hazardous paint cans blocking the sidewalk access near the apartment complex entrance.',
    category: 'SANITATION',
    status: 'OPEN',
    severity: 'HIGH',
    latitude: 37.7762,
    longitude: -122.4231,
    addressText: '312 Hayes St, San Francisco, CA 94102',
    imageUrls: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
    ],
    upvotesCount: 31,
    verificationsCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'rep-104',
    userName: 'David K.',
    userEmail: 'david.k@example.com',
    isGuest: false,
    title: 'Main Water Pipe Leak Spewing on Sidewalk',
    description: 'Water spraying steadily out from a cracked fire hydrant connector valve onto the public sidewalk. Wasting clean municipal water and making path slippery.',
    category: 'WATER_LEAK',
    status: 'IN_PROGRESS',
    severity: 'CRITICAL',
    latitude: 37.7915,
    longitude: -122.3982,
    addressText: '1 Embarcadero Center, San Francisco, CA 94111',
    imageUrls: [
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
    ],
    upvotesCount: 42,
    verificationsCount: 5,
    officialNote: 'Emergency Water District crew on-site shutting valve and installing replacement flange.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    assignedWorker: 'Emergency Water Rapid Response'
  },
  {
    id: 'rep-105',
    userName: 'Alex Morgan',
    userEmail: 'alex.m@cityscape.org',
    isGuest: false,
    title: 'Graffiti Vandalism on Community Center Wall',
    description: 'Fresh spray paint covering the neighborhood youth center mural. Requesting cleanup/restoration crew to remove tag.',
    category: 'VANDALISM',
    status: 'RESOLVED',
    severity: 'LOW',
    latitude: 37.7523,
    longitude: -122.4181,
    addressText: '2520 24th St, San Francisco, CA 94110',
    imageUrls: [
      'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?auto=format&fit=crop&w=800&q=80'
    ],
    resolutionImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    upvotesCount: 15,
    verificationsCount: 6,
    officialNote: 'Graffiti abatement team buffed and repainted wall surface with protective anti-graffiti sealant coating.',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    assignedWorker: 'Beautification Crew 4'
  },
  {
    id: 'rep-106',
    userName: 'Officer Rodriguez',
    isGuest: false,
    title: 'Damaged Stop Sign / Twisted Post',
    description: 'Stop sign at intersection was bumped by a delivery truck and is now bent 90 degrees out of visibility for oncoming northbound traffic.',
    category: 'ROADS_TRAFFIC',
    status: 'RESOLVED',
    severity: 'HIGH',
    latitude: 37.7694,
    longitude: -122.4461,
    addressText: '1200 Cole St, San Francisco, CA 94117',
    imageUrls: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
    ],
    resolutionImageUrl: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80',
    upvotesCount: 29,
    verificationsCount: 8,
    officialNote: 'Traffic Safety Team re-anchored steel post with heavy-duty concrete anchor and fresh reflective sign plate.',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    assignedWorker: 'MTA Traffic Sign Crew'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    reportId: 'rep-101',
    userName: 'Jessica Taylor',
    userRole: 'citizen',
    content: 'Hit this exact pothole last night on my commute home! Bent my bicycle rim. Glad someone filed a report.',
    isOfficialUpdate: false,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: 'comm-2',
    reportId: 'rep-101',
    userName: 'Public Works Admin',
    userRole: 'admin',
    content: 'Thank you for reporting. This issue has been prioritized for cold-patch emergency repair within 24 hours.',
    isOfficialUpdate: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'comm-3',
    reportId: 'rep-102',
    userName: 'City Electrician Dept',
    userRole: 'worker',
    content: 'Work order assigned to Crew 3. Replacement high-bay LED fixture loaded in truck for afternoon route.',
    isOfficialUpdate: true,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-alex-morgan',
  username: 'alex_sentinel',
  fullName: 'Alex Morgan',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  neighborhoodId: 'zone-mission',
  neighborhoodName: 'Mission District (Ward 9)',
  title: 'Block Captain',
  unlockedTitles: [
    'Resident Citizen',
    'Community Sentinel',
    'Block Captain',
    'Civic Guardian',
    'Infrastructure Steward'
  ],
  civicKarma: 840,
  trustScore: 96,
  joinedDate: 'March 2025',
  impactStats: {
    reportsSubmitted: 14,
    reportsResolved: 11,
    verificationsCount: 28,
    upvotesReceived: 142,
    upvotesGiven: 89,
    estHoursSaved: 42,
    civicValueCreatedUsd: 14500,
  },
  adoptedZones: ['zone-mission', 'zone-soma']
};

export const BADGES_CATALOG: Badge[] = [
  {
    id: 'badge-sharp-eye',
    name: 'Sharp Eye',
    description: 'Submitted 5 verified hazard reports that led to municipal work orders.',
    iconName: 'Search',
    category: 'reporting',
    tier: 'gold',
    maxProgress: 5,
  },
  {
    id: 'badge-loop-closer',
    name: 'Loop Closer',
    description: 'Completed 10 ground verifications confirming completed repairs on site.',
    iconName: 'CheckCircle2',
    category: 'verification',
    tier: 'platinum',
    maxProgress: 10,
  },
  {
    id: 'badge-civic-diplomat',
    name: 'Civic Diplomat',
    description: 'Posted 25 constructive, highly upvoted comments in community discussions.',
    iconName: 'MessageSquare',
    category: 'community',
    tier: 'gold',
    maxProgress: 25,
  },
  {
    id: 'badge-eco-steward',
    name: 'Eco-Steward',
    description: 'Reported & verified 10 sanitation, dumping, or green space maintenance issues.',
    iconName: 'Leaf',
    category: 'eco',
    tier: 'silver',
    maxProgress: 10,
  },
  {
    id: 'badge-block-guardian',
    name: 'Block Guardian',
    description: 'Adopted a micro-zone and maintained its hazard resolution health above 90%.',
    iconName: 'ShieldCheck',
    category: 'leadership',
    tier: 'platinum',
    maxProgress: 1,
  },
  {
    id: 'badge-first-responder',
    name: 'First Responder',
    description: 'First resident to inspect and verify a critical water leak or traffic hazard repair.',
    iconName: 'Zap',
    category: 'verification',
    tier: 'bronze',
    maxProgress: 3,
  },
];

export const USER_BADGES: Record<string, UserBadge> = {
  'badge-sharp-eye': { badgeId: 'badge-sharp-eye', unlockedAt: '2025-05-10', currentProgress: 5 },
  'badge-loop-closer': { badgeId: 'badge-loop-closer', unlockedAt: '2025-06-01', currentProgress: 10 },
  'badge-civic-diplomat': { badgeId: 'badge-civic-diplomat', unlockedAt: '2025-06-18', currentProgress: 25 },
  'badge-eco-steward': { badgeId: 'badge-eco-steward', currentProgress: 7 }, // 7/10
  'badge-block-guardian': { badgeId: 'badge-block-guardian', unlockedAt: '2025-07-02', currentProgress: 1 },
  'badge-first-responder': { badgeId: 'badge-first-responder', currentProgress: 2 }, // 2/3
};

export const INITIAL_VERIFICATIONS: IssueVerification[] = [
  {
    id: 'verif-1',
    reportId: 'rep-105',
    userId: 'usr-alex-morgan',
    userName: 'Alex Morgan',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    statusConfirmed: 'RESOLVED',
    photoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    notes: 'Walked past on 24th St today. The paint job looks pristine and completely matches the mural background!',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    karmaAwarded: 25,
  },
  {
    id: 'verif-2',
    reportId: 'rep-106',
    userId: 'usr-sarah-k',
    userName: 'Sarah Kim',
    statusConfirmed: 'RESOLVED',
    notes: 'Confirmed from my morning jog. Sign is upright, securely bolted, and fully visible from Cole St.',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    karmaAwarded: 15,
  },
];

export const INITIAL_ADOPTED_ZONES: AdoptedZone[] = [
  {
    id: 'zone-mission',
    name: 'Mission District Corridor',
    ward: 'Ward 9',
    activeReportsCount: 4,
    resolvedThisMonth: 18,
    isAdoptedByMe: true,
    karmaMultiplier: 2.0,
    description: 'High pedestrian and commercial corridor spanning 16th St to 24th St.',
  },
  {
    id: 'zone-soma',
    name: 'SoMa Tech & Transit Hub',
    ward: 'Ward 6',
    activeReportsCount: 6,
    resolvedThisMonth: 22,
    isAdoptedByMe: true,
    karmaMultiplier: 1.5,
    description: 'Transit heavy area covering Market St, 4th St, and Caltrain corridors.',
  },
  {
    id: 'zone-hayes',
    name: 'Hayes Valley & Civic Center',
    ward: 'Ward 5',
    activeReportsCount: 3,
    resolvedThisMonth: 14,
    isAdoptedByMe: false,
    karmaMultiplier: 1.5,
    description: 'Cultural arts district with high foot traffic and bike boulevards.',
  },
  {
    id: 'zone-sunset',
    name: 'Outer Sunset Ocean Parkway',
    ward: 'Ward 4',
    activeReportsCount: 2,
    resolvedThisMonth: 11,
    isAdoptedByMe: false,
    karmaMultiplier: 1.2,
    description: 'Coastal neighborhood focus on park maintenance, beach access & storm drains.',
  },
];

