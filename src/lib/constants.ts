import { ReportCategory, ReportStatus, SeverityLevel } from '../types';

export interface CategoryMeta {
  label: string;
  iconName: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const CATEGORY_CONFIG: Record<ReportCategory, CategoryMeta> = {
  EMERGENCY: {
    label: 'Emergency / Hazard',
    iconName: 'Siren',
    badgeBg: 'bg-red-600 text-white animate-pulse',
    badgeText: 'text-white border-red-700 bg-red-600 font-black',
    description: 'Immediate life-safety hazards, structural collapses, dangerous power line outages'
  },
  POTHOLE: {
    label: 'Potholes & Pavement',
    iconName: 'AlertTriangle',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    description: 'Road cracks, dangerous asphalt depressions, broken curbs'
  },
  LIGHTING: {
    label: 'Streetlights & Signals',
    iconName: 'Lightbulb',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-950/60',
    badgeText: 'text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
    description: 'Flickering lamps, dead streetlights, traffic light outages'
  },
  SANITATION: {
    label: 'Trash & Dumping',
    iconName: 'Trash2',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeText: 'text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    description: 'Illegal dumping, overflowing public bins, hazardous debris'
  },
  VANDALISM: {
    label: 'Graffiti & Vandalism',
    iconName: 'Paintbrush',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
    badgeText: 'text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    description: 'Spray tags, defaced public property, damaged benches'
  },
  WATER_LEAK: {
    label: 'Water & Drainage',
    iconName: 'Droplets',
    badgeBg: 'bg-[#E6F4F1] dark:bg-[#004D40]',
    badgeText: 'text-[#006D5B] dark:text-teal-200 border-[#006D5B]/30',
    description: 'Burst water mains, clogged storm drains, sewage backup'
  },
  ROADS_TRAFFIC: {
    label: 'Roads & Traffic Signs',
    iconName: 'TrafficCone',
    badgeBg: 'bg-[#E6F4F1] dark:bg-[#004D40]',
    badgeText: 'text-[#006D5B] dark:text-teal-200 border-[#006D5B]/30',
    description: 'Damaged stop signs, missing lane markers, obscured crosswalks'
  },
  OTHER: {
    label: 'General Infrastructure',
    iconName: 'HelpCircle',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-[#111827] dark:text-slate-200 border-slate-300 dark:border-slate-700',
    description: 'Damaged trees, public park issues, unspecified civic defects'
  }
};

export const STATUS_CONFIG: Record<ReportStatus, { label: string; dotColor: string; bgClass: string; textClass: string; pinHex: string }> = {
  OPEN: {
    label: 'Open / Unresolved',
    dotColor: 'bg-red-500 animate-pulse',
    bgClass: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900',
    textClass: 'text-red-700 dark:text-red-300',
    pinHex: '#EF4444' // Red
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dotColor: 'bg-amber-500 animate-ping',
    bgClass: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900',
    textClass: 'text-amber-700 dark:text-amber-300',
    pinHex: '#F59E0B' // Amber/Yellow
  },
  RESOLVED: {
    label: 'Resolved / Closed',
    dotColor: 'bg-emerald-500',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900',
    textClass: 'text-[#006D5B] dark:text-emerald-300',
    pinHex: '#006D5B' // Warm Sage Teal
  },
  REJECTED: {
    label: 'Rejected / Duplicate',
    dotColor: 'bg-slate-400',
    bgClass: 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
    textClass: 'text-slate-700 dark:text-slate-300',
    pinHex: '#64748B' // Slate Gray
  }
};

export const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; colorClass: string }> = {
  LOW: { label: 'Low Severity', colorClass: 'bg-slate-100 text-[#111827] dark:text-slate-200 border-slate-300 dark:border-slate-700 font-bold' },
  MEDIUM: { label: 'Moderate Hazard', colorClass: 'bg-[#E6F4F1] dark:bg-[#004D40] text-[#006D5B] dark:text-teal-200 border-[#006D5B]/30 font-bold' },
  HIGH: { label: 'High Priority', colorClass: 'bg-amber-50 dark:bg-amber-950/50 text-[#B45309] dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold' },
  CRITICAL: { label: 'Critical Safety Risk', colorClass: 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-200 border-red-300 dark:border-red-800 font-bold' }
};

export const CATEGORY_SLA_HOURS: Record<ReportCategory, { hours: number; label: string }> = {
  EMERGENCY: { hours: 2, label: '2 Hours (Emergency Dispatch)' },
  POTHOLE: { hours: 120, label: '5 Business Days (Road Works)' },
  LIGHTING: { hours: 72, label: '3 Business Days (Electrical Dept)' },
  SANITATION: { hours: 24, label: '24 Hours (Sanitation Dept)' },
  VANDALISM: { hours: 96, label: '4 Business Days (Public Works)' },
  WATER_LEAK: { hours: 24, label: '24 Hours (Water & Sewage)' },
  ROADS_TRAFFIC: { hours: 72, label: '3 Business Days (Transit Auth)' },
  OTHER: { hours: 168, label: '7 Business Days (General Services)' },
};

export const MUNICIPAL_WARDS = [
  { id: 'ward_1', name: 'San Francisco Ward 1 - Downtown & Civic Center', officer: 'Capt. Sarah Jenkins' },
  { id: 'ward_2', name: 'San Francisco Ward 2 - Mission & Valencia Corridor', officer: 'Insp. Carlos Rivera' },
  { id: 'ward_3', name: 'San Francisco Ward 3 - Sunset & Richmond District', officer: 'Officer Elena Rostova' },
  { id: 'ward_4', name: 'San Francisco Ward 4 - SoMa, South Beach & Wharf', officer: 'Chief Marcus Vance' },
  { id: 'ward_5', name: 'San Francisco Ward 5 - Castro, Noe & Twin Peaks', officer: 'Officer Maya Lin' },
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ann_1',
    title: 'Emergency Water Main Servicing & Pressure Reduction',
    department: 'Water & Utility Board',
    category: 'UTILITY',
    priority: 'CRITICAL',
    description:
      'Crews are conducting urgent repairs on the primary feeder main along 14th Street. Temporary low water pressure expected between 8:00 AM and 3:00 PM for Ward 1 and Ward 2 residents.',
    effectiveDates: 'July 29 - July 30, 2026',
    publishedAt: '2026-07-29T08:00:00Z',
    wardZone: 'Ward 1 - Downtown',
  },
  {
    id: 'ann_2',
    title: 'Senior Wellness & Digital Literacy Workshop Series',
    department: 'Department of Aging & Adult Services',
    category: 'SENIOR_SERVICES',
    priority: 'INFO',
    description:
      'Free weekly workshops for senior citizens covering tablet usage, telehealth navigation, and Medicare assistance. Lunch provided. Free shuttle pickup available from Ward 3 Community Center.',
    effectiveDates: 'Every Tuesday & Thursday in August',
    publishedAt: '2026-07-28T10:30:00Z',
    wardZone: 'Ward 3 - Sunset',
  },
  {
    id: 'ann_3',
    title: 'Market Street Resurfacing & Nighttime Lane Closures',
    department: 'Department of Transportation',
    category: 'ROADWORK',
    priority: 'URGENT',
    description:
      'Night resurfacing work from 10:00 PM to 5:00 AM daily. Single lane traffic active with flaggers present. Bus routes 14 and 49 detoured via Mission Street.',
    effectiveDates: 'August 1 - August 15, 2026',
    publishedAt: '2026-07-27T14:15:00Z',
    wardZone: 'Ward 4 - SoMa',
  },
  {
    id: 'ann_4',
    title: 'Public Town Hall: 2027 Municipal Infrastructure Budget',
    department: 'Office of the Mayor & City Council',
    category: 'PUBLIC_HEARING',
    priority: 'INFO',
    description:
      'Join Mayor & District Supervisors at City Hall Chambers or via livestream to submit public testimony regarding neighborhood road, park, and accessibility improvements.',
    effectiveDates: 'August 5, 2026 at 6:00 PM',
    publishedAt: '2026-07-25T09:00:00Z',
  },
];

