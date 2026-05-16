import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Incident } from "../../../../context/services/mock/government/history-incidents";

const toAscii = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

const getTypeLabel = (type: Incident["type"]) => {
  switch (type) {
    case "flood":
      return "Ngap";
    case "rain":
      return "Mua";
    case "storm":
      return "Bao";
    case "traffic":
      return "Giao thong";
    default:
      return "Khac";
  }
};

const getSeverityLabel = (severity: Incident["severity"]) => {
  switch (severity) {
    case "High":
      return "Cao";
    case "Medium":
      return "Trung binh";
    case "Low":
      return "Thap";
    default:
      return severity;
  }
};

const getStatusLabel = (status: Incident["status"]) => {
  switch (status) {
    case "Handled":
      return "Da xu ly";
    case "Pending":
      return "Dang cho";
    default:
      return status;
  }
};

const formatReportDate = (date: Date) =>
  `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

export const downloadAlertsEventsReportPdf = (incidents: Incident[]) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const generatedAt = new Date();
  const total = incidents.length;
  const handled = incidents.filter((incident) => incident.status === "Handled").length;
  const pending = incidents.filter((incident) => incident.status === "Pending").length;
  const high = incidents.filter((incident) => incident.severity === "High").length;
  const medium = incidents.filter((incident) => incident.severity === "Medium").length;
  const low = incidents.filter((incident) => incident.severity === "Low").length;

  doc.setProperties({
    title: "BAO CAO CANH BAO VA SU CO",
    subject: "Automated alert event summary",
    author: "SWTIS",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("BAO CAO CANH BAO VA SU CO", 40, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Ngay tao: ${formatReportDate(generatedAt)}`, 40, 62);
  doc.text(`Tong canh bao: ${total}`, 40, 80);
  doc.text(`Da xu ly: ${handled}    Dang cho: ${pending}`, 40, 96);
  doc.text(`Muc do: Cao (${high}), Trung binh (${medium}), Thap (${low})`, 40, 112);

  autoTable(doc, {
    startY: 128,
    head: [[ "Thoi gian", "Khu vuc", "Vi tri", "Loai", "Muc do", "Trang thai", "Mo ta"]],
    body: incidents.map((incident) => [
    //   String(incident.id),
      toAscii(incident.time),
      toAscii(incident.area),
      toAscii(incident.location),
      toAscii(getTypeLabel(incident.type)),
      toAscii(getSeverityLabel(incident.severity)),
      toAscii(getStatusLabel(incident.status)),
      toAscii(incident.description)
    //   toAscii(incident.actions.length > 0 ? incident.actions.join(", ") : "No actions recorded"),
    ]),
    theme: "grid",
    margin: { left: 40, right: 40 },
    styles: {
      font: "helvetica",
      fontSize: 7,
      cellPadding: 3,
      valign: "top",
      overflow: "linebreak",
      textColor: [40, 40, 40],
    },
    headStyles: {
      fillColor: [16, 117, 149],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 7,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
    //   0: { cellWidth: 24 },
      0: { cellWidth: 70 },
      1: { cellWidth: 60 },
      2: { cellWidth: 114 },
      3: { cellWidth: 48 },
      4: { cellWidth: 52 },
      5: { cellWidth: 52 },
      6: { cellWidth: 320 },
    //   8: { cellWidth: 150 },
    },
  });

  const totalPages = doc.getNumberOfPages();
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    doc.setPage(pageNumber);
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text(`Generated ${formatReportDate(generatedAt)}`, 40, 580);
    doc.text(`Page ${pageNumber} / ${totalPages}`, 690, 580);
    doc.setTextColor(0);
  }

  const fileName = `báo-cáo-sự-cố-${generatedAt.toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};