import { content } from '@/data/content';

export type ItineraryDay = {
  day: number;
  title: string;
  detail: string;
  meals: string;
  stay: string;
  transport: string;
};

export type QuickFacts = {
  duration: string;
  maxAltitude: string;
  difficulty: string;
  groupSize: string;
};

export type MonthRating = 'excellent' | 'good' | 'fair' | 'poor';

export type PackageDetail = {
  slug: string;
  name: string;
  description: string;
  categoryLabel: string;
  categoryKey: string;
  destinationLabel: string;
  destinationHref: string;
  heroImage: string;
  highlights: string[];
  priceFrom: number;
  quickFacts: QuickFacts;
  bestTime: { month: string; rating: MonthRating }[];
  itinerary: ItineraryDay[];
  altitudeProfile: number[];
  costIncludes: string[];
  costExcludes: string[];
};

type FlatPackage = {
  name: string;
  description: string;
  categoryLabel: string;
  categoryKey: string;
  destinationLabel: string;
  destinationHref: string;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const HERO_IMAGES: Record<string, string> = {
  'nepal-tours': '/content-images/NepalTour.png',
  trekking: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=2200',
  kailash: '/content-images/Kailash.png',
};

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function flattenPackages(): FlatPackage[] {
  const flat: FlatPackage[] = [];
  content.tripsMenu.forEach((category) => {
    category.destinations.forEach((destination) => {
      destination.packages.forEach((pkg) => {
        flat.push({
          name: pkg.name,
          description: pkg.description,
          categoryLabel: category.label,
          categoryKey: category.key,
          destinationLabel: destination.label,
          destinationHref: destination.href,
        });
      });
    });
  });
  return flat;
}

function daysForPackage(pkg: FlatPackage): number {
  const seed = hashString(pkg.name) % 100;
  if (pkg.categoryKey === 'kailash') return 15 + (seed % 4);
  if (pkg.categoryKey === 'trekking') return 3 + (seed % 8);
  return 1 + (seed % 3);
}

function difficultyForCategory(categoryKey: string): string {
  if (categoryKey === 'kailash') return 'Challenging';
  if (categoryKey === 'trekking') return 'Moderate';
  return 'Easy';
}

function maxAltitudeForCategory(categoryKey: string, days: number): { label: string; peak: number; base: number } {
  if (categoryKey === 'kailash') return { label: '5,630 M', peak: 5630, base: 1300 };
  if (categoryKey === 'trekking') {
    const peak = 3200 + days * 180;
    return { label: `${peak.toLocaleString()} M`, peak, base: 850 };
  }
  return { label: '1,400 M', peak: 1400, base: 700 };
}

function bestTimeForCategory(categoryKey: string): { month: string; rating: MonthRating }[] {
  if (categoryKey === 'kailash') {
    const ratings: MonthRating[] = ['poor', 'poor', 'poor', 'fair', 'good', 'excellent', 'excellent', 'excellent', 'good', 'fair', 'poor', 'poor'];
    return MONTHS.map((month, i) => ({ month, rating: ratings[i] }));
  }
  if (categoryKey === 'trekking') {
    const ratings: MonthRating[] = ['fair', 'good', 'excellent', 'excellent', 'good', 'poor', 'poor', 'poor', 'excellent', 'excellent', 'good', 'fair'];
    return MONTHS.map((month, i) => ({ month, rating: ratings[i] }));
  }
  const ratings: MonthRating[] = ['good', 'good', 'good', 'excellent', 'good', 'fair', 'fair', 'fair', 'good', 'excellent', 'excellent', 'good'];
  return MONTHS.map((month, i) => ({ month, rating: ratings[i] }));
}

function costForCategory(categoryKey: string): { includes: string[]; excludes: string[] } {
  if (categoryKey === 'kailash') {
    return {
      includes: ['Permits and pilgrimage fees', 'Overland transport and support vehicle', 'Guesthouse and camp accommodation', 'All meals during the yatra', 'Experienced guide and support crew'],
      excludes: ['International and domestic flights', 'Nepal and China visa fees', 'Travel insurance', 'Personal gear and down jackets', 'Tips for guides and crew'],
    };
  }
  if (categoryKey === 'trekking') {
    return {
      includes: ['Trekking permits and TIMS card', 'Teahouse or lodge accommodation', 'All meals on the trail', 'Licensed trekking guide and porter', 'Ground transport to and from the trailhead'],
      excludes: ['International flights', 'Nepal visa fee', 'Travel and rescue insurance', 'Personal trekking gear', 'Tips for guide and porter'],
    };
  }
  return {
    includes: ['Private ground transport', 'Entrance fees to listed sites', 'English-speaking local guide', 'Accommodation as noted', 'Welcome tea on arrival'],
    excludes: ['International flights', 'Nepal visa fee', 'Travel insurance', 'Meals not listed', 'Personal expenses and tips'],
  };
}

function itineraryForPackage(pkg: FlatPackage, days: number): ItineraryDay[] {
  const isCity = pkg.categoryKey === 'nepal-tours';
  const isKailash = pkg.categoryKey === 'kailash';
  return Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    if (day === 1) {
      return {
        day,
        title: `Arrival in ${pkg.destinationLabel}`,
        detail: pkg.description,
        meals: 'Dinner',
        stay: `${pkg.destinationLabel} — guesthouse`,
        transport: 'Private vehicle',
      };
    }
    if (day === days && days > 1) {
      return {
        day,
        title: isKailash ? 'Return to Kathmandu' : `Departure from ${pkg.destinationLabel}`,
        detail: 'A final morning to gather yourself before the journey back, with time built in for the road.',
        meals: 'Breakfast',
        stay: '—',
        transport: 'Private vehicle',
      };
    }
    if (isCity) {
      return {
        day,
        title: `${pkg.destinationLabel} in depth`,
        detail: `A full day given over to the sights and rhythms that make ${pkg.destinationLabel} what it is, at a pace that leaves room to linger.`,
        meals: 'Breakfast, Lunch',
        stay: `${pkg.destinationLabel} — guesthouse`,
        transport: 'Private vehicle',
      };
    }
    if (isKailash) {
      return {
        day,
        title: day === Math.ceil(days / 2) ? 'Parikrama — Dolma La Pass' : 'Overland toward the pilgrimage route',
        detail: day === Math.ceil(days / 2)
          ? 'The high point of the yatra: a long day crossing the pass, with the mountain never far from view.'
          : 'A steady drive with acclimatisation stops, monasteries, and the plateau opening up around you.',
        meals: 'Breakfast, Lunch, Dinner',
        stay: 'Guesthouse or camp',
        transport: 'Support vehicle',
      };
    }
    return {
      day,
      title: `Trail day ${day}`,
      detail: 'A day of steady walking through changing terrain, with a teahouse and a hot meal waiting at the end of it.',
      meals: 'Breakfast, Lunch, Dinner',
      stay: 'Teahouse',
      transport: 'On foot',
    };
  });
}

