/**
 * accessories.js — mock product catalogue
 * ─────────────────────────────────────────────────────────────────────
 * Shape matches the MongoDB Product document from catalog/models.py.
 * When the backend is ready, replace the default export with:
 *
 *   export const fetchProducts = () =>
 *     fetch(`${import.meta.env.VITE_API_URL}/api/catalog/products`)
 *       .then(r => r.json())
 *
 * Images here use Unsplash placeholders — replace with R2 CDN URLs
 * once the admin upload flow is built.
 * ─────────────────────────────────────────────────────────────────────
 */

export const CATEGORIES = [
  { id: 'all',       label: 'All' },
  { id: 'laptop',    label: 'Laptops' },
  { id: 'mouse',     label: 'Mice' },
  { id: 'keyboard',  label: 'Keyboards' },
  { id: 'charger',   label: 'Chargers' },
  { id: 'hub',       label: 'USB Hubs' },
  { id: 'bag',       label: 'Laptop Bags' },
]

export const TIERS = [
  { id: 'all',       label: 'All' },
  { id: 'premium',   label: 'Premium' },
  { id: 'mid-range', label: 'Mid-range' },
  { id: 'budget',    label: 'Budget' },
]

// Tag styles — maps tag name → Tailwind classes
export const TAG_STYLES = {
  'Quick Sale':   'bg-red-100 text-red-700 border-red-200',
  'Great Value':  'bg-green-100 text-green-700 border-green-200',
  'Affordable':   'bg-yellow text-ink border-yellow-deep',
  'Popular':      'bg-violet-pale text-violet border-violet/20',
  'New Arrival':  'bg-blue-100 text-blue-700 border-blue-200',
  'Low Stock':    'bg-orange-100 text-orange-700 border-orange-200',
  'Best Pick':    'bg-pink/10 text-pink border-pink/20',
}

