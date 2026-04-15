import React from "react";

// Government Components
import GovDashboard from "../government/page/dashboard";
import GovAreaManagement from "../government/page/area-management";
import GovHistory from "@/app/government/page/history";
import GovReports from "../government/page/reports";
import GovScenarioManagement from "../government/page/scenario-management";

// Shared Normal Components (Personal & Business)
import NormalHome from "../normal/page/home";
import NormalWeather from "../normal/page/weather";
import NormalMap from "../normal/page/map";
import NormalHistory from "../normal/page/history";
import NormalPersona from "../normal/page/persona";
import NormalAccount from "../normal/page/account";

// Business Specific Components
import BusinessReports from "../normal/business/page/reports";

// Type definition for route registry
type RouteRegistry = {
  [key: string]: React.ComponentType<any> | any;
};

// --- Government Routing ---
const governmentRoutes: RouteRegistry = {
  "dashboard": GovDashboard,
  "area-management": GovAreaManagement,
  "history": GovHistory,
  "reports": GovReports,
  "scenario-management": GovScenarioManagement,
};

export const getGovernmentContent = (slug: string | string[] | undefined) => {
  const path = Array.isArray(slug) ? slug[0] : slug; // Take first segment for now
  const Component = governmentRoutes[path || "dashboard"]; // Default to dashboard
  return Component ? <Component /> : <div>Page not found</div>;
};

// --- Business Routing ---
// Business uses shared 'normal' pages + specific business pages
const businessRoutes: RouteRegistry = {
  // "home" is handled specially to pass props
  "weather": NormalWeather,
  "map": NormalMap,
  "history": NormalHistory,
  "persona": NormalPersona,
  "account": NormalAccount,
  "reports": BusinessReports, // Specific to business
};

export const getBusinessContent = (slug: string | string[] | undefined) => {
  const path = Array.isArray(slug) ? slug[0] : slug || "home";
  
  if (path === "home") {
      return <NormalHome mode="business" />;
  }

  const Component = businessRoutes[path];
  return Component ? <Component mode="business" /> : <div>Page not found</div>;
};

// --- Personal Routing ---
// Personal uses shared 'normal' pages
const personalRoutes: RouteRegistry = {
  // "home" is handled specially to pass props
  "weather": NormalWeather,
  "map": NormalMap,
  "history": NormalHistory,
  "persona": NormalPersona,
  "account": NormalAccount,
};

export const getPersonalContent = (slug: string | string[] | undefined) => {
  const path = Array.isArray(slug) ? slug[0] : slug || "home";

  if (path === "home") {
      return <NormalHome mode="personal" />;
  }

  const Component = personalRoutes[path];
  return Component ? <Component mode="personal" /> : <div>Page not found</div>;
};
