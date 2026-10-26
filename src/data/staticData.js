import slideModernApartment from "../assets/Modern Apartment Complex Under Blue Skies.png";
import slideZeroBrokerage from "../assets/Exclusive Zero Brokerage Deals.png";
import slideConstruction from "../assets/Construction Site at Blue Hour.png";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Properties", href: "/properties" },
  {
    label: "Service",
    children: [
      { label: "Commercial", href: "/properties?type=Commercial" },
      { label: "Land", href: "/properties?type=Plot" },
      { label: "Investment", href: "/properties?service=Investment" },
      { label: "IL & W", href: "/properties?service=ILW" },
    ],
  },
];

export const searchTabs = [
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "pg", label: "PG" },
  { id: "new-launch", label: "New Launch", badge: "New" },
  { id: "commercial", label: "Commercial" },
  { id: "plots", label: "Plots/Land" },
  { id: "projects", label: "Projects" },
  { id: "post", label: "Post Property", badge: "Free" },
];

export const propertyTypes = ["All Residential", "Apartment", "Villa", "Independent House", "Studio"];

export const quickLinks = [
  { icon: "Building2", label: "New Projects", desc: "Discover newly launched projects" },
  { icon: "MapPin", label: "Top Localities", desc: "Find the best localities near you" },
  { icon: "TrendingUp", label: "Price Trends", desc: "Track market trends and prices" },
  { icon: "Landmark", label: "Home Loans", desc: "Quick & easy loan solutions" },
  { icon: "Megaphone", label: "Sell/Rent Property", desc: "List your property for free" },
];

export const propertyFilterTabs = ["All Properties", "Premium Homes", "Affordable Homes", "New Launch", "Commercial"];

export const properties = [
  {
    id: 1,
    name: "Godrej Riverine",
    location: "Sector 79, Gurugram",
    price: "₹2.45 Cr*",
    beds: "2, 3, 4 BHK Apartments",
    area: "1,840 - 3,205",
    possession: "Ready to Move",
    tag: "Premium Homes",
    badge: "Trending Now",
    badgeColor: "bg-gold text-charcoal-deep",
    gradient: "from-amber-200 via-orange-100 to-stone-200",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=640&q=80", // Premium Apartment Building
  },
  {
    id: 2,
    name: "Prestige Park Grove",
    location: "Whitefield, Bangalore",
    price: "₹1.78 Cr*",
    beds: "2, 3 BHK Apartments",
    area: "1,335 - 1,950",
    possession: "Dec 2027",
    tag: "New Launch",
    badge: "New Launch",
    badgeColor: "bg-navy text-white",
    gradient: "from-emerald-200 via-teal-100 to-stone-200",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=640&q=80", // Modern Residential Estate
  },
  {
    id: 3,
    name: "DLF The Dahlias",
    location: "Golf Course Extension, Gurugram",
    price: "₹14.90 Cr*",
    beds: "4, 5 BHK Apartments",
    area: "6,500 - 11,800",
    possession: "Ready to Move",
    tag: "Premium Homes",
    badge: "Luxury",
    badgeColor: "bg-plum text-white",
    gradient: "from-violet-200 via-purple-100 to-stone-200",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=640&q=80", // Ultra-Luxury Property
  },
  {
    id: 4,
    name: "Vatika One on One",
    location: "Cyber City, Gurugram",
    price: "₹85 L*",
    beds: "Office Space",
    area: "560 - 3,500",
    possession: "Approved",
    tag: "Commercial",
    badge: "Commercial",
    badgeColor: "bg-clay text-white",
    gradient: "from-rose-200 via-red-100 to-stone-200",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=640&q=80", // Modern Commercial Office Building
  },
  {
    id: 5,
    name: "Sobha Neopolis",
    location: "Panathur, Bangalore",
    price: "₹1.95 Cr*",
    beds: "2, 3 BHK Apartments",
    area: "1,410 - 2,010",
    possession: "Ready to Move",
    tag: "Affordable Homes",
    badge: "Trending Now",
    badgeColor: "bg-gold text-charcoal-deep",
    gradient: "from-sky-200 via-cyan-100 to-stone-200",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=640&q=80", // Contemporary Apartment Complex
  },
  {
    id: 6,
    name: "Brigade Atmosphere",
    location: "Varthur, Bangalore",
    price: "₹98 L*",
    beds: "2, 3 BHK Apartments",
    area: "1,180 - 1,640",
    possession: "Mar 2026",
    tag: "Affordable Homes",
    badge: "New Launch",
    badgeColor: "bg-navy text-white",
    gradient: "from-lime-200 via-green-100 to-stone-200",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=640&q=80", // Residential Family Home/Apartment
  },
];

