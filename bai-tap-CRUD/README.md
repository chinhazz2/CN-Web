# React CRUD - Quản lý người dùng

Ứng dụng thực hành React 18 sử dụng `useState`, `useEffect`, props, state lifting và các chức năng CRUD.

## Cách sử dụng

- Mở `index.html` bằng trình duyệt có kết nối Internet, hoặc chạy thư mục này qua Live Server / `python -m http.server 8000`.
- Trình duyệt cần tải React 18 từ unpkg.com. Dữ liệu ban đầu tải từ https://jsonplaceholder.typicode.com/users.
- Khi API không khả dụng, giao diện tự chuyển sang 3 bản ghi mẫu để có thể thử chức năng.
- CRUD chỉ thay đổi state trong bộ nhớ trình duyệt. Tải lại trang sẽ đặt lại dữ liệu; không thay đổi dữ liệu trên JSONPlaceholder.

## Cấu trúc

- `index.html`: điểm vào của trang
- `App.jsx`: mã nguồn React dạng JSX (để đọc/chỉnh sửa)
- `app.js`: mã JavaScript đã biên dịch từ `App.jsx` bằng TypeScript JSX transform (không cần Babel khi chạy)
- `style.css`: giao diện tối giản trắng đen

## Đưa lên host

- Có thể kéo thả toàn bộ nội dung thư mục này vào một dịch vụ static hosting như Netlify Drop, hoặc dùng Vercel/GitHub Pages.
- Không chỉ upload `App.jsx`: cần đủ ba file `index.html`, `app.js`, `style.css`.

## Component Tree

App
├── SearchForm
├── AddUser
│   └── UserFields
└── ResultTable
    └── UserFields (khi mở form sửa)

## Hạn chế

Ứng dụng sử dụng CDN (cần Internet) và API mẫu. Đây là giao diện CRUD minh họa, không có backend ghi dữ liệu.
