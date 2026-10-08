import React from 'react';
import { AboutSEO } from '../../components/About/AboutSEO';
import { 
  HeroBanner, 
  CompanyOverview, 
  StatsAndValue, 
  ServicesAndJourney, 
  TeamSection, 
  TestimonialsAndCTA 
} from '../../components/About/AboutSections';

export default function About() {
  return (
    <main className="min-h-screen bg-[#FBF7EF] text-slate-900 antialiased">
      <AboutSEO />
      <HeroBanner />
      <CompanyOverview />
      <StatsAndValue />
      <ServicesAndJourney />
      <TeamSection />
      <TestimonialsAndCTA />
    </main>
  );
}