export const trustStrip = [
  { icon: "ShieldCheck", label: "Verified Properties", desc: "100% verified listings" },
  { icon: "BadgePercent", label: "Best Price Guarantee", desc: "Get the best deals" },
  { icon: "Headset", label: "Expert Support", desc: "24/7 customer care" },
  { icon: "LockKeyhole", label: "Secure Transactions", desc: "Safe & transparent" },
];

export const localities = [
  {
    id: 1,
    name: "Sector 74",
    city: "Noida",
    count: "1,350+ Properties",
    gradient: "from-amber-300 to-orange-200",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=480&h=480&q=80", // High-rise towers with sunset glow
  },
  {
    id: 2,
    name: "Whitefield",
    city: "Bangalore",
    count: "2,180+ Properties",
    gradient: "from-emerald-300 to-teal-200",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=480&h=480&q=80", // Premium corporate & residential towers
  },
  {
    id: 3,
    name: "Golf Course Road",
    city: "Gurugram",
    count: "1,900+ Properties",
    gradient: "from-violet-300 to-purple-200",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=480&h=480&q=80", // Glass commercial cyber hub buildings
  },
  {
    id: 4,
    name: "Andheri West",
    city: "Mumbai",
    count: "860+ Properties",
    gradient: "from-rose-300 to-red-200",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=480&h=480&q=80", // Skyline apartments at twilight
  },
  {
    id: 5,
    name: "Kharadi",
    city: "Pune",
    count: "1,260+ Properties",
    gradient: "from-sky-300 to-cyan-200",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=480&h=480&q=80", // Dense modern apartment clusters
  },
  {
    id: 6,
    name: "Gachibowli",
    city: "Hyderabad",
    count: "970+ Properties",
    gradient: "from-lime-300 to-green-200",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=480&h=480&q=80", // Modern residential high-rises with lush green views
  },
];


export const heroStats = [
  { value: "25K+", label: "Properties Listed" },
  { value: "15K+", label: "Happy Customers" },
  { value: "50+", label: "Top Cities" },
  { value: "10+", label: "Years of Trust" },
];

export const nearbyPins = [
  { label: "₹1.26 Cr", top: "18%", left: "30%" },
  { label: "₹2.40 Cr", top: "55%", left: "16%" },
  { label: "₹3.60 Cr", top: "62%", left: "62%" },
  { label: "₹98 L", top: "30%", left: "72%" },
];

export const excellenceFeatures = [
  {
    icon: "Landmark",
    tag: "Bank",
    title: "Trusted Banking Partners",
    desc: "Explore home loan options through our partner banks with guidance throughout the process.",
  },
  {
    icon: "ShieldCheck",
    tag: "Property",
    title: "Verified Properties, Confident Choices",
    desc: "Find the right property with support for documentation checks and informed decisions.",
  },
  {
    icon: "Scale",
    tag: "Legal team",
    title: "Legal Support You Can Rely On",
    desc: "Get assistance with property documentation, legal concerns, and understanding your rights.",
  },
  {
    icon: "Wallet",
    tag: "Loan",
    title: "Loan Guidance Without the Stress",
    desc: "Get support navigating loan-related concerns, repayment issues, and the next steps.",
  },
  {
    icon: "Headphones",
    tag: "Customer service",
    title: "With You at Every Step",
    desc: "From property selection to paperwork, receive guidance throughout your journey.",
  },
  {
    icon: "Eye",
    tag: "Transparency",
    title: "Clarity in Every Decision",
    desc: "Straightforward information and honest guidance to help you make informed choices.",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Gurugram",
    rating: 5,
    quote:
      "Finding our dream home was so simple here. The team was responsive throughout the process and helped us close in under three weeks.",
  },
  {
    id: 2,
    name: "Amit Verma",
    city: "Bangalore",
    rating: 5,
    quote:
      "A wide range of properties and complete transparency on pricing. I never felt pressured and always had the information I needed.",
  },
  {
    id: 3,
    name: "Sneha Iyer",
    city: "Pune",
    rating: 5,
    quote:
      "The team understood exactly what we needed and matched us with the right property quickly. Highly recommend for first-time buyers.",
  },
  {
    id: 4,
    name: "Rohit Mehta",
    city: "Mumbai",
    rating: 5,
    quote:
      "Excellent legal support made our paperwork stress-free. The whole experience felt secure from search to registration.",
  },
];

