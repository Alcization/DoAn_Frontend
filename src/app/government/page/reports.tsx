"use client";

import AdminNav from "../component/AdminNav";
import ReportConfigForm from "../component/ReportConfigForm";
import ReportHistoryList from "../component/ReportHistoryList";
import { useReportManagement } from "../hooks/useReportManagement";

/**
 * [FACADE PATTERN] - AdminReports: Orchestrates report management by delegating to a hook.
 */
export default function AdminReports() {
  const {
      config,
      history,
      setFrequency,
      setDay,
      setEmail,
      toggleTopic,
      setAllTopics,
      isLoadingConfig,
      isSavingConfig,
      saveConfig,
  } = useReportManagement();

  return (
    <div className="flex flex-col gap-4 sm:gap-6 pb-10">
      <AdminNav />

      <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
        <ReportConfigForm 
            config={config}
            setFrequency={setFrequency}
            setDay={setDay}
            setEmail={setEmail}
            toggleTopic={toggleTopic}
            setAllTopics={setAllTopics}
            isLoadingConfig={isLoadingConfig}
            isSavingConfig={isSavingConfig}
            saveConfig={saveConfig}
        />
        <ReportHistoryList history={history} />
      </section>
    </div>
  );
}