function altitudeProfileForPackage(days: number, base: number, peak: number, categoryKey: string): number[] {
  return Array.from({ length: days }, (_, i) => {
    if (days === 1) return peak;
    const t = i / (days - 1);
    if (categoryKey === 'kailash') {
      const climb = Math.sin(t * Math.PI);
      return Math.round(base + (peak - base) * climb);
    }
    if (categoryKey === 'trekking') {
      const climb = t <= 0.6 ? t / 0.6 : 1 - (t - 0.6) / 0.4;
      return Math.round(base + (peak - base) * Math.max(climb, 0.15));
    }
    return Math.round(base + (peak - base) * 0.3 * Math.sin(t * Math.PI));
  });
}

function generateDetail(pkg: FlatPackage): PackageDetail {
  const days = daysForPackage(pkg);
  const { label, peak, base } = maxAltitudeForCategory(pkg.categoryKey, days);
  const { includes, excludes } = costForCategory(pkg.categoryKey);
  const seed = hashString(pkg.name) % 100;
  return {
    slug: slugify(pkg.name),
    name: pkg.name,
    description: pkg.description,
    categoryLabel: pkg.categoryLabel,
    categoryKey: pkg.categoryKey,
    destinationLabel: pkg.destinationLabel,
    destinationHref: pkg.destinationHref,
    heroImage: HERO_IMAGES[pkg.categoryKey] ?? HERO_IMAGES['nepal-tours'],
    highlights: [
      pkg.description,
      `Guided time in and around ${pkg.destinationLabel}`,
      pkg.categoryKey === 'kailash' ? 'A full pilgrimage circuit with acclimatisation built in' : 'Small-group pace with a local guide throughout',
    ],
    priceFrom: (pkg.categoryKey === 'kailash' ? 185000 : pkg.categoryKey === 'trekking' ? 45000 : 12000) + days * (pkg.categoryKey === 'kailash' ? 6000 : 3500) + seed * 40,
    quickFacts: {
      duration: `${days} Day${days > 1 ? 's' : ''}${days > 1 ? ` / ${days - 1} Night${days - 1 > 1 ? 's' : ''}` : ''}`,
      maxAltitude: label,
      difficulty: difficultyForCategory(pkg.categoryKey),
      groupSize: '2–12 travellers',
    },
    bestTime: bestTimeForCategory(pkg.categoryKey),
    itinerary: itineraryForPackage(pkg, days),
    altitudeProfile: altitudeProfileForPackage(days, base, peak, pkg.categoryKey),
    costIncludes: includes,
    costExcludes: excludes,
  };
}

