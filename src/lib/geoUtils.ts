export interface UserCoordinates {
  latitude: number;
  longitude: number;
}

export interface WardInfo {
  id: string;
  name: string;
  officer: string;
  govtBody?: string;
  ecpCode?: string;
}

/**
 * Calculates the great-circle distance between two points in kilometers using the Haversine formula.
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats a distance into a human-readable tag (e.g. "250m away", "1.2 km away").
 */
export function formatDistanceTag(distanceKm: number): string {
  if (distanceKm < 0.1) {
    return '<100m away';
  }
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters}m away`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km away`;
  }
  return `${Math.round(distanceKm)} km away`;
}

export interface KnownCityCoords {
  name: string;
  lat: number;
  lng: number;
}

export const KNOWN_CITIES: KnownCityCoords[] = [
  { name: 'Rawalpindi', lat: 33.5970, lng: 73.0449 },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { name: 'Lahore', lat: 31.5204, lng: 74.3587 },
  { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
  { name: 'Peshawar', lat: 34.0151, lng: 71.5249 },
  { name: 'Quetta', lat: 30.1798, lng: 66.9750 },
  { name: 'Multan', lat: 30.1575, lng: 71.5249 },
  { name: 'Faisalabad', lat: 31.4504, lng: 73.1350 },
  { name: 'Sialkot', lat: 32.4945, lng: 74.5229 },
  { name: 'Gujranwala', lat: 32.1877, lng: 74.1945 },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
];

/**
 * Extracts city name from geotagged address string or coordinates.
 */
export function extractCityFromAddress(addressText: string, lat?: number, lng?: number): string {
  if (addressText) {
    const lowerAddr = addressText.toLowerCase();
    for (const city of KNOWN_CITIES) {
      if (lowerAddr.includes(city.name.toLowerCase())) {
        return city.name;
      }
    }
  }

  // If coordinates are provided, find closest city using Haversine distance
  if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    let closestCity = KNOWN_CITIES[0].name;
    let minDistance = Infinity;

    for (const city of KNOWN_CITIES) {
      const dist = calculateDistanceKm(lat, lng, city.lat, city.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = city.name;
      }
    }

    if (minDistance < 150) {
      return closestCity;
    }
  }

  // Check localStorage saved active geotagged city if present
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('cityscape_user_city');
    if (saved) return saved;
  }

  if (addressText) {
    const parts = addressText.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const candidate = parts.length === 2 ? parts[0] : parts[1];
      const cleanCity = candidate.replace(/[^a-zA-Z\s]/g, '').trim();
      if (cleanCity && cleanCity.length > 2 && !cleanCity.toLowerCase().startsWith('lat')) {
        return cleanCity;
      }
    }

    const cleanFirst = parts[0]?.replace(/[^a-zA-Z\s]/g, '').trim();
    if (cleanFirst && cleanFirst.length > 2 && !cleanFirst.toLowerCase().startsWith('lat')) {
      return cleanFirst;
    }
  }

  return 'San Francisco';
}

/**
 * Returns administrative ward and zone list tailored to the geotagged city.
 */
