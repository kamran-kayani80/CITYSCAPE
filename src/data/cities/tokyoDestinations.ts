import { CityAttraction } from '../attractionTypes';

export const TOKYO_DESTINATIONS: CityAttraction[] = [
  {
    id: 'tokyo-senso-ji',
    cityId: 'tokyo',
    cityName: 'Tokyo',
    name: 'Sensō-ji Ancient Buddhist Temple & Nakamise-dōri',
    localName: '浅草寺と仲見世通り',
    category: 'RELIGIOUS',
    categoryLabel: 'Tokyo’s Oldest Temple (645 CE) & Historic Market',
    era: 'Asuka Period to Edo Era',
    builtYear: '645 CE',
    heritageStatus: 'National Monument',
    rating: 4.9,
    reviewsCount: 9600,
    upvotes: 1910,
    shortSummary: 'Tokyo’s oldest and most significant ancient Buddhist temple in Asakusa, featuring the iconic giant red Kaminarimon (Thunder Gate) paper lantern, five-story pagoda, and Nakamise shopping street.',
    historicalBrief: 'Founded in 645 CE when two brothers fished a golden statue of Kannon, Goddess of Mercy, from the Sumida River. Rebuilt after WWII with community donations.',
    generalSignificance: 'The historic and spiritual heartbeat of Tokyo’s traditional Shitamachi (Old Town) district.',
    architecturalHighlights: [
      'Kaminarimon Gate featuring a 700 kg red paper lantern and carved wind/thunder gods',
      'Five-story 53-meter high Buddhist Pagoda holding sacred relics',
      'Nakamise-dōri pedestrian stone market with 90 legacy artisan shops'
    ],
    visitingTips: [
      'Clean hands and mouth at the Dragon Water Fountain (Temizuya) before approaching the incense cauldron',
      'Evenings after 8 PM are serene with dramatic floodlighting on the pagoda and shutter murals'
    ],
    bestTimeToVisit: 'Early Morning (06:30 AM – 08:30 AM) or Night Illumination',
    openingHours: 'Main Hall: 06:00 AM – 05:00 PM • Grounds: Open 24/7',
    entryFee: 'Free Public Access',
    addressText: '2-3-1 Asakusa, Taito-ku, Tokyo 111-0032',
    coordinates: { lat: 35.7148, lng: 139.7967 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'Sensō-ji Temple in Asakusa is Tokyo’s oldest spiritual sanctuary, welcoming travelers through the majestic Thunder Gate into 1,400 years of Buddhist devotion.',
    neighborTips: [
      { author: 'Kenji Takahashi', role: 'Asakusa Resident', tip: 'Try fresh warm Ningyo-yaki (sweet bean cakes) baked in maple leaf shapes on Nakamise street.', date: '1 day ago' }
    ]
  },
  {
    id: 'tokyo-meiji-shrine',
    cityId: 'tokyo',
    cityName: 'Tokyo',
    name: 'Meiji Jingu Shinto Shrine & 170-Acre Sacred Forest',
    localName: '明治神宮',
    category: 'RELIGIOUS',
    categoryLabel: '170-Acre Hand-Planted Sacred Shinto Forest',
    era: 'Taisho Era (1920)',
    builtYear: '1920 CE',
    heritageStatus: 'National Monument',
    rating: 4.8,
    reviewsCount: 8900,
    upvotes: 1840,
    shortSummary: 'A serene Shinto shrine dedicated to Emperor Meiji and Empress Shoken, set within a tranquil 170-acre evergreen forest of 120,000 trees donated by people from all over Japan.',
    historicalBrief: 'Dedicated in 1920 in honor of Emperor Meiji, who led Japan’s transformation into a modern nation. The sacred forest was hand-planted with native species designed to become self-sustaining.',
    generalSignificance: 'A tranquil spiritual oasis providing complete peace and natural calm directly adjacent to the bustling youth culture of Harajuku.',
    architecturalHighlights: [
      'Massive 12-meter high Torii gate crafted from 1,500-year-old Japanese cypress wood',
      'The vibrant decorative wall of stacked sake barrels (Kazaridaru) donated by wineries and breweries',
      'Main inner sanctuary built in the classical Nagare-zukuri cypress style'
    ],
    visitingTips: [
      'You may often witness a traditional Japanese Shinto wedding procession in the inner courtyard on weekends',
      'The gravel pathways are wide and flat with smooth stone paving alongside'
    ],
    bestTimeToVisit: 'Morning Hours (Peaceful bird song and forest tranquility)',
    openingHours: 'Sunrise to Sunset (Approx. 05:30 AM – 06:00 PM)',
    entryFee: 'Free Shrine Access (Inner Garden ¥500)',
    addressText: '1-1 Yoyogikamizonocho, Shibuya-ku, Tokyo 151-8557',
    coordinates: { lat: 35.6764, lng: 139.6993 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'Meiji Jingu Shrine is a peaceful Shinto haven enveloped by 170 acres of sacred evergreen forest in the heart of Shibuya, offering harmony between nature and tradition.',
    neighborTips: [
      { author: 'Yoko Sato', role: 'Shibuya Neighbor', tip: 'Write a wish or prayer on a wooden Ema plaque and hang it around the sacred Camphor tree.', date: '2 days ago' }
    ]
  },
  {
    id: 'tokyo-skytree',
    cityId: 'tokyo',
    cityName: 'Tokyo',
    name: 'Tokyo Skytree & Sumida Riverside Promenade',
    localName: '東京スカイツリー',
    category: 'VIEWPOINT',
    categoryLabel: '634-Meter Neo-Futuristic Broadcast Tower',
    era: 'Modern Era (2012)',
    builtYear: '2012 CE',
    heritageStatus: 'Civic Landmark',
    rating: 4.8,
    reviewsCount: 8200,
    upvotes: 1760,
    shortSummary: 'The world’s tallest freestanding broadcast tower rising 634 meters, offering panoramic glass observation decks with views stretching to Mount Fuji on clear days, with Solamachi shopping town below.',
    historicalBrief: 'Opened in May 2012, designed by Nikken Sekkei incorporating traditional five-story pagoda earthquake-damping center-column engineering (shinbashira).',
    generalSignificance: 'The ultimate modern landmark of Tokyo, blending ancient pagoda architectural wisdom with cutting-edge engineering.',
    architecturalHighlights: [
      '634-meter height chosen as wordplay on "Musashi", the ancient historical province name',
      'Tembo Deck (350m) and Tembo Galleria spiraling glass skywalk (450m)',
      'Traditional Japanese indigo-white (Aijiro) steel lattice color coating'
    ],
    visitingTips: [
      'Visit on crisp, clear winter mornings or golden sunset for the highest chance of seeing Mount Fuji',
      'Direct barrier-free elevator access from Tokyo Skytree Station'
    ],
    bestTimeToVisit: 'Sunset to Night (Tokyo city light sea)',
    openingHours: '10:00 AM – 09:00 PM (Daily)',
    entryFee: 'Combo Deck Ticket ¥3,100 (Seniors ¥2,800)',
    addressText: '1-1-2 Oshiage, Sumida-ku, Tokyo 131-0045',
    coordinates: { lat: 35.7100, lng: 139.8107 },
    accessibilityScore: 'High (Wheelchair & Senior Accessible)',
    audioNarrationText: 'Tokyo Skytree reaches 634 meters into the clouds, combining ancient Japanese structural wisdom with futuristic panoramic views across the Tokyo metropolis.',
    neighborTips: [
      { author: 'Hiroshi Tanaka', role: 'Sumida Ward Resident', tip: 'The Sumida River terrace walk between Skytree and Asakusa is a gorgeous flat stroll with benches.', date: '4 days ago' }
    ]
  }
];
