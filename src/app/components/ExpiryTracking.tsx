import { useState } from "react";
import { Search, AlertTriangle, Clock, CheckCircle, Filter } from "lucide-react";

interface Batch {
  id: string;
  name: string;
  lotNumber: string;
  mfgDate: string;
  expDate: string;
  quantity: number;
  location: string;
}

const batches: Batch[] = [
  { id: "TH001", name: "Amoxicillin 500mg", lotNumber: "AMX-2024-001", mfgDate: "01/03/2024", expDate: "01/03/2025", quantity: 200, location: "Kệ A1" },
  { id: "TH002", name: "Paracetamol 650mg", lotNumber: "PCT-2024-012", mfgDate: "20/03/2024", expDate: "20/05/2025", quantity: 8, location: "Kệ A2" },
  { id: "TH003", name: "Omeprazole 20mg", lotNumber: "OMP-2023-008", mfgDate: "01/01/2023", expDate: "01/01/2025", quantity: 45, location: "Tủ B1" },
  { id: "TH003B", name: "Omeprazole 20mg", lotNumber: "OMP-2024-002", mfgDate: "15/02/2024", expDate: "15/08/2026", quantity: 100, location: "Tủ B1" },
  { id: "TH004", name: "Metformin 500mg", lotNumber: "MTF-2024-005", mfgDate: "10/02/2024", expDate: "10/05/2025", quantity: 12, location: "Kệ C3" },
  { id: "TH005", name: "Atorvastatin 10mg", lotNumber: "ATV-2024-003", mfgDate: "30/05/2024", expDate: "30/08/2025", quantity: 5, location: "Tủ B2" },
  { id: "TH006", name: "Amlodipine 5mg", lotNumber: "AML-2024-007", mfgDate: "15/06/2024", expDate: "15/09/2025", quantity: 60, location: "Tủ B2" },
  { id: "TH007", name: "Cetirizine 10mg", lotNumber: "CTZ-2024-011", mfgDate: "01/08/2024", expDate: "01/02/2026", quantity: 78, location: "Kệ A3" },
  { id: "TH008", name: "Azithromycin 250mg", lotNumber: "AZM-2024-004", mfgDate: "10/04/2024", expDate: "10/10/2026", quantity: 220, location: "Kệ A1" },
  { id: "TH009", name: "Ibuprofen 400mg", lotNumber: "IBP-2024-009", mfgDate: "05/05/2024", expDate: "05/11/2026", quantity: 195, location: "Kệ A2" },
  { id: "TH010", name: "Losartan 50mg", lotNumber: "LST-2024-006", mfgDate: "20/06/2024", expDate: "20/06/2025", quantity: 30, location: "Tủ B2" },
  { id: "TH011", name: "Vitamin C 500mg", lotNumber: "VTC-2024-010", mfgDate: "01/07/2024", expDate: "01/07/2027", quantity: 312, location: "Kệ D1" },
];

