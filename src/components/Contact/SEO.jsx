import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * Production-Ready SEO Component
 * Dynamically injects Meta, OG, and Twitter elements into the document head.
 */
const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type
}) => {
    // Define absolute system fallbacks for a premium real estate baseline
    const defaultTitle = "Premium Real Estate Agency | Luxury Properties";
    const defaultDescription = "Discover your next premium investment or luxury residential space with our world-class real estate brokerage infrastructure.";
    const defaultImage = "https://yourdomain.com/assets/og-default-banner.jpg";
    const defaultUrl = "https://yourdomain.com";

    const siteTitle = title ? `${title} | Premium Real Estate` : defaultTitle;
    const siteDescription = description || defaultDescription;
    const siteImage = image || defaultImage;
    const siteUrl = url || defaultUrl;

    return (
        <Helmet>
            {/* Primary HTML Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={siteDescription} />
            {keywords && <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />}
            <link rel="canonical" href={siteUrl} />

            {/* Open Graph / Facebook Protocol */}
            <meta property="og:type" content={type || 'website'} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:image" content={siteImage} />

            {/* X / Twitter Card Protocol */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={siteUrl} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={siteDescription} />
            <meta name="twitter:image" content={siteImage} />
        </Helmet>
    );
};

// Enforce robust component prop declarations
SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    image: PropTypes.string,
    url: PropTypes.string,
    type: PropTypes.string,
};

export default SEO;