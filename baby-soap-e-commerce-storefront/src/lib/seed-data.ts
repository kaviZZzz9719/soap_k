export type SeedCollection = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
  sortOrder: number;
};

export type SeedReview = {
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  daysAgo: number;
};

export type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceCents: number;
  compareAtCents?: number;
  collectionSlug: string;
  format: "bar" | "wash" | "set";
  scent: string;
  skinConcerns: string[];
  ageRange: string;
  size: string;
  images: string[];
  ingredients: string;
  howToUse: string;
  highlights: string[];
  badge?: string;
  isFeatured?: boolean;
  inventory: number;
  popularity: number;
  daysOld: number;
  reviews: SeedReview[];
};

export const seedCollections: SeedCollection[] = [
  {
    slug: "newborn-essentials",
    name: "Newborn Essentials",
    tagline: "For the very first baths",
    description:
      "Fragrance-free, ultra-mild cleansers made for brand-new skin. Gentle enough from day one, with nothing your little one doesn't need.",
    image: "/images/p-pure-newborn.jpg",
    accent: "#f4ece2",
    sortOrder: 1,
  },
  {
    slug: "calm-and-bedtime",
    name: "Calm & Bedtime",
    tagline: "Wind-down rituals",
    description:
      "Soft botanicals like lavender and chamomile turn bath time into the sweetest start of the bedtime routine.",
    image: "/images/p-lavender.jpg",
    accent: "#ece8f1",
    sortOrder: 2,
  },
  {
    slug: "sensitive-skin",
    name: "Sensitive Skin",
    tagline: "Soothing for delicate skin",
    description:
      "Colloidal oat, calendula and shea for skin that's dry, easily irritated or prone to eczema. Formulated with pediatric dermatologists.",
    image: "/images/p-oat-comfort.jpg",
    accent: "#efe9df",
    sortOrder: 3,
  },
  {
    slug: "gift-sets",
    name: "Gift Sets",
    tagline: "Ready to give, made to love",
    description:
      "Thoughtfully boxed sets for baby showers, new arrivals and first birthdays, each one wrapped by hand in our studio.",
    image: "/images/p-giftbox.jpg",
    accent: "#e9efe8",
    sortOrder: 4,
  },
];

