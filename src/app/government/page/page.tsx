"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import GovernmentSidebar from "../component/sidebar";
import { getGovernmentContent } from "../../route/routing";

export default function GovernmentPage() {
  const searchParams = useSearchParams();
  return (
    <div className="flex bg-(--color-bg) min-h-screen">
      <GovernmentSidebar />
      <div className="flex-1 p-6 print:p-0">
        {getGovernmentContent(searchParams.get("tab") ?? undefined)}
      </div>
    </div>
  );
}
