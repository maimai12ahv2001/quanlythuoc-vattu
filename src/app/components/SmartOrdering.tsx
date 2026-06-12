import { useState } from "react";
import { Download, Send, CheckSquare, Square, TrendingUp, AlertCircle } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  avgMonthly: number;
  minStock: number;
  suggestedQty: number;
  reason: string;
  priority: "high" | "medium" | "low";
  selected: boolean;
}

const orderItems: OrderItem[] = [
  { id: "TH001", name: "Amoxicillin 500mg", category: "Kháng sinh", unit: "Viên", currentStock: 0, avgMonthly: 450, minStock: 50, suggestedQty: 900, reason: "Hết hàng", priority: "high", selected: true },
  { id: "TH006", name: "Amlodipine 5mg", category: "Tim mạch", unit: "Viên", currentStock: 0, avgMonthly: 120, minStock: 40, suggestedQty: 240, reason: "Hết hàng", priority: "high", selected: true },
  { id: "TH002", name: "Paracetamol 650mg", category: "Giảm đau", unit: "Viên", currentStock: 8, avgMonthly: 380, minStock: 100, suggestedQty: 760, reason: "Sắp hết hàng", priority: "high", selected: true },
  { id: "TH004", name: "Metformin 500mg", category: "Tiểu đường", unit: "Viên", currentStock: 12, avgMonthly: 200, minStock: 80, suggestedQty: 400, reason: "Dưới mức tối thiểu", priority: "high", selected: true },
  { id: "TH005", name: "Atorvastatin 10mg", category: "Tim mạch", unit: "Viên", currentStock: 5, avgMonthly: 90, minStock: 60, suggestedQty: 180, reason: "Tồn thấp", priority: "high", selected: true },
  { id: "TH010", name: "Losartan 50mg", category: "Tim mạch", unit: "Viên", currentStock: 30, avgMonthly: 150, minStock: 60, suggestedQty: 300, reason: "Dưới mức tối thiểu", priority: "medium", selected: false },
  { id: "TH007", name: "Cetirizine 10mg", category: "Dị ứng", unit: "Hộp", currentStock: 78, avgMonthly: 50, minStock: 20, suggestedQty: 100, reason: "Nhu cầu cao mùa dị ứng", priority: "medium", selected: false },
  { id: "TH011", name: "Vitamin C 500mg", category: "Vitamin", unit: "Hộp", currentStock: 312, avgMonthly: 180, minStock: 50, suggestedQty: 200, reason: "Dự phòng theo mùa", priority: "low", selected: false },
];

const priorityConfig = {
  high: { label: "Ưu tiên cao", bg: "bg-red-100", text: "text-red-700" },
  medium: { label: "Trung bình", bg: "bg-orange-100", text: "text-orange-700" },
  low: { label: "Thấp", bg: "bg-blue-100", text: "text-blue-700" },
};

function coverDays(stock: number, avg: number) {
  if (avg === 0) return "∞";
  const days = Math.floor((stock / avg) * 30);
  return `${days} ngày`;
}

