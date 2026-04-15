export type ScenarioStatus = "active" | "draft" | "archived";
export type ScenarioType = "flood" | "storm" | "fire" | "earthquake";
export type Priority = "High" | "Medium" | "Low";

export interface ScenarioAction {
  id: number;
  step: number;
  description: string;
  priority: Priority;
}

export interface Scenario {
  id: number;
  name: string;
  type: ScenarioType;
  status: ScenarioStatus;
  description: string;
  steps: number;
  lastUpdate: string;
  author: string;
  usageCount: number;
  checklist: ScenarioAction[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    name: "Kịch bản ngập trên 0.5m",
    type: "flood",
    status: "active",
    description: "Kích hoạt trạm bơm, phong tỏa khu vực trọng yếu",
    steps: 3,
    lastUpdate: "2024-03-15T08:00:00Z",
    author: "Nguyễn Văn A",
    usageCount: 12,
    checklist: [
        { id: 1, step: 1, description: "Thông báo người dân di chuyển", priority: "High" },
        { id: 2, step: 2, description: "Kích hoạt trạm bơm dự phòng", priority: "High" },
        { id: 3, step: 3, description: "Cử đội phản ứng nhanh hỗ trợ", priority: "Medium" },
    ]
  },
  {
    id: 2,
    name: "Cảnh báo bão cấp 10",
    type: "storm",
    status: "active",
    description: "Gia cố công trình, sơ tán dân cư ven biển",
    steps: 3,
    lastUpdate: "2024-03-20T14:30:00Z",
    author: "Trần Thị B",
    usageCount: 5,
    checklist: [
        { id: 1, step: 1, description: "Kêu gọi tàu thuyền về nơi tránh trú", priority: "High" },
        { id: 2, step: 2, description: "Chằng chống nhà cửa, công trình", priority: "Medium" },
        { id: 3, step: 3, description: "Sơ tán dân cư vùng nguy hiểm", priority: "High" },
    ]
  },
  {
    id: 3,
    name: "Ứng phó hỏa hoạn nhà cao tầng",
    type: "fire",
    status: "active",
    description: "Huy động xe thang, ngắt điện khu vực",
    steps: 4,
    lastUpdate: "2024-03-21T09:15:00Z",
    author: "Lê Văn C",
    usageCount: 3,
    checklist: [
        { id: 1, step: 1, description: "Xác định vị trí cháy và số người kẹt", priority: "High" },
        { id: 2, step: 2, description: "Ngắt điện và hệ thống gas", priority: "High" },
        { id: 3, step: 3, description: "Triển khai xe thang cứu hộ", priority: "High" },
        { id: 4, step: 4, description: "Sơ cấp cứu người bị nạn", priority: "Medium" },
    ]
  },
  {
    id: 4,
    name: "Kế hoạch sơ tán do động đất",
    type: "earthquake",
    status: "draft",
    description: "Hướng dẫn trú ẩn, kiểm tra kết cấu hạ tầng",
    steps: 2,
    lastUpdate: "2024-03-22T11:00:00Z",
    author: "Phạm Văn D",
    usageCount: 0,
    checklist: [
        { id: 1, step: 1, description: "Hướng dẫn người dân tìm chỗ ẩn nấp an toàn", priority: "High" },
        { id: 2, step: 2, description: "Kiểm tra hư hại sau chấn động", priority: "Medium" },
    ]
  },
  {
    id: 5,
    name: "Triều cường dâng cao > 1.6m",
    type: "flood",
    status: "active",
    description: "Vận hành cống ngăn triều, cảnh báo vùng thấp",
    steps: 3,
    lastUpdate: "2024-03-23T16:45:00Z",
    author: "Nguyễn Văn A",
    usageCount: 8,
    checklist: [
        { id: 1, step: 1, description: "Đóng các cống ngăn triều", priority: "High" },
        { id: 2, step: 2, description: "Bố trí rào chắn khu vực ngập nặng", priority: "Medium" },
        { id: 3, step: 3, description: "Hỗ trợ di dời tài sản cho dân", priority: "Low" },
    ]
  },
  {
    id: 6,
    name: "Cứu hộ sạt lở bờ sông",
    type: "storm",
    status: "active",
    description: "Di dời khẩn cấp các hộ dân ven sông",
    steps: 3,
    lastUpdate: "2024-03-24T07:20:00Z",
    author: "Trần Thị B",
    usageCount: 2,
    checklist: [
        { id: 1, step: 1, description: "Khoanh vùng nguy hiểm sạt lở", priority: "High" },
        { id: 2, step: 2, description: "Di dời dân cư đến nơi an toàn", priority: "High" },
        { id: 3, step: 3, description: "Gia cố tạm thời bờ sông", priority: "Medium" },
    ]
  },
  {
    id: 7,
    name: "Phòng chống cháy rừng mùa khô",
    type: "fire",
    status: "active",
    description: "Thiết lập đường băng cản lửa, trực ban 24/7",
    steps: 3,
    lastUpdate: "2024-03-24T13:10:00Z",
    author: "Lê Văn C",
    usageCount: 15,
    checklist: [
        { id: 1, step: 1, description: "Tăng cường tuần tra các điểm nóng", priority: "Medium" },
        { id: 2, step: 2, description: "Chuẩn bị nguồn nước dự phòng", priority: "High" },
        { id: 3, step: 3, description: "Phát quang đường băng cản lửa", priority: "High" },
    ]
  },
  {
    id: 8,
    name: "Xử lý sự cố tràn dầu trên sông",
    type: "storm",
    status: "archived",
    description: "Quây phao ngăn dầu, thu gom xử lý",
    steps: 3,
    lastUpdate: "2024-02-10T10:00:00Z",
    author: "Phạm Văn D",
    usageCount: 1,
    checklist: [
        { id: 1, step: 1, description: "Triển khai phao quây ngăn dầu loang", priority: "High" },
        { id: 2, step: 2, description: "Sử dụng vật liệu thấm hút dầu", priority: "High" },
        { id: 3, step: 3, description: "Xử lý lượng dầu thu gom được", priority: "Medium" },
    ]
  },
  {
    id: 9,
    name: "Ứng phó rò rỉ khí gas công nghiệp",
    type: "fire",
    status: "active",
    description: "Sơ tán công nhân, phun sương làm mát",
    steps: 4,
    lastUpdate: "2024-03-25T08:30:00Z",
    author: "Nguyễn Văn A",
    usageCount: 0,
    checklist: [
        { id: 1, step: 1, description: "Kích hoạt báo động sơ tán", priority: "High" },
        { id: 2, step: 2, description: "Khoá van gas tổng", priority: "High" },
        { id: 3, step: 3, description: "Phun nước làm mát bồn chứa", priority: "High" },
        { id: 4, step: 4, description: "Kiểm tra nồng độ khí độc", priority: "Medium" },
    ]
  },
  {
    id: 10,
    name: "Kịch bản ngập cục bộ do mưa lớn",
    type: "flood",
    status: "active",
    description: "Khơi thông dòng chảy, hỗ trợ giao thông",
    steps: 3,
    lastUpdate: "2024-03-25T14:00:00Z",
    author: "Trần Thị B",
    usageCount: 20,
    checklist: [
        { id: 1, step: 1, description: "Vệ sinh miệng cống thoát nước", priority: "Medium" },
        { id: 2, step: 2, description: "Bố trí nhân sự hướng dẫn giao thông", priority: "High" },
        { id: 3, step: 3, description: "Vận hành các máy bơm di động", priority: "High" },
    ]
  },
  {
    id: 11,
    name: "Diễn tập cứu hộ lốc xoáy",
    type: "storm",
    status: "draft",
    description: "Kịch bản thực tập cứu hộ cứu nạn",
    steps: 2,
    lastUpdate: "2024-03-25T15:30:00Z",
    author: "Lê Văn C",
    usageCount: 0,
    checklist: [
        { id: 1, step: 1, description: "Chuẩn bị trang thiết bị cứu hộ", priority: "Medium" },
        { id: 2, step: 2, description: "Thực hiện tìm kiếm người bị nạn", priority: "High" },
    ]
  },
];
