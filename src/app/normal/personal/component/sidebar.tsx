"use client";

import Sidebar from "../../../shared_component/sidebar";

export default function PersonalSidebar() {
  const items = [
    { labelKey: "sidebar.home", href: "/normal/personal/page?tab=home" },
    { labelKey: "sidebar.weatherForecast", href: "/normal/personal/page?tab=weather" },
    { labelKey: "sidebar.combinedMap", href: "/normal/personal/page?tab=map" },
    { labelKey: "sidebar.history", href: "/normal/personal/page?tab=history" },
    { labelKey: "sidebar.personal", href: "/normal/personal/page?tab=persona" },
    { labelKey: "sidebar.account", href: "/normal/personal/page?tab=account" },
  ];

  return <Sidebar items={items} />;
}
