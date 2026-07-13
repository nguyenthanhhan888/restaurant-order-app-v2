# Ứng dụng Quản lý Đơn hàng Nhà hàng

Đây là một ứng dụng web hiện đại, được xây dựng hoàn toàn bằng JavaScript phía client, giúp quản lý việc đặt hàng nguyên vật liệu cho nhà hàng một cách hiệu quả. Ứng dụng sử dụng Supabase làm backend, cung cấp một giải pháp mạnh mẽ, nhanh chóng và có khả năng mở rộng.

## Tính năng chính

*   **Dashboard Tổng quan:** Cung cấp cái nhìn nhanh về các chỉ số quan trọng (KPIs) như tổng đơn hàng, chi tiêu, và các hoạt động gần đây.
*   **Quản lý Nhà cung cấp:** Thêm, sửa, xóa nhà cung cấp.
*   **Quản lý Mặt hàng:** Quản lý danh sách mặt hàng chi tiết cho từng nhà cung cấp, hỗ trợ phân nhóm.
*   **Tạo Đơn hàng thông minh:** Giao diện tạo đơn hàng trực quan, cho phép chọn sản phẩm và nhập số lượng dễ dàng.
*   **Lịch sử Đơn hàng:** Lưu trữ, xem lại, tìm kiếm, và "Đặt lại" các đơn hàng cũ một cách nhanh chóng.
*   **Tìm kiếm & Sắp xếp:** Chức năng tìm kiếm và sắp xếp (A-Z, Z-A) được tích hợp trên tất cả các trang danh sách.
*   **Sao lưu Dữ liệu:** Cho phép tải về toàn bộ dữ liệu dưới dạng file CSV để lưu trữ hoặc phục hồi.
*   **An toàn Dữ liệu:** Áp dụng cơ chế "Xóa Mềm" (Soft Deletes) để ngăn ngừa mất mát dữ liệu do lỗi hoặc thao tác nhầm.
*   **Giao diện Thân thiện Di động:** Thiết kế ưu tiên cho việc sử dụng trên điện thoại.
*   **Kiến trúc Hiện đại:** Tái cấu trúc các thành phần chung (header, sidebar) để dễ dàng bảo trì và mở rộng.

## Công nghệ sử dụng

