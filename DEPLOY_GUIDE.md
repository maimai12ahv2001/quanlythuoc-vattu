# 📌 Hướng Dẫn Deploy lên GitHub Pages

## **1️⃣ Commit & Push Code lên GitHub**

### Bước 1.1: Stage tất cả file
```bash
git add .
```

### Bước 1.2: Tạo commit
```bash
git commit -m "Initial commit: Inventory management dashboard"
```

### Bước 1.3: Thêm GitHub remote (thay URL của bạn)
```bash
git remote add origin https://github.com/your-username/your-repo-name.git
```

### Bước 1.4: Đặt branch main và push
```bash
git branch -M main
git push -u origin main
```

---

## **2️⃣ Setup GitHub Pages**

### Bước 2.1: Vào Settings Repository
- Trên GitHub, vào repository của bạn
- Click **Settings** (cog icon)

### Bước 2.2: Enable GitHub Pages
- Sidebar trái → **Pages**
- **Source**: Chọn `GitHub Actions` (hoặc `Deploy from a branch` nếu cần)
- Click **Save**

---

## **3️⃣ GitHub Actions sẽ tự động Deploy**

### Bước 3.1: Monitor Deployment
- Vào **Actions** tab trên GitHub
- Xem workflow "Deploy to GitHub Pages" chạy
- Sau ~1-2 phút, project sẽ live

### Bước 3.2: Truy cập Website
**URL sẽ là:**
```
https://your-username.github.io/your-repo-name/
```

---

## **4️⃣ Cập nhật Code sau này**

Lần sau muốn deploy thêm code, chỉ cần:
```bash
git add .
git commit -m "Update: Your changes here"
git push
```

GitHub Actions sẽ tự động rebuild & deploy! 🚀

---

## **⚠️ Troubleshooting**

### ❌ "fatal: not a git repository"
→ Chạy: `git init`

### ❌ Deployment failed trong Actions
→ Kiểm tra **Actions** tab → xem log lỗi

### ❌ Website không hiển thị
→ Chờ 2-3 phút, mở lại browser, xóa cache (Ctrl+Shift+Delete)

---

## **📱 Công cụ hỗ trợ**

- GitHub Desktop: https://desktop.github.com/
- VS Code Git Graph: Cài extension để xem git history
