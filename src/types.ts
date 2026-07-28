export type ReportCategory =
  | 'EMERGENCY'
  | 'POTHOLE'
  | 'LIGHTING'
  | 'SANITATION'
  | 'VANDALISM'
  | 'WATER_LEAK'
  | 'ROADS_TRAFFIC'
  | 'OTHER';

export type ReportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IssueVerification {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  statusConfirmed: 'RESOLVED' | 'STILL_BROKEN';
  photoUrl?: string;
  notes?: string;
  createdAt: string;
  karmaAwarded: number;
}

export interface Report {
  id: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  isGuest: boolean;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  addressText: string;
  imageUrls: string[];
  resolutionImageUrl?: string;
  upvotesCount: number;
  userHasUpvoted?: boolean;
  officialNote?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedWorker?: string;
  verificationsCount?: number;
  verifications?: IssueVerification[];
  aiForensics?: AiForensicResult;
  isFlaggedAsAiFake?: boolean;
}

export interface Comment {
  id: string;
  reportId: string;
  userName: string;
  userRole: 'citizen' | 'admin' | 'worker';
  content: string;
  isOfficialUpdate: boolean;
  createdAt: string;
}

export interface Upvote {
  id: string;
  reportId: string;
  userOrIp: string;
  createdAt: string;
}

export interface ReportFilter {
  status?: ReportStatus | 'ALL';
  category?: ReportCategory | 'ALL';
  severity?: SeverityLevel | 'ALL';
  searchQuery?: string;
  sortBy?: 'newest' | 'oldest' | 'upvotes' | 'severity';
}

export interface CityStats {
  totalReports: number;
  openCount: number;
  inProgressCount: number;
  resolvedCount: number;
  rejectedCount: number;
  avgResolutionDays: number;
  topCategory: string;
  upvotesTotal: number;
  totalVerifications?: number;
}

export interface AIAnalysisResult {
  title: string;
  category: ReportCategory;
  severity: SeverityLevel;
  description: string;
  confidenceScore: number;
  suggestedAction: string;
}

export interface AiForensicResult {
  isAiGenerated: boolean;
  aiProbability: number; // 0 to 100 percentage
  riskLevel: 'LOW_RISK' | 'SUSPECTED_MANIPULATION' | 'HIGH_RISK_AI_SYNTHETIC';
  detectedArtifacts: string[];
  forensicAnalysis: string;
  metadataAuthenticity: 'VERIFIED_REAL_CAMERA' | 'UNVERIFIED_SOURCE' | 'SYNTHETIC_GENERATED';
  scannedAt: string;
  sensorNoiseScore?: number; // 0 to 100
  lightingConsistencyScore?: number; // 0 to 100
  diffusionPatternScore?: number; // 0 to 100
}

// ==========================================
// CIVIC IDENTITY & MOTIVATION TYPES
// ==========================================

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verifiedEmail?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  avatarUrl: string;
  isGoogleConnected?: boolean;
  googleId?: string;
  neighborhoodId: string;
  neighborhoodName: string;
  title: string;
  unlockedTitles: string[];
  civicKarma: number;
  trustScore: number; // 0 - 100 percentage
  joinedDate: string;
  impactStats: {
    reportsSubmitted: number;
    reportsResolved: number;
    verificationsCount: number;
    upvotesReceived: number;
    upvotesGiven: number;
    estHoursSaved: number;
    civicValueCreatedUsd: number;
  };
  adoptedZones: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'reporting' | 'verification' | 'community' | 'eco' | 'leadership';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  maxProgress: number;
}

export interface UserBadge {
  badgeId: string;
  unlockedAt?: string;
  currentProgress: number;
}

export interface AdoptedZone {
  id: string;
  name: string;
  ward: string;
  activeReportsCount: number;
  resolvedThisMonth: number;
  isAdoptedByMe: boolean;
  karmaMultiplier: number;
  description: string;
}

