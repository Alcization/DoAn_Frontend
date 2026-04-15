"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import BusinessSidebar from "../component/sidebar";
import { getBusinessContent } from "../../../route/routing";

export default function BusinessPage() {
  const searchParams = useSearchParams();
  return (
    <div className="flex bg-(--color-bg) min-h-screen">
      <BusinessSidebar />
      <div className="flex-1 p-6 overflow-y-auto print:p-0">
        {getBusinessContent(searchParams.get("tab") ?? undefined)}
      </div>
    </div>
  );
}
