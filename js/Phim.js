class Phim {
    constructor(
        id,
        tenPhim,
        moTa,
        thoiLuong,
        namPhatHanh,
        giaPhim,
        anhPhim
    ) {
        this.id = id;
        this.tenPhim = tenPhim;
        this.moTa = moTa;
        this.thoiLuong = thoiLuong;
        this.namPhatHanh = namPhatHanh;
        this.giaPhim = giaPhim;
        this.anhPhim = anhPhim;
    }

    hienThiPhim() {
        return `
            <div class="movie-card">
                <img src="${this.anhPhim}" alt="${this.tenPhim}">

                <div class="movie-content">
                    <h3>${this.tenPhim}</h3>

                    <div class="movie-info">
                        ${this.thoiLuong} phút | ${this.namPhatHanh}
                    </div>

                    <div class="movie-description">
                        ${this.moTa}
                    </div>

                    <div class="movie-actions">
                        <button class="watch-btn" type="button">Xem Ngay</button>
                        <button class="edit-btn" type="button" data-id="${this.id}" aria-label="Sửa phim ${this.tenPhim}">Sửa</button>
                        <button class="delete-btn" type="button" data-id="${this.id}" aria-label="Xóa phim ${this.tenPhim}">Xóa</button>
                    </div>
                </div>
            </div>
        `;
    }
    themPhim() {
        return fetch("https://6aaa4322ff4dd5698b4e4091.mockapi.io/Phim", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this)
        }).then(response => response.json());
    }

    capNhatPhim() {
        return fetch(`https://6aaa4322ff4dd5698b4e4091.mockapi.io/Phim/${this.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this)
        }).then(response => response.json());
    }

    xoaPhim() {
        return fetch(`https://6aaa4322ff4dd5698b4e4091.mockapi.io/Phim/${this.id}`, {
            method: "DELETE"
        }).then(response => response.json());
    }
}
