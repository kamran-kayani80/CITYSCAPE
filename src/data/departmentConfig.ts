import { MunicipalDepartmentCode, MunicipalDepartmentConfig } from '../types';

export const MUNICIPAL_DEPARTMENTS: Record<MunicipalDepartmentCode, MunicipalDepartmentConfig> = {
  DPW: {
    code: 'DPW',
    name: 'Public Works & Infrastructure',
    shortName: 'DPW Infrastructure',
    roleTitle: 'Chief Civil Engineer / Works Inspector',
    defaultPasskey: 'dpw2026',
    supervisorRecoveryCode: 'DPW-SUPERVISOR-991',
    securityQuestion: 'What is the primary road resurfacing asphalt standard grade code?',
    securityAnswer: 'SUPERPAVE-PG70',
    recoveryEmail: 'kaamikayani@gmail.com',
    iconName: 'Wrench',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/80',
    badgeText: 'text-amber-900 dark:text-amber-200',
    borderColor: 'border-amber-500',
    description: 'Road resurfacing, pothole repairs, bridges, storm drain maintenance, structural masonry & culvert clearing.',
    sampleTopics: [
      'Main Arterial Asphalt Rehabilitation & Resurfacing',
      'Underground Storm Drainage Reinforcement',
      'Structural Culvert Clearing Ahead of Monsoons',
      'Pothole Remediation Blitz in Central Ward'
    ]
  },
  WASA: {
    code: 'WASA',
    name: 'Water & Sanitation Agency (WASA)',
    shortName: 'WASA Water & Sanitation',
    roleTitle: 'Hydraulic Operations & Water Board Officer',
    defaultPasskey: 'wasa2026',
    supervisorRecoveryCode: 'WASA-HYD-CHIEF-882',
    securityQuestion: 'What is the central water filtration reservoir code?',
    securityAnswer: 'RAWAL-FILTRATION-01',
    recoveryEmail: 'kaamikayani@gmail.com',
    iconName: 'Droplets',
    badgeBg: 'bg-teal-100 dark:bg-teal-950/80',
    badgeText: 'text-teal-900 dark:text-teal-200',
    borderColor: 'border-[#008080]',
    description: 'Potable water supply, main line pressure balancing, filtration plant maintenance & sewer line desilting.',
    sampleTopics: [
      'Scheduled Filtration Plant Maintenance & Disinfection',
      'Main Pipeline Pressure Balancing in Sector B',
      'Emergency Water Tanker Dispatch to High Elevation Wards',
      'Trunk Sewer Desilting & Flushing Operations'
    ]
  },
  TRANSIT: {
    code: 'TRANSIT',
    name: 'Traffic, Transit & Mobility Bureau',
    shortName: 'Transit & Traffic Mobility',
    roleTitle: 'Senior Traffic Warden / Mobility Dispatcher',
    defaultPasskey: 'transit2026',
    supervisorRecoveryCode: 'TRANSIT-DIR-773',
    securityQuestion: 'What is the central traffic signal telemetry dispatch center?',
    securityAnswer: 'CORRIDOR-COMMAND-9',
    recoveryEmail: 'kaamikayani@gmail.com',
    iconName: 'Bus',
    badgeBg: 'bg-sky-100 dark:bg-sky-950/80',
    badgeText: 'text-sky-900 dark:text-sky-200',
    borderColor: 'border-sky-600',
    description: 'Traffic diversions, traffic signal modernization, low-floor bus scheduling, road closures & pedestrian corridors.',
    sampleTopics: [
      'Temporary Commercial Boulevard Detour During Peak Hours',
      'Deployment of Low-Floor Accessible Buses on Route 4',
      'Smart Traffic Signal Calibration at Major Intersections',
      'Pedestrian Greenway & School Crossing Zone Activation'
    ]
  },
  RESCUE: {
    code: 'RESCUE',
    name: 'Emergency Services & Disaster Management (1122)',
    shortName: 'Rescue 1122 Emergency',
    roleTitle: 'Disaster Management & Emergency Response Chief',
    defaultPasskey: 'rescue2026',
    supervisorRecoveryCode: 'RESCUE-HQ-1122',
    securityQuestion: 'What is the citywide disaster management emergency frequency code?',
    securityAnswer: 'RESCUE-DISASTER-1122',
    recoveryEmail: 'kaamikayani@gmail.com',
    iconName: 'Siren',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/80',
    badgeText: 'text-rose-900 dark:text-rose-200',
    borderColor: 'border-red-600',
    description: 'Flash flood warnings, storm preparedness advisories, building collapse risk alerts & fire safety notices.',
    sampleTopics: [
      '⚡ High-Priority Monsoon Flash Flood Watch & Nullah Advisory',
      'Structural Safety Precaution During High Wind Advisories',
      'Emergency First Responder Sector Staging Alert',
      'Public Cooling Station & Heatwave Advisory Activation'
    ]
  },
  COUNCIL: {
    code: 'COUNCIL',
    name: 'City Council & Citizen Engagement Secretariat',
    shortName: 'City Council Secretariat',
    roleTitle: 'Municipal Secretary / Ward Liaison Officer',
    defaultPasskey: 'council2026',
    supervisorRecoveryCode: 'COUNCIL-SEC-554',
    securityQuestion: 'What is the official city charter gazette volume registration number?',
    securityAnswer: 'CHARTER-GAZETTE-2026',
    recoveryEmail: 'kaamikayani@gmail.com',
    iconName: 'Landmark',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80',
    badgeText: 'text-emerald-900 dark:text-emerald-200',
    borderColor: 'border-[#006D5B]',
    description: 'Public hearings, municipal budget town halls, green civic grant announcements & ward representative meetings.',
    sampleTopics: [
      '🏛️ Public Hearing: Fiscal Infrastructure & Greening Budget',
      'Ward Representative Community Open Door Session',
      'Citizen Participatory Budgeting & Green Street Grants',
      'Senior Citizen & Accessibility Advisory Committee Briefing'
    ]
  }
};

export const MUNICIPAL_DEPARTMENTS_ARRAY = Object.values(MUNICIPAL_DEPARTMENTS);

// Master Emergency & Universal Recovery Tokens (ISO 27001 Certified)
export const MASTER_SECURITY_KEYS = {
  MASTER_RECOVERY_TOKEN: 'CITYSCAPE-RECOVER-2026',
  MASTER_OWNER_KEY: 'owner2026',
  DEFAULT_DESK_PASSCODE: 'civic2026',
  OWNER_RECOVERY_EMAIL: 'kaamikayani@gmail.com',
  MAIN_DESK_SECURITY_QUESTION: 'What is the registered Cityscape Municipal Project ID?',
  MAIN_DESK_SECURITY_ANSWER: 'CITYSCAPE-RP-01',
};
