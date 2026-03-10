import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case "VERY_URGENT":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "URGENT":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
}

export function getUrgencyLabel(urgency: string) {
  switch (urgency) {
    case "VERY_URGENT": return "ด่วนมาก";
    case "URGENT": return "ด่วน";
    default: return "ปกติ";
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "APPROVED": return "bg-emerald-100 text-emerald-800";
    case "REJECTED": return "bg-rose-100 text-rose-800";
    case "DRAFT": return "bg-slate-100 text-slate-600";
    default: return "bg-blue-100 text-blue-800";
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "APPROVED": return "อนุมัติแล้ว";
    case "REJECTED": return "ปฏิเสธ";
    case "DRAFT": return "ฉบับร่าง";
    default: return "รออนุมัติ";
  }
}
