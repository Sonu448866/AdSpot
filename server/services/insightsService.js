// Structured, privacy-conscious geographic audience intelligence zones
export const AUDIENCE_ZONES = [
  // Mumbai
  {
    id: 'mum_andheri_w',
    city: 'Mumbai',
    locality: 'Andheri West',
    categoryAffinity: ['education', 'entertainment', 'retail', 'f&b'],
    targetDemographics: ['college students', 'young professionals', 'media workers'],
    center: [72.8277, 19.1363], // [lng, lat]
    densityScore: 92,
    transitHubScore: 95,
    commercialIntensity: 88,
    primaryLandmarks: ['Bhavans College', 'Andheri Metro Station', 'Infinity Mall', 'Lokhandwala Market'],
    recommendationReason: 'High density of coaching centers, degree colleges, and rapid transit footfall along Link Road.',
  },
  {
    id: 'mum_bandra_w',
    city: 'Mumbai',
    locality: 'Bandra West',
    categoryAffinity: ['fashion', 'luxury', 'f&b', 'real_estate'],
    targetDemographics: ['affluent consumers', 'youth', 'creative industry'],
    center: [72.8333, 19.0596],
    densityScore: 96,
    transitHubScore: 90,
    commercialIntensity: 98,
    primaryLandmarks: ['Linking Road', 'Hill Road', 'Bandra Bandstand', 'National College'],
    recommendationReason: 'Premium lifestyle retail corridor with immense affluent youth footfall and vehicular visibility.',
  },
  {
    id: 'mum_bkc',
    city: 'Mumbai',
    locality: 'Bandra Kurla Complex (BKC)',
    categoryAffinity: ['b2b', 'fintech', 'luxury_cars', 'real_estate'],
    targetDemographics: ['corporate executives', 'finance professionals', 'decision makers'],
    center: [72.8687, 19.0657],
    densityScore: 94,
    transitHubScore: 85,
    commercialIntensity: 99,
    primaryLandmarks: ['Jio World Drive', 'NSE Headquarters', 'US Consulate', 'MMRDA Grounds'],
    recommendationReason: 'Indias leading financial district with high-income working professionals and C-suite commuters.',
  },
  {
    id: 'mum_dadar',
    city: 'Mumbai',
    locality: 'Dadar Central',
    categoryAffinity: ['retail', 'healthcare', 'fmcg', 'education'],
    targetDemographics: ['daily commuters', 'families', 'shoppers'],
    center: [72.8427, 19.0178],
    densityScore: 99,
    transitHubScore: 100,
    commercialIntensity: 90,
    primaryLandmarks: ['Dadar Railway Station', 'Siddhivinayak Temple', 'Shivaji Park'],
    recommendationReason: 'Busiest transit interchange with over 500,000 daily commuters passing through central junctions.',
  },
  {
    id: 'mum_powai',
    city: 'Mumbai',
    locality: 'Powai Hiranandani',
    categoryAffinity: ['tech', 'startups', 'education', 'fine_dining'],
    targetDemographics: ['tech professionals', 'students', 'expats'],
    center: [72.9051, 19.1176],
    densityScore: 86,
    transitHubScore: 80,
    commercialIntensity: 92,
    primaryLandmarks: ['IIT Bombay', 'Hiranandani Gardens', 'Supreme Business Park'],
    recommendationReason: 'Prime tech cluster surrounding IIT Bombay with high purchasing power and tech-savvy consumers.',
  },

  // Delhi NCR
  {
    id: 'del_connaught_place',
    city: 'Delhi',
    locality: 'Connaught Place',
    categoryAffinity: ['retail', 'f&b', 'tourism', 'banking'],
    targetDemographics: ['shoppers', 'office commuters', 'tourists'],
    center: [77.2167, 28.6315],
    densityScore: 98,
    transitHubScore: 99,
    commercialIntensity: 96,
    primaryLandmarks: ['Rajiv Chowk Metro', 'Janpath Market', 'Inner Circle'],
    recommendationReason: 'Capital city landmark with major metro interchange and historic high-street retail presence.',
  },
  {
    id: 'del_gurugram_cyberhub',
    city: 'Delhi',
    locality: 'DLF Cyber City / Cyberhub',
    categoryAffinity: ['tech', 'automotive', 'luxury', 'f&b'],
    targetDemographics: ['tech professionals', 'corporate workers', 'millennials'],
    center: [77.0888, 28.4907],
    densityScore: 95,
    transitHubScore: 89,
    commercialIntensity: 97,
    primaryLandmarks: ['CyberHub', 'Rapid Metro Station', 'DLF Gateway Tower'],
    recommendationReason: 'Hub of Fortune 500 tech companies with dense young corporate audience during peak commuting hours.',
  },
  {
    id: 'del_hauz_khas',
    city: 'Delhi',
    locality: 'Hauz Khas / South Ext',
    categoryAffinity: ['fashion', 'education', 'youth_lifestyle'],
    targetDemographics: ['college students', 'young creatives', 'café goers'],
    center: [77.1994, 28.5494],
    densityScore: 89,
    transitHubScore: 85,
    commercialIntensity: 90,
    primaryLandmarks: ['IIT Delhi', 'Hauz Khas Village', 'Siri Fort'],
    recommendationReason: 'Cultural and student nerve center with proximity to IIT Delhi and NIFT.',
  },

  // Bengaluru
  {
    id: 'blr_koramangala',
    city: 'Bengaluru',
    locality: 'Koramangala',
    categoryAffinity: ['tech', 'startups', 'f&b', 'education'],
    targetDemographics: ['startup founders', 'techies', 'students'],
    center: [77.6245, 12.9352],
    densityScore: 94,
    transitHubScore: 86,
    commercialIntensity: 95,
    primaryLandmarks: ['Forum Mall', 'Jyoti Nivas College', 'Sony World Junction'],
    recommendationReason: 'Startup capital center with heavy student populations and vibrant night economy along 80ft Road.',
  },
  {
    id: 'blr_indiranagar',
    city: 'Bengaluru',
    locality: 'Indiranagar 100ft Road',
    categoryAffinity: ['retail', 'craft_beer', 'lifestyle', 'fitness'],
    targetDemographics: ['high disposable income', 'urban professionals'],
    center: [77.6412, 12.9719],
    densityScore: 92,
    transitHubScore: 88,
    commercialIntensity: 96,
    primaryLandmarks: ['100ft Road', '12th Main', 'Indiranagar Metro Station'],
    recommendationReason: 'High-energy commercial artery known for premium storefronts and dense evening foot traffic.',
  },
  {
    id: 'blr_whitefield',
    city: 'Bengaluru',
    locality: 'Whitefield ITPL',
    categoryAffinity: ['tech', 'automotive', 'real_estate'],
    targetDemographics: ['software engineers', 'family households'],
    center: [77.7499, 12.9850],
    densityScore: 90,
    transitHubScore: 84,
    commercialIntensity: 91,
    primaryLandmarks: ['ITPL Park', 'Phoenix Marketcity', 'Whitefield Metro'],
    recommendationReason: 'Major tech corridor with captive audiences of multinational tech workforce commuters.',
  },
];

