"use client";

import Sidebar from "../../../shared_component/sidebar";

export default function BusinessSidebar() {
  const items = [
    { labelKey: "sidebar.home", href: "/normal/business/page?tab=home" },
    { labelKey: "sidebar.weatherForecast", href: "/normal/business/page?tab=weather" },
    { labelKey: "sidebar.combinedMap", href: "/normal/business/page?tab=map" },
    { labelKey: "sidebar.reports", href: "/normal/business/page?tab=reports" },
    { labelKey: "sidebar.history", href: "/normal/business/page?tab=history" },
    { labelKey: "sidebar.personal", href: "/normal/business/page?tab=persona" },
    { labelKey: "sidebar.account", href: "/normal/business/page?tab=account" },
  ];

  return <Sidebar items={items} />;
}
