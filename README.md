# HomeLuxe – Real Estate Landing Page

A pixel-matched clone of the HomeLuxe real estate landing page, built with React 18 + Vite + Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## What's included

- Sticky header with mobile nav drawer
- Hero with working search tabs, property-type dropdown, search input + live result message, quick-links strip
- "Everything you need in one place" feature cards
- Featured Properties: category filter tabs, scroll-carousel with arrow controls, wishlist heart toggle per card
- Trust badge strip
- Popular Localities scroll-carousel
- Stats + "Properties Near You" map widget
- "Find Your Dream Home" CTA banner
- "Experience Excellence" feature grid
- Testimonials scroll-carousel
- Stats + "Ready to Find Your Dream Home" CTA box
- Trusted partner logos
- Blog grid
- Footer with working newsletter subscribe form

All data is static, defined in `src/data/staticData.js` — edit that file to swap in real listings, localities, testimonials, blog posts, etc.

## Design tokens

- Colors: cream background, charcoal text/footer, gold accent (see `tailwind.config.js`)
- Fonts: Fraunces (display/headings) + Manrope (body), loaded via Google Fonts in `src/index.css`


website/
│
├── public/
│
├── src/
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   ├── fonts/
│   └── styles/
│       ├── global.css
│       ├── variables.css
│       └── responsive.css
│
├── components/
│
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Loader.jsx
│   │   ├── Modal.jsx
│   │   ├── Pagination.jsx
│   │   ├── EmptyState.jsx
│   │   ├── NoData.jsx
│   │   └── PageLoader.jsx
│   │
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── MobileMenu.jsx
│   │
│   ├── home/
│   │   ├── Hero.jsx
│   │   ├── ExploreMore.jsx
│   │   ├── FeaturedProperties.jsx
│   │   ├── TrustBadges.jsx
│   │   ├── PopularLocalities.jsx
│   │   ├── StatsMap.jsx
│   │   ├── DreamHomeCTA.jsx
│   │   ├── WhyChooseUs.jsx
│   │   ├── Testimonials.jsx
│   │   ├── StatsCTA.jsx
│   │   ├── Partners.jsx
│   │   └── BlogSection.jsx
│   │
│   ├── property/
│   │   ├── PropertyCard.jsx
│   │   ├── PropertyGrid.jsx
│   │   ├── PropertyFilter.jsx
│   │   ├── PropertyGallery.jsx
│   │   ├── PropertyAmenities.jsx
│   │   ├── PropertyLocation.jsx
│   │   ├── PropertyOverview.jsx
│   │   └── PropertyContact.jsx
│   │
│   ├── profile/
│   │   ├── ProfileCard.jsx
│   │   ├── EditProfileForm.jsx
│   │   └── ChangePasswordForm.jsx
│   │
│   ├── dashboard/
│   │   ├── DashboardCard.jsx
│   │   ├── DashboardStats.jsx
│   │   └── RecentProperty.jsx
│   │
│   ├── blog/
│   │   ├── BlogCard.jsx
│   │   ├── BlogSidebar.jsx
│   │   └── RecentPost.jsx
│   │
│   ├── chatbot/
│   │   └── ChatBot.jsx
│   │
│   └── seo/
│       └── Seo.jsx
│
├── layouts/
│   ├── MainLayout.jsx
│   └── DashboardLayout.jsx
│
├── pages/
│   ├── Home/
│   │   └── Home.jsx
│   │
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   │
│   ├── Dashboard/
│   ├── Property/
│   ├── Profile/
│   ├── Buyer/
│   ├── Lead/
│   ├── Blog/
│   ├── Contact/
│   ├── About/
│   └── NotFound/
│
├── routes/
│   ├── AppRoutes.jsx
│   ├── PublicRoutes.jsx
│   └── PrivateRoutes.jsx
│
├── services/
├── context/
├── hooks/
├── redux/
├── utils/
│
├── App.jsx
└── main.jsx