export function getWardsForCity(cityName: string): WardInfo[] {
  const cleanCity = cityName.trim();
  const lower = cleanCity.toLowerCase();

  if (lower.includes('rawalpindi')) {
    return [
      { id: 'pindi_1', name: 'ECP UC/Ward 1 [Rawalpindi Municipal Corp] - Raja Bazaar & Saddar', officer: 'Maj. Tariq Mahmood', govtBody: 'Rawalpindi Municipal Corporation (RMC) & ECP', ecpCode: 'ECP-RMC-UC01' },
      { id: 'pindi_2', name: 'ECP UC/Ward 2 [Rawalpindi Municipal Corp] - Commercial Market & Satellite Town', officer: 'Insp. Asad Ali', govtBody: 'Rawalpindi Municipal Corporation (RMC) & ECP', ecpCode: 'ECP-RMC-UC02' },
      { id: 'pindi_3', name: 'ECP UC/Ward 3 [Rawalpindi Municipal Corp] - Liaquat Bagh & Murree Road', officer: 'Supt. Farooq Khan', govtBody: 'Rawalpindi Municipal Corporation (RMC) & ECP', ecpCode: 'ECP-RMC-UC03' },
      { id: 'pindi_4', name: 'ECP UC/Ward 4 [Rawalpindi Municipal Corp] - Bahria Town & PWD Corridor', officer: 'Engr. Bilal Ahmed', govtBody: 'Rawalpindi Municipal Corporation (RMC) & ECP', ecpCode: 'ECP-RMC-UC04' },
      { id: 'pindi_5', name: 'ECP UC/Ward 5 [Rawalpindi Municipal Corp] - Dhamial & Westridge Sector', officer: 'Insp. Usman Malik', govtBody: 'Rawalpindi Municipal Corporation (RMC) & ECP', ecpCode: 'ECP-RMC-UC05' },
    ];
  }

  if (lower.includes('islamabad')) {
    return [
      { id: 'isb_1', name: 'ECP UC/Ward 1 [Metropolitan Corp Islamabad] - Sector F-6 & F-7 Super Market', officer: 'Officer Hamza Shah', govtBody: 'Metropolitan Corporation Islamabad (MCI) & ECP', ecpCode: 'ECP-MCI-UC01' },
      { id: 'isb_2', name: 'ECP UC/Ward 2 [Metropolitan Corp Islamabad] - Sector G-8 & G-9 Markaz', officer: 'Dir. Zainab Bibi', govtBody: 'Metropolitan Corporation Islamabad (MCI) & ECP', ecpCode: 'ECP-MCI-UC02' },
      { id: 'isb_3', name: 'ECP UC/Ward 3 [Metropolitan Corp Islamabad] - Sector I-8 & I-9 Commercial Zone', officer: 'Engr. Rashid Minhas', govtBody: 'Metropolitan Corporation Islamabad (MCI) & ECP', ecpCode: 'ECP-MCI-UC03' },
      { id: 'isb_4', name: 'ECP UC/Ward 4 [Metropolitan Corp Islamabad] - Sector E-11 & F-11 Heights', officer: 'Insp. Ali Raza', govtBody: 'Metropolitan Corporation Islamabad (MCI) & ECP', ecpCode: 'ECP-MCI-UC04' },
      { id: 'isb_5', name: 'ECP UC/Ward 5 [Metropolitan Corp Islamabad] - Blue Area Secretariat & Financial Dist', officer: 'Supt. Kamran Akram', govtBody: 'Metropolitan Corporation Islamabad (MCI) & ECP', ecpCode: 'ECP-MCI-UC05' },
    ];
  }

  if (lower.includes('lahore')) {
    return [
      { id: 'lhr_1', name: 'ECP UC/Ward 1 [Lahore Metropolitan Corp] - Gulberg & MM Alam', officer: 'Supt. Hassan Raza', govtBody: 'Lahore Metropolitan Corporation (LMC) & ECP', ecpCode: 'ECP-LMC-UC01' },
      { id: 'lhr_2', name: 'ECP UC/Ward 2 [Lahore Metropolitan Corp] - Mall Road & Anarkali Zone', officer: 'Insp. Imran Qureshi', govtBody: 'Lahore Metropolitan Corporation (LMC) & ECP', ecpCode: 'ECP-LMC-UC02' },
      { id: 'lhr_3', name: 'ECP UC/Ward 3 [Lahore Metropolitan Corp] - DHA & Cantt Sector', officer: 'Engr. Faisal Shah', govtBody: 'Lahore Metropolitan Corporation (LMC) & ECP', ecpCode: 'ECP-LMC-UC03' },
      { id: 'lhr_4', name: 'ECP UC/Ward 4 [Lahore Metropolitan Corp] - Model Town & Garden Town', officer: 'Officer Ayesha Malik', govtBody: 'Lahore Metropolitan Corporation (LMC) & ECP', ecpCode: 'ECP-LMC-UC04' },
      { id: 'lhr_5', name: 'ECP UC/Ward 5 [Lahore Metropolitan Corp] - Johar Town & Wapda Town', officer: 'Insp. Bilal Butt', govtBody: 'Lahore Metropolitan Corporation (LMC) & ECP', ecpCode: 'ECP-LMC-UC05' },
    ];
  }

  if (lower.includes('karachi')) {
    return [
      { id: 'khi_1', name: 'ECP UC/Ward 1 [Karachi Metropolitan Corp] - Clifton & Defence Secretariat', officer: 'Supt. Tariq Jamil', govtBody: 'Karachi Metropolitan Corporation (KMC) & ECP', ecpCode: 'ECP-KMC-UC01' },
      { id: 'khi_2', name: 'ECP UC/Ward 2 [Karachi Metropolitan Corp] - Saddar & M.A. Jinnah Road', officer: 'Insp. Farhan Saeed', govtBody: 'Karachi Metropolitan Corporation (KMC) & ECP', ecpCode: 'ECP-KMC-UC02' },
      { id: 'khi_3', name: 'ECP UC/Ward 3 [Karachi Metropolitan Corp] - Gulshan-e-Iqbal Sector', officer: 'Engr. Owais Siddiqui', govtBody: 'Karachi Metropolitan Corporation (KMC) & ECP', ecpCode: 'ECP-KMC-UC03' },
      { id: 'khi_4', name: 'ECP UC/Ward 4 [Karachi Metropolitan Corp] - PECHS & Tariq Road Corridor', officer: 'Officer Noman Khan', govtBody: 'Karachi Metropolitan Corporation (KMC) & ECP', ecpCode: 'ECP-KMC-UC04' },
      { id: 'khi_5', name: 'ECP UC/Ward 5 [Karachi Metropolitan Corp] - North Nazimabad Zone', officer: 'Insp. Kamran Mirza', govtBody: 'Karachi Metropolitan Corporation (KMC) & ECP', ecpCode: 'ECP-KMC-UC05' },
    ];
  }

  if (lower.includes('new york') || lower.includes('ny') || lower.includes('manhattan')) {
    return [
      { id: 'ny_1', name: 'NYC Council Ward 1 [NYC Board of Elections] - Manhattan Financial District', officer: 'Capt. John Miller', govtBody: 'NYC Board of Elections & City Council', ecpCode: 'NYC-BOE-W01' },
      { id: 'ny_2', name: 'NYC Council Ward 2 [NYC Board of Elections] - Midtown & Times Square', officer: 'Sgt. Rachel Green', govtBody: 'NYC Board of Elections & City Council', ecpCode: 'NYC-BOE-W02' },
      { id: 'ny_3', name: 'NYC Council Ward 3 [NYC Board of Elections] - Brooklyn Williamsburg & DUMBO', officer: 'Insp. David Ross', govtBody: 'NYC Board of Elections & City Council', ecpCode: 'NYC-BOE-W03' },
      { id: 'ny_4', name: 'NYC Council Ward 4 [NYC Board of Elections] - Queens Astoria & LIC', officer: 'Officer Maria Santos', govtBody: 'NYC Board of Elections & City Council', ecpCode: 'NYC-BOE-W04' },
      { id: 'ny_5', name: 'NYC Council Ward 5 [NYC Board of Elections] - Bronx Grand Concourse & Hub', officer: 'Chief Marcus Vance', govtBody: 'NYC Board of Elections & City Council', ecpCode: 'NYC-BOE-W05' },
    ];
  }

  if (lower.includes('london')) {
    return [
      { id: 'ldn_1', name: 'Electoral Ward 1 [UK Electoral Commission] - Westminster, Soho & Covent Garden', officer: 'Insp. James Sterling', govtBody: 'UK Electoral Commission & GLA', ecpCode: 'UK-EC-LDN01' },
      { id: 'ldn_2', name: 'Electoral Ward 2 [UK Electoral Commission] - Camden & Kings Cross', officer: 'Officer Emma Watson', govtBody: 'UK Electoral Commission & GLA', ecpCode: 'UK-EC-LDN02' },
      { id: 'ldn_3', name: 'Electoral Ward 3 [UK Electoral Commission] - City of London Square Mile', officer: 'Supt. Arthur Pendelton', govtBody: 'UK Electoral Commission & GLA', ecpCode: 'UK-EC-LDN03' },
      { id: 'ldn_4', name: 'Electoral Ward 4 [UK Electoral Commission] - Kensington & Chelsea', officer: 'Sgt. Oliver Twist', govtBody: 'UK Electoral Commission & GLA', ecpCode: 'UK-EC-LDN04' },
      { id: 'ldn_5', name: 'Electoral Ward 5 [UK Electoral Commission] - Lambeth & Southbank', officer: 'Insp. Charlotte Webb', govtBody: 'UK Electoral Commission & GLA', ecpCode: 'UK-EC-LDN05' },
    ];
  }

  if (lower.includes('paris')) {
    return [
      { id: 'prs_1', name: 'Arrondissement Électoral 1 [Mairie/Govt] - 1er Arr. & Louvre Secretariat', officer: 'Supt. Pierre Laurent', govtBody: "Ministère de l'Intérieur & Mairie de Paris", ecpCode: 'FR-ELEC-P01' },
      { id: 'prs_2', name: 'Arrondissement Électoral 2 [Mairie/Govt] - Le Marais & Bastille', officer: 'Insp. Claire Dubois', govtBody: "Ministère de l'Intérieur & Mairie de Paris", ecpCode: 'FR-ELEC-P02' },
      { id: 'prs_3', name: 'Arrondissement Électoral 3 [Mairie/Govt] - Montmartre & 18e Zone', officer: 'Officer Luc Moreau', govtBody: "Ministère de l'Intérieur & Mairie de Paris", ecpCode: 'FR-ELEC-P03' },
      { id: 'prs_4', name: 'Arrondissement Électoral 4 [Mairie/Govt] - Champs-Élysées & 8e Zone', officer: 'Supt. Sophie Martin', govtBody: "Ministère de l'Intérieur & Mairie de Paris", ecpCode: 'FR-ELEC-P04' },
      { id: 'prs_5', name: 'Arrondissement Électoral 5 [Mairie/Govt] - Quartier Latin & Rive Gauche', officer: 'Insp. Antoine Bernard', govtBody: "Ministère de l'Intérieur & Mairie de Paris", ecpCode: 'FR-ELEC-P05' },
    ];
  }

  if (lower.includes('tokyo')) {
    return [
      { id: 'tky_1', name: 'Electoral Ku/Ward 1 [TMG Commission] - Shinjuku & Shibuya District', officer: 'Insp. Kenji Sato', govtBody: 'Tokyo Metropolitan Govt & Election Commission', ecpCode: 'TMG-ELEC-W01' },
      { id: 'tky_2', name: 'Electoral Ku/Ward 2 [TMG Commission] - Chiyoda & Ginza Zone', officer: 'Supt. Yoko Tanaka', govtBody: 'Tokyo Metropolitan Govt & Election Commission', ecpCode: 'TMG-ELEC-W02' },
      { id: 'tky_3', name: 'Electoral Ku/Ward 3 [TMG Commission] - Minato & Roppongi Sector', officer: 'Officer Hiroshi Takahashi', govtBody: 'Tokyo Metropolitan Govt & Election Commission', ecpCode: 'TMG-ELEC-W03' },
      { id: 'tky_4', name: 'Electoral Ku/Ward 4 [TMG Commission] - Asakusa & Ueno Zone', officer: 'Supt. Akiko Suzuki', govtBody: 'Tokyo Metropolitan Govt & Election Commission', ecpCode: 'TMG-ELEC-W04' },
      { id: 'tky_5', name: 'Electoral Ku/Ward 5 [TMG Commission] - Ikebukuro & Toshima Sector', officer: 'Insp. Daisuke Watanabe', govtBody: 'Tokyo Metropolitan Govt & Election Commission', ecpCode: 'TMG-ELEC-W05' },
    ];
  }

  if (lower.includes('san francisco') || lower.includes('sf')) {
    return [
      { id: 'sf_ward_1', name: 'SF Govt District 1 [Department of Elections] - Downtown & Civic Center', officer: 'Capt. Sarah Jenkins', govtBody: 'SF Board of Supervisors & Dept of Elections', ecpCode: 'SF-ELEC-D01' },
      { id: 'sf_ward_2', name: 'SF Govt District 2 [Department of Elections] - Mission & Valencia Corridor', officer: 'Insp. Carlos Rivera', govtBody: 'SF Board of Supervisors & Dept of Elections', ecpCode: 'SF-ELEC-D02' },
      { id: 'sf_ward_3', name: 'SF Govt District 3 [Department of Elections] - Sunset & Richmond District', officer: 'Officer Elena Rostova', govtBody: 'SF Board of Supervisors & Dept of Elections', ecpCode: 'SF-ELEC-D03' },
      { id: 'sf_ward_4', name: 'SF Govt District 4 [Department of Elections] - SoMa, South Beach & Wharf', officer: 'Chief Marcus Vance', govtBody: 'SF Board of Supervisors & Dept of Elections', ecpCode: 'SF-ELEC-D04' },
      { id: 'sf_ward_5', name: 'SF Govt District 5 [Department of Elections] - Castro, Noe & Twin Peaks', officer: 'Officer Maya Lin', govtBody: 'SF Board of Supervisors & Dept of Elections', ecpCode: 'SF-ELEC-D05' },
    ];
  }

  const capitalized = cleanCity.charAt(0).toUpperCase() + cleanCity.slice(1);
  return [
    { id: `${cleanCity}_1`, name: `ECP/Municipal Ward 1 [${capitalized} Govt Secretariat] - Central & Civic District`, officer: 'Chief Admin Lead', govtBody: `${capitalized} Municipal Corporation & Election Board`, ecpCode: `${cleanCity.toUpperCase()}-UC01` },
    { id: `${cleanCity}_2`, name: `ECP/Municipal Ward 2 [${capitalized} Govt Secretariat] - North Zone & Commercial Corridor`, officer: 'Municipal Inspector', govtBody: `${capitalized} Municipal Corporation & Election Board`, ecpCode: `${cleanCity.toUpperCase()}-UC02` },
    { id: `${cleanCity}_3`, name: `ECP/Municipal Ward 3 [${capitalized} Govt Secretariat] - East Zone & Residential Sector`, officer: 'Community Field Officer', govtBody: `${capitalized} Municipal Corporation & Election Board`, ecpCode: `${cleanCity.toUpperCase()}-UC03` },
    { id: `${cleanCity}_4`, name: `ECP/Municipal Ward 4 [${capitalized} Govt Secretariat] - South Zone & Industrial Park`, officer: 'Public Works Engr.', govtBody: `${capitalized} Municipal Corporation & Election Board`, ecpCode: `${cleanCity.toUpperCase()}-UC04` },
    { id: `${cleanCity}_5`, name: `ECP/Municipal Ward 5 [${capitalized} Govt Secretariat] - West Zone & Suburban Sector`, officer: 'Municipal Operations Lead', govtBody: `${capitalized} Municipal Corporation & Election Board`, ecpCode: `${cleanCity.toUpperCase()}-UC05` },
  ];
}

