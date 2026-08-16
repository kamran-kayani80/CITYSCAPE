export interface TechnicalRepairGuide {
  id: string;
  title: string;
  category: 'roads' | 'water' | 'lighting' | 'concrete' | 'forestry' | 'traffic';
  department: string;
  officialAuthor: {
    name: string;
    role: string;
    department: string;
    avatarUrl?: string;
    verifiedSeal: boolean;
  };
  lastUpdated: string;
  commonResidentQuestion: string;
  shortSummary: string;
  plainLanguageExplanation: string; // Senior-accessible, empathetic, plain language
  technicalSop: {
    methodName: string;
    standardCode?: string; // e.g. "ASTM D6690 / AASHTO M324"
    stepByStepProcedure: string[];
    equipmentAndMaterials: string[];
    crewRequirement: string;
    cureAndResolutionTime: string;
    serviceLifeExpectancy: string;
    trafficControlProtocol?: string;
  };
  whyThisMethodChosen: string;
  commonResidentMisconceptions?: string[];
  helpfulCount: number;
  featuredStatus: boolean;
  relatedReportTypes: string[];
}

export const INITIAL_EXPERT_QA: TechnicalRepairGuide[] = [
  {
    id: 'qa-pothole-hotmix',
    title: 'Hot-Mix Asphalt Box Cut vs. Emergency Cold Patch',
    category: 'roads',
    department: 'Bureau of Street Services & Paving',
    officialAuthor: {
      name: 'Elena Rostova, PE',
      role: 'Lead Pavement Materials Engineer',
      department: 'Dept. of Public Works',
      verifiedSeal: true,
    },
    lastUpdated: 'August 12, 2026',
    commonResidentQuestion: 'Why does the city sometimes fill a pothole quickly in winter with soft asphalt, and later return with heavy machinery to cut a large square hole?',
    shortSummary: 'Explains the difference between temporary cold patches during rain/freeze cycles and permanent rectangular hot-mix asphalt saw-cut milling.',
    plainLanguageExplanation: 'During freezing or rainy weather, hot asphalt cannot stick properly to the ground. Our crews first use an emergency cold mix so cars do not damage their tires. Once the weather is dry and warm, our public works crew returns with a saw to cut clean, square edges, clean out the sub-base, pour 300°F hot asphalt, and roll it flat with heavy compactors. This creates a smooth, watertight seal that lasts 7 to 10 years.',
    technicalSop: {
      methodName: 'Square-Cut Mill & Infill with Type S-1 Hot Mix Asphalt',
      standardCode: 'AASHTO T-245 / ASTM D6927-15',
      stepByStepProcedure: [
        'Mark a perimeter 12 inches beyond all visible stress cracks using fluorescent chalk.',
        'Saw-cut vertical edges at 90-degree angles to avoid feathering edges which crumble easily.',
        'Excavate decayed asphalt to the solid aggregate base course (typically 2 to 4 inches deep).',
        'Apply SS-1h cationic asphalt tack coat emulsion evenly across all vertical walls and base at 0.10 gal/sq yard.',
        'Deposit hot-mix asphalt (HMA) at 295°F–320°F in uniform 2-inch lifts.',
        'Compact with a 3-ton vibratory steel-drum roller to achieve 93%–97% theoretical maximum density (TMD).',
        'Apply rubberized over-band joint sealant along perimeter joints to prevent moisture infiltration.',
      ],
      equipmentAndMaterials: [
        'Diamond-blade hydraulic asphalt saw',
        'Vibratory tandem steel roller (3–5 ton)',
        'SS-1h Tack Coat Emulsion',
        'PG 64-22 binder Hot-Mix Asphalt Aggregate',
        'Infrared thermometer & nuclear density gauge',
      ],
      crewRequirement: '4-person paving crew + 1 traffic flagger',
      cureAndResolutionTime: '2 to 3 hours before traffic reopening',
      serviceLifeExpectancy: '7 to 10 years',
      trafficControlProtocol: 'MUTCD Single-Lane Closure with Type II Barricades and 200ft Cone Taper',
    },
    whyThisMethodChosen: 'Saw-cutting rectangular edges eliminates weakened perimeter material and provides a solid vertical wall for the tack coat to lock into, preventing water from seeping underneath during winter freezes.',
    commonResidentMisconceptions: [
      'Myth: "The city did a sloppy job because the patch washed out in the rain." (Fact: Temporary emergency cold patch is formulated to be pliable in sub-freezing temps until permanent hot-mix plants reopen in spring).',
      'Myth: "Potholes should just be filled higher like a speed bump." (Fact: Overfilled patches get sheared off by snowplows and bus tires, causing larger road craters).',
    ],
    helpfulCount: 342,
    featuredStatus: true,
    relatedReportTypes: ['Pothole', 'Road Hazard', 'Cracked Pavement'],
  },
  {
    id: 'qa-cipp-watermain',
    title: 'Cured-In-Place Pipe (CIPP) Trenchless Sewer Relining',
    category: 'water',
    department: 'Bureau of Sanitation & Water Works',
    officialAuthor: {
      name: 'Marcus Vance',
      role: 'Chief Underground Utilities Superintendent',
      department: 'Municipal Water & Sewer Authority',
      verifiedSeal: true,
    },
    lastUpdated: 'August 8, 2026',
    commonResidentQuestion: 'Why is there steam coming out of manholes on our street without the city digging up the roadway?',
    shortSummary: 'How trenchless cured-in-place resin liners restore aging sewer and stormwater pipes without ripping open neighborhood streets.',
    plainLanguageExplanation: 'Instead of digging up your street with backhoes and closing roads for weeks, our water crew feeds a flexible, resin-soaked felt tube through existing manholes. We inflate the tube with hot steam or UV light, which hardens the resin into a brand-new, joint-free structural pipe inside the old one. The steam you see from manholes is the curing process that locks the new pipe in place.',
    technicalSop: {
      methodName: 'Cured-In-Place Pipe (CIPP) Inversion with Thermosetting Epoxy Resin',
      standardCode: 'ASTM F1216 / ASTM F1743 Standard Practice for CIPP',
      stepByStepProcedure: [
        'Pre-clean host pipe using high-pressure CCTV hydro-jetter (2,500 PSI) and remove root intrusion with robotic cutter.',
        'Perform pre-installation digital robotic CCTV inspection to verify pipe geometry and lateral locations.',
        'Saturate polyester felt tube with thermosetting vinyl ester / epoxy resin in a temperature-controlled truck.',
        'Invert liner tube through access manhole using hydrostatic water column or compressed air inversion drum.',
        'Circulate pressurized steam (180°F–210°F) or draw UV light train at 2.5 ft/min to cure the resin matrix to 450,000 PSI flexural modulus.',
        'Deploy robotic lateral reinstatement cutter to mill open existing residential branch connections.',
        'Conduct final high-definition pan-and-tilt CCTV log and hydrostatic pressure test.',
      ],
      equipmentAndMaterials: [
        'CCTV Robotic Camera Inspection Rig',
        'High-velocity vacuum jetter truck',
        'Mobile steam generation boiler unit',
        'Woven glass-reinforced polyester felt liner',
        'Non-hazardous thermosetting epoxy resin',
      ],
      crewRequirement: '5-person trenchless specialist crew',
      cureAndResolutionTime: '8 to 12 hours continuous cycle',
      serviceLifeExpectancy: '50+ years',
      trafficControlProtocol: 'Manhole perimeter safety zone; local resident bypass pumping if required',
    },
    whyThisMethodChosen: 'Trenchless CIPP eliminates open-cut street excavation, saves taxpayers up to 60% in road reconstruction costs, preserves mature street trees, and reduces street closure time from 3 weeks to 1 day.',
    commonResidentMisconceptions: [
      'Myth: "The steam from the manholes is smoke from a fire." (Fact: It is clean water vapor from the heated curing boiler).',
      'Myth: "My house sewer will be shut off for days." (Fact: Lateral connections are automatically reopened within 8 hours).',
    ],
    helpfulCount: 289,
    featuredStatus: true,
    relatedReportTypes: ['Sewage Backup', 'Storm Drain Blockage', 'Water Main Leak'],
  },
  {
    id: 'qa-led-photocell-driver',
    title: 'Smart LED Luminaire Photocell & Optical Driver Replacement',
    category: 'lighting',
    department: 'Bureau of Street Lighting',
    officialAuthor: {
      name: 'Sarah Chen, PE',
      role: 'Supervising Electrical Systems Engineer',
      department: 'Bureau of Street Lighting',
      verifiedSeal: true,
    },
    lastUpdated: 'August 14, 2026',
    commonResidentQuestion: 'Why does a street light flicker on and off continuously at dusk, or stay on brightly during the middle of a sunny day?',
    shortSummary: 'Diagnosing photoelectric daylight sensors, thermal cycling in LED drivers, and optical luminaire repairs.',
    plainLanguageExplanation: 'When a streetlight stays on during broad daylight, it is usually because the photoelectric daylight sensor on top of the pole has failed in "fail-safe" mode. By design, our lights turn ON when the sensor breaks so streets never stay dark at night. When a light flickers rapidly, it is often due to an overheating LED power driver. Our electricians use bucket trucks to test the 7-pin smart sensor and replace the sealed electronic driver module in under 30 minutes.',
    technicalSop: {
      methodName: '7-Pin ANSI C136.41 NEMA Receptacle & Constant-Current Driver Overhaul',
      standardCode: 'ANSI C136.41 / IESNA RP-8-21 Roadway Lighting',
      stepByStepProcedure: [
        'Lockout/Tagout 120V/277V luminaire branch circuit at base pull box.',
        'Ascend via insulated aerial bucket truck to inspect luminaire housing for environmental water ingress.',
        'Test photoelectric control (PE) twist-lock sensor using calibrated lux light-blocking shroud.',
        'If daylight sensor unresponsive, replace with ANSI C136.41 7-pin smart twist-lock photocell with built-in GPS node.',
        'If strobing/flickering persists, disconnect constant-current LED driver and test input/output DC voltage ripple with multimeter.',
        'Replace with IP67-rated 0-10V dimmable LED electronic driver (150W, 700mA output) and reconnect surge protection device (10kV/10kA SPD).',
        'Verify 4000K CCT luminous output and aim optics to eliminate light trespass onto resident bedroom windows.',
      ],
      equipmentAndMaterials: [
        'Aerial bucket truck with insulated boom',
        'Digital true-RMS multimeter & lux meter',
        'ANSI C136.41 Smart NEMA Photocell controller',
        'IP67 Dimmable LED Driver (100W–150W)',
        '10kV Surge Protective Device (SPD)',
      ],
      crewRequirement: '2 certified high-voltage municipal electricians',
      cureAndResolutionTime: '30 to 45 minutes per luminaire',
      serviceLifeExpectancy: '12 to 15 years (100,000 operating hours)',
      trafficControlProtocol: 'Bucket truck flashing arrow board + 100ft trailing safety buffer cones',
    },
    whyThisMethodChosen: 'Smart 7-pin photocells communicate with our central municipal SCADA grid, reporting outages automatically before residents even have to submit a request.',
    commonResidentMisconceptions: [
      'Myth: "A light burning during the day is wasting thousands of dollars." (Fact: Modern LED fixtures consume less than 65 Watts, costing roughly 4 cents for an afternoon of testing).',
      'Myth: "The city just needs to screw in a new bulb." (Fact: Modern municipal streetlights are integrated solid-state circuit arrays, not screw-in bulbs).',
    ],
    helpfulCount: 215,
    featuredStatus: true,
    relatedReportTypes: ['Streetlight Out', 'Flickering Light', 'Exposed Electrical Box'],
  },
  {
    id: 'qa-tree-root-sidewalk',
    title: 'Tree Root Deflector Barriers & Concrete Slab Precision Re-leveling',
    category: 'concrete',
    department: 'Urban Forestry & Sidewalk Maintenance',
    officialAuthor: {
      name: 'Julian Thorne, ISA Board Certified Master Arborist',
      role: 'Senior Urban Forester & Right-of-Way Inspector',
      department: 'Dept. of Urban Forestry & Sidewalks',
      verifiedSeal: true,
    },
    lastUpdated: 'August 10, 2026',
    commonResidentQuestion: 'Can the city fix the trip hazard on our sidewalk without cutting down our 40-year-old shade tree?',
    shortSummary: 'Preserving neighborhood tree canopies while eliminating ADA tripping hazards through selective root pruning and interlocking root deflectors.',
    plainLanguageExplanation: 'We love our street trees and do everything possible to protect them. When tree roots lift a sidewalk slab, our arborists do not cut down the tree. For small bumps under 1 inch, we use diamond-blade horizontal saws to shave the edge smooth. For larger lifts, we carefully dig with compressed air to protect the roots, install a deep plastic root deflector wall that guides future roots downward, and pour a flexible reinforced concrete slab with a rubberized expansion cushion.',
    technicalSop: {
      methodName: 'Air-Spade Root Excavation, Deep Root Deflection Barrier & ADA Ramp Re-pour',
      standardCode: 'ANSI A300 (Part 8 Root Management) / ADAAG Section 403',
      stepByStepProcedure: [
        'Survey sidewalk vertical displacement using an ADA smart digital level (threshold > 0.25 inch requires remediation).',
        'If lift is between 0.25" and 0.75", perform precision horizontal diamond saw cutting to create a 1:12 ADA-compliant transition ramp.',
        'If lift exceeds 1.0", saw-cut and remove concrete flag without damaging underlying root collars.',
        'Use supersonic Air-Spade pneumatic tool (compressed air at 90 PSI) to expose root zone without tearing the cambium bark layer.',
        'Perform surgical selective root pruning only on non-structural roots under 2" diameter, treating cuts according to ANSI A300 standards.',
        'Install 18-inch deep high-density polyethylene (HDPE) vertical root barrier panels with 90-degree downward guidance ribs.',
        'Re-pour slab using 4,000 PSI fiber-reinforced concrete with #4 rebar dowels into adjacent stable flags.',
      ],
      equipmentAndMaterials: [
        'Pneumatic Air-Spade excavation system with 185 CFM compressor',
        'Horizontal precision diamond concrete planer',
        'DeepRoot HDPE 18" Vertical Root Barrier Panels',
        'Fiber-reinforced 4,000 PSI concrete mix',
        'Pre-molded bituminous expansion joint filler',
      ],
      crewRequirement: '3 concrete masons + 1 certified arborist',
      cureAndResolutionTime: '24 hours initial set, 72 hours for full wheelchair traffic',
      serviceLifeExpectancy: '15 to 20 years',
      trafficControlProtocol: 'Pedestrian bypass canopy walkway or temporary ADA ramp crossing',
    },
    whyThisMethodChosen: 'Combines urban canopy preservation with strict federal ADA wheelchair access compliance, avoiding $5,000+ tree removal and replanting costs.',
    commonResidentMisconceptions: [
      'Myth: "Just chop the big tree root with an axe." (Fact: Severing roots larger than 3 inches destabilizes the tree, turning it into a dangerous falling hazard in windstorms).',
      'Myth: "Sidewalks should be asphalt instead." (Fact: Asphalt melts and warps in summer heat, creating soft ruts inaccessible to walkers and strollers).',
    ],
    helpfulCount: 412,
    featuredStatus: true,
    relatedReportTypes: ['Broken Sidewalk', 'Tripping Hazard', 'Tree Root Damage'],
  },
  {
    id: 'qa-speed-cushion-geometry',
    title: 'Emergency-Vehicle Friendly Speed Cushions vs. Traditional Speed Bumps',
    category: 'traffic',
    department: 'Bureau of Traffic Engineering & Vision Zero',
    officialAuthor: {
      name: 'David Okafor, PTOE',
      role: 'Senior Traffic Calming Engineer',
      department: 'Vision Zero Street Safety Taskforce',
      verifiedSeal: true,
    },
    lastUpdated: 'August 5, 2026',
    commonResidentQuestion: 'Why did the city install speed cushions with split wheel cutouts instead of one continuous speed bump across our street?',
    shortSummary: 'Engineering traffic calming that slows residential speeders without delaying fire trucks or paramedics.',
    plainLanguageExplanation: 'Speed cushions have specially measured wheel cutouts that allow wide-wheelbase emergency vehicles—like fire engines and ambulances—to drive straight through without slowing down. Standard passenger cars and SUVs have a narrower wheelbase, so their tires must ride over the gentle 3-inch raised hump, naturally calming traffic to safe 15–20 MPH neighborhood speeds.',
    technicalSop: {
      methodName: 'Split-Wheelbase Parabolic Speed Cushion Installation',
      standardCode: 'ITE Guidelines for Traffic Calming / MUTCD Section 3B.18',
      stepByStepProcedure: [
        'Conduct 7-day radar traffic speed and volume study to verify 85th percentile speed exceeds posted speed limit by ≥ 5 MPH.',
        'Survey roadway cross-slope and storm drainage gutters to ensure cushion placement maintains 12" unobstructed gutter flow line.',
        'Lay out modular recycled rubber speed cushion sections (7 ft width, 6 ft length, 3.125 in height with 1:10 approach slope).',
        'Drill anchor holes using rotary hammer drill and drive 1/2" x 5-1/2" mechanical expansion anchor bolts with heavy-duty lag shields.',
        'Torque anchor bolts to 45 ft-lbs and cap bolt recesses with watertight rubber plugs.',
        'Apply high-visibility molded reflective polyurethane white arrow chevrons facing both directions of vehicular travel.',
        'Install advance W17-1 "SPEED CUSHION 15 MPH" warning signs 100 feet in advance of installation.',
      ],
      equipmentAndMaterials: [
        'Heavy-duty recycled vulcanized rubber cushion modules',
        'Galvanized 1/2" mechanical concrete expansion anchors',
        'Rotary hammer drill with HEPA dust collection',
        'Torque wrench & calibrated impact driver',
        'Retroreflective MUTCD W17-1 signs and solar flashers',
      ],
      crewRequirement: '2-person traffic operations crew',
      cureAndResolutionTime: '2 hours total install (immediate roadway opening)',
      serviceLifeExpectancy: '8 to 12 years (with annual bolt retorquing)',
      trafficControlProtocol: 'Alternating flagger single-lane traffic control during 2-hour install',
    },
    whyThisMethodChosen: 'Preserves 0-second delay for Emergency Medical Services (EMS) and Fire Departments while reducing speeding by up to 68% in residential school zones.',
    commonResidentMisconceptions: [
      'Myth: "Speed bumps damage all car suspensions." (Fact: Parabolic cushions at 15–20 MPH produce a smooth vertical deflection with zero structural vehicle impact).',
      'Myth: "They block rainwater from draining." (Fact: Cushions stop 12 to 18 inches short of the curb so street water flows freely to storm catch basins).',
    ],
    helpfulCount: 198,
    featuredStatus: false,
    relatedReportTypes: ['Speeding', 'Traffic Calming', 'Unsafe Intersection'],
  },
];
