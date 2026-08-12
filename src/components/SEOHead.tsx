import React, { useEffect } from 'react';
import { AppViewMode, Report } from '../types';
import { getShareableUrl } from '../lib/shareUtils';

interface SEOHeadProps {
  activeView: AppViewMode;
  selectedReport?: Report | null;
  reportsCount?: number;
}

const VIEW_SEO_CONFIG: Record<string, { title: string; description: string; keywords: string }> = {
  map: {
    title: "Interactive Community Map | Cityscape Civic Engagement",
    description: "Explore reported neighborhood issues, active public works repairs, and municipal crew updates on the live Cityscape interactive map.",
    keywords: "community map, live issue tracker, 311 map, pothole reporting map, local public works, civic map",
  },
  list: {
    title: "Neighborhood Requests Directory | Cityscape Civic Reports",
    description: "Browse, search, and upvote local infrastructure reports submitted by residents in your ward or city district.",
    keywords: "neighborhood requests, 311 issue directory, community issues, street repairs list, municipal priority requests",
  },
  public_works: {
    title: "Public Works Crew Command Desk | Cityscape Municipal Portal",
    description: "Real-time dispatch management, crew assignment, and resolution workflow tracking for municipal public works officers.",
    keywords: "public works desk, municipal portal, 311 dispatch, crew status, civic maintenance management",
  },
  analytics: {
    title: "Civic Resolution Analytics & Impact | Cityscape Data Hub",
    description: "View ward performance statistics, average resolution times, issue density heatmaps, and civic engagement metrics.",
    keywords: "civic analytics, municipal response time, public works stats, resolution rate, 311 data insights",
  },
  journal: {
    title: "Civic Journal & Community Stories | Cityscape News & Updates",
    description: "Read updates on neighborhood transformations, public works milestones, green space improvements, and community achievements.",
    keywords: "civic journal, community news, neighborhood updates, public works blog, citizen stories",
  },
  events: {
    title: "Community Events & Civic Workshops | Cityscape Local Hub",
    description: "Join upcoming neighborhood cleanups, ward council town halls, tree planting drives, and civic volunteer meetups.",
    keywords: "community events, ward town halls, neighborhood cleanups, civic volunteer events, municipal workshops",
  },
  bulletin: {
    title: "Civic Bulletin & Official Announcements | Cityscape Public Notices",
    description: "Official municipal announcements, emergency weather alerts, road closure notices, and ward representative updates.",
    keywords: "civic bulletin, municipal announcements, emergency alerts, road closures, ward notices",
  },
  gratitude: {
    title: "Community Gratitude Feed | Thank Your Local Public Works Crew",
    description: "Send appreciation and shoutouts to the municipal crews and neighbors keeping our streets and parks clean and safe.",
    keywords: "gratitude feed, public works appreciation, community thank you, neighbor shoutouts",
  },
  profile: {
    title: "Citizen Impact Profile | Cityscape Civic Karma & History",
    description: "Track your personal civic contributions, reported issues, upvoted requests, earned karma badges, and neighborhood rank.",
    keywords: "citizen profile, civic karma, reported issues history, neighborhood impact, volunteer profile",
  },
  brand_system: {
    title: "Brand & Accessibility Design Tokens | Cityscape Framework",
    description: "Cityscape WCAG AAA visual identity, accessible color contrast tokens, Atkinson Hyperlegible typography, and touch standards.",
    keywords: "cityscape design system, civic accessibility, WCAG AAA contrast, brand identity framework",
  },
  strategic_arch: {
    title: "Platform Strategic Architecture & Security | Cityscape Docs",
    description: "Enterprise system architecture, offline-first queue synchronization, role-based access control, and Firestore security rules.",
    keywords: "cityscape architecture, offline sync queue, firestore security rules, civic tech stack",
  },
  estate_portal: {
    title: "Public Property & Asset Management Portal | Cityscape Estate",
    description: "Municipal property registry, public asset inspection records, park facilities management, and civic infrastructure tracking.",
    keywords: "public property portal, estate asset management, park maintenance, municipal registry",
  },
  sla_dashboard: {
    title: "SLA Resolution & Accountability Tracker | Cityscape Compliance",
    description: "Monitor expected resolution times, service level agreement compliance, and response efficiency for all municipal wards.",
    keywords: "SLA resolution tracker, municipal compliance, response time tracking, civic accountability",
  },
};

