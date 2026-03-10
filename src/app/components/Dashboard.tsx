import { Link } from "react-router";
import { Clock, AlertTriangle, FileCheck, Info, Search, Filter } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { th } from "date-fns/locale";
import { mockDocuments } from "../data/mockData";
import { getUrgencyColor, getUrgencyLabel, getStatusColor, getStatusLabel, cn } from "../utils";
import { useState } from "react";

export function Dashboard() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const pending = mockDocuments.filter(d => d.status === "PENDING").length;
  
  const today = new Date();
  const expiringSoon = mockDocuments.filter(d => {
    if (d.status !== "PENDING") return false;
    const daysLeft = differenceInDays(new Date(d.deadline), today);
    return daysLeft <= 2 && daysLeft >= 0;
  }).length;
  
  const urgent = mockDocuments.filter(d => d.urgency === "URGENT" || d.urgency === "VERY_URGENT").length;
  const approved = mockDocuments.filter(d => d.status === "APPROVED").length;

  const filteredDocs = mockDocuments.filter(d => {
    if (filter !== "ALL" && d.status !== filter) return false;
    if (search && !d.title.includes(search) && !d.docNo.includes(search) && !d.sender.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">ภาพรวมแดชบอร์ด</h2>
          <p className="text-slate-500 mt-1.5 text-sm md:text-base">สรุปจำนวนเอกสารที่รอการตรวจสอบและอนุมัติประจำวัน</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-sm flex items-center justify-center gap-2">
            <Filter size={16} /> กรองข้อมูล
          </button>
          <button className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2">
            <span>+</span> ร่างเอกสารใหม่
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <SummaryCard 
          title="รออนุมัติทั้งหมด" 
          value={pending} 
          icon={Clock} 
          colorClass="bg-blue-50 text-blue-600" 
        />
        <SummaryCard 
          title="ใกล้ครบกำหนด" 
          value={expiringSoon} 
          icon={Info} 
          colorClass="bg-amber-50 text-amber-600" 
          highlight 
        />
        <SummaryCard 
          title="เอกสารด่วน/ด่วนมาก" 
          value={urgent} 
          icon={AlertTriangle} 
          colorClass="bg-rose-50 text-rose-600" 
        />
        <SummaryCard 
          title="อนุมัติแล้ว" 
          value={approved} 
          icon={FileCheck} 
          colorClass="bg-emerald-50 text-emerald-600" 
        />
      </div>

      {/* Document List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">รายการเอกสารล่าสุด</h3>
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">{filteredDocs.length} รายการ</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="ค้นหาเอกสาร..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
            </div>
            
            <select 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">สถานะทั้งหมด</option>
              <option value="PENDING">รออนุมัติ</option>
              <option value="APPROVED">อนุมัติแล้ว</option>
              <option value="REJECTED">ปฏิเสธ</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-6 py-4">ข้อมูลเอกสาร</th>
                <th className="px-6 py-4">ผู้ส่ง/แผนก</th>
                <th className="px-6 py-4">ระดับความด่วน</th>
                <th className="px-6 py-4">สถานะ/กำหนดเวลา</th>
                <th className="px-6 py-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredDocs.map((doc) => {
                const daysLeft = differenceInDays(new Date(doc.deadline), new Date());
                const isLate = daysLeft < 0;
                
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "mt-1 w-2 h-2 rounded-full flex-shrink-0",
                          doc.status === "PENDING" ? "bg-amber-400 animate-pulse" : "bg-transparent"
                        )} />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 mb-0.5 line-clamp-1 group-hover:text-blue-600 transition-colors">{doc.title}</p>
                          <p className="text-xs text-slate-500 font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded">{doc.docNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-800 font-medium">{doc.sender}</p>
                      <p className="text-xs text-slate-500">{doc.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border",
                        getUrgencyColor(doc.urgency)
                      )}>
                        {getUrgencyLabel(doc.urgency)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide",
                          getStatusColor(doc.status)
                        )}>
                          {getStatusLabel(doc.status)}
                        </span>
                        
                        {doc.status === "PENDING" && (
                          <div className={cn(
                            "flex items-center gap-1.5 text-xs font-medium",
                            isLate ? "text-rose-600" : daysLeft <= 2 ? "text-amber-600" : "text-slate-500"
                          )}>
                            <Clock size={12} />
                            {isLate ? "เลยกำหนด" : `เหลือ ${daysLeft} วัน`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right align-middle">
                      <Link 
                        to={`/document/${doc.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm group-hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        ดูรายละเอียด
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    ไม่พบเอกสารที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, colorClass, highlight = false }: { title: string, value: number, icon: any, colorClass: string, highlight?: boolean }) {
  return (
    <div className={cn(
      "bg-white p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group",
      highlight ? "border-amber-200 shadow-sm shadow-amber-100/50" : "border-slate-200 shadow-sm hover:shadow-md hover:border-blue-100"
    )}>
      {/* Decorative background circle */}
      <div className={cn(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150",
        colorClass.split(' ')[0]
      )} />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn("p-3 rounded-xl", colorClass)}>
          <Icon size={24} className="stroke-[2.5]" />
        </div>
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h4>
            <span className="text-sm font-medium text-slate-500">รายการ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
