import React from 'react';
import { Helmet } from 'react-helmet-async';

export const AboutSEO = () => (
    <Helmet>
        <title>About Us | Edge Mile Realty</title>
        <meta
            name="description"
            content="Learn about Edge Mile Realty, our mission, vision, world-class real estate services, and the expert team helping you find your dream home."
        />
        <meta property="og:title" content="About Us | Edge Mile Realty" />
        <meta
            property="og:description"
            content="Discover our journey, company milestones, and why thousands trust us for buying, selling, and managing luxury property."
        />
        <meta property="og:type" content="website" />
    </Helmet>
);