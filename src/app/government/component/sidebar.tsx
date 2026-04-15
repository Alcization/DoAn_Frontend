"use client";

import Sidebar from "../../shared_component/sidebar";

export default function GovernmentSidebar() {
  const items = [
    { labelKey: "sidebar.dashboard", href: "/government/page?tab=dashboard" },
    { labelKey: "sidebar.areaManagement", href: "/government/page?tab=area-management" },
    { labelKey: "sidebar.scenarioManagement", href: "/government/page?tab=scenario-management" },
    { labelKey: "sidebar.alertIncidentHistory", href: "/government/page?tab=history" },
    { labelKey: "sidebar.reports", href: "/government/page?tab=reports" },
  ];

  return <Sidebar items={items} />;
}
