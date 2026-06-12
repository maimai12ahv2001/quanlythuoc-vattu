import { useState } from "react";
import { AlertTriangle, Package, TrendingDown, Clock, ArrowRight, PhoneCall, Banknote, Warehouse } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const warehouses = [
  { id: "all", label: "Tất cả kho", shortLabel: "Tất cả" },
  { id: "ke_a", label: "Kệ A", shortLabel: "Kệ A" },
  { id: "tu_b", label: "Tủ B", shortLabel: "Tủ B" },
  { id: "ke_c", label: "Kệ C", shortLabel: "Kệ C" },
  { id: "ke_d", label: "Kệ D", shortLabel: "Kệ D" },
  { id: "kho_lanh", label: "Kho lạnh", shortLabel: "Kho lạnh" },
];

const warehouseStats: Record<string, { thuoc: string; hetHan: string; canHan: string; sapHet: string; giaTriTon: string; nhap: number; xuat: number }> = {
  all:      { thuoc: "248", hetHan: "7",  canHan: "23", sapHet: "18", giaTriTon: "₫1,24 tỷ", nhap: 580, xuat: 530 },
  ke_a:     { thuoc: "84",  hetHan: "2",  canHan: "8",  sapHet: "6",  giaTriTon: "₫380 tr",  nhap: 210, xuat: 195 },
  tu_b:     { thuoc: "62",  hetHan: "3",  canHan: "9",  sapHet: "5",  giaTriTon: "₫510 tr",  nhap: 145, xuat: 132 },
  ke_c:     { thuoc: "45",  hetHan: "1",  canHan: "4",  sapHet: "4",  giaTriTon: "₫185 tr",  nhap: 98,  xuat: 88  },
  ke_d:     { thuoc: "38",  hetHan: "0",  canHan: "2",  sapHet: "2",  giaTriTon: "₫95 tr",   nhap: 75,  xuat: 70  },
  kho_lanh: { thuoc: "19",  hetHan: "1",  canHan: "0",  sapHet: "1",  giaTriTon: "₫70 tr",   nhap: 52,  xuat: 45  },
};

const baseChartData = [
  { month: "T1", nhap: 420, xuat: 380 },
  { month: "T2", nhap: 380, xuat: 350 },
  { month: "T3", nhap: 510, xuat: 460 },
  { month: "T4", nhap: 290, xuat: 310 },
  { month: "T5", nhap: 640, xuat: 590 },
  { month: "T6", nhap: 520, xuat: 480 },
  { month: "T7", nhap: 470, xuat: 430 },
  { month: "T8", nhap: 610, xuat: 560 },
  { month: "T9", nhap: 530, xuat: 495 },
  { month: "T10", nhap: 480, xuat: 450 },
  { month: "T11", nhap: 720, xuat: 670 },
  { month: "T12", nhap: 580, xuat: 530 },
];

const warehouseChartScales: Record<string, number> = {
  all: 1, ke_a: 0.36, tu_b: 0.27, ke_c: 0.17, ke_d: 0.14, kho_lanh: 0.09,
};

const allUrgentMeds = [
  { id: "TH001", name: "Amoxicillin 500mg", category: "Kháng sinh", stock: 0, status: "het_hang", expiry: "15/03/2025", location: "ke_a" },
  { id: "TH002", name: "Paracetamol 650mg", category: "Giảm đau", stock: 8, status: "sap_het", expiry: "20/06/2025", location: "ke_a" },
  { id: "TH003", name: "Omeprazole 20mg", category: "Dạ dày", stock: 0, status: "het_han", expiry: "01/01/2025", location: "tu_b" },
  { id: "TH004", name: "Metformin 500mg", category: "Tiểu đường", stock: 12, status: "can_han", expiry: "10/05/2025", location: "ke_c" },
  { id: "TH005", name: "Atorvastatin 10mg", category: "Tim mạch", stock: 5, status: "sap_het", expiry: "30/08/2025", location: "tu_b" },
  { id: "TH006", name: "Amlodipine 5mg", category: "Tim mạch", stock: 0, status: "het_hang", expiry: "15/09/2025", location: "tu_b" },
];

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  het_hang: { label: "Hết hàng", bg: "bg-red-100", text: "text-red-700" },
  het_han: { label: "Hết hạn", bg: "bg-red-100", text: "text-red-700" },
  sap_het: { label: "Sắp hết", bg: "bg-orange-100", text: "text-orange-700" },
  can_han: { label: "Cận hạn", bg: "bg-orange-100", text: "text-orange-700" },
};

