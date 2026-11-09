# INFINITE WALLPAPER LEGACY — Android 4.x

Bản giao diện tối giản được viết để tăng khả năng chạy trên trình duyệt Android 4.x.

## Tương thích
- JavaScript ES5, script cổ điển (không `type="module"`, không `import/export`).
- Dùng `XMLHttpRequest`, không dùng `fetch`, Promise, async/await, arrow functions hoặc template literals.
- CSS đơn giản, không dùng CSS Grid/Flexbox, CSS variables, backdrop-filter hoặc object-fit.
- Ưu tiên ảnh; không phát video để giảm tải cho thiết bị cũ.
- Không yêu cầu API key.

## Đưa lên Vercel
1. Giải nén ZIP.
2. Đưa toàn bộ nội dung thư mục vào repository đang liên kết với Vercel (thay thế bản cũ).
3. Commit và push lên nhánh production, thường là `main`.
4. Chờ Vercel deploy xong rồi mở lại website trên máy chiếu.
5. Trên máy chiếu, xóa cache trình duyệt hoặc thử tải lại trang.

Nếu dùng Vercel import repository mới: chọn Framework Preset = Other, Build Command để trống, Output Directory = `.`.

## Nguồn ảnh
- Wikimedia Commons API
- NASA Image and Video Library
- Lorem Picsum

Các nguồn là dịch vụ bên ngoài và có thể giới hạn truy cập. Trình duyệt Android 4.x có thể không kết nối được HTTPS hiện đại do chứng chỉ TLS/cipher cũ; nếu vậy thử trình duyệt khác có hỗ trợ TLS mới hơn hoặc dùng thiết bị phát HDMI/Android TV mới.

## Giới hạn
Không thể bảo đảm Android 4.x hỗ trợ đầy đủ mọi website hiện đại. Bản này giảm yêu cầu trình duyệt nhưng không thể cập nhật hệ điều hành, chứng chỉ gốc hoặc codec của máy chiếu. Ảnh được tải từ Internet, chất lượng phụ thuộc từng nguồn và kết nối.