const products = [
  // ── LAPTOPS ─────────────────────────────────────────────────────────
  {
    id: '1',
    slug: 'dell-inspiron-15-3520',
    name: 'Dell Inspiron 15 3520',
    category: 'laptop',
    tier: 'mid-range',
    price_ugx: 1_850_000,
    original_price_ugx: 2_200_000,
    stock: 4,
    tags: ['Great Value', 'Low Stock'],
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80',
    ],
    short_description: 'Reliable everyday laptop for students and professionals. Handles coding, design, and Office with ease.',
    description: `The Dell Inspiron 15 3520 is built for the demands of campus life. Whether you're in a 3-hour lecture, pulling an all-nighter before exams, or running your small business — this machine keeps up.\n\nThe 12th Gen Intel Core i5 delivers snappy performance for coding, Figma, light video editing, and multitasking. 16GB RAM means no slowdowns when you have 20 tabs open alongside VS Code. The 512GB SSD boots Windows in under 10 seconds.\n\nThis is one of our most-traded-in laptops — students buy it in Year 1 and trade up to a Dell XPS or MacBook in Year 3. Comes with a 3-month novaXchange warranty.`,
    specs: {
      cpu: 'Intel Core i5-1235U (12th Gen)',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      display: '15.6" FHD Anti-glare',
      battery: 'Up to 7 hrs',
      os: 'Windows 11 Home',
    },
  },
  {
    id: '2',
    slug: 'lenovo-thinkpad-e14',
    name: 'Lenovo ThinkPad E14',
    category: 'laptop',
    tier: 'premium',
    price_ugx: 2_450_000,
    original_price_ugx: null,
    stock: 3,
    tags: ['Best Pick', 'Popular'],
    images: [
      'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=600&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&q=80',
    ],
    short_description: 'Business-grade ThinkPad durability with enterprise features. Built to last through 4 years of campus punishment.',
    description: `The ThinkPad E14 is the laptop that never lets you down. Lenovo's military-grade build quality means it survives drops, dust, and the inside of an overstuffed campus bag.\n\nPopular with software engineering and data science students who need reliability above all else. The keyboard is legendary — after typing on a ThinkPad, every other keyboard feels wrong.\n\nComes with a clean Windows 11 install (no bloatware) and our standard novaXchange 3-month warranty.`,
    specs: {
      cpu: 'AMD Ryzen 5 5625U',
      ram: '16GB DDR4',
      storage: '256GB SSD',
      display: '14" FHD IPS',
      battery: 'Up to 8 hrs',
      os: 'Windows 11 Pro',
    },
  },
  {
    id: '3',
    slug: 'hp-250-g9',
    name: 'HP 250 G9',
    category: 'laptop',
    tier: 'budget',
    price_ugx: 1_150_000,
    original_price_ugx: 1_400_000,
    stock: 8,
    tags: ['Affordable', 'Quick Sale'],
    images: [
      'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=600&q=80',
      'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=600&q=80',
    ],
    short_description: 'The most affordable route into a reliable laptop. Perfect entry-level pick for first-year students.',
    description: `Not every student needs a powerhouse. If your primary workload is Microsoft Office, browsing, and light coding — the HP 250 G9 does the job at a price that won't drain your entire semester budget.\n\nWe refurbish each unit ourselves: fresh Windows install, cleaned internals, new thermal paste. Battery holds at least 4 hours under normal use.\n\nPair this with a novaBoost service to squeeze another 2 years of life out of the machine.`,
    specs: {
      cpu: 'Intel Core i3-1215U',
      ram: '8GB DDR4',
      storage: '256GB SSD',
      display: '15.6" HD',
      battery: '4–5 hrs',
      os: 'Windows 11 Home',
    },
  },

  // ── ACCESSORIES ─────────────────────────────────────────────────────
  {
    id: '4',
    slug: 'logitech-mx-master-3',
    name: 'Logitech MX Master 3',
    category: 'mouse',
    tier: 'premium',
    price_ugx: 185_000,
    original_price_ugx: null,
    stock: 9,
    tags: ['Popular', 'Best Pick'],
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
      'https://images.unsplash.com/photo-1615750173703-dce6f3d79dc0?w=600&q=80',
    ],
    short_description: 'The best mouse for productivity. Magnetic scroll wheel, ergonomic grip, connects to 3 devices.',
    description: `The MX Master 3 is the gold standard for anyone who spends more than 4 hours a day at a computer. The MagSpeed electromagnetic scroll wheel is genuinely transformative — scroll through a 1000-line file in under a second.\n\nConnects to up to 3 devices simultaneously and switches between them with one button. Charges via USB-C. Battery lasts 70 days on a full charge.\n\nThis is genuine Logitech stock — not a grey-market import. Every unit comes with the original box and 1-year manufacturer warranty.`,
    specs: {
      connectivity: 'Bluetooth + USB-C receiver',
      dpi: '200–8,000',
      battery: '70 days per charge',
      compatibility: 'Windows · macOS · Linux',
    },
  },
  {
    id: '5',
    slug: 'logitech-m185',
    name: 'Logitech M185',
    category: 'mouse',
    tier: 'budget',
    price_ugx: 38_000,
    original_price_ugx: null,
    stock: 22,
    tags: ['Affordable', 'Great Value'],
    images: [
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&q=80',
    ],
    short_description: 'Plug-and-play wireless mouse. The campus default — reliable, cheap, works forever.',
    description: `The Logitech M185 is the mouse that just works. Plug in the tiny USB receiver, and it connects instantly — no drivers, no setup, no Bluetooth pairing.\n\nRuns on a single AA battery for up to 12 months. If you need a mouse that you can throw in your bag and never think about, this is it.`,
    specs: {
      connectivity: '2.4GHz wireless (nano USB)',
      dpi: '1000',
      battery: '12 months (1× AA)',
      compatibility: 'Windows · macOS · Linux · Chrome OS',
    },
  },
  {
    id: '6',
    slug: 'redragon-k552',
    name: 'Redragon K552 Mechanical',
    category: 'keyboard',
    tier: 'mid-range',
    price_ugx: 95_000,
    original_price_ugx: 120_000,
    stock: 14,
    tags: ['Great Value', 'Popular'],
    images: [
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    ],
    short_description: 'Mechanical keyboard that punches well above its price. Red switches, RGB backlight, compact TKL layout.',
    description: `Mechanical keyboards make you a better typist — the tactile and auditory feedback trains faster, more accurate keystrokes. The K552 is the gateway drug.\n\nRed switches are smooth and linear — great for both typing and gaming. The TKL (tenkeyless) layout removes the numpad so your mouse hand sits closer to the keyboard, reducing shoulder strain during long sessions.\n\nBuilt like a tank. We've had these survive campus bags, spilled water, and three years of daily use.`,
    specs: {
      switches: 'Outemu Red (linear)',
      layout: 'TKL (87 keys)',
      backlight: 'RGB per-key',
      connection: 'USB-A braided cable',
    },
  },
  {
    id: '7',
    slug: 'ugreen-65w-charger',
    name: 'UGREEN 65W GaN Charger',
    category: 'charger',
    tier: 'mid-range',
    price_ugx: 72_000,
    original_price_ugx: 90_000,
    stock: 18,
    tags: ['New Arrival', 'Great Value'],
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
    ],
    short_description: '65W GaN — charges laptops, phones, tablets. Half the size of a brick charger.',
    description: `GaN (Gallium Nitride) technology means this 65W charger is roughly half the size and weight of a traditional 65W adapter. Throw it in your bag and you won't feel it.\n\nCharges most laptops at full speed via USB-C PD. Also charges your phone and tablet simultaneously through the extra USB-A port. Auto-detects what's plugged in and allocates power intelligently.`,
    specs: {
      power: '65W total (45W USB-C + 20W USB-A)',
      ports: '1× USB-C + 1× USB-A',
      compatibility: 'MacBook · Dell · Lenovo · phones',
      size: '45 × 45 × 28mm',
    },
  },
  {
    id: '8',
    slug: 'ugreen-7-in-1-hub',
    name: 'UGREEN 7-in-1 USB-C Hub',
    category: 'hub',
    tier: 'mid-range',
    price_ugx: 88_000,
    original_price_ugx: null,
    stock: 11,
    tags: ['Popular', 'New Arrival'],
    images: [
      'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600&q=80',
    ],
    short_description: 'One USB-C port → HDMI, 3× USB-A, SD card, PD charging. The workspace essential.',
    description: `Modern laptops have 1–2 USB-C ports and nothing else. This hub gives you everything back: HDMI for an external monitor, three USB-A ports for your mouse/keyboard/USB drive, SD and TF card slots, and a 100W PD passthrough so the hub charges your laptop while you work.\n\nSupports 4K@30Hz HDMI output. Works with Windows, macOS, Linux, and iPad Pro.`,
    specs: {
      ports: '3× USB-A 3.0 + 1× HDMI + 1× USB-C PD',
      hdmi: '4K @ 30Hz',
      pd_passthrough: '100W',
      connection: 'USB-C (15cm cable)',
    },
  },
  {
    id: '9',
    slug: 'kingsons-laptop-bag-15',
    name: 'Kingsons 15.6" Laptop Bag',
    category: 'bag',
    tier: 'budget',
    price_ugx: 55_000,
    original_price_ugx: 68_000,
    stock: 20,
    tags: ['Affordable', 'Quick Sale'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600&q=80',
    ],
    short_description: 'Water-resistant, padded laptop compartment, USB charging port on the outside. Campus-ready.',
    description: `A laptop bag that doesn't embarrass you in a professional setting but costs less than a textbook. The Kingsons 15.6" has a dedicated padded laptop sleeve, a tablet pocket, and enough organiser pockets to keep your chargers, cables, and notebooks separated.\n\nThe external USB port connects to an internal cable — plug in your power bank and charge your phone while the bag is on your back.`,
    specs: {
      capacity: '20L',
      fits: 'Up to 15.6" laptops',
      material: 'Water-resistant polyester',
      features: 'External USB port, hidden anti-theft pocket',
    },
  },
]

export default products