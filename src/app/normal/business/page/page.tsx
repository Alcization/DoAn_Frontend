"use client";

import React, { use } from "react";
import BusinessSidebar from "../component/sidebar";
import { getBusinessContent } from "../../../route/routing";

export default function BusinessPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const resolvedSearchParams = use(searchParams);
  return (
    <div className="flex bg-(--color-bg) min-h-screen">
      <BusinessSidebar />
      <div className="flex-1 p-6 overflow-y-auto print:p-0">
        {getBusinessContent(resolvedSearchParams.tab)}
      </div>
    </div>
  );
}
