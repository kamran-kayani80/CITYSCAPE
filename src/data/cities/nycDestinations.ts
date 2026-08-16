import { CityAttraction } from '../attractionTypes';

export const NYC_DESTINATIONS: CityAttraction[] = [
  {
    id: 'nyc-central-park',
    cityId: 'new-york',
    cityName: 'New York City',
    name: 'Central Park (843-Acre Urban Sanctuary)',
    category: 'NATURE',
    categoryLabel: '843-Acre Masterpiece Urban Park & Lakes',
    era: '19th Century (Olmsted & Vaux)',
    builtYear: '1858 CE',
    heritageStatus: 'National Monument',
    rating: 4.9,
    reviewsCount: 9800,
    upvotes: 1890,
    shortSummary: 'An 843-acre urban oasis in the center of Manhattan featuring Bethesda Terrace, Bow Bridge, the Ramble woodland trails, Sheep Meadow, and Jacqueline Kennedy Onassis Reservoir.',
    historicalBrief: 'Designed by Frederick Law Olmsted and Calvert Vaux in 1858 as America’s first major landscaped public park, providing green recreation for all social classes.',
    generalSignificance: 'The defining public backyard of New York City, celebrated worldwide for democratic green space, free public concerts, and serene biodiversity.',
    architecturalHighlights: [
      'Bethesda Terrace and Angel of the Waters bronze fountain (1873)',
      'Cast-iron Bow Bridge spanning the Central Park lake',
      'Belvedere Castle perched atop Vista Rock'
    ],
    visitingTips: [
      'Rent a Rowboat at Loeb Boathouse for picturesque water views of Bow Bridge',
      'Paved loops have dedicated pedestrian lanes with gentle grades for senior walking'
    ],
    bestTimeToVisit: 'Morning & Autumn Foliage / Spring Cherry Blossoms',
    openingHours: '06:00 AM – 01:00 AM (Daily)',
    entryFee: 'Free Public Access',
    addressText: '59th St to 110th St, Manhattan, New York, NY',
    coordinates: { lat: 40.785091, lng: -73.968285 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'Central Park is New York City’s 843-acre green jewel, offering peaceful lakes, historic bridges, and tree-lined promenades nestled amidst Manhattan skyscrapers.',
    neighborTips: [
      { author: 'Eleanor Vance', role: 'Upper West Side Resident', tip: 'The Conservatory Garden at 105th Street is a designated quiet zone with beautiful classical fountains.', date: '2 days ago' }
    ]
  },
  {
    id: 'nyc-statue-of-liberty',
    cityId: 'new-york',
    cityName: 'New York City',
    name: 'Statue of Liberty & Ellis Island Immigration Museum',
    category: 'MONUMENT',
    categoryLabel: 'Colossal Neoclassical Copper Monument & Museum',
    era: '19th Century (Bartholdi & Eiffel)',
    builtYear: '1886 CE',
    heritageStatus: 'UNESCO World Heritage',
    rating: 4.8,
    reviewsCount: 8400,
    upvotes: 1750,
    shortSummary: 'A colossal 93-meter neoclassical copper sculpture on Liberty Island symbolizing freedom and democracy, paired with the historic immigration halls on Ellis Island.',
    historicalBrief: 'A gift from the people of France to the United States in 1886. Ellis Island welcomed over 12 million immigrants between 1892 and 1954.',
    generalSignificance: 'The preeminent global beacon of liberty, immigrant hope, and democratic ideals.',
    architecturalHighlights: [
      'Hand-hammered copper skin repoussé structure engineered by Gustave Eiffel',
      'Pedestal designed by Richard Morris Hunt on historic Fort Wood foundations',
      'Ellis Island Great Hall with vaulted Guastavino tile ceilings'
    ],
    visitingTips: [
      'Book Crown and Pedestal reserve tickets at least 2 months in advance',
      'Ferry departs from Battery Park, Manhattan with accessible gangways'
    ],
    bestTimeToVisit: 'Early Morning (09:00 AM departure avoids peak crowds)',
    openingHours: '09:00 AM – 05:00 PM (Daily)',
    entryFee: 'Ferry & Island Access $24.50 (Seniors $18)',
    addressText: 'Liberty Island, New York Harbor, NY',
    coordinates: { lat: 40.689247, lng: -74.044502 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'The Statue of Liberty and Ellis Island stand together in New York Harbor, symbolizing liberty, democratic resilience, and the immigrant journey.',
    neighborTips: [
      { author: 'Marcus Sterling', role: 'Battery Park Neighbor', tip: 'If you are pressed for time, the free Staten Island Ferry offers incredible harbor views of Lady Liberty.', date: '1 day ago' }
    ]
  },
  {
    id: 'nyc-met-museum',
    cityId: 'new-york',
    cityName: 'New York City',
    name: 'The Metropolitan Museum of Art (The Met)',
    category: 'MUSEUM',
    categoryLabel: '5,000 Years of World Art & Temple of Dendur',
    era: 'Beaux-Arts & Modern Expansions',
    builtYear: '1870 CE (Building 1902)',
    heritageStatus: 'National Monument',
    rating: 4.9,
    reviewsCount: 9200,
    upvotes: 1810,
    shortSummary: 'One of the world’s greatest encyclopedic art museums, housing over 2 million works spanning 5,000 years of global human creativity, from ancient Egyptian temples to European masters.',
    historicalBrief: 'Founded in 1870 on Fifth Avenue’s Museum Mile. Features the monumental Temple of Dendur, an authentic Roman-Egyptian sandstone temple from 10 BCE.',
    generalSignificance: 'The pinnacle of global artistic heritage and cultural preservation in North America.',
    architecturalHighlights: [
      'Beaux-Arts Great Hall and Fifth Avenue limestone facade by Richard Morris Hunt',
      'The Sackler Wing enclosing the 2,000-year-old sandstone Temple of Dendur in reflecting pool',
      'The American Wing glass court and European Paintings skylit galleries'
    ],
    visitingTips: [
      'Take the elevator to the Cantor Rooftop Garden in summer for art installations and Central Park skyline views',
      'Free wheelchairs and mobility escorts available at the coat check'
    ],
    bestTimeToVisit: 'Friday & Saturday Evenings (Open until 9 PM)',
    openingHours: '10:00 AM – 05:00 PM (Fri/Sat until 09:00 PM, Closed Wed)',
    entryFee: '$30 General • $22 Seniors • NY State Residents Pay-What-You-Wish',
    addressText: '1000 Fifth Avenue at 82nd Street, Manhattan, NY',
    coordinates: { lat: 40.779437, lng: -73.963244 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'The Metropolitan Museum of Art on Fifth Avenue preserves five millennia of human artistic genius, from the Temple of Dendur to Dutch Renaissance masters.',
    neighborTips: [
      { author: 'Clara Chen', role: 'Upper East Side Resident', tip: 'Enter via the ground-level accessible entrance at 81st Street to skip the grand outdoor stairway lines.', date: '3 days ago' }
    ]
  },
  {
    id: 'nyc-high-line',
    cityId: 'new-york',
    cityName: 'New York City',
    name: 'The High Line Elevated Linear Park',
    category: 'RECREATION',
    categoryLabel: '1.45-Mile Elevated Historic Rail Greenway',
    era: 'Industrial Rail Reimagined (2009)',
    builtYear: '1934 Rail (Park opened 2009)',
    heritageStatus: 'Civic Landmark',
    rating: 4.8,
    reviewsCount: 7100,
    upvotes: 1640,
    shortSummary: 'A 1.45-mile public linear park created on a historic elevated freight rail line high above Manhattan’s West Side, featuring perennial gardens, public art, and Hudson River views.',
    historicalBrief: 'Originally built in 1934 to carry freight trains 30 feet above street traffic. Saved from demolition by neighborhood civic activists Robert Hammond and Joshua David.',
    generalSignificance: 'A global model for adaptive reuse, combining urban horticulture, contemporary sculpture, and pedestrian tranquility.',
    architecturalHighlights: [
      'Interlocking concrete pavers seamlessly blending into natural prairie plantings and vintage steel rails',
      '10th Avenue Overlook with sunken amphitheater seating framing downtown traffic',
      'Direct connection to Chelsea Market and the Hudson Yards Vessel'
    ],
    visitingTips: [
      'Elevators are located at Gansevoort St, 14th St, 23rd St, and 30th St for zero-step access',
      'Stroll from north to south (Hudson Yards to Meatpacking District) during golden hour'
    ],
    bestTimeToVisit: 'Morning Hours or Sunset',
    openingHours: '07:00 AM – 10:00 PM (Daily)',
    entryFee: 'Free Public Access',
    addressText: 'Gansevoort St to 34th St, West Side Manhattan, NY',
    coordinates: { lat: 40.7480, lng: -74.0048 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'The High Line transformed an abandoned elevated railway into a lush botanical promenade, floating 30 feet above the vibrant streets of Chelsea and Meatpacking.',
    neighborTips: [
      { author: 'Samir Patel', role: 'Chelsea Neighbor', tip: 'The sundeck wooden loungers near 15th Street are the best spot to catch afternoon river breezes.', date: '4 days ago' }
    ]
  }
];
