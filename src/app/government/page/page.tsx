"use client";

import React, { use } from "react";
import GovernmentSidebar from "../component/sidebar";
import { getGovernmentContent } from "../../route/routing";

export default function GovernmentPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const resolvedSearchParams = use(searchParams);
  return (
    <div className="flex bg-(--color-bg) min-h-screen">
      <GovernmentSidebar />
      <div className="flex-1 p-6 print:p-0">
        {getGovernmentContent(resolvedSearchParams.tab)}
      </div>
    </div>
  );
}
