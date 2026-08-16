import { Report, Comment, UserProfile, Badge, UserBadge, IssueVerification, AdoptedZone } from '../types';

export const INITIAL_REPORTS: Report[] = [];

export const INITIAL_COMMENTS: Comment[] = [];

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-neighbor',
  username: 'neighbor',
  fullName: 'Community Member',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  neighborhoodId: 'zone-general',
  neighborhoodName: 'Local Community Ward',
  title: 'Resident Citizen',
  unlockedTitles: [
    'Resident Citizen',
    'Community Sentinel',
    'Block Captain',
    'Civic Guardian',
    'Infrastructure Steward'
  ],
  civicKarma: 0,
  trustScore: 100,
  joinedDate: 'New Member',
  impactStats: {
    reportsSubmitted: 0,
    reportsResolved: 0,
    verificationsCount: 0,
    upvotesReceived: 0,
    upvotesGiven: 0,
    estHoursSaved: 0,
    civicValueCreatedUsd: 0,
  },
  adoptedZones: []
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

export const USER_BADGES: Record<string, UserBadge> = {};

export const INITIAL_VERIFICATIONS: IssueVerification[] = [];

export const INITIAL_ADOPTED_ZONES: AdoptedZone[] = [
  {
    id: 'zone-district-1',
    name: 'Central Urban Corridor',
    ward: 'Ward 1',
    activeReportsCount: 0,
    resolvedThisMonth: 0,
    isAdoptedByMe: false,
    karmaMultiplier: 1.5,
    description: 'High pedestrian, commercial and transit zone.',
  },
  {
    id: 'zone-district-2',
    name: 'Civic & Cultural Center',
    ward: 'Ward 2',
    activeReportsCount: 0,
    resolvedThisMonth: 0,
    isAdoptedByMe: false,
    karmaMultiplier: 1.5,
    description: 'Municipal buildings, parks, and community gathering areas.',
  },
  {
    id: 'zone-district-3',
    name: 'Residential Neighborhood Sector',
    ward: 'Ward 3',
    activeReportsCount: 0,
    resolvedThisMonth: 0,
    isAdoptedByMe: false,
    karmaMultiplier: 1.2,
    description: 'Quiet residential tree-lined avenues, schools, and playgrounds.',
  },
];
