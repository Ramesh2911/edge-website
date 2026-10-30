import Hero from "../../components/home/Hero";
import ExploreMore from "../../components/home/ExploreMore";
import FeaturedProperties from "../../components/home/FeaturedProperties";
import PopularProperties from "../../components/home/PopularProperties";
import PopularLocalities from "../../components/home/PopularLocalities";
import HomeLoan from "../../components/home/HomeLoan";
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
            <FeaturedProperties />
            <PopularProperties />
            <PopularLocalities />
            <HomeLoan />
            {/* <ExploreMore /> */}
            <WhyChooseUs />
            <Partners />
            <Testimonials />
            <BlogSection />
            <StatsCTA />
            <LeadPopup />
        </>
    );
}