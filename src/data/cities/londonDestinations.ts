import { CityAttraction } from '../attractionTypes';

export const LONDON_DESTINATIONS: CityAttraction[] = [
  {
    id: 'london-tower-bridge',
    cityId: 'london',
    cityName: 'London',
    name: 'Tower Bridge & Victorian Engine Rooms',
    category: 'ARCHITECTURE',
    categoryLabel: 'Victorian Gothic Suspension & Bascule River Bridge',
    era: 'British Victorian Industrial Era',
    builtYear: '1894 CE',
    heritageStatus: 'National Monument',
    rating: 4.8,
    reviewsCount: 8900,
    upvotes: 1820,
    shortSummary: 'London’s iconic 1894 Victorian Gothic suspension bridge with twin towers, high-level glass floor walkways, and preserved coal-fired steam hydraulics.',
    historicalBrief: 'Engineered by Sir Horace Jones and Sir John Wolfe Barry in 1894 to ease Thames river crossings while allowing tall masted ships to reach the Pool of London.',
    generalSignificance: 'The world’s most recognizable river bridge and a marvel of Victorian civil engineering.',
    architecturalHighlights: [
      'Twin Neo-Gothic Portland stone towers rising 213 feet above the River Thames',
      'High-level walkway with transparent 11-meter glass floor looking down on river traffic',
      'Preserved Victorian steam engines and accumulator machinery in the south engine room'
    ],
    visitingTips: [
      'Check the bridge lift schedule online in advance to watch the giant bascules open for passing ships',
      'Step-free lift access available in both North and South towers'
    ],
    bestTimeToVisit: 'Early Evening (Bridge illumination over the Thames)',
    openingHours: '09:30 AM – 06:00 PM (Daily)',
    entryFee: 'Walkway: £12.30 (Seniors £8.90) • River Crossing Free',
    addressText: 'Tower Bridge Road, London SE1 2UP',
    coordinates: { lat: 51.5055, lng: -0.0754 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'Tower Bridge has defined London’s skyline since 1894, uniting Gothic majesty with cutting-edge Victorian bascule mechanics over the River Thames.',
    neighborTips: [
      { author: 'Graham Bell', role: 'Bermondsey Neighbor', tip: 'The Queen’s Walk promenade on the South Bank offers the best unobstructed photo angle.', date: '1 day ago' }
    ]
  },
  {
    id: 'london-british-museum',
    cityId: 'london',
    cityName: 'London',
    name: 'The British Museum & Great Court',
    category: 'MUSEUM',
    categoryLabel: 'World History, Rosetta Stone & Parthenon Sculptures',
    era: 'Greek Revival & Modern Glass Canopy',
    builtYear: '1753 CE (Great Court 2000)',
    heritageStatus: 'National Monument',
    rating: 4.9,
    reviewsCount: 9400,
    upvotes: 1910,
    shortSummary: 'A world-famous public museum dedicated to human history, art, and culture, featuring the Rosetta Stone, Egyptian mummies, and Norman Foster’s glass-canopied Great Court.',
    historicalBrief: 'Founded in 1753 as the first national public museum in the world. Queen Elizabeth II opened the Queen Elizabeth II Great Court in 2000, creating Europe’s largest covered square.',
    generalSignificance: 'A cornerstone of global cultural heritage spanning over two million years of human history.',
    architecturalHighlights: [
      'Queen Elizabeth II Great Court covered by 3,312 unique triangular glass panes',
      'Neoclassical Greek Revival colonnade facade designed by Sir Robert Smirke',
      'The Rosetta Stone gallery (Room 4) and Parthenon Sculptures (Room 18)'
    ],
    visitingTips: [
      'Admission is completely free; advance online time slots recommended during weekends',
      'Fully wheelchair accessible via Montague Place and Great Russell Street elevators'
    ],
    bestTimeToVisit: 'Friday Evenings (Open until 08:30 PM)',
    openingHours: '10:00 AM – 05:00 PM (Fridays until 08:30 PM)',
    entryFee: 'Free Public Admission',
    addressText: 'Great Russell Street, Bloomsbury, London WC1B 3DG',
    coordinates: { lat: 51.5194, lng: -0.1270 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'The British Museum chronicles two million years of human storytelling under Foster’s iconic tessellated glass dome in Bloomsbury.',
    neighborTips: [
      { author: 'Helena Croft', role: 'Bloomsbury Resident', tip: 'The Middle East and Islamic world gallery (Room 43) is exceptionally peaceful with rare Iznik tiles.', date: '3 days ago' }
    ]
  },
  {
    id: 'london-westminster-abbey',
    cityId: 'london',
    cityName: 'London',
    name: 'Westminster Abbey (Royal Coronation Church)',
    category: 'RELIGIOUS',
    categoryLabel: 'UNESCO World Heritage Gothic Coronation Cathedral',
    era: 'Medieval Gothic Era (1245)',
    builtYear: '1245 CE',
    heritageStatus: 'UNESCO World Heritage',
    rating: 4.8,
    reviewsCount: 8100,
    upvotes: 1720,
    shortSummary: 'The royal coronation site of British monarchs since 1066, a Gothic architectural marvel housing Poet’s Corner, royal tombs, and the historic Coronation Chair.',
    historicalBrief: 'Rebuilt by King Henry III in 1245 in the French Gothic style. The burial place of 30 kings and queens, alongside Isaac Newton, Charles Darwin, and Stephen Hawking.',
    generalSignificance: 'The ceremonial epicentre of British royal history, literature, and Christian faith.',
    architecturalHighlights: [
      'Magnificent 16th-century fan-vaulted ceiling in the Lady Chapel of Henry VII',
      'The 700-year-old oak Coronation Chair crafted for King Edward I in 1296',
      'Poets’ Corner commemorating Chaucer, Shakespeare, Jane Austen, and Dickens'
    ],
    visitingTips: [
      'Attend the free Evensong service at 5 PM on weekdays to hear the world-class choir',
      'Senior audio guides with large-print maps provided free of charge'
    ],
    bestTimeToVisit: 'Morning Hours (09:30 AM – 11:30 AM)',
    openingHours: '09:30 AM – 03:30 PM (Mon–Sat)',
    entryFee: '£27 (Seniors £24) • Free for Worship',
    addressText: '20 Dean’s Yard, Westminster, London SW1P 3PA',
    coordinates: { lat: 51.4994, lng: -0.1273 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'Westminster Abbey has crowned British monarchs for a millennium, its soaring stone arches and fan-vaulted chapels echoing with centuries of ceremony.',
    neighborTips: [
      { author: 'Canon Richard', role: 'Westminster Neighbor', tip: 'Take time to walk through the 900-year-old College Garden, one of the oldest cultivated gardens in England.', date: '5 days ago' }
    ]
  }
];
