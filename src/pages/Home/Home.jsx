import Hero from "../../components/home/Hero";
import ExploreMore from "../../components/home/ExploreMore";
import FeaturedProperties from "../../components/home/FeaturedProperties";
import TrustBadges from "../../components/home/TrustBadges";
import PopularLocalities from "../../components/home/PopularLocalities";
import DreamHomeCTA from "../../components/home/DreamHomeCTA";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Testimonials from "../../components/home/Testimonials";
import StatsCTA from "../../components/home/StatsCTA";
import Partners from "../../components/home/Partners";
import BlogSection from "../../components/home/Blog";
import LeadPopup from "../../components/common/LeadPopup";

export default function Home() {
    return (
        <>
            <Hero />
            <ExploreMore />
            <FeaturedProperties />
            <TrustBadges />
            <PopularLocalities />
            <DreamHomeCTA />
            <WhyChooseUs />
            <Testimonials />
            <StatsCTA />
            <Partners />
            <BlogSection />
            <LeadPopup />
        </>
    );
}