export const SEOHead: React.FC<SEOHeadProps> = ({ activeView, selectedReport, reportsCount }) => {
  useEffect(() => {
    let title = "Cityscape | Citizen Engagement Platform & Municipal Issue Reporting";
    let description = "Report local neighborhood issues, track public works repairs in real-time, upvote civic priorities, and collaborate with your city team on 311 services.";
    let keywords = "Cityscape, civic reporting, 311 municipal requests, pothole repair app, public works crew, street repair, neighborhood requests";

    if (selectedReport) {
      title = `${selectedReport.title} | Cityscape Neighborhood Request #${selectedReport.id.slice(-6)}`;
      description = `Status: ${selectedReport.status}. ${selectedReport.description.slice(0, 150)}... Located in Ward ${selectedReport.ward || 'Main'}. Upvoted by ${selectedReport.upvotesCount || 0} neighbors.`;
      keywords = `${selectedReport.category.toLowerCase()}, ${selectedReport.status.toLowerCase()} request, ${selectedReport.locationName || 'neighborhood'}, cityscape issue`;
    } else if (VIEW_SEO_CONFIG[activeView]) {
      const config = VIEW_SEO_CONFIG[activeView];
      title = config.title;
      description = config.description;
      keywords = config.keywords;
    }

    // Dynamically update page Title
    document.title = title;

    // Helper to update or create meta tag
    const setMetaTag = (nameAttr: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // Determine image and URL for Open Graph preview
    const ogImageUrl = selectedReport
      ? (selectedReport.imageUrls?.[0] || selectedReport.resolutionImageUrl || 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80')
      : 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80';

    const ogPageUrl = selectedReport
      ? getShareableUrl('report', selectedReport.id)
      : window.location.origin + (window.location.pathname === '/' ? '' : window.location.pathname);

    // Update Meta Description & Keywords
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // Update Open Graph Meta
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImageUrl);
    setMetaTag('property', 'og:image:alt', selectedReport?.title || 'Cityscape Civic Request');
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:url', ogPageUrl);
    setMetaTag('property', 'og:type', selectedReport ? 'article' : 'website');
    setMetaTag('property', 'og:site_name', 'Cityscape Civic Platform');

    // Update Twitter Card Meta
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImageUrl);
    setMetaTag('name', 'twitter:image:alt', selectedReport?.title || 'Cityscape Civic Request');

    // Update Dynamic Breadcrumb & ItemList Schema
    let breadcrumbSchema = document.getElementById('seo-breadcrumb-schema');
    if (!breadcrumbSchema) {
      breadcrumbSchema = document.createElement('script');
      breadcrumbSchema.setAttribute('type', 'application/ld+json');
      breadcrumbSchema.setAttribute('id', 'seo-breadcrumb-schema');
      document.head.appendChild(breadcrumbSchema);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Cityscape Home",
          "item": "https://cityscape.gov/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": activeView.toUpperCase().replace('_', ' '),
          "item": `https://cityscape.gov/#${activeView}`
        },
        ...(selectedReport
          ? [
              {
                "@type": "ListItem",
                "position": 3,
                "name": selectedReport.title,
                "item": `https://cityscape.gov/#report-${selectedReport.id}`
              }
            ]
          : [])
      ]
    };

    breadcrumbSchema.textContent = JSON.stringify(schemaData);

    // Update Dynamic Place & GeoCoordinates Schema for Geo-Relevance
    let geoSchema = document.getElementById('seo-geo-place-schema');
    if (!geoSchema) {
      geoSchema = document.createElement('script');
      geoSchema.setAttribute('type', 'application/ld+json');
      geoSchema.setAttribute('id', 'seo-geo-place-schema');
      document.head.appendChild(geoSchema);
    }

    const sLat = selectedReport ? Number(selectedReport.latitude) : NaN;
    const sLng = selectedReport ? Number(selectedReport.longitude) : NaN;
    const hasValidGeo = selectedReport && !isNaN(sLat) && !isNaN(sLng) && isFinite(sLat) && isFinite(sLng);

    if (hasValidGeo) {
      const geoData = {
        "@context": "https://schema.org",
        "@type": "Place",
        "@id": `https://cityscape.gov/#place-report-${selectedReport.id}`,
        "name": selectedReport.title,
        "description": selectedReport.description,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": selectedReport.locationName || `Ward ${selectedReport.ward || '1'} Street`,
          "addressLocality": "San Francisco",
          "addressRegion": "CA",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": sLat,
          "longitude": sLng
        }
      };
      geoSchema.textContent = JSON.stringify(geoData);
    } else {
      const defaultDistrictGeo = {
        "@context": "https://schema.org",
        "@type": "Place",
        "@id": "https://cityscape.gov/#place-district-center",
        "name": "Cityscape Municipal Service Area Center",
        "description": "Central geographical dispatch zone for city public works and civic requests.",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 37.7749,
          "longitude": -122.4194
        }
      };
      geoSchema.textContent = JSON.stringify(defaultDistrictGeo);
    }

  }, [activeView, selectedReport, reportsCount]);

  return null;
};