export const seedProducts: SeedProduct[] = [
  {
    slug: "pure-newborn-bar",
    name: "Pure Newborn Bar",
    tagline: "Fragrance-free goat milk & shea",
    description:
      "Our original bar, and the one most parents start with. Fresh goat milk and unrefined shea butter are slow-cured for eight weeks into a creamy, low-lather bar that cleanses without stripping the protective layer of new skin. No fragrance, no essential oils, no dyes. Just the gentlest clean we know how to make.",
    priceCents: 1200,
    collectionSlug: "newborn-essentials",
    format: "bar",
    scent: "Fragrance-free",
    skinConcerns: ["Newborn", "Sensitive", "Dryness"],
    ageRange: "0 months +",
    size: "100 g / 3.5 oz",
    images: ["/images/p-pure-newborn.jpg", "/images/g-soap-cloth.jpg", "/images/life-feet.jpg", "/images/life-towel.jpg"],
    ingredients:
      "Saponified olive oil, fresh goat milk, saponified coconut oil, Butyrospermum parkii (shea) butter, glycerin (naturally occurring), tocopherol (vitamin E).",
    howToUse:
      "Wet the bar and work a soft lather between your hands or on a muslin cloth. Gently wash baby from head to toe, then rinse with warm water. Let the bar dry on a draining dish between uses.",
    highlights: ["pH-balanced for newborn skin", "Fragrance & essential-oil free", "8-week slow cure", "Dermatologist tested"],
    badge: "Bestseller",
    isFeatured: true,
    inventory: 240,
    popularity: 98,
    daysOld: 420,
    reviews: [
      { author: "Priya S.", location: "Austin, TX", rating: 5, title: "The only soap our pediatrician approved", body: "We were nervous about using anything on our daughter's skin in the first weeks. This bar is so mild. No redness, no dryness, and it smells like... nothing, which is exactly what we wanted.", daysAgo: 12 },
      { author: "Hannah W.", location: "Portland, OR", rating: 5, title: "Lasts forever", body: "We've been using one bar for almost two months of nightly baths. It lathers just enough and rinses clean. Already ordered three more.", daysAgo: 34 },
      { author: "Marcus L.", location: "Chicago, IL", rating: 4, title: "Gentle and creamy", body: "Love how soft our son's skin is afterwards. Took one star off only because it gets a bit soft if you leave it in a wet dish, so get a draining one!", daysAgo: 58 },
      { author: "Aiko T.", location: "Seattle, WA", rating: 5, title: "Cleared up his dry patches", body: "Our newborn had little dry flaky spots on his legs. After a week of switching to this bar they were gone. Truly a little miracle in a bar.", daysAgo: 91 },
      { author: "Rachel M.", location: "Brooklyn, NY", rating: 5, title: "Gift-worthy", body: "Bought this for my sister's baby shower after using it with my own two. Simple, beautiful, and it just works.", daysAgo: 140 },
    ],
  },
  {
    slug: "colloidal-oat-comfort-bar",
    name: "Colloidal Oat Comfort Bar",
    tagline: "Soothing relief for eczema-prone skin",
    description:
      "Finely milled colloidal oat forms a soft, protective film that calms itchy, irritated skin while it cleanses. Paired with ceramide-rich sunflower oil and shea, this bar was developed with pediatric dermatologists for babies prone to eczema and persistent dryness.",
    priceCents: 1300,
    collectionSlug: "sensitive-skin",
    format: "bar",
    scent: "Fragrance-free",
    skinConcerns: ["Eczema-prone", "Sensitive", "Dryness"],
    ageRange: "0 months +",
    size: "110 g / 3.9 oz",
    images: ["/images/p-oat-comfort.jpg", "/images/g-soap-dish.jpg", "/images/life-bath.jpg", "/images/g-towel.jpg"],
    ingredients:
      "Saponified olive oil, saponified coconut oil, Avena sativa (colloidal oat) kernel flour, Helianthus annuus (sunflower) seed oil, shea butter, glycerin, tocopherol.",
    howToUse:
      "Lather gently in hands and smooth over damp skin. Avoid scrubbing. Rinse and pat (don't rub) dry, then follow with a fragrance-free moisturizer within three minutes.",
    highlights: ["Colloidal oat skin protectant", "National Eczema Association friendly formula", "No fragrance, dyes or sulfates", "Pediatrician recommended"],
    badge: "Derm Approved",
    isFeatured: true,
    inventory: 180,
    popularity: 94,
    daysOld: 360,
    reviews: [
      { author: "Leah K.", location: "Denver, CO", rating: 5, title: "Game changer for eczema", body: "Our 7-month-old has had eczema since birth and every wash used to make it worse. This bar doesn't. His flare-ups are noticeably fewer since we switched.", daysAgo: 6 },
      { author: "Daniel O.", location: "Atlanta, GA", rating: 5, title: "No more itchy nights", body: "She used to scratch after every bath. Now she just... goes to sleep. Worth every cent.", daysAgo: 29 },
      { author: "Sofia R.", location: "Miami, FL", rating: 4, title: "Very gentle", body: "Lovely, mild and calming. It doesn't lather much, which took getting used to, but that's the point with sensitive skin.", daysAgo: 77 },
      { author: "Megan P.", location: "Boston, MA", rating: 5, title: "Whole family uses it", body: "Bought for the baby, and now my husband and I use it too. My own dry winter hands are thankful.", daysAgo: 120 },
    ],
  },
  {
    slug: "lavender-dreams-bedtime-bar",
    name: "Lavender Dreams Bedtime Bar",
    tagline: "A whisper of lavender for sleepy evenings",
    description:
      "A softly scented bedtime bar made with a gentle 0.2% infusion of French lavender, far below adult soap levels, plus calming oat milk. Make it part of your evening ritual: warm water, soft lather, cozy towel, sleepy baby.",
    priceCents: 1200,
    collectionSlug: "calm-and-bedtime",
    format: "bar",
    scent: "Lavender",
    skinConcerns: ["Sleep routine", "Normal"],
    ageRange: "3 months +",
    size: "100 g / 3.5 oz",
    images: ["/images/p-lavender.jpg", "/images/g-soap-stone.jpg", "/images/life-towel.jpg", "/images/life-feet.jpg"],
    ingredients:
      "Saponified olive oil, saponified coconut oil, oat milk, shea butter, Lavandula angustifolia (lavender) oil, glycerin, dried lavender buds, tocopherol.",
    howToUse:
      "Use during your evening bath. Lather softly, wash from neck to toes, rinse, and wrap in a warm towel. Keep away from eyes.",
    highlights: ["Baby-safe lavender level (0.2%)", "Oat milk for softness", "Part of a calming bedtime ritual", "Hand-cut in small batches"],
    badge: "Bestseller",
    isFeatured: true,
    inventory: 210,
    popularity: 96,
    daysOld: 400,
    reviews: [
      { author: "Emily J.", location: "Nashville, TN", rating: 5, title: "Our bedtime secret", body: "It's not magic, but honestly, it kind of feels like it. Bath with this bar, bottle, and she's out. The scent is so subtle and lovely.", daysAgo: 4 },
      { author: "Chris D.", location: "San Diego, CA", rating: 5, title: "Smells like a spa (for babies)", body: "The lavender is very light, not overpowering at all. Our twins love bath time now.", daysAgo: 41 },
      { author: "Nadia F.", location: "Toronto, ON", rating: 5, title: "Beautiful bar", body: "So pretty I almost didn't want to use it. Gentle, creamy, and the scent lingers just slightly on their pajamas.", daysAgo: 66 },
      { author: "Tom H.", location: "Minneapolis, MN", rating: 4, title: "Lovely, wish it was bigger", body: "Great product. We go through it a bit faster than the newborn bar, but that might be because everyone in the house steals it.", daysAgo: 102 },
      { author: "Grace L.", location: "Raleigh, NC", rating: 5, title: "Repeat buyer", body: "On my fifth bar. Never had a single reaction with my sensitive little guy.", daysAgo: 160 },
    ],
  },
  {
    slug: "chamomile-calendula-bar",
    name: "Chamomile & Calendula Bar",
    tagline: "Golden botanicals for calm, happy skin",
    description:
      "Calendula petals and chamomile are steeped in organic sunflower oil for six weeks, then blended into a buttery bar that soothes redness and comforts skin after a long day of exploring. Faint, honeyed, naturally floral.",
    priceCents: 1200,
    collectionSlug: "calm-and-bedtime",
    format: "bar",
    scent: "Chamomile",
    skinConcerns: ["Redness", "Sensitive", "Sleep routine"],
    ageRange: "0 months +",
    size: "100 g / 3.5 oz",
    images: ["/images/p-chamomile.jpg", "/images/g-soap-cloth.jpg", "/images/life-bath.jpg"],
    ingredients:
      "Saponified olive oil, saponified coconut oil, Calendula officinalis-infused sunflower oil, Chamomilla recutita (chamomile) extract, cocoa butter, glycerin, dried calendula petals.",
    howToUse:
      "Lather between palms, gently wash, rinse thoroughly. Petals on top are decorative and soften away after the first few uses.",
    highlights: ["6-week botanical infusion", "Soothes redness", "No added fragrance", "Organic botanicals"],
    isFeatured: false,
    inventory: 150,
    popularity: 82,
    daysOld: 300,
    reviews: [
      { author: "Isabel C.", location: "Phoenix, AZ", rating: 5, title: "Calmed his drool rash", body: "We used this on his cheeks and chin during teething, and the redness calmed down within days.", daysAgo: 18 },
      { author: "Olivia B.", location: "Columbus, OH", rating: 5, title: "Gorgeous and gentle", body: "The little petals on top are adorable. The bar is creamy, and the scent is barely there, just soft and natural.", daysAgo: 53 },
      { author: "Jared N.", location: "Salt Lake City, UT", rating: 4, title: "Great everyday bar", body: "Mild and pleasant. Nothing flashy, just reliably gentle.", daysAgo: 110 },
    ],
  },
  {
    slug: "coconut-milk-cuddle-bar",
    name: "Coconut Milk Cuddle Bar",
    tagline: "Rich, milky lather for extra-soft skin",
    description:
      "Creamy coconut milk and cold-pressed coconut oil make a rich, cushiony lather that leaves skin feeling like a fresh cuddle. Perfect for dry winter months and those first explorations in the tub.",
    priceCents: 1100,
    collectionSlug: "newborn-essentials",
    format: "bar",
    scent: "Coconut",
    skinConcerns: ["Dryness", "Normal"],
    ageRange: "3 months +",
    size: "100 g / 3.5 oz",
    images: ["/images/p-coconut.jpg", "/images/g-soap-dish.jpg", "/images/life-skincare.jpg"],
    ingredients:
      "Saponified olive oil, Cocos nucifera (coconut) milk, saponified coconut oil, mango butter, glycerin, tocopherol.",
    howToUse:
      "Wet, lather and enjoy the creamy foam. Rinse well and pat dry. Store on a draining dish.",
    highlights: ["Real coconut milk", "Extra-creamy lather", "Naturally sweet scent", "Vegan friendly alternative to goat milk"],
    isFeatured: true,
    inventory: 130,
    popularity: 78,
    daysOld: 200,
    reviews: [
      { author: "Bianca A.", location: "Honolulu, HI", rating: 5, title: "So creamy!", body: "Best lather of all the kAvI bars. Smells faintly sweet and her skin is so soft after.", daysAgo: 9 },
      { author: "Kevin Y.", location: "San Jose, CA", rating: 4, title: "Great for winter", body: "Helped with our toddler's dry elbows. Would love a bigger size.", daysAgo: 47 },
      { author: "Fatima Z.", location: "Houston, TX", rating: 5, title: "Vegan and gentle", body: "We're a plant-based family and this was the perfect pick. Gentle and lovely.", daysAgo: 88 },
    ],
  },
  {
    slug: "honey-almond-tiny-bar",
    name: "Honey & Almond Tiny Bar",
    tagline: "Sized for tiny hands and first self-washes",
    description:
      "A palm-sized bar made for little hands learning to wash themselves. Raw wildflower honey draws in moisture while sweet almond oil softens. Rounded edges, easy grip, endlessly giggle-worthy.",
    priceCents: 1100,
    collectionSlug: "newborn-essentials",
    format: "bar",
    scent: "Honey",
    skinConcerns: ["Dryness", "Normal"],
    ageRange: "12 months +",
    size: "60 g / 2.1 oz",
    images: ["/images/p-honey.jpg", "/images/g-soap-stone.jpg", "/images/life-feet.jpg"],
    ingredients:
      "Saponified olive oil, saponified coconut oil, Prunus amygdalus dulcis (sweet almond) oil, raw wildflower honey, beeswax, glycerin. Contains tree nuts.",
    howToUse:
      "Let your toddler hold and lather the bar with supervision. Rinse thoroughly. Contains almond. Avoid if nut allergies are a concern.",
    highlights: ["Toddler-sized grip", "Raw wildflower honey", "Rounded, no-slip shape", "Encourages independence"],
    badge: "New",
    isFeatured: false,
    inventory: 90,
    popularity: 70,
    daysOld: 25,
    reviews: [
      { author: "Laura G.", location: "Charlotte, NC", rating: 5, title: "Perfect for my toddler", body: "She insists on washing herself now and this little bar is just the right size. Smells like honey, so cute.", daysAgo: 7 },
      { author: "Sam P.", location: "Kansas City, MO", rating: 4, title: "Sweet little bar", body: "Lovely scent and size. It's small so it goes quicker, but that's expected.", daysAgo: 15 },
    ],
  },
  {
    slug: "tear-free-foaming-wash",
    name: "Tear-Free Foaming Wash",
    tagline: "Head-to-toe foam, no tears",
    description:
      "A cloud-soft foaming wash that dispenses ready-to-use bubbles, so there's one hand on baby, always. Our tear-free, sulfate-free formula uses coconut-derived cleansers and aloe to clean hair and body in one gentle step.",
    priceCents: 1600,
    collectionSlug: "newborn-essentials",
    format: "wash",
    scent: "Fragrance-free",
    skinConcerns: ["Newborn", "Sensitive", "Cradle cap"],
    ageRange: "0 months +",
    size: "250 ml / 8.5 fl oz",
    images: ["/images/p-wash.jpg", "/images/life-bath.jpg", "/images/g-towel.jpg"],
    ingredients:
      "Aqua, Aloe barbadensis leaf juice, coco-glucoside, glycerin, decyl glucoside, Calendula officinalis extract, sodium levulinate, citric acid.",
    howToUse:
      "Pump 1–2 times into your palm and massage gently into wet hair and body. Rinse well. Tear-free formula, but still avoid direct eye contact.",
    highlights: ["One-handed pump", "Tear-free & sulfate-free", "Hair + body in one", "Recyclable bottle"],
    badge: "Parent Favorite",
    isFeatured: true,
    inventory: 160,
    popularity: 90,
    daysOld: 280,
    reviews: [
      { author: "Jess T.", location: "Philadelphia, PA", rating: 5, title: "One-handed heaven", body: "As anyone who's bathed a slippery newborn knows, the pump foam is a lifesaver. Totally tear-free in our experience.", daysAgo: 3 },
      { author: "Andre M.", location: "Detroit, MI", rating: 5, title: "Helped with cradle cap", body: "Used it daily with a soft brush and the cradle cap cleared up within two weeks.", daysAgo: 38 },
      { author: "Wendy C.", location: "Sacramento, CA", rating: 4, title: "Gentle and easy", body: "Works well and is very gentle. Bottle lasts about six weeks with daily baths.", daysAgo: 72 },
      { author: "Rosa V.", location: "Albuquerque, NM", rating: 5, title: "No more crying at hair wash", body: "My son used to scream during hair washing. Not anymore. The foam doesn't sting at all.", daysAgo: 130 },
    ],
  },
  {
    slug: "calendula-cradle-cap-bar",
    name: "Calendula Cradle Cap Bar",
    tagline: "Gentle scalp care with a soft lather",
    description:
      "A rich, dense bar for scalp and body that helps loosen cradle cap flakes. Calendula and jojoba oil nourish the scalp, while a touch of finely ground oat makes for the softest, most gentle exfoliation.",
    priceCents: 1300,
    collectionSlug: "sensitive-skin",
    format: "bar",
    scent: "Fragrance-free",
    skinConcerns: ["Cradle cap", "Sensitive"],
    ageRange: "0 months +",
    size: "100 g / 3.5 oz",
    images: ["/images/g-soap-dish.jpg", "/images/p-chamomile.jpg", "/images/life-bath.jpg"],
    ingredients:
      "Saponified olive oil, saponified coconut oil, Simmondsia chinensis (jojoba) oil, calendula-infused olive oil, finely ground oat, glycerin, tocopherol.",
    howToUse:
      "Lather in your hands, massage gently onto baby's scalp in small circles, then lift flakes with a soft baby brush. Rinse well.",
    highlights: ["Targets cradle cap", "Jojoba for scalp balance", "Fragrance-free", "Works well with a soft baby brush"],
    isFeatured: false,
    inventory: 110,
    popularity: 74,
    daysOld: 150,
    reviews: [
      { author: "Hailey R.", location: "Omaha, NE", rating: 5, title: "Actually works", body: "We tried oils, shampoos, everything. This bar and a soft brush finally did it.", daysAgo: 21 },
      { author: "Ben S.", location: "Richmond, VA", rating: 4, title: "Good results", body: "Took about 10 days, but his scalp is clear now. Gentle on his face too.", daysAgo: 64 },
      { author: "Cara E.", location: "Pittsburgh, PA", rating: 5, title: "Lovely and effective", body: "So glad this exists. A gentle, natural option that our pediatrician was happy with.", daysAgo: 99 },
    ],
  },
  {
    slug: "rice-water-silk-bar",
    name: "Rice Water Silk Bar",
    tagline: "Fermented rice water for silky softness",
    description:
      "Inspired by generations-old bathing traditions, this bar blends fermented rice water and rice bran oil for a silky, smoothing clean. Mildly sweet, naturally soft, and lovely for normal-to-dry skin.",
    priceCents: 1200,
    collectionSlug: "sensitive-skin",
    format: "bar",
    scent: "Fragrance-free",
    skinConcerns: ["Dryness", "Normal"],
    ageRange: "6 months +",
    size: "100 g / 3.5 oz",
    images: ["/images/g-soap-cloth.jpg", "/images/p-coconut.jpg", "/images/life-skincare.jpg"],
    ingredients:
      "Saponified olive oil, saponified rice bran oil, fermented Oryza sativa (rice) water, saponified coconut oil, kokum butter, glycerin.",
    howToUse: "Lather, wash gently, rinse. Ideal for daily use.",
    highlights: ["Fermented rice water", "Rich in natural vitamin E", "Silky, smooth finish", "Fragrance-free"],
    isFeatured: false,
    inventory: 95,
    popularity: 66,
    daysOld: 60,
    reviews: [
      { author: "Mei L.", location: "San Francisco, CA", rating: 5, title: "Reminds me of home", body: "My grandmother bathed us with rice water. This bar brings that tradition to my daughter. Skin is incredibly soft.", daysAgo: 11 },
      { author: "Jordan F.", location: "Austin, TX", rating: 4, title: "Silky indeed", body: "Lovely texture. Leaves skin very smooth. Wish there was a mild scent option.", daysAgo: 44 },
    ],
  },
  {
    slug: "little-traveler-mini-bars",
    name: "Little Traveler Mini Bars",
    tagline: "Three mini bars for diaper bags & trips",
    description:
      "Our three bestselling formulas (Pure Newborn, Colloidal Oat and Lavender Dreams) in travel-friendly 35 g minis, packed in a reusable cotton pouch. Perfect for grandparents' houses, holidays and hotel stays.",
    priceCents: 1500,
    compareAtCents: 1800,
    collectionSlug: "gift-sets",
    format: "set",
    scent: "Assorted",
    skinConcerns: ["Newborn", "Sensitive", "Sleep routine"],
    ageRange: "0 months +",
    size: "3 × 35 g",
    images: ["/images/g-soap-stone.jpg", "/images/p-pure-newborn.jpg", "/images/p-lavender.jpg", "/images/p-oat-comfort.jpg"],
    ingredients: "See individual bar listings: Pure Newborn Bar, Colloidal Oat Comfort Bar, Lavender Dreams Bedtime Bar.",
    howToUse: "Use as you would each full-size bar. Keep the cotton pouch dry between uses.",
    highlights: ["TSA-friendly", "Reusable cotton pouch", "Try three formulas", "Save 15%"],
    isFeatured: false,
    inventory: 70,
    popularity: 72,
    daysOld: 90,
    reviews: [
      { author: "Nicole H.", location: "Las Vegas, NV", rating: 5, title: "Perfect for travel", body: "Took these on a two-week trip. Tiny, adorable, and we didn't have to use hotel soap on the baby.", daysAgo: 26 },
      { author: "Peter Q.", location: "Baltimore, MD", rating: 5, title: "Great sampler", body: "Helped us figure out which bar our son liked best (the oat one). Great value.", daysAgo: 80 },
    ],
  },
  {
    slug: "bath-time-trio",
    name: "Bath Time Trio",
    tagline: "Three full-size bars, one sweet ritual",
    description:
      "Our most-loved trio: Pure Newborn for everyday, Chamomile & Calendula for calming, and a blush Rose Clay bar exclusive to this set. Stacked, wrapped in linen and tied with ribbon, ready for the nursery shelf.",
    priceCents: 3200,
    compareAtCents: 3600,
    collectionSlug: "gift-sets",
    format: "set",
    scent: "Assorted",
    skinConcerns: ["Newborn", "Sensitive", "Redness"],
    ageRange: "0 months +",
    size: "3 × 100 g",
    images: ["/images/hero.jpg", "/images/p-chamomile.jpg", "/images/p-pure-newborn.jpg", "/images/life-towel.jpg"],
    ingredients:
      "Includes Pure Newborn Bar, Chamomile & Calendula Bar and Rose Clay Bar (saponified olive oil, saponified coconut oil, kaolin & rose clay, shea butter, glycerin).",
    howToUse: "Rotate bars to suit baby's needs. Store unused bars in a cool, dry place.",
    highlights: ["Exclusive Rose Clay bar", "Linen wrap & ribbon", "Save $4", "Gift note included"],
    badge: "Gift Favorite",
    isFeatured: true,
    inventory: 85,
    popularity: 88,
    daysOld: 240,
    reviews: [
      { author: "Allison K.", location: "New York, NY", rating: 5, title: "Showstopper shower gift", body: "Everyone at the shower asked where it was from. Beautifully wrapped, and the new mom loves the soaps.", daysAgo: 14 },
      { author: "Victor G.", location: "Dallas, TX", rating: 5, title: "Beautiful packaging", body: "Felt very premium. The rose clay bar is my favorite. So gentle.", daysAgo: 49 },
      { author: "Stephanie M.", location: "Tampa, FL", rating: 4, title: "Lovely set", body: "Great gift. Shipping took four days, but it arrived perfectly packaged.", daysAgo: 115 },
    ],
  },
  {
    slug: "welcome-baby-gift-box",
    name: "Welcome Baby Gift Box",
    tagline: "The complete first-bath collection",
    description:
      "Everything for a beautiful first bath: Pure Newborn Bar, Lavender Dreams Bedtime Bar, Tear-Free Foaming Wash, an organic muslin washcloth and a beechwood soap dish, presented in our signature keepsake box with a handwritten note.",
    priceCents: 5800,
    compareAtCents: 6800,
    collectionSlug: "gift-sets",
    format: "set",
    scent: "Assorted",
    skinConcerns: ["Newborn", "Sensitive", "Sleep routine"],
    ageRange: "0 months +",
    size: "5-piece set",
    images: ["/images/p-giftbox.jpg", "/images/p-wash.jpg", "/images/p-lavender.jpg", "/images/life-towel.jpg"],
    ingredients: "See individual product listings. Washcloth: 100% GOTS-certified organic cotton muslin. Dish: FSC-certified beechwood.",
    howToUse: "Unwrap, admire, and enjoy the first of many cozy bath times.",
    highlights: ["Keepsake gift box", "Handwritten note", "Save $10", "Free shipping"],
    badge: "Limited",
    isFeatured: true,
    inventory: 40,
    popularity: 85,
    daysOld: 120,
    reviews: [
      { author: "Monica D.", location: "Los Angeles, CA", rating: 5, title: "The nicest gift I've given", body: "My friend actually cried opening it. Every detail is so thoughtful, from the note to the little wooden dish.", daysAgo: 5 },
      { author: "Ethan W.", location: "Seattle, WA", rating: 5, title: "Worth it", body: "Pricey, but you can feel the quality. Everything in the box is useful, nothing is filler.", daysAgo: 33 },
      { author: "Julia P.", location: "Boulder, CO", rating: 5, title: "Gorgeous presentation", body: "The keepsake box now holds our baby's first mementos. Love that it has a second life.", daysAgo: 70 },
      { author: "Ryan B.", location: "Milwaukee, WI", rating: 4, title: "Great gift box", body: "Lovely contents. I wish there was an option to choose the bar scents, but overall very happy.", daysAgo: 125 },
    ],
  },
];
