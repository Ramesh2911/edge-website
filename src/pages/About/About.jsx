import React from 'react';
import { AboutSEO } from '../../components/About/AboutSEO';
import {
    HeroBanner,
    AwardsMarquee,
    CompanyOverview,
    StatsAndValue,
    Milestones,
    ServicesAndJourney,
    OfficeGallery,
    TeamSection,
    Testimonials,
    CTABanner,
} from '../../components/About/AboutSections';

export default function About() {
    return (
        <main className="min-h-screen bg-[#FBF7EF] text-slate-900 antialiased">
            <AboutSEO />
            <HeroBanner />
            <AwardsMarquee />
            <CompanyOverview />
            <StatsAndValue />
            <Milestones />
            <ServicesAndJourney />
            <OfficeGallery />
            <TeamSection />
            <Testimonials />
            <CTABanner />
        </main>
    );
}
