import { useState } from "react";
import { Search, Plus, Minus, Filter, X } from "lucide-react";

const allMeds = [
  { id: "TH001", name: "Amoxicillin 500mg", category: "Khang_sinh", unit: "Viên", stock: 0, minStock: 50, location: "Kệ A1", price: 3500 },
  { id: "TH002", name: "Paracetamol 650mg", category: "Giam_dau", unit: "Viên", stock: 8, minStock: 100, location: "Kệ A2", price: 1200 },
  { id: "TH003", name: "Omeprazole 20mg", category: "Da_day", unit: "Viên", stock: 145, minStock: 30, location: "Tủ B1", price: 4200 },
  { id: "TH004", name: "Metformin 500mg", category: "Tieu_duong", unit: "Viên", stock: 12, minStock: 80, location: "Kệ C3", price: 2800 },
  { id: "TH005", name: "Atorvastatin 10mg", category: "Tim_mach", unit: "Viên", stock: 5, minStock: 60, location: "Tủ B2", price: 8500 },
  { id: "TH006", name: "Amlodipine 5mg", category: "Tim_mach", unit: "Viên", stock: 0, minStock: 40, location: "Tủ B2", price: 6200 },
  { id: "TH007", name: "Cetirizine 10mg", category: "Di_ung", unit: "Hộp", stock: 78, minStock: 20, location: "Kệ A3", price: 45000 },
  { id: "TH008", name: "Azithromycin 250mg", category: "Khang_sinh", unit: "Viên", stock: 220, minStock: 50, location: "Kệ A1", price: 12000 },
  { id: "TH009", name: "Ibuprofen 400mg", category: "Giam_dau", unit: "Viên", stock: 195, minStock: 80, location: "Kệ A2", price: 2500 },
  { id: "TH010", name: "Losartan 50mg", category: "Tim_mach", unit: "Viên", stock: 30, minStock: 60, location: "Tủ B2", price: 5600 },
  { id: "TH011", name: "Vitamin C 500mg", category: "Vitamin", unit: "Hộp", stock: 312, minStock: 50, location: "Kệ D1", price: 35000 },
  { id: "TH012", name: "Pantoprazole 40mg", category: "Da_day", unit: "Viên", stock: 88, minStock: 30, location: "Tủ B1", price: 9800 },
];

const categories: Record<string, string> = {
  all: "Tất cả",
  Khang_sinh: "Kháng sinh",
  Giam_dau: "Giảm đau",
  Da_day: "Dạ dày",
  Tieu_duong: "Tiểu đường",
  Tim_mach: "Tim mạch",
  Di_ung: "Dị ứng",
  Vitamin: "Vitamin",
};

type ModalType = "nhap" | "xuat" | null;

function getStatus(stock: number, minStock: number) {
  if (stock === 0) return { label: "Hết hàng", bg: "bg-red-100", text: "text-red-700" };
  if (stock < minStock * 0.3) return { label: "Sắp hết", bg: "bg-orange-100", text: "text-orange-700" };
  if (stock < minStock) return { label: "Thiếu hàng", bg: "bg-amber-100", text: "text-amber-700" };
  return { label: "Còn hàng", bg: "bg-green-100", text: "text-green-700" };
}

interface ModalProps {
  type: ModalType;
  onClose: () => void;
}

function TransactionModal({ type, onClose }: ModalProps) {
  const [form, setForm] = useState({ medId: "", quantity: "", note: "", supplier: "", date: new Date().toISOString().slice(0, 10) });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-md shadow-xl">
        <div className={`px-6 py-4 rounded-t-2xl flex items-center justify-between ${type === "nhap" ? "bg-primary" : "bg-emerald-600"}`}>
          <h3 className="text-white">{type === "nhap" ? "Nhập kho thuốc" : "Xuất kho thuốc"}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-foreground block mb-1">Tên thuốc / Mã thuốc *</label>
            <input
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Tìm và chọn thuốc..."
              value={form.medId}
              onChange={(e) => setForm({ ...form, medId: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-foreground block mb-1">Số lượng *</label>
              <input
                type="number"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1">Ngày {type === "nhap" ? "nhập" : "xuất"}</label>
              <input
                type="date"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>
          {type === "nhap" && (
            <div>
              <label className="text-sm text-foreground block mb-1">Nhà cung cấp</label>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Tên nhà cung cấp..."
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="text-sm text-foreground block mb-1">Ghi chú</label>
            <textarea
              rows={2}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Ghi chú thêm..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-border rounded-lg py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
              Hủy bỏ
            </button>
            <button
              onClick={onClose}
              className={`flex-1 rounded-lg py-2 text-sm text-white transition-opacity hover:opacity-90 ${type === "nhap" ? "bg-primary" : "bg-emerald-600"}`}
            >
              Xác nhận {type === "nhap" ? "Nhập kho" : "Xuất kho"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Inventory() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState<ModalType>(null);

  const filtered = allMeds.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || m.category === catFilter;
    const st = getStatus(m.stock, m.minStock).label;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "con_hang" && st === "Còn hàng") ||
      (statusFilter === "sap_het" && (st === "Sắp hết" || st === "Thiếu hàng")) ||
      (statusFilter === "het_hang" && st === "Hết hàng");
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 w-60"
              placeholder="Tìm mã, tên thuốc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select
              className="pl-8 pr-8 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none appearance-none cursor-pointer"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              {Object.entries(categories).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <select
            className="px-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="con_hang">Còn hàng</option>
            <option value="sap_het">Sắp hết / Thiếu hàng</option>
            <option value="het_hang">Hết hàng</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setModal("nhap")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Nhập kho
          </button>
          <button
            onClick={() => setModal("xuat")}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <Minus size={16} /> Xuất kho
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị <span className="text-foreground" style={{ fontWeight: 600 }}>{filtered.length}</span> / {allMeds.length} loại thuốc
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                {["Mã thuốc", "Tên thuốc", "Danh mục", "Đơn vị", "Tồn kho", "Tồn tối thiểu", "Vị trí kho", "Đơn giá", "Trạng thái", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground whitespace-nowrap" style={{ fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((med, i) => {
                const st = getStatus(med.stock, med.minStock);
                return (
                  <tr key={med.id} className={`border-t border-border hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{med.id}</td>
                    <td className="px-4 py-3 text-foreground" style={{ fontWeight: 500 }}>{med.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{categories[med.category]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{med.unit}</td>
                    <td className="px-4 py-3">
                      <span className={med.stock === 0 ? "text-red-600" : med.stock < med.minStock ? "text-orange-600" : "text-green-600"} style={{ fontWeight: 600 }}>
                        {med.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{med.minStock}</td>
                    <td className="px-4 py-3 text-muted-foreground">{med.location}</td>
                    <td className="px-4 py-3 text-muted-foreground">{med.price.toLocaleString("vi-VN")}đ</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${st.bg} ${st.text}`} style={{ fontWeight: 600 }}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-primary hover:underline">Chi tiết</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <TransactionModal type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