*   **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
*   **Backend:** [Supabase](https://supabase.com/) (PostgreSQL Database)
*   **Thư viện:** [Chart.js](https://www.chartjs.org/) (để vẽ biểu đồ trên Dashboard)

## Cấu trúc Dự án

```
restaurant-order-app/
├── assets/
│   ├── css/
│   │   └── style.css         # File CSS chính
│   └── js/
│       ├── main.js           # Logic chính, khởi tạo app
│       ├── pages/            # Chứa các file JS cho từng trang
│       └── services/         # Chứa các module dịch vụ (storage, loading...)
├── pages/
│   ├── shared-header.html    # Template cho header
│   ├── shared-sidebar.html   # Template cho sidebar
│   ├── order.html
│   ├── products.html
│   ├── settings.html
│   ├── suppliers.html
│   └── summary.html
└── index.html                # Trang chủ (Dashboard)
```

## Hướng dẫn Cài đặt và Chạy dự án

Để chạy dự án này trên máy của bạn, hãy làm theo các bước sau:

### Bước 1: Tải mã nguồn

Tải hoặc clone repository này về máy tính của bạn.

### Bước 2: Thiết lập Cơ sở dữ liệu trên Supabase

1.  Truy cập [Supabase.com](https://supabase.com/) và tạo một dự án mới.
2.  Trong dự án của bạn, vào mục **SQL Editor**.
3.  Chạy đoạn mã SQL dưới đây để tạo tất cả các bảng cần thiết.

<details>
  <summary><strong>Bấm để xem mã SQL tạo bảng</strong></summary>

```sql
-- 1. Bảng Nhà cung cấp (suppliers)
CREATE TABLE public.suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- 2. Bảng Nhóm hàng (groups)
CREATE TABLE public.groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  supplier_id TEXT NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  UNIQUE(supplier_id, name)
);

-- 3. Bảng Mặt hàng (items)
CREATE TABLE public.items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  supplier_id TEXT NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES public.groups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- 4. Bảng Đơn hàng (orders)
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  supplier_id TEXT NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  note TEXT,
  status TEXT DEFAULT 'completed'::text,
  deleted_at TIMESTAMPTZ
);

-- 5. Bảng Chi tiết đơn hàng (order_items)
CREATE TABLE public.order_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_id TEXT REFERENCES public.items(id) ON DELETE SET NULL,
  quantity NUMERIC NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```
</details>

4.  Tiếp tục chạy đoạn mã SQL dưới đây để thiết lập các chính sách bảo mật (Row Level Security), cho phép ứng dụng có thể đọc và ghi dữ liệu.

<details>
  <summary><strong>Bấm để xem mã SQL tạo chính sách (Policies)</strong></summary>

```sql
-- Chính sách cho bảng "suppliers"
CREATE POLICY "Enable read access for non-deleted rows" ON public.suppliers FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Enable insert for all users" ON public.suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.suppliers FOR UPDATE USING (true);

-- Chính sách cho bảng "groups"
CREATE POLICY "Enable read access for non-deleted rows" ON public.groups FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Enable insert for all users" ON public.groups FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.groups FOR UPDATE USING (true);

-- Chính sách cho bảng "items"
CREATE POLICY "Enable read access for non-deleted rows" ON public.items FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Enable insert for all users" ON public.items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.items FOR UPDATE USING (true);

-- Chính sách cho bảng "orders"
CREATE POLICY "Enable read access for non-deleted rows" ON public.orders FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Enable insert for all users" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.orders FOR UPDATE USING (true);

-- Chính sách cho bảng "order_items"
CREATE POLICY "Enable read access for all users" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.order_items FOR UPDATE USING (true);
```
</details>

### Bước 3: Cấu hình kết nối

1.  Trong dự án Supabase, vào **Project Settings** > **API**.
2.  Sao chép **Project URL** và **`anon` `public` Key**.
3.  Mở file `assets/js/services/supabaseClient.js` trong mã nguồn của bạn.
4.  Dán URL và Key vừa sao chép vào đúng vị trí:

    ```javascript
    const supabaseUrl = 'YOUR_SUPABASE_URL'; // <-- Dán Project URL vào đây
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // <-- Dán anon public key vào đây
    ```

### Bước 4: (Tùy chọn) Nạp dữ liệu ban đầu

Nếu bạn muốn có sẵn dữ liệu mẫu, bạn có thể chạy đoạn mã SQL nạp dữ liệu trong **SQL Editor**.

<details>
  <summary><strong>Bấm để xem mã SQL nạp dữ liệu mẫu</strong></summary>

```sql
-- Nạp dữ liệu cho bảng Nhà cung cấp (suppliers)
INSERT INTO public.suppliers (id, name) VALUES
('sup_metro', 'Metro'),
('sup_edeka', 'EDEKA'),
('sup_asia', 'Châu Á'),
('sup_japan', 'Đồ Nhật');

-- Nạp dữ liệu cho bảng Nhóm hàng (groups)
INSERT INTO public.groups (id, name, supplier_id) VALUES
('grp_rau', 'Hàng Rau', 'sup_metro'),
('grp_kho', 'Hàng Khô', 'sup_metro'),
('grp_vs', 'Vệ Sinh', 'sup_metro'),
('grp_thit', 'Thịt', 'sup_metro');

-- (Thêm các lệnh INSERT cho bảng 'items' nếu cần)
```
</details>

### Bước 5: Chạy ứng dụng

Cách đơn giản nhất để chạy dự án là sử dụng một máy chủ web cục bộ. Nếu bạn dùng Visual Studio Code, bạn có thể cài đặt tiện ích mở rộng **Live Server**.

1.  Cài đặt tiện ích **Live Server**.
2.  Mở thư mục dự án trong VS Code.
3.  Nhấn chuột phải vào file `index.html` và chọn **"Open with Live Server"**.

Ứng dụng sẽ tự động mở trong trình duyệt của bạn.

## Định hướng phát triển trong tương lai

*   **In ấn:** Thêm chức năng in phiếu đặt hàng.
*   **Cập nhật thời gian thực:** Tích hợp Supabase Realtime để dữ liệu tự động cập nhật trên tất cả các thiết bị.
*   **Xác thực & Phân quyền:** Xây dựng hệ thống đăng nhập và phân quyền người dùng (Admin, Staff).
*   **Quản lý Tồn kho:** Theo dõi số lượng hàng hóa trong kho.
*   **PWA (Progressive Web App):** Cho phép "cài đặt" ứng dụng lên màn hình chính của điện thoại.