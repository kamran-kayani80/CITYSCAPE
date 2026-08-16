import { CityAttraction } from '../attractionTypes';

export const PARIS_DESTINATIONS: CityAttraction[] = [
  {
    id: 'paris-eiffel-tower',
    cityId: 'paris',
    cityName: 'Paris',
    name: 'Eiffel Tower & Champ de Mars Gardens',
    category: 'MONUMENT',
    categoryLabel: '330-Meter Wrought-Iron Masterpiece & Gardens',
    era: 'Industrial Belle Époque (1889)',
    builtYear: '1889 CE',
    heritageStatus: 'National Monument',
    rating: 4.8,
    reviewsCount: 9900,
    upvotes: 1950,
    shortSummary: 'The global emblem of France, a 330-meter wrought-iron lattice tower designed by Gustave Eiffel for the 1889 Exposition Universelle, surrounded by the green lawns of Champ de Mars.',
    historicalBrief: 'Erected in 1889 to celebrate the centenary of the French Revolution. Originally intended to stand for just 20 years, it was preserved as a vital radio transmission tower.',
    generalSignificance: 'The world’s most visited paid monument and a timeless icon of Parisian romance and architectural innovation.',
    architecturalHighlights: [
      'Puddle iron lattice network joined by 2.5 million rivets',
      'Glass-floor first floor observation platform 57 meters above ground',
      'Sparkling evening light show with 20,000 bulbs illuminating for 5 minutes every hour'
    ],
    visitingTips: [
      'Book summit elevator tickets online well in advance to avoid 2-hour queue lines',
      'Wheelchair elevators serve both the 1st and 2nd floors smoothly'
    ],
    bestTimeToVisit: 'Twilight to Sunset (Watch the evening golden hour & first sparkle)',
    openingHours: '09:00 AM – Midnight (Daily)',
    entryFee: 'Elevator to Summit €29.40 (Seniors €14.70) • Stairs €11.80',
    addressText: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
    coordinates: { lat: 48.8584, lng: 2.2945 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'The Eiffel Tower stands gracefully on the Champ de Mars, an iron masterpiece designed by Gustave Eiffel that has illuminated the Paris skyline since 1889.',
    neighborTips: [
      { author: 'Camille Laurent', role: '7th Arrondissement Resident', tip: 'Sit on the lawns of the Champ de Mars near the Peace Monument for the most relaxing view.', date: '1 day ago' }
    ]
  },
  {
    id: 'paris-louvre-museum',
    cityId: 'paris',
    cityName: 'Paris',
    name: 'The Louvre Museum & I.M. Pei Glass Pyramid',
    category: 'MUSEUM',
    categoryLabel: 'Royal Renaissance Palace, Mona Lisa & Winged Victory',
    era: 'Medieval Fortress to Modern Glass Pyramid',
    builtYear: '12th Century Palace (Pyramid 1989)',
    heritageStatus: 'UNESCO World Heritage',
    rating: 4.9,
    reviewsCount: 9800,
    upvotes: 1920,
    shortSummary: 'The world’s largest art museum, housed in a historic royal palace on the Right Bank of the Seine, home to the Mona Lisa, Venus de Milo, and Winged Victory of Samothrace.',
    historicalBrief: 'Constructed as a fortress in the late 12th century under Philip II. Converted to a national public museum in 1793 during the French Revolution.',
    generalSignificance: 'The ultimate treasury of Western and Oriental human art from antiquity to the mid-19th century.',
    architecturalHighlights: [
      'I.M. Pei’s 21-meter high glass and steel pyramid in the Cour Napoléon',
      'The Grande Galerie with skylit classical painting salons',
      'Preserved medieval moat foundations in the subterranean Sully wing'
    ],
    visitingTips: [
      'Enter via the Carrousel du Louvre shopping mall entrance for significantly shorter security queues',
      'Free loan wheelchairs available in the central reception area'
    ],
    bestTimeToVisit: 'Wednesday & Friday Evenings (Open until 09:45 PM)',
    openingHours: '09:00 AM – 06:00 PM (Wed/Fri until 09:45 PM, Closed Tuesdays)',
    entryFee: '€22 (Citizens/EU under 26 Free)',
    addressText: 'Rue de Rivoli, 75001 Paris',
    coordinates: { lat: 48.8606, lng: 2.3376 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'The Louvre Museum unites eight centuries of French royal palace architecture with I.M. Pei’s modern glass pyramid, housing over 35,000 timeless works of art.',
    neighborTips: [
      { author: 'Pierre Dubois', role: '1st Arrondissement Resident', tip: 'The Richelieu wing’s French sculpture courtyards under glass canopies are peaceful and less crowded.', date: '3 days ago' }
    ]
  },
  {
    id: 'paris-notre-dame',
    cityId: 'paris',
    cityName: 'Paris',
    name: 'Notre-Dame Cathedral & Île de la Cité',
    category: 'RELIGIOUS',
    categoryLabel: 'Medieval French Gothic Masterpiece on the Seine',
    era: 'Medieval French Gothic (1163–1345)',
    builtYear: '1163 CE (Restored 2024)',
    heritageStatus: 'UNESCO World Heritage',
    rating: 4.8,
    reviewsCount: 8800,
    upvotes: 1840,
    shortSummary: 'A medieval Catholic cathedral on the Île de la Cité, celebrated for its French Gothic flying buttresses, twin western towers, and radiant rose stained-glass windows.',
    historicalBrief: 'Begun in 1163 under Bishop Maurice de Sully. Immortalized in Victor Hugo’s novel. Painstakingly restored to glory following the 2019 fire.',
    generalSignificance: 'The geographic and spiritual heart of Paris (Point Zéro of all French roads).',
    architecturalHighlights: [
      'Three immense 13th-century stained-glass Rose Windows with vibrant cobalt and ruby glass',
      'Pioneering exterior flying buttresses spanning the high choir walls',
      'Gargoyles and chimeras sculpted along the upper Grand Gallery'
    ],
    visitingTips: [
      'Check the Point Zéro bronze marker embedded in the stone plaza directly in front of the main doors',
      'Stroll around the leafy Square Jean-XXIII behind the cathedral along the Seine'
    ],
    bestTimeToVisit: 'Morning Light (Courtyard & West facade)',
    openingHours: '08:00 AM – 06:45 PM (Daily)',
    entryFee: 'Free Cathedral Admission',
    addressText: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris',
    coordinates: { lat: 48.8530, lng: 2.3499 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'Notre-Dame Cathedral on the Île de la Cité stands as a testament to Gothic engineering and spiritual resilience, its rose windows shining over the River Seine.',
    neighborTips: [
      { author: 'Sylvie Moreau', role: 'Île Saint-Louis Neighbor', tip: 'Cross Pont Saint-Louis behind the cathedral for famous Berthillon artisanal ice cream.', date: '4 days ago' }
    ]
  }
];