export function SmartOrdering() {
  const [items, setItems] = useState(orderItems);
  const [sent, setSent] = useState(false);

  const toggle = (id: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));
  const toggleAll = () => {
    const allSelected = items.every((i) => i.selected);
    setItems((prev) => prev.map((i) => ({ ...i, selected: !allSelected })));
  };
  const allSelected = items.every((i) => i.selected);
  const selectedCount = items.filter((i) => i.selected).length;
  const selectedItems = items.filter((i) => i.selected);
  const totalSuggested = selectedItems.reduce((s, i) => s + i.suggestedQty, 0);
  const estimatedValue = selectedItems.reduce((s, i) => s + i.suggestedQty * 4200, 0);

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <TrendingUp size={20} className="text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-primary" style={{ fontWeight: 600 }}>Hệ thống tự động phân tích tồn kho</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Dựa trên lượng tiêu thụ trung bình 3 tháng gần nhất và mức tồn tối thiểu, hệ thống đã lập danh sách{" "}
            <span style={{ fontWeight: 600 }} className="text-foreground">{items.length} mặt hàng</span> cần đặt mua.
          </p>
        </div>
      </div>

      {/* Summary widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Mặt hàng đề xuất", value: items.length, sub: "cần đặt mua" },
          { label: "Đã chọn", value: selectedCount, sub: "mặt hàng" },
          { label: "Tổng số lượng", value: totalSuggested.toLocaleString("vi-VN"), sub: "đơn vị" },
          { label: "Giá trị ước tính", value: `₫${(estimatedValue / 1000000).toFixed(1)}M`, sub: "tạm tính" },
        ].map((w) => (
          <div key={w.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl text-foreground leading-none mb-1" style={{ fontWeight: 700 }}>{w.value}</p>
            <p className="text-sm text-muted-foreground">{w.label}</p>
            <p className="text-xs text-muted-foreground">{w.sub}</p>
          </div>
        ))}
      </div>

      {/* Table + actions */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-foreground">Danh sách đề xuất mua hàng</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Xuất file dự trù Excel/PDF")}
              className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
            >
              <Download size={15} /> Xuất file dự trù
            </button>
            <button
              onClick={() => setSent(true)}
              disabled={selectedCount === 0}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={15} /> Gửi yêu cầu ({selectedCount})
            </button>
          </div>
        </div>

        {sent && (
          <div className="mx-5 mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2">
            <CheckSquare size={16} className="text-green-600" />
            <p className="text-sm text-green-700">Đã gửi yêu cầu mua hàng cho <span style={{ fontWeight: 600 }}>{selectedCount} mặt hàng</span> đến quản lý.</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 w-10">
                  <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground">
                    {allSelected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                  </button>
                </th>
                {["Tên thuốc", "Danh mục", "Tồn hiện tại", "TB tháng", "Đủ dùng", "Đề xuất mua", "Lý do", "Ưu tiên"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground whitespace-nowrap" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const pc = priorityConfig[item.priority];
                return (
                  <tr
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`border-t border-border cursor-pointer transition-colors ${
                      item.selected ? "bg-blue-50/60" : i % 2 === 1 ? "bg-muted/10" : ""
                    } hover:bg-muted/30`}
                  >
                    <td className="px-4 py-3">
                      {item.selected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} className="text-muted-foreground" />}
                    </td>
                    <td className="px-4 py-3 text-foreground" style={{ fontWeight: item.selected ? 500 : 400 }}>{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3">
                      <span className={item.currentStock === 0 ? "text-red-600" : item.currentStock < item.minStock ? "text-orange-600" : "text-foreground"} style={{ fontWeight: 600 }}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.avgMonthly} {item.unit}</td>
                    <td className="px-4 py-3">
                      <span className={item.currentStock === 0 ? "text-red-600" : "text-muted-foreground"}>
                        {coverDays(item.currentStock, item.avgMonthly)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-primary" style={{ fontWeight: 700 }}>{item.suggestedQty.toLocaleString("vi-VN")} {item.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <AlertCircle size={12} className="shrink-0" />
                        {item.reason}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${pc.bg} ${pc.text}`} style={{ fontWeight: 600 }}>
                        {pc.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Đã chọn <span className="text-foreground" style={{ fontWeight: 600 }}>{selectedCount}</span> / {items.length} mặt hàng
          </p>
          <p className="text-sm text-muted-foreground">
            Tổng số lượng: <span className="text-foreground" style={{ fontWeight: 600 }}>{totalSuggested.toLocaleString("vi-VN")}</span> đơn vị —
            Giá trị ước tính: <span className="text-primary" style={{ fontWeight: 600 }}>₫{(estimatedValue / 1000000).toFixed(1)}M</span>
          </p>
        </div>
      </div>
    </div>
  );
}
