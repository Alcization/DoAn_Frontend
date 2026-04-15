export type IncidentType = "rain" | "flood" | "storm" | "traffic";
export type IncidentSeverity = "High" | "Medium" | "Low";
export type IncidentStatus = "Handled" | "Pending";

export interface Incident {
  id: number;
  time: string;
  area: string;
  location: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  actions: string[];
  scenarioId?: number | null;
}

export const INCIDENTS: Incident[] = [
  {
    id: 1,
    time: "2025-11-26 08:30",
    area: "Quận 7",
    location: "Nguyễn Văn Linh - Lotte",
    type: "flood",
    severity: "High",
    status: "Handled",
    description: "Ngập sâu 0.4m, ảnh hưởng giao thông giờ cao điểm",
    actions: ["Kích hoạt trạm bơm", "Điều tiết giao thông"],
  },
  {
    id: 2,
    time: "2025-11-25 21:00",
    area: "Quận 1",
    location: "Đồng Khởi - Nguyễn Huệ",
    type: "rain",
    severity: "Medium",
    status: "Pending",
    description: "Mưa lớn kéo dài 45 phút, cảnh báo người dân hạn chế ra đường",
    actions: ["Gửi cảnh báo qua app"],
  },
  {
    id: 3,
    time: "2025-11-24 15:10",
    area: "Nhà Bè",
    location: "Đường Huỳnh Tấn Phát",
    type: "traffic",
    severity: "Medium",
    status: "Handled",
    description: "Cây gãy đổ do gió lớn, tạm thời phong tỏa một làn",
    actions: ["Đội cây xanh xử lý", "Phân luồng tạm thời"],
  },
  {
    id: 4,
    time: "2025-11-23 10:20",
    area: "Quận 4",
    location: "Cầu Ông Lãnh",
    type: "traffic",
    severity: "Low",
    status: "Handled",
    description: "Va chạm nhẹ giữa 2 xe máy, ùn tắc cục bộ",
    actions: ["CSGT điều tiết"],
  },
  {
    id: 5,
    time: "2025-11-23 09:00",
    area: "Quận 3",
    location: "Cách Mạng Tháng 8",
    type: "rain",
    severity: "Medium",
    status: "Handled",
    description: "Mưa vừa, mặt đường trơn trượt",
    actions: ["Cảnh báo an toàn"],
  },
  {
    id: 6,
    time: "2025-11-22 18:45",
    area: "Quận 10",
    location: "Đường Ba Tháng Hai",
    type: "flood",
    severity: "Medium",
    status: "Handled",
    description: "Ngập nhẹ mép đường, nước rút chậm",
    actions: ["Kiểm tra cống thoát nước"],
  },
  {
    id: 7,
    time: "2025-11-22 14:00",
    area: "Quận Tân Bình",
    location: "Cộng Hòa",
    type: "traffic",
    severity: "High",
    status: "Handled",
    description: "Xe tải hỏng giữa đường, gây kẹt xe kéo dài",
    actions: ["Xe cứu hộ di dời", "Xả trạm thu phí nếu cần"],
  },
  {
    id: 8,
    time: "2025-11-21 07:30",
    area: "Quận Bình Thạnh",
    location: "Xô Viết Nghệ Tĩnh",
    type: "traffic",
    severity: "Medium",
    status: "Handled",
    description: "Mật độ phương tiện tăng cao đầu tuần",
    actions: ["Tăng cường CSGT"],
  },
  {
    id: 9,
    time: "2025-11-20 22:15",
    area: "Thủ Đức",
    location: "Võ Văn Ngân",
    type: "rain",
    severity: "High",
    status: "Handled",
    description: "Mưa rất lớn, nguy cơ ngập lụt vùng trũng",
    actions: ["Trực chiến thoát nước"],
  },
  {
    id: 10,
    time: "2025-11-20 16:00",
    area: "Quận 5",
    location: "Hùng Vương",
    type: "storm",
    severity: "Medium",
    status: "Handled",
    description: "Gió giật mạnh, vài biển quảng cáo bị hư hỏng",
    actions: ["Gia cố vật kiến trúc"],
  },
  {
    id: 11,
    time: "2025-11-19 11:30",
    area: "Quận 1",
    location: "Hầm Thủ Thiêm",
    type: "traffic",
    severity: "Low",
    status: "Handled",
    description: "Vệ sinh hầm định kỳ, tạm đóng một làn",
    actions: ["Thông báo lộ trình thay thế"],
  },
  {
    id: 12,
    time: "2025-11-18 08:00",
    area: "Quận 7",
    location: "Cầu Phú Mỹ",
    type: "storm",
    severity: "High",
    status: "Handled",
    description: "Sương mù dày đặc, hạn chế tầm nhìn trên cầu",
    actions: ["Bật đèn cảnh báo", "Giới hạn tốc độ"],
  },
  {
    id: 13,
    time: "2025-11-17 19:20",
    area: "Huyện Củ Chi",
    location: "Quốc lộ 22",
    type: "rain",
    severity: "Low",
    status: "Handled",
    description: "Mưa phùn diện rộng",
    actions: ["Theo dõi diễn biến"],
  },
];