export function Dashboard() {
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");

  const stats = warehouseStats[selectedWarehouse];
  const scale = warehouseChartScales[selectedWarehouse];
  const chartData = baseChartData.map((d) => ({
    ...d,
    nhap: Math.round(d.nhap * scale),
    xuat: Math.round(d.xuat * scale),
  }));
  const urgentMeds = selectedWarehouse === "all"
    ? allUrgentMeds
    : allUrgentMeds.filter((m) => m.location === selectedWarehouse);

  const widgets = [
    { label: "Tổng loại thuốc", value: stats.thuoc, sub: "đang quản lý", icon: Package, color: "text-primary", bg: "bg-blue-50" },
    { label: "Đã hết hạn", value: stats.hetHan, sub: "cần tiêu hủy ngay", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", urgent: true },
    { label: "Cận hạn", value: stats.canHan, sub: "dưới 3 tháng", icon: Clock, color: "text-orange-600", bg: "bg-orange-50", urgent: true },
    { label: "Sắp hết hàng", value: stats.sapHet, sub: "dưới mức tối thiểu", icon: TrendingDown, color: "text-orange-500", bg: "bg-amber-50", urgent: true },
    { label: "Giá trị tồn kho", value: stats.giaTriTon, sub: "cập nhật hôm nay", icon: Banknote, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const warehouseName = warehouses.find((w) => w.id === selectedWarehouse)?.label ?? "";

  return (
    <div className="space-y-5">
      {/* Warehouse filter */}
      <div className="bg-card border border-border rounded-xl px-5 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            <Warehouse size={16} />
            <span className="text-sm" style={{ fontWeight: 500 }}>Lọc theo kho:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {warehouses.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWarehouse(w.id)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedWarehouse === w.id
                    ? "bg-primary text-white"
                    : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
          {selectedWarehouse !== "all" && (
            <span className="ml-auto text-xs bg-secondary text-primary px-3 py-1 rounded-full" style={{ fontWeight: 500 }}>
              Đang xem: {warehouseName}
            </span>
          )}
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {widgets.map((w) => (
          <div
            key={w.label}
            className={`bg-card rounded-xl border ${w.urgent ? "border-orange-200" : "border-border"} p-5 flex items-start gap-4`}
          >
            <div className={`${w.bg} p-3 rounded-lg`}>
              <w.icon size={22} className={w.color} />
            </div>
            <div>
              <p className="text-2xl leading-none mb-1 text-foreground" style={{ fontWeight: 700 }}>
                {w.value}
              </p>
              <p className="text-sm text-muted-foreground leading-tight">{w.label}</p>
              <p className={`text-xs mt-0.5 ${w.urgent ? "text-orange-600" : "text-muted-foreground"}`}>
                {w.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="mb-4 text-foreground">
            Xu hướng Xuất / Nhập theo tháng
            {selectedWarehouse !== "all" && (
              <span className="ml-2 text-sm text-muted-foreground" style={{ fontWeight: 400 }}>— {warehouseName}</span>
            )}
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
                formatter={(val: number, name: string) => [
                  `${val} đơn vị`,
                  name === "nhap" ? "Nhập kho" : "Xuất kho",
                ]}
              />
              <Legend formatter={(val) => (val === "nhap" ? "Nhập kho" : "Xuất kho")} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="nhap" fill="#0a6e8a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="xuat" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-4">
          <h3 className="text-foreground">
            Tóm tắt tháng này
            {selectedWarehouse !== "all" && (
              <span className="block text-xs text-muted-foreground mt-0.5" style={{ fontWeight: 400 }}>{warehouseName}</span>
            )}
          </h3>
          {[
            { label: "Tổng nhập kho", value: `${stats.nhap} đơn vị`, color: "text-primary" },
            { label: "Tổng xuất kho", value: `${stats.xuat} đơn vị`, color: "text-emerald-600" },
            { label: "Tồn cuối kỳ", value: `${(stats.nhap * 7 + stats.xuat).toLocaleString("vi-VN")} đơn vị`, color: "text-foreground" },
            { label: "Giá trị tồn kho", value: stats.giaTriTon, color: "text-foreground" },
            { label: "Thuốc mới nhập", value: `${Math.round(parseInt(stats.thuoc) * 0.05)} loại`, color: "text-foreground" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <span className={`text-sm ${s.color}`} style={{ fontWeight: 600 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-foreground">Danh sách xử lý khẩn cấp</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedWarehouse === "all" ? "Tất cả các kho" : warehouseName} — Top thuốc cần xử lý ngay
            </p>
          </div>
          <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
            {urgentMeds.length} mục
          </span>
        </div>
        {urgentMeds.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted-foreground text-sm">
            Không có mục khẩn cấp cho kho này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  {["Mã thuốc", "Tên thuốc", "Danh mục", "Tồn kho", "Hạn dùng", "Trạng thái", "Hành động"].map((h) => (
                    <th key={h} className={`text-left px-4 py-3 text-muted-foreground`} style={{ fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {urgentMeds.map((med, i) => {
                  const cfg = statusConfig[med.status];
                  return (
                    <tr key={med.id} className={`border-t border-border hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{med.id}</td>
                      <td className="px-4 py-3 text-foreground" style={{ fontWeight: 500 }}>{med.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{med.category}</td>
                      <td className="px-4 py-3">
                        <span className={med.stock === 0 ? "text-red-600" : "text-orange-600"} style={{ fontWeight: 600 }}>
                          {med.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{med.expiry}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`} style={{ fontWeight: 600 }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                            Xử lý <ArrowRight size={12} />
                          </button>
                          <button className="flex items-center gap-1 text-xs border border-border text-muted-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                            <PhoneCall size={12} /> NCC
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
