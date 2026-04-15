"use client";

import React, { use } from "react";
import PersonalSidebar from "../component/sidebar";
import { getPersonalContent } from "../../../route/routing";

export default function PersonalPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const resolvedSearchParams = use(searchParams);
  return (
    <div className="flex bg-(--color-bg) min-h-screen">
      <PersonalSidebar />
      <div className="flex-1 p-6 overflow-y-auto print:p-0">
        {getPersonalContent(resolvedSearchParams.tab)}
      </div>
    </div>
  );
}