function daysUntilExpiry(expDate: string): number {
  const [d, m, y] = expDate.split("/").map(Number);
  const exp = new Date(y, m - 1, d);
  const today = new Date(2025, 5, 10); // June 10 2025 (simulated)
  return Math.floor((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getExpiryStatus(days: number) {
  if (days < 0) return { label: "Đã hết hạn", bg: "bg-red-100", text: "text-red-700", icon: AlertTriangle, iconColor: "text-red-500", priority: 0 };
  if (days <= 90) return { label: "Cận hạn < 3 tháng", bg: "bg-orange-100", text: "text-orange-700", icon: Clock, iconColor: "text-orange-500", priority: 1 };
  if (days <= 180) return { label: "Sắp đến hạn", bg: "bg-amber-100", text: "text-amber-700", icon: Clock, iconColor: "text-amber-500", priority: 2 };
  return { label: "Còn hạn", bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, iconColor: "text-green-500", priority: 3 };
}

const filterOpts = [
  { value: "all", label: "Tất cả" },
  { value: "expired", label: "Đã hết hạn" },
  { value: "near", label: "Cận hạn < 3 tháng" },
  { value: "soon", label: "Sắp đến hạn" },
  { value: "ok", label: "Còn hạn" },
];

export function ExpiryTracking() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const enriched = batches
    .map((b) => ({ ...b, days: daysUntilExpiry(b.expDate), status: getExpiryStatus(daysUntilExpiry(b.expDate)) }))
    .sort((a, b) => a.days - b.days);

  const filtered = enriched.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.lotNumber.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "expired" && b.days < 0) ||
      (filter === "near" && b.days >= 0 && b.days <= 90) ||
      (filter === "soon" && b.days > 90 && b.days <= 180) ||
      (filter === "ok" && b.days > 180);
    return matchSearch && matchFilter;
  });

  const counts = {
    expired: enriched.filter((b) => b.days < 0).length,
    near: enriched.filter((b) => b.days >= 0 && b.days <= 90).length,
    soon: enriched.filter((b) => b.days > 90 && b.days <= 180).length,
    ok: enriched.filter((b) => b.days > 180).length,
  };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Đã hết hạn", count: counts.expired, bg: "bg-red-50", border: "border-red-200", text: "text-red-700", sub: "Cần tiêu hủy ngay" },
          { label: "Cận hạn < 3T", count: counts.near, bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", sub: "Cần xử lý ưu tiên" },
          { label: "Sắp đến hạn", count: counts.soon, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", sub: "Theo dõi chặt" },
          { label: "Còn hạn", count: counts.ok, bg: "bg-green-50", border: "border-green-200", text: "text-green-700", sub: "Tình trạng tốt" },
        ].map((c) => (
          <div key={c.label} className={`${c.bg} border ${c.border} rounded-xl p-4`}>
            <p className={`text-3xl ${c.text} leading-none mb-1`} style={{ fontWeight: 700 }}>{c.count}</p>
            <p className={`text-sm ${c.text}`} style={{ fontWeight: 500 }}>{c.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 w-64"
            placeholder="Tìm tên thuốc, số lô..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {filterOpts.map((o) => (
            <button
              key={o.value}
              onClick={() => setFilter(o.value)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${filter === o.value ? "bg-primary text-white" : "border border-border text-muted-foreground hover:bg-muted"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-sm text-muted-foreground">
            Hiển thị <span className="text-foreground" style={{ fontWeight: 600 }}>{filtered.length}</span> lô thuốc
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                {["Tên thuốc", "Số lô", "Ngày SX", "Ngày HH", "Số ngày còn lại", "Số lượng", "Vị trí", "Trạng thái", "Hành động"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const StatusIcon = b.status.icon;
                return (
                  <tr
                    key={b.lotNumber}
                    className={`border-t border-border hover:bg-muted/30 transition-colors ${
                      b.days < 0 ? "bg-red-50/50" : b.days <= 90 ? "bg-orange-50/30" : i % 2 === 1 ? "bg-muted/10" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-foreground" style={{ fontWeight: 500 }}>{b.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.lotNumber}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.mfgDate}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.expDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon size={14} className={b.status.iconColor} />
                        <span
                          className={`font-mono ${b.days < 0 ? "text-red-600" : b.days <= 90 ? "text-orange-600" : b.days <= 180 ? "text-amber-600" : "text-green-600"}`}
                          style={{ fontWeight: 600 }}
                        >
                          {b.days < 0 ? `Quá ${Math.abs(b.days)} ngày` : `${b.days} ngày`}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.quantity}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.location}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${b.status.bg} ${b.status.text}`} style={{ fontWeight: 600 }}>
                        {b.status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {b.days < 0 ? (
                        <button className="text-xs bg-red-600 text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity">Tiêu hủy</button>
                      ) : b.days <= 90 ? (
                        <button className="text-xs bg-orange-500 text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity">Đẩy bán</button>
                      ) : (
                        <button className="text-xs border border-border text-muted-foreground px-3 py-1 rounded-lg hover:bg-muted transition-colors">Xem</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
