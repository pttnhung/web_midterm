const API_URL = "https://6aaa4322ff4dd5698b4e4091.mockapi.io/Phim";

const movieForm = document.getElementById("movieForm");
const movieList = document.getElementById("movieList");
const formMessage = document.getElementById("formMessage");
const saveBtn = document.getElementById("saveBtn");
let danhSachPhim = [];

function getTenPhim(phim) {
    return phim.tenPhim ?? phim.ten ?? phim.title ?? phim.name ?? "Chưa có tên phim";
}

function taoPhim(phim) {
    return new Phim(
        phim.id, getTenPhim(phim), phim.moTa ?? "", phim.thoiLuong ?? "",
        phim.namPhatHanh ?? "", phim.giaPhim ?? "",
        phim.anhPhim ?? phim.hinhAnh ?? ""
    );
}

function showPhim(phim) {
    movieList.innerHTML = phim.map(taoPhim).map(movie => movie.hienThiPhim()).join("");
}

function hienThiThongBao(message, isError = false) {
    formMessage.textContent = message;
    formMessage.className = isError ? "error-message" : "success-message";
}

async function getPhim() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Không thể tải danh sách phim.");
        danhSachPhim = await response.json();
        showPhim(danhSachPhim);
    } catch (error) {
        movieList.innerHTML = '<p class="list-message">Không thể tải danh sách phim. Vui lòng thử lại.</p>';
        console.error(error);
    }
}

function xoaTrangThaiForm() {
    movieForm.reset();
    document.getElementById("movieId").value = "";
    saveBtn.textContent = "Thêm phim";
}

function dienForm(phim) {
    const movie = taoPhim(phim);
    document.getElementById("movieId").value = movie.id;
    document.getElementById("tenPhim").value = movie.tenPhim;
    document.getElementById("moTa").value = movie.moTa;
    document.getElementById("thoiLuong").value = movie.thoiLuong;
    document.getElementById("namPhatHanh").value = movie.namPhatHanh;
    document.getElementById("giaPhim").value = movie.giaPhim;
    document.getElementById("anhPhim").value = movie.anhPhim;
    saveBtn.textContent = "Cập nhật phim";
    hienThiThongBao(`Đang sửa: ${movie.tenPhim}`);
}

document.getElementById("resetFormBtn").addEventListener("click", () => {
    xoaTrangThaiForm();
    hienThiThongBao("");
});

movieForm.addEventListener("submit", async event => {
    event.preventDefault();
    const id = document.getElementById("movieId").value;
    const phim = new Phim(
        id, document.getElementById("tenPhim").value.trim(), document.getElementById("moTa").value.trim(),
        Number(document.getElementById("thoiLuong").value), Number(document.getElementById("namPhatHanh").value),
        Number(document.getElementById("giaPhim").value),
        document.getElementById("anhPhim").value.trim()
    );

    saveBtn.disabled = true;
    try {
        if (id) {
            await phim.capNhatPhim();
            hienThiThongBao("Đã cập nhật phim.");
        } else {
            await phim.themPhim();
            hienThiThongBao("Đã thêm phim mới.");
        }
        xoaTrangThaiForm();
        await getPhim();
    } catch (error) {
        hienThiThongBao("Không thể lưu phim. Vui lòng thử lại.", true);
        console.error(error);
    } finally {
        saveBtn.disabled = false;
    }
});

movieList.addEventListener("click", async event => {
    const editButton = event.target.closest(".edit-btn");
    if (editButton) {
        const phim = danhSachPhim.find(item => String(item.id) === editButton.dataset.id);
        if (!phim) return;
        dienForm(phim);
        movieForm.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
    }

    const deleteButton = event.target.closest(".delete-btn");
    if (!deleteButton) return;
    const phim = danhSachPhim.find(item => String(item.id) === deleteButton.dataset.id);
    if (!phim || !confirm(`Bạn có chắc muốn xóa phim “${getTenPhim(phim)}” không?`)) return;

    deleteButton.disabled = true;
    try {
        await taoPhim(phim).xoaPhim();
        hienThiThongBao("Đã xóa phim.");
        xoaTrangThaiForm();
        await getPhim();
    } catch (error) {
        hienThiThongBao("Không thể xóa phim. Vui lòng thử lại.", true);
        deleteButton.disabled = false;
        console.error(error);
    }
});

getPhim();
