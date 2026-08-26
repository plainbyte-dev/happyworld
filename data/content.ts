export type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  place: string;
};

export type Experience = {
  title: string;
  kind: string;
  detail: string;
  image: string;
  meta: string;
};

export type DestinationPackage = {
  name: string;
  description: string;
};

export type TripsCategory = {
  key: string;
  label: string;
  description: string;
  href: string;
  destinations: { label: string; href: string; packages: DestinationPackage[] }[];
};

export const content = {
  brand: {
    name: 'Happy World',
    mark: 'HW',
    location: 'Kathmandu · Nepal',
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Trips ', href: '#way' },
    { label: 'About Us ', href: '#' },
    { label: 'Contact Us', href: '#journal' },
  ],
  tripsMenu: [
    {
      key: 'nepal-tours',
      label: 'Nepal Tours',
      description: 'Heritage, culture and valley life.',
      href: '#way',
      destinations: [
        {
          label: 'Kathmandu',
          href: '#way',
          packages: [
            { name: 'Heritage City Walk', description: 'A day through Durbar Square, Swayambhunath and the old trade lanes.' },
            { name: 'Valley Rim Escape', description: 'Two nights above the city, temples and terraced views at dawn.' },
          ],
        },
        {
          label: 'Pokhara',
          href: '#way',
          packages: [
            { name: 'Phewa Lakeside Retreat', description: 'Slow mornings on the water, Annapurna views without the climb.' },
            { name: 'Sarangkot Sunrise', description: 'A short pre-dawn drive for the best light on the range.' },
          ],
        },
        {
          label: 'Chitwan',
          href: '#way',
          packages: [
            { name: 'Jungle Safari Lodge', description: 'Canoe rides and rhino tracking in the national park.' },
            { name: 'Tharu Village Stay', description: 'A night with a local family, cooking and folk dance included.' },
          ],
        },
        {
          label: 'Lumbini',
          href: '#way',
          packages: [
            { name: 'Birthplace Pilgrimage', description: 'The Maya Devi Temple and the monastic zone in a quiet single day.' },
          ],
        },
        {
          label: 'Janakpur',
          href: '#way',
          packages: [
            { name: 'Mithila Heritage Trail', description: 'Painted courtyards, the Janaki Mandir, and local artisan visits.' },
          ],
        },
        {
          label: 'Ilam',
          href: '#way',
          packages: [
            { name: 'Tea Garden Wander', description: 'Rolling estates, fresh brews, and hill views toward Kanchenjunga.' },
          ],
        },
      ],
    },
    {
      key: 'trekking',
      label: 'Trekking',
      description: 'Trails through the high quiet.',
      href: '#way',
      destinations: [
        {
          label: 'Pokhara',
          href: '#way',
          packages: [
            { name: 'Annapurna Base Camp', description: 'Seven days through rhododendron forest to the amphitheatre of peaks.' },
            { name: 'Poon Hill Short Trek', description: 'A gentler three-day loop with a classic sunrise viewpoint.' },
          ],
        },
        {
          label: 'Kathmandu',
          href: '#way',
          packages: [
            { name: 'Langtang Valley Trek', description: 'A quieter Himalayan trail close to the capital, glaciers and yak pastures.' },
          ],
        },
        {
          label: 'Ilam',
          href: '#way',
          packages: [
            { name: 'Eastern Hills Trail', description: 'A lesser-known ridge walk through tea country and pine forest.' },
          ],
        },
      ],
    },
    {
      key: 'kailash',
      label: 'Kailash',
      description: 'The pilgrim roads to Mount Kailash.',
      href: '#way',
      destinations: [
        {
          label: 'Kathmandu',
          href: '#way',
          packages: [
            { name: 'Kailash Mansarovar Yatra', description: 'The full overland pilgrimage with acclimatisation stops from the capital.' },
          ],
        },
      ],
    },
  ] satisfies TripsCategory[],
  heroSlides: [
    {
      eyebrow: 'PILGRIMAGE · Kasilash',
      title: 'A landscape\nwith a pulse.',
      description: 'Follow ancient paths, warm teahouses and the quiet rituals that have held these valleys together for centuries.',
      image: '/content-images/Kailash.png',
      place: '',
    },
    {
      eyebrow: 'TREKKING',
      title: 'Walk slowly.\nSee more.',
      description: 'Journeys with enough space for the mountains to speak — and for you to hear yourself in them.',
      image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=2200',
      place: 'LARKE PASS · 5,106 M',
    },
    
    {
      eyebrow: 'HERITAGE · KATHMANDU VALLEY',
      title: 'Come for the\nmountains. Stay for\nthe stories.',
      description: 'A deeper Nepal, shaped by living temples, patient craft and the people who call these places home.',
      image: '/content-images/NepalTour.png',
      place: 'PATAN · 1,400 M',
    },
  ] satisfies HeroSlide[],
  introduction: {
    kicker: 'THE LONG WAY HOME',
    title: 'Nepal is not a checklist.\nIt is a relationship.',
    body: 'We are a small, locally rooted travel company for people who want to meet a place on its own terms. Our guides know which ridge catches the last light, which family makes the best dal bhat, and when the trail asks for quiet.',
  },
  experiences: [
    {
      title: 'The high quiet',
      kind: 'TREKKING',
      detail: 'For the days when the trail is the destination.',
      image: '/content-images/image1.png',
      meta: '04 — 21 DAYS',
    },
    {
      title: 'Pilgrim roads',
      kind: 'PILGRIMAGE',
      detail: 'Ancient paths, sacred pauses, a different pace.',
      image: '/content-images/image2.png',
      meta: '05 — 14 DAYS',
    },
    {
      title: 'Living archives',
      kind: 'HERITAGE',
      detail: 'A close look at the Nepal that keeps creating.',
      image: '/content-images/image3.png',
      meta: '03 — 09 DAYS',
    },
  ] satisfies Experience[],
  services: [
    { number: '01', title: 'Thoughtful itineraries', body: 'No plug-and-play routes. Every day is shaped around your curiosity, comfort and the season.' },
    { number: '02', title: 'Local knowledge', body: 'Our guides are from these valleys. Their relationships turn a visit into a welcome.' },
    { number: '03', title: 'Small footprints', body: 'We travel in small groups, stay in local homes and keep more of your spend close to the trail.' },
    { number: '04', title: 'Quiet confidence', body: 'From airport pickup to the last cup of tea, the details are handled without making a show of it.' },
  ],
  journal: {
    title: 'Notes from the trail',
    body: 'Dispatches for the curious: a little practical, a little poetic, always from the ground.',
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1600',
    articles: [
      { category: 'FIELD NOTES', title: 'How to be a good guest in the Himalaya', date: '07 MAR 2024' },
      { category: 'A TASTE OF PLACE', title: 'The particular comfort of a mountain kitchen', date: '18 JAN 2024' },
      { category: 'WAYFINDING', title: 'Five trails for finding your own pace', date: '29 OCT 2023' },
    ],
  },
  footer: {
    statement: 'The trail stays with you.',
    email: 'hello@happyworld.com',
    phone: '+977 1 452 1098',
  },
} as const;