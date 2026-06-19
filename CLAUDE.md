# Web Kỷ yếu khối K49 - FOIE, Học viện Ngoại giao

## Tổng quan
Website kỷ yếu KHỐI (không có ảnh cá nhân, chỉ ảnh tập thể) cho K49,
Khoa Kinh tế Quốc tế (FOIE), Học viện Ngoại giao Việt Nam.
Stack: Next.js (App Router) + TailwindCSS + Framer Motion.

## Cấu trúc ảnh (ĐÃ CÓ SẴN - không cần hỏi lại)
Ảnh nằm trong public/images/, chia theo hoạt động:
- 01-nhap-hoc/
- 02-hoat-dong-clb/
- 03-su-kien-gala/
- 04-da-ngoai/
- 05-tot-nghiep/
Khi cần ảnh cho 1 section, LUÔN quét thư mục tương ứng bằng lệnh liệt kê file
thực tế, KHÔNG bịa tên file, KHÔNG hỏi lại tôi đã có ảnh chưa.

Lưu ý: folder 05-tot-nghiep hiện ĐANG RỖNG (khối chưa ra trường). Khi rỗng,
không hiện ảnh trôi mà hiện text "and the next slide?" trôi nhẹ giữa màn hình.

## Design system (CỐ ĐỊNH - áp dụng toàn site)
- Heading/điểm nhấn: font "Itim" (Google Fonts, hỗ trợ tiếng Việt)
- Body text: font "Be Vietnam Pro"
- Màu chủ đạo:
  - Navy đậm: #0B1E3F
  - Navy trung: #163A6B
  - Xanh nhạt: #7EC8E3
  - Trắng: #FFFFFF
  - Gradient nền chính: linear-gradient(135deg, #0B1E3F 0%, #163A6B 50%, #7EC8E3 100%)
- Hiệu ứng glass morphism: backdrop-filter blur, viền trắng mờ (border: 1px solid
  rgba(255,255,255,0.18)), bóng nhẹ, có thêm lớp "khúc xạ ánh sáng" mờ
  (radial-gradient trắng mờ di chuyển nhẹ theo mouse/scroll) làm điểm nhấn

## Quy ước code
- Component nhỏ, dễ thay ảnh/text sau
- Lazy load ảnh, không tối ưu sớm/over-engineer
- Không hỏi lại các quyết định đã ghi trong file này
