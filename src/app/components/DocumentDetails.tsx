import { useParams, Link, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  FileText, 
  Paperclip, 
  CheckCircle, 
  XCircle, 
  PenTool, 
  Clock,
  Download,
  User,
  Building,
  AlertTriangle
} from "lucide-react";
import { mockDocuments } from "../data/mockData";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { getUrgencyColor, getUrgencyLabel, getStatusColor, getStatusLabel, cn } from "../utils";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doc = mockDocuments.find(d => d.id === id);
  const [isSigning, setIsSigning] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <FileText size={48} className="mb-4 opacity-50 text-slate-400" />
        <p className="text-lg font-medium text-slate-600">ไม่พบเอกสาร</p>
        <Link to="/" className="text-blue-600 hover:underline mt-2 flex items-center gap-2 font-medium">
          <ArrowLeft size={16} /> กลับ��ู่หน้าหลัก
        </Link>
      </div>
    );
  }

  const handleApprove = () => {
    toast.success("อนุมัติเอกสารเรียบร้อยแล้ว");
    setTimeout(() => navigate("/"), 1500);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("กรุณาระบุสาเหตุการปฏิเสธหรือตีกลับเอกสาร");
      return;
    }
    setIsRejecting(false);
    toast.error("ปฏิเสธเอกสารแล้ว พร้อมบันทึกสาเหตุ");
    setTimeout(() => navigate("/"), 1500);
  };

  const currentUserRole = "CEO"; // Mocked user role

  const isPendingForMe = doc.status === "PENDING" && 
    doc.workflow.some(w => w.status === "PENDING" && w.role === currentUserRole);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="p-2.5 rounded-full hover:bg-slate-200/50 text-slate-600 transition-colors shadow-sm bg-white border border-slate-200"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-semibold tracking-wide border border-blue-200">
                {doc.docNo}
              </span>
              <span className={cn("text-xs px-2.5 py-0.5 rounded-md font-semibold border", getUrgencyColor(doc.urgency))}>
                {getUrgencyLabel(doc.urgency)}
              </span>
              <span className={cn("text-xs px-2.5 py-0.5 rounded-md font-semibold border border-transparent", getStatusColor(doc.status))}>
                {getStatusLabel(doc.status)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{doc.title}</h1>
          </div>
        </div>
        
        {isPendingForMe && (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsRejecting(true)}
              className="px-5 py-2.5 text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 rounded-xl font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-100 flex items-center gap-2"
            >
              <XCircle size={18} /> ปฏิเสธ
            </button>
            <button 
              onClick={() => setIsSigning(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-blue-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center gap-2 group"
            >
              <PenTool size={18} className="group-hover:rotate-12 transition-transform" /> อนุมัติและเซ็นเอกสาร
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Attachments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="text-blue-600" size={20} /> รายละเอียดเอกสาร
            </h3>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><User size={14}/> ผู้ส่ง</p>
                <p className="font-semibold text-slate-900">{doc.sender}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><Building size={14}/> แผนก</p>
                <p className="font-semibold text-slate-900">{doc.department}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><Clock size={14}/> วันที่ส่ง</p>
                <p className="font-semibold text-slate-900">{format(new Date(doc.dateSent), "dd MMM yyyy HH:mm", { locale: th })}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1.5"><AlertTriangle size={14} className="text-amber-500"/> กำหนดเวลา</p>
                <p className="font-semibold text-rose-600">{format(new Date(doc.deadline), "dd MMM yyyy", { locale: th })}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"/> คำอธิบ��ย
              </h4>
              <p className="text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm leading-relaxed text-sm">
                {doc.description}
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Paperclip className="text-blue-600" size={20} /> ไฟล์แนบ ({doc.attachments.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doc.attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm transition-all group cursor-pointer">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">{file.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{file.size}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Workflow Timeline */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 h-fit sticky top-24">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="text-blue-600" size={20} /> ลำดับการอนุมัติ
          </h3>
          <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-8 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {doc.workflow.map((step, idx) => {
              const isApproved = step.status === "APPROVED";
              const isRejected = step.status === "REJECTED";
              const isCurrent = step.status === "PENDING" && doc.workflow.findIndex(w => w.status === "PENDING") === idx;
              
              return (
                <div key={step.id} className="relative flex items-start gap-5">
                  {/* Icon */}
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white shadow-sm shrink-0 z-10 transition-colors duration-300 mt-1",
                    isApproved ? "bg-emerald-500 text-white" : 
                    isRejected ? "bg-rose-500 text-white" : 
                    isCurrent ? "bg-blue-500 text-white animate-pulse" : "bg-slate-200 text-slate-400"
                  )}>
                    {isApproved ? <CheckCircle size={14} /> : 
                     isRejected ? <XCircle size={14} /> : 
                     <Clock size={14} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm transition-all hover:bg-white hover:border-blue-100 hover:shadow-md">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{step.role}</span>
                        {step.date && <span className="text-xs text-slate-400 font-medium">{format(new Date(step.date), "dd MMM HH:mm", { locale: th })}</span>}
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{step.assignee}</p>
                      <p className={cn(
                        "text-xs font-medium mt-1.5 inline-flex w-fit px-2 py-0.5 rounded-full border",
                        isApproved ? "bg-emerald-100 text-emerald-700 border-emerald-200" : 
                        isRejected ? "bg-rose-100 text-rose-700 border-rose-200" : 
                        isCurrent ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-500 border-slate-200"
                      )}>
                        {isApproved ? "อนุมัติแล้ว" : isRejected ? "ปฏิเสธ" : isCurrent ? "กำลังรอตรวจสอบ" : "รอดำเนินการ"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {isSigning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <PenTool className="text-blue-600" size={24} /> ลงนามอิเล็กทรอนิกส์
              </h3>
              <button 
                onClick={() => setIsSigning(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex items-start gap-3 border border-blue-100">
                <Info size={18} className="mt-0.5 flex-shrink-0 text-blue-600"/>
                <p className="font-medium leading-relaxed">การลงนามนี้ถือเป็นการอนุมัติอย่างเป็นทางการและจะถูกบันทึกในระบบพร้อม Time Stamp</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 block">ลายเซ็นของคุณ (CEO)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl h-40 flex items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-blue-300 transition-colors cursor-pointer group relative overflow-hidden">
                  <span className="text-slate-400 group-hover:text-blue-500 font-medium flex flex-col items-center gap-2 transition-colors">
                    <PenTool size={28} className="opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 transition-all"/>
                    คลิกเพื่อวาด หรืออัปโหลดลายเซ็น
                  </span>
                  
                  {/* Mock Signature Line */}
                  <div className="absolute inset-x-8 bottom-8 border-b-2 border-slate-200 opacity-50"></div>
                </div>
              </div>

              <div className="space-y-3">
                 <label className="text-sm font-bold text-slate-700 block">รหัส PIN ยืนยันตัวตน</label>
                 <input 
                   type="password" 
                   placeholder="••••••" 
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center tracking-[0.5em] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                 />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button 
                onClick={() => setIsSigning(false)}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                ยกเลิก
              </button>
              <button 
                onClick={() => {
                  setIsSigning(false);
                  handleApprove();
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> ยืนยันการลงนาม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <XCircle className="text-rose-600" size={24} /> ปฏิเสธ/ตีกลับเอกสาร
              </h3>
              <button 
                onClick={() => setIsRejecting(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-rose-200 p-2 rounded-full transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-3">
                 <label className="text-sm font-bold text-slate-700 block">สาเหตุการปฏิเสธหรือแก้ไข <span className="text-rose-500">*</span></label>
                 <textarea 
                   autoFocus
                   value={rejectReason}
                   onChange={(e) => setRejectReason(e.target.value)}
                   placeholder="ระบุสาเหตุที่ต้องตีกลับ หรือสิ่งที่ต้องการให้แก้ไข..." 
                   rows={4}
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all shadow-sm resize-none"
                 />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button 
                onClick={() => setIsRejecting(false)}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleReject}
                className="flex-1 px-4 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-md shadow-rose-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 flex items-center justify-center gap-2"
              >
                <XCircle size={18} /> ยืนยันการปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Temporary Info Icon since I forgot to import it at top
function Info(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
