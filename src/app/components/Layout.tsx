import { Outlet, Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Files, 
  Clock, 
  AlertTriangle, 
  History, 
  BarChart3, 
  Bell, 
  Search,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "../utils";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "#", label: "เอกสารของฉัน", icon: Files },
  { path: "#", label: "เอกสารรออนุมัติ", icon: Clock },
  { path: "#", label: "เอกสารด่วน", icon: AlertTriangle },
  { path: "#", label: "ประวัติเอกสาร", icon: History },
  { path: "#", label: "รายงาน", icon: BarChart3 },
];

export function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
             <span className="text-white font-bold text-xs">OSD</span>
          </div>
          <span className="font-semibold text-lg text-slate-800">One-Stop Doc</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-md">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 z-40",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
            <Files className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-[15px] leading-tight tracking-tight">One-Stop</h1>
            <p className="text-xs text-slate-500 font-medium tracking-tight">Document Center</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">เมนูหลัก</div>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={18} className={cn(isActive ? "text-blue-600" : "text-slate-400")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
               <span className="text-blue-700 font-bold text-sm">ปย</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">ประยุทธ์ สุขเจริญ</p>
              <p className="text-xs text-slate-500 truncate">CEO & Founder</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Top Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 w-96 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-colors">
            <Search className="text-slate-400 w-4 h-4 mr-2" />
            <input 
              type="text" 
              placeholder="ค้นหาเอกสาร, เลขที่, หรือผู้ส่ง..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-700"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <div className="text-sm text-slate-600 font-medium">
               10 มีนาคม 2026
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