const overrides: Record<string, Partial<PackageDetail>> = {
  'annapurna-base-camp': {
    heroImage: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=2200',
    priceFrom: 118000,
    highlights: [
      'Walk through rhododendron and bamboo forest into the high Annapurna Sanctuary',
      'Wake inside a ring of 7,000m peaks at Annapurna Base Camp',
      'Soak in the natural hot springs at Jhinu Danda on the way down',
      'Stay in family-run teahouses the whole way',
    ],
    quickFacts: { duration: '7 Days / 6 Nights', maxAltitude: '4,130 M', difficulty: 'Moderate', groupSize: '2–12 travellers' },
    bestTime: bestTimeForCategory('trekking'),
    itinerary: [
      { day: 1, title: 'Pokhara to Nayapul, trek to Tikhedhunga', detail: 'A scenic drive from Pokhara to the trailhead at Nayapul, then a gentle first walk along the Modi Khola to Tikhedhunga.', meals: 'Breakfast, Lunch, Dinner', stay: 'Tikhedhunga — teahouse', transport: 'Private vehicle, on foot' },
      { day: 2, title: 'Tikhedhunga to Ghorepani', detail: 'A demanding climb of stone steps through forest to Ghorepani, with Annapurna South and Dhaulagiri appearing above the ridgeline.', meals: 'Breakfast, Lunch, Dinner', stay: 'Ghorepani — teahouse', transport: 'On foot' },
      { day: 3, title: 'Poon Hill sunrise, on to Tadapani', detail: 'A pre-dawn climb to Poon Hill for sunrise over the Annapurna and Dhaulagiri ranges, then a long ridge walk to Tadapani.', meals: 'Breakfast, Lunch, Dinner', stay: 'Tadapani — teahouse', transport: 'On foot' },
      { day: 4, title: 'Tadapani to Himalaya via Chhomrong', detail: 'Descend into the Modi Khola gorge and climb steadily into the Sanctuary, forest giving way to bamboo and open valley walls.', meals: 'Breakfast, Lunch, Dinner', stay: 'Himalaya — teahouse', transport: 'On foot' },
      { day: 5, title: 'Himalaya to Annapurna Base Camp', detail: 'The final climb past Machapuchare Base Camp into the amphitheatre of peaks, arriving at ABC with the afternoon light on the summits.', meals: 'Breakfast, Lunch, Dinner', stay: 'Annapurna Base Camp — teahouse', transport: 'On foot' },
      { day: 6, title: 'Descend to Jhinu Danda', detail: 'A long descent back through the Sanctuary, ending with an evening soak in the hot springs above the Modi Khola.', meals: 'Breakfast, Lunch, Dinner', stay: 'Jhinu Danda — teahouse', transport: 'On foot' },
      { day: 7, title: 'Jhinu Danda to Pokhara', detail: 'A final walk down to the roadhead at Siwai and a drive back to Pokhara, with the afternoon free by the lake.', meals: 'Breakfast', stay: '—', transport: 'On foot, private vehicle' },
    ],
    altitudeProfile: [1070, 2860, 3210, 2920, 4130, 2170, 850],
  },
  'kailash-mansarovar-yatra': {
    heroImage: '/content-images/Kailash.png',
    priceFrom: 315000,
    highlights: [
      'Complete the Kailash Parikrama, crossing the 5,630m Dolma La Pass',
      'Circle the sacred waters of Lake Mansarovar',
      'Overland route through the Tibetan plateau with built-in acclimatisation days',
      'Small group travelling with an experienced yatra guide throughout',
    ],
    quickFacts: { duration: '16 Days / 15 Nights', maxAltitude: '5,630 M', difficulty: 'Challenging', groupSize: '2–12 travellers' },
    bestTime: bestTimeForCategory('kailash'),
    itinerary: [
      { day: 1, title: 'Arrival in Kathmandu', detail: 'Arrive in Kathmandu, briefing and final permit checks with the group.', meals: 'Dinner', stay: 'Kathmandu — hotel', transport: 'Private vehicle' },
      { day: 2, title: 'Kathmandu to Kerung', detail: 'Cross the Nepal–China border at Rasuwagadhi and drive up to Kerung, gaining altitude for the first time.', meals: 'Breakfast, Lunch, Dinner', stay: 'Kerung — guesthouse', transport: 'Support vehicle' },
      { day: 3, title: 'Acclimatisation in Kerung', detail: 'A rest day in Kerung to adjust before the plateau, with short walks to ease the transition.', meals: 'Breakfast, Lunch, Dinner', stay: 'Kerung — guesthouse', transport: 'On foot' },
      { day: 4, title: 'Kerung to Saga', detail: 'Onto the Tibetan plateau proper, a long overland day with the landscape opening into wide brown hills.', meals: 'Breakfast, Lunch, Dinner', stay: 'Saga — guesthouse', transport: 'Support vehicle' },
      { day: 5, title: 'Saga to Lake Mansarovar', detail: 'Drive to the shores of Lake Mansarovar, the sacred lake at the foot of Kailash, with time for a ritual circuit.', meals: 'Breakfast, Lunch, Dinner', stay: 'Lake Mansarovar — guesthouse', transport: 'Support vehicle' },
      { day: 6, title: 'Rest day at Lake Mansarovar', detail: 'A full day by the lake for rest, ritual bathing, and acclimatisation ahead of the parikrama.', meals: 'Breakfast, Lunch, Dinner', stay: 'Lake Mansarovar — guesthouse', transport: 'On foot' },
      { day: 7, title: 'To Darchen, start of the Kailash Parikrama', detail: 'Drive to Darchen, the traditional starting point of the pilgrimage circuit around Mount Kailash.', meals: 'Breakfast, Lunch, Dinner', stay: 'Darchen — guesthouse', transport: 'Support vehicle' },
      { day: 8, title: 'Parikrama Day 1 — Darchen to Dirapuk', detail: 'The first day of the circuit, walking beneath the north face of Kailash to the camp at Dirapuk.', meals: 'Breakfast, Lunch, Dinner', stay: 'Dirapuk — guesthouse', transport: 'On foot' },
      { day: 9, title: 'Parikrama Day 2 — Dolma La Pass to Zutulpuk', detail: 'The high point of the yatra: a pre-dawn start over the 5,630m Dolma La Pass, then down to Zutulpuk.', meals: 'Breakfast, Lunch, Dinner', stay: 'Zutulpuk — guesthouse', transport: 'On foot' },
      { day: 10, title: 'Parikrama Day 3 — Zutulpuk to Darchen', detail: 'A gentler final descent back to Darchen, completing the circuit.', meals: 'Breakfast, Lunch, Dinner', stay: 'Darchen — guesthouse', transport: 'On foot' },
      { day: 11, title: 'Darchen to Saga', detail: 'Begin the overland return, retracing the route back toward the border.', meals: 'Breakfast, Lunch, Dinner', stay: 'Saga — guesthouse', transport: 'Support vehicle' },
      { day: 12, title: 'Saga to Kerung', detail: 'Continue the return journey across the plateau to Kerung.', meals: 'Breakfast, Lunch, Dinner', stay: 'Kerung — guesthouse', transport: 'Support vehicle' },
      { day: 13, title: 'Kerung to Kathmandu', detail: 'Cross back into Nepal at Rasuwagadhi and descend to Kathmandu, the altitude falling away behind you.', meals: 'Breakfast, Lunch, Dinner', stay: 'Kathmandu — hotel', transport: 'Support vehicle' },
      { day: 14, title: 'Contingency day', detail: 'A buffer day held in reserve for weather or border delays on the plateau.', meals: 'Breakfast, Lunch, Dinner', stay: 'Kathmandu — hotel', transport: '—' },
      { day: 15, title: 'Free day in Kathmandu', detail: 'A last day in the valley to rest, shop, or visit Boudhanath before departure.', meals: 'Breakfast', stay: 'Kathmandu — hotel', transport: 'Private vehicle' },
      { day: 16, title: 'Departure', detail: 'Transfer to the airport for your onward flight.', meals: 'Breakfast', stay: '—', transport: 'Private vehicle' },
    ],
    altitudeProfile: [1400, 2700, 2700, 4640, 4590, 4590, 4670, 4890, 5630, 4760, 4640, 2700, 1400, 1400, 1400, 1400],
  },
};

let cache: PackageDetail[] | null = null;

function allDetails(): PackageDetail[] {
  if (!cache) {
    cache = flattenPackages().map((pkg) => {
      const base = generateDetail(pkg);
      const override = overrides[base.slug];
      return override ? { ...base, ...override } : base;
    });
  }
  return cache;
}

export function getAllPackageSlugs(): string[] {
  return allDetails().map((detail) => detail.slug);
}

export function getPackageBySlug(slug: string): PackageDetail | undefined {
  return allDetails().find((detail) => detail.slug === slug);
}

export function getRelatedPackages(detail: PackageDetail, limit = 3): PackageDetail[] {
  const others = allDetails().filter((candidate) => candidate.slug !== detail.slug);
  const sameDestination = others.filter((candidate) => candidate.destinationLabel === detail.destinationLabel);
  const sameCategory = others.filter((candidate) => candidate.categoryKey === detail.categoryKey && candidate.destinationLabel !== detail.destinationLabel);
  return [...sameDestination, ...sameCategory, ...others].filter((candidate, index, arr) => arr.findIndex((c) => c.slug === candidate.slug) === index).slice(0, limit);
}