export const partners = ["DLF", "LODHA", "GODREJ", "SOBHA", "BRIGADE", "MAHINDRA"];

const logoFiles = import.meta.glob("../assets/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
});

const findLogo = (keywords) => {
  for (const [path, url] of Object.entries(logoFiles)) {
    const name = path.toLowerCase();
    if (keywords.some((k) => name.includes(k))) return url;
  }
  return null;
};

export const partnerDevelopers = [
  {
    name: "Srijan Realty",
    initials: "SR",
    color: "bg-[#1E4C8C] text-[#8BC53F]",
    logo: findLogo(["srijan"]),
    desc: "Srijan Realty Pvt. Ltd. is a fast-growing real estate company engaged in construction of several real estate projects across India.",
  },
  {
    name: "Oswal Group",
    initials: "OG",
    color: "bg-[#EAF6DE] text-[#6FA82C]",
    logo: findLogo(["oswal"]),
    desc: "Oswal Group is a renowned and admired brand which has moved from strength to strength over the past three decades.",
  },
  {
    name: "Primarc",
    initials: "P",
    color: "bg-[#EAF1FB] text-[#1E4C8C]",
    logo: findLogo(["primarc"]),
    desc: "Since inception, Primarc Group has aimed to be a customer centric organization with the highest levels of transparency and quality.",
  },
  {
    name: "Jupiter Developer",
    initials: "JD",
    color: "bg-[#153964] text-white",
    logo: findLogo(["jupiter"]),
    desc: "Jupiter Developers have offered luxury, comfort, and happiness. All our apartments are spacious and the complexes we design offer a premium lifestyle.",
  },
];

export const blogPosts = [
  {
    id: 1,
    tag: "Home Buying",
    date: "June 12, 2026",
    title: "10 Things You Must Know Before Buying a Home",
    excerpt: "From budgeting to legal checks, here is everything first-time buyers often overlook.",
    gradient: "from-amber-200 to-orange-100",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=480&h=320&q=80", // Modern living room with a city view window
  },
  {
    id: 2,
    tag: "Market Trends",
    date: "May 28, 2026",
    title: "Real Estate Market Trends in 2026",
    excerpt: "Key insights into pricing patterns and demand shifts across major Indian cities.",
    gradient: "from-emerald-200 to-teal-100",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=480&h=320&q=80", // High-rise city towers at dusk
  },
  {
    id: 3,
    tag: "Home Decor",
    date: "May 14, 2026",
    title: "7 Smart Decor Ideas to Elevate Your Space",
    excerpt: "Simple and affordable ways to bring a fresh, premium feel to your home interiors.",
    gradient: "from-violet-200 to-purple-100",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=480&h=320&q=80", // Bright, aesthetic living room setup with green plants
  },
  {
    id: 4,
    tag: "Investment",
    date: "April 30, 2026",
    title: "Why Real Estate is the Best Long-Term Investment",
    excerpt: "Discover why steady appreciation makes property a smart addition to your portfolio.",
    gradient: "from-rose-200 to-red-100",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=480&h=320&q=80", // Premium luxury villa exterior
  },
];

// Hero slider banners (src/assets)
export const heroSlides = [
  { id: "slide-1", image: slideModernApartment },
  { id: "slide-2", image: slideZeroBrokerage },
  { id: "slide-3", image: slideConstruction },
];

// Hero background — modern luxury home exterior at dusk
export const heroImage =
  "https://images.unsplash.com/photo-1757359056339-22968344cce6?w=1600&h=900&fit=crop&auto=format&q=80";

// Dream Home CTA — luxury living room interior
export const dreamHomeImage =
  "https://images.unsplash.com/photo-1758448755856-01d3add0177b?w=900&h=700&fit=crop&auto=format&q=80";

export const footerLinks = {
  "Quick Links": [
    { label: "Buy Property", href: "/properties?purpose=Sale" },
    { label: "Rent Property", href: "/properties?purpose=Rent" },
    { label: "New Launch", href: "/properties?status=New+Launch" },
    { label: "Plots & Land", href: "/properties?type=Plot" },
    { label: "Post Property", href: "/add-property" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Price Trends", href: "/properties" },
    { label: "Blog", href: "/properties" },
  ],
  Support: [
    { label: "Help Center", href: "/contact" },
  ],
};
