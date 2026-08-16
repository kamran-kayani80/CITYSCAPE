export interface CityAttraction {
  id: string;
  cityId: string;
  cityName: string;
  name: string;
  localName?: string;
  category: 'MONUMENT' | 'RELIGIOUS' | 'NATURE' | 'MUSEUM' | 'BAZAAR' | 'ARCHITECTURE' | 'RECREATION' | 'VIEWPOINT';
  categoryLabel: string;
  era: string;
  builtYear: string;
  heritageStatus: 'UNESCO World Heritage' | 'National Monument' | 'Provincial Heritage' | 'Civic Landmark' | 'Eco Sanctuary';
  rating: number;
  reviewsCount: number;
  upvotes: number; // Base neighbor upvotes count
  shortSummary: string; // Concise small brief
  historicalBrief: string; // Concise historical brief
  generalSignificance: string; // Cultural & community role
  architecturalHighlights: string[];
  visitingTips: string[];
  bestTimeToVisit: string;
  openingHours: string;
  entryFee: string;
  addressText: string;
  coordinates: { lat: number; lng: number };
  accessibilityScore: 'High (Wheelchair & Senior Accessible)' | 'Moderate (Assisted Access)' | 'Heritage Steps (Partial Access)';
  audioNarrationText: string;
  neighborTips: { author: string; role: string; tip: string; date: string }[];
}

export interface CityAttractionGroup {
  cityId: string;
  cityName: string;
  demonym: string;
  country: string;
  description: string;
  totalLandmarks: number;
  attractions: CityAttraction[];
}
