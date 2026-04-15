"use client";

import { useTranslation } from "react-i18next";

export default function MapHeader() {
  const { t } = useTranslation();

  return (
    <h1 className="text-[24px] sm:text-[30px] lg:text-[36px] font-bold text-[var(--color-text-primary)] m-0">
      {t("map.title")}
    </h1>
  );
}