export const generateAudienceRecommendations = ({
  businessCategory = '',
  targetAudience = '',
  city = 'Mumbai',
  locality = '',
}) => {
  const normCity = city.trim().toLowerCase();
  const normCategory = businessCategory.trim().toLowerCase();
  const normAudience = targetAudience.trim().toLowerCase();

  // Filter or match by city
  let matchedZones = AUDIENCE_ZONES.filter(
    (z) => z.city.toLowerCase() === normCity || normCity === 'all'
  );

  if (matchedZones.length === 0) {
    matchedZones = AUDIENCE_ZONES; // Fallback to all if city has no specific zones yet
  }

  // Calculate relevance score
  const scoredZones = matchedZones.map((zone) => {
    let score = 50; // base score

    // Check category affinity
    const hasCategoryMatch = zone.categoryAffinity.some(
      (cat) => normCategory.includes(cat) || cat.includes(normCategory)
    );
    if (hasCategoryMatch) score += 25;

    // Check demographic match
    const hasDemographicMatch = zone.targetDemographics.some(
      (demo) => normAudience.includes(demo) || demo.includes(normAudience)
    );
    if (hasDemographicMatch) score += 20;

    // Density factor
    score += (zone.densityScore / 100) * 10;

    // Locality specific bonus
    if (locality && zone.locality.toLowerCase().includes(locality.toLowerCase())) {
      score += 15;
    }

    return {
      ...zone,
      relevanceScore: Math.min(Math.round(score), 99),
    };
  });

  // Sort descending by relevance
  scoredZones.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scoredZones;
};
