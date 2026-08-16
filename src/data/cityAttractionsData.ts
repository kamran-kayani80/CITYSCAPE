import { CityAttraction, CityAttractionGroup } from './attractionTypes';
import { RAWALPINDI_DESTINATIONS } from './cities/rawalpindiDestinations';
import { ISLAMABAD_DESTINATIONS } from './cities/islamabadDestinations';
import { LAHORE_DESTINATIONS } from './cities/lahoreDestinations';
import { KARACHI_DESTINATIONS } from './cities/karachiDestinations';
import { PESHAWAR_DESTINATIONS } from './cities/peshawarDestinations';
import { MULTAN_DESTINATIONS } from './cities/multanDestinations';
import { NYC_DESTINATIONS } from './cities/nycDestinations';
import { LONDON_DESTINATIONS } from './cities/londonDestinations';
import { PARIS_DESTINATIONS } from './cities/parisDestinations';
import { TOKYO_DESTINATIONS } from './cities/tokyoDestinations';

export * from './attractionTypes';

export const CITY_ATTRACTIONS_DATA: Record<string, CityAttractionGroup> = {
  rawalpindi: {
    cityId: 'rawalpindi',
    cityName: 'Rawalpindi',
    demonym: 'Rawalpindian',
    country: 'Pakistan',
    description: 'The historic gateway to the Potohar Plateau and northern mountains, rich with ancient trade bazaars, colonial garrison architecture, 2,500-year Gandharan ruins, and vast municipal parks.',
    totalLandmarks: RAWALPINDI_DESTINATIONS.length,
    attractions: RAWALPINDI_DESTINATIONS
  },
  islamabad: {
    cityId: 'islamabad',
    cityName: 'Islamabad',
    demonym: 'Islamabadian',
    country: 'Pakistan',
    description: 'The verdant national capital framed by the Margalla Hills, renowned for iconic modern Islamic geometry, 2,400-year-old Buddhist caves, ethnic folklore museums, and panoramic scenic viewpoints.',
    totalLandmarks: ISLAMABAD_DESTINATIONS.length,
    attractions: ISLAMABAD_DESTINATIONS
  },
  lahore: {
    cityId: 'lahore',
    cityName: 'Lahore',
    demonym: 'Lahori',
    country: 'Pakistan',
    description: 'The cultural capital and crowning jewel of Mughal South Asia, celebrated for UNESCO World Heritage palaces, red sandstone imperial mosques, glazed tile art, and ancient bazaars.',
    totalLandmarks: LAHORE_DESTINATIONS.length,
    attractions: LAHORE_DESTINATIONS
  },
  karachi: {
    cityId: 'karachi',
    cityName: 'Karachi',
    demonym: 'Karachite',
    country: 'Pakistan',
    description: 'The vibrant mega-city on the Arabian Sea, uniting national marble monuments, Venetian Gothic stone halls, Anglo-Mughal palaces, and cooling ocean sunset promenades.',
    totalLandmarks: KARACHI_DESTINATIONS.length,
    attractions: KARACHI_DESTINATIONS
  },
  peshawar: {
    cityId: 'peshawar',
    cityName: 'Peshawar',
    demonym: 'Peshawari',
    country: 'Pakistan',
    description: 'One of the oldest continuously inhabited cities in Asia, legendary for Silk Road storyteller bazaars, 1,000-year-old citadels, white marble Mughal mosques, and the world’s largest Gandhara art museum.',
    totalLandmarks: PESHAWAR_DESTINATIONS.length,
    attractions: PESHAWAR_DESTINATIONS
  },
  multan: {
    cityId: 'multan',
    cityName: 'Multan',
    demonym: 'Multani',
    country: 'Pakistan',
    description: 'The 5,000-year-old City of Saints, celebrated for monumental 14th-century Sufi brick mausoleums, cobalt blue Kashigari ceramic pottery, and Victorian municipal palaces.',
    totalLandmarks: MULTAN_DESTINATIONS.length,
    attractions: MULTAN_DESTINATIONS
  },
  'new-york': {
    cityId: 'new-york',
    cityName: 'New York City',
    demonym: 'New Yorker',
    country: 'United States',
    description: 'A global cultural metropolis featuring world-renowned urban parks, iconic harbor monuments, 5,000 years of global art, and repurposed elevated greenways.',
    totalLandmarks: NYC_DESTINATIONS.length,
    attractions: NYC_DESTINATIONS
  },
  london: {
    cityId: 'london',
    cityName: 'London',
    demonym: 'Londoner',
    country: 'United Kingdom',
    description: 'A historic global capital spanning two millennia, celebrated for iconic river crossings, encyclopedic public museums, and UNESCO Gothic royal coronation cathedrals.',
    totalLandmarks: LONDON_DESTINATIONS.length,
    attractions: LONDON_DESTINATIONS
  },
  paris: {
    cityId: 'paris',
    cityName: 'Paris',
    demonym: 'Parisian',
    country: 'France',
    description: 'The City of Light along the Seine, celebrated for monumental 19th-century wrought-iron towers, royal palace art galleries, and Gothic architectural treasures.',
    totalLandmarks: PARIS_DESTINATIONS.length,
    attractions: PARIS_DESTINATIONS
  },
  tokyo: {
    cityId: 'tokyo',
    cityName: 'Tokyo',
    demonym: 'Tokyoite',
    country: 'Japan',
    description: 'A harmonious blend of ancient spiritual heritage and cutting-edge engineering, featuring 1,400-year-old Buddhist temples, sacred forests, and soaring observation towers.',
    totalLandmarks: TOKYO_DESTINATIONS.length,
    attractions: TOKYO_DESTINATIONS
  }
};

export function getAttractionsForCity(cityId: string): CityAttractionGroup | null {
  const normalized = cityId.toLowerCase().trim();
  
  if (CITY_ATTRACTIONS_DATA[normalized]) {
    return CITY_ATTRACTIONS_DATA[normalized];
  }
  
  // Fuzzy match fallback
  for (const key of Object.keys(CITY_ATTRACTIONS_DATA)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return CITY_ATTRACTIONS_DATA[key];
    }
  }
  
  return null;
}
