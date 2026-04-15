"use client";

import { useTranslation } from "react-i18next";
import AreaTable from "../component/AreaTable";
import AreaForm from "../component/AreaForm";

export default function AreaManagementPage() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-80px)] overflow-y-auto pr-2 pb-10">
      {/* Main List Column */}
      <div className="lg:col-span-3 h-full">
        <AreaTable />
      </div>
    </div>
  );
}
