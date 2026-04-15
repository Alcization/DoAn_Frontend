"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PersonalSidebar from "../component/sidebar";
import { getPersonalContent } from "../../../route/routing";

export default function PersonalPage() {
  const searchParams = useSearchParams();
  return (
    <div className="flex bg-(--color-bg) min-h-screen">
      <PersonalSidebar />
      <div className="flex-1 p-6 overflow-y-auto print:p-0">
        {getPersonalContent(searchParams.get("tab") ?? undefined)}
      </div>
    </div>
  );
}
