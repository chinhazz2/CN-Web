/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------
const oTimKiem = document.getElementById("o-tim-kiem");
const danhSach = document.getElementById("list");
const boDem = document.getElementById("bo-dem");
const khongThay = document.getElementById("khong-thay");
const oTieuDe = document.getElementById("tin-tieu-de");
const oNoiDung = document.getElementById("tin-noi-dung");
const nutDang = document.getElementById("nut-dang");
const baoLoi = document.getElementById("bao-loi");

function cacTin() {
	return Array.from(danhSach.querySelectorAll("li"));
}

// F1. Bộ đếm "Đang hiển thị x/y tin" trong #bo-dem.
function capNhatBoDem() {
	const ds = cacTin();
	const soDangHien = ds.filter(tin => !tin.classList.contains("an")).length;
	boDem.textContent = `Đang hiển thị ${soDangHien}/${ds.length} tin`;
}

// F2 + F3. Lọc tin khi gõ vào #o-tim-kiem (sự kiện keyup) và thông báo #khong-thay.
function locTin() {
	const tuKhoaGoc = oTimKiem.value;
	const tuKhoa = tuKhoaGoc.toLowerCase();
	let soKhop = 0;

	for (const tin of cacTin()) {
		const tieuDe = tin.querySelector("h3").textContent;
		const noiDung = tin.querySelector("p").textContent;
		const khop = (tieuDe + " " + noiDung).toLowerCase().includes(tuKhoa);
		tin.classList.toggle("an", !khop);
		if (khop) {
			soKhop++;
		}
	}

	if (soKhop === 0) {
		khongThay.classList.remove("an");
		khongThay.textContent = `Không tìm thấy tin nào cho "${tuKhoaGoc}"`;
	} else {
		khongThay.classList.add("an");
		khongThay.textContent = "";
	}

	capNhatBoDem();
}

oTimKiem.addEventListener("keyup", locTin);

// F4. Nút "Read more >>" / "Thu gọn <<" — MỘT trình lắng nghe đặt trên #list.
danhSach.addEventListener("click", (e) => {
	if (!e.target.classList.contains("more")) {
		return;
	}

	const tin = e.target.closest("li");
	const doanVan = tin.querySelector("p");
	const dangMo = doanVan.classList.toggle("day-du");
	e.target.textContent = dangMo ? "Thu gọn <<" : "Read more >>";
});

// F5. Nút #nut-dang: kiểm tra dữ liệu, tạo <li> mới, chèn vào đầu #list.
nutDang.addEventListener("click", () => {
	const tieuDeMoi = oTieuDe.value;
	const noiDungMoi = oNoiDung.value;

	if (tieuDeMoi === "" || noiDungMoi === "") {
		baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
		return;
	}

	const li = document.createElement("li");
	const ngay = document.createElement("span");
	const h3 = document.createElement("h3");
	const p = document.createElement("p");
	const nut = document.createElement("button");

	ngay.className = "time";
	ngay.textContent = homNay();
	h3.textContent = tieuDeMoi;
	p.textContent = noiDungMoi;
	nut.type = "button";
	nut.className = "more";
	nut.textContent = "Read more >>";

	li.append(ngay, h3, p, nut);
	danhSach.prepend(li);

	oTieuDe.value = "";
	oNoiDung.value = "";
	baoLoi.textContent = "";

	// Tin mới phải tuân theo bộ lọc hiện tại và bộ đếm phải được cập nhật.
	locTin();
});

// Trạng thái ban đầu.
locTin();
