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
    badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
    badgeText: 'text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    description: 'Burst water mains, clogged storm drains, sewage backup'
  },
  ROADS_TRAFFIC: {
    label: 'Roads & Traffic Signs',
    iconName: 'TrafficCone',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    description: 'Damaged stop signs, missing lane markers, obscured crosswalks'
  },
  OTHER: {
    label: 'General Infrastructure',
    iconName: 'HelpCircle',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
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
    textClass: 'text-emerald-700 dark:text-emerald-300',
    pinHex: '#10B981' // Green
  },
  REJECTED: {
    label: 'Rejected / Duplicate',
    dotColor: 'bg-slate-400',
    bgClass: 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
    textClass: 'text-slate-600 dark:text-slate-400',
    pinHex: '#64748B' // Slate Gray
  }
};

export const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; colorClass: string }> = {
  LOW: { label: 'Low Severity', colorClass: 'bg-slate-100 text-slate-700 border-slate-300' },
  MEDIUM: { label: 'Moderate Hazard', colorClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  HIGH: { label: 'High Priority', colorClass: 'bg-orange-50 text-orange-700 border-orange-300 font-semibold' },
  CRITICAL: { label: 'Critical Safety Risk', colorClass: 'bg-red-100 text-red-800 border-red-300 font-bold' }
};
