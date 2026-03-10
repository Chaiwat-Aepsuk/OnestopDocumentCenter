export type Urgency = "NORMAL" | "URGENT" | "VERY_URGENT";
export type Status = "PENDING" | "APPROVED" | "REJECTED" | "DRAFT";

export interface WorkflowStep {
  id: string;
  role: string;
  assignee: string;
  status: Status;
  date?: string;
}

export interface Document {
  id: string;
  docNo: string;
  title: string;
  sender: string;
  department: string;
  urgency: Urgency;
  dateSent: string;
  deadline: string;
  status: Status;
  workflow: WorkflowStep[];
  attachments: { name: string; size: string }[];
  description: string;
}

const today = new Date();
const addDays = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const mockDocuments: Document[] = [
  {
    id: "doc-001",
    docNo: "REQ-2024-001",
    title: "ขออนุมัติจัดซื้ออุปกรณ์ไอทีประจำไตรมาสที่ 3",
    sender: "สมชาย ใจดี",
    department: "IT",
    urgency: "NORMAL",
    dateSent: addDays(-2),
    deadline: addDays(3),
    status: "PENDING",
    workflow: [
      { id: "w1", role: "Manager", assignee: "กมลวัช พูนสวัสดิ์", status: "APPROVED", date: addDays(-1) },
      { id: "w2", role: "Director", assignee: "วิชัย รัตนกุล", status: "PENDING" },
      { id: "w3", role: "CEO", assignee: "ประยุทธ์ สุขเจริญ", status: "PENDING" }
    ],
    attachments: [
      { name: "IT_Equipment_List_Q3.pdf", size: "2.4 MB" },
      { name: "Quotation_VendorA.pdf", size: "1.1 MB" }
    ],
    description: "เอกสารขออนุมัติงบประมาณในการจัดซื้อคอมพิวเตอร์และอุปกรณ์เสริมสำหรับพนักงานใหม่จำนวน 15 อัตรา"
  },
  {
    id: "doc-002",
    docNo: "HR-2024-112",
    title: "สัญญาจ้างพนักงานใหม่ระดับบริหาร (Director of Marketing)",
    sender: "ลัดดา วงศ์สกุล",
    department: "HR",
    urgency: "VERY_URGENT",
    dateSent: addDays(0),
    deadline: addDays(1),
    status: "PENDING",
    workflow: [
      { id: "w1", role: "VP HR", assignee: "สมหญิง เจริญพร", status: "APPROVED", date: addDays(0) },
      { id: "w2", role: "CEO", assignee: "ประยุทธ์ สุขเจริญ", status: "PENDING" }
    ],
    attachments: [
      { name: "Employment_Contract.pdf", size: "3.2 MB" },
      { name: "Candidate_Resume.pdf", size: "1.5 MB" }
    ],
    description: "สัญญาจ้างงานคุณพิมดาว รัตนพงษ์ ในตำแหน่ง Director of Marketing โปรดลงนามก่อนวันที่เริ่มงาน"
  },
  {
    id: "doc-003",
    docNo: "FIN-2024-055",
    title: "รายงานสรุปงบการเงินประจำเดือนกรกฎาคม",
    sender: "ธนาธิป ศรีทอง",
    department: "Finance",
    urgency: "URGENT",
    dateSent: addDays(-1),
    deadline: addDays(2),
    status: "PENDING",
    workflow: [
      { id: "w1", role: "CFO", assignee: "สุรศักดิ์ มั่นคง", status: "APPROVED", date: addDays(0) },
      { id: "w2", role: "CEO", assignee: "ประยุทธ์ สุขเจริญ", status: "PENDING" }
    ],
    attachments: [
      { name: "Financial_Report_July.pdf", size: "5.6 MB" },
      { name: "Expense_Details.xlsx", size: "1.2 MB" }
    ],
    description: "รายงานสรุปงบประมาณรายรับ-รายจ่ายของบริษัท พร้อมการเปรียบเทียบกับเป้าหมายที่ตั้งไว้"
  },
  {
    id: "doc-004",
    docNo: "MKT-2024-089",
    title: "แผนการตลาดแคมเปญส่งท้ายปี (Year-End Sale)",
    sender: "ณัฐวุฒิ กล้าหาญ",
    department: "Marketing",
    urgency: "NORMAL",
    dateSent: addDays(-5),
    deadline: addDays(-1),
    status: "APPROVED",
    workflow: [
      { id: "w1", role: "Marketing Director", assignee: "พิมดาว รัตนพงษ์", status: "APPROVED", date: addDays(-4) },
      { id: "w2", role: "CEO", assignee: "ประยุทธ์ สุขเจริญ", status: "APPROVED", date: addDays(-2) }
    ],
    attachments: [
      { name: "Campaign_Strategy.pdf", size: "12.5 MB" }
    ],
    description: "แผนงานแคมเปญโปรโมชั่นส่งท้ายปี ประกอบด้วยงบประมาณสื่อโฆษณาและแผนการโปรโมท"
  },
  {
    id: "doc-005",
    docNo: "REQ-2024-005",
    title: "ขออนุมัติงบปรับปรุงพื้นที่ส่วนกลางสำนักงานใหญ่",
    sender: "ธีรพล สุขสันต์",
    department: "Admin",
    urgency: "URGENT",
    dateSent: addDays(-3),
    deadline: addDays(0),
    status: "REJECTED",
    workflow: [
      { id: "w1", role: "Manager", assignee: "วิลาศรินทร์ บุณยรัตน์", status: "APPROVED", date: addDays(-2) },
      { id: "w2", role: "Director", assignee: "วิชัย รัตนกุล", status: "REJECTED", date: addDays(-1) }
    ],
    attachments: [
      { name: "Renovation_Plan.pdf", size: "4.8 MB" }
    ],
    description: "แผนผังการปรับปรุงพื้นที่ Pantry และพื้นที่พักผ่อนพนักงานชั้น 5"
  }
];