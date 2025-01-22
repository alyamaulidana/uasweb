// Fungsi untuk mengambil data siswa dari server menggunakan Axios
function ambilData() {
  axios.get("http://localhost:3000/siswa")
    .then((response) => {
      let wadah = "";
      let siswa = response.data;

      // Jika ada data siswa
      if (siswa.length > 0) {
        siswa.forEach((item, i) => {
          wadah += `
            <tr>
                <td id="clmNoAbsen">${item.noAbsen}</td>
                <td id="clmNama">${item.nama}</td>
                <td id="clmJurusan">${item.jurusan}</td>
                <td id="clmTanggal">${item.tanggal}</td>
                <td id="clmKeterangan">${item.keterangan}</td>
                <td id="clmAction">
                    <button id="btnEdit" onclick="editData('${item.id}', '${item.noAbsen}', '${item.nama}', '${item.jurusan}', '${item.tanggal}', '${item.keterangan}')">Edit</button>
                    <button id="btnHapus" onclick="hapusData('${item.id}')">Hapus</button>
                </td>
            </tr>
          `;
        });
      } else {
        wadah += `
            <tr>
                <td colspan="7" id="clmkosong">Data tidak ditemukan</td>
            </tr>
        `;
      }

      // Menambahkan data ke dalam tabel
      document.getElementById("hasil").innerHTML = wadah;
    })
    .catch((error) => {
      document.getElementById("hasil").innerHTML = `
        <tr>
            <td colspan="7" id="clmerror">${error.message}</td>
        </tr>
      `;
    });
}

// Panggil fungsi ambilData untuk pertama kali
ambilData();

// Variabel global untuk menyimpan ID data yang sedang diedit
let idSiswaSedangDiedit = null;

// Fungsi untuk menyimpan data ke server dan tabel
function simpanData() {
  // Mendapatkan nilai input dari form
  var noAbsen = document.getElementById("noabsen").value;
  var nama = document.getElementById("nama").value;
  var jurusan = document.getElementById("jurusan").value;
  var tanggal = document.getElementById("tanggal").value;
  var keterangan = document.getElementById("keterangan").value;

  // Validasi untuk memastikan semua input diisi
  if (!noAbsen || !nama || !jurusan || !tanggal || !keterangan) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Semua data harus diisi!',
    });
    return;
  }

  // Jika sedang mengedit data, lakukan update
  if (idSiswaSedangDiedit) {
    var dataSiswa = {
      noAbsen: noAbsen,
      nama: nama,
      jurusan: jurusan,
      tanggal: tanggal,
      keterangan: keterangan
    };

    axios.put(`http://localhost:3000/siswa/${idSiswaSedangDiedit}`, dataSiswa)
      .then((response) => {
        Swal.fire('Berhasil!', 'Data berhasil diperbarui.', 'success');
        idSiswaSedangDiedit = null; // Reset ID setelah update
        document.getElementById("btnSimpan").innerText = "Simpan";
        ambilData(); // Refresh data yang ditampilkan
      })
      .catch((error) => {
        Swal.fire('Gagal!', 'Terjadi kesalahan dalam memperbarui data.', 'error');
      });
  } else {
    // Membuat objek data untuk disimpan
    var dataSiswa = {
      noAbsen: noAbsen,
      nama: nama,
      jurusan: jurusan,
      tanggal: tanggal,
      keterangan: keterangan
    };

    // Menyimpan data ke API menggunakan Axios
    axios.post("http://localhost:3000/siswa", dataSiswa)
      .then((response) => {
        Swal.fire('Berhasil!', 'Data berhasil disimpan.', 'success');
        ambilData(); // Refresh data yang ditampilkan
      })
      .catch((error) => {
        Swal.fire('Gagal!', 'Terjadi kesalahan dalam menyimpan data.', 'error');
      });
  }

  // Mengosongkan form setelah menyimpan data
  document.getElementById("noabsen").value = "";
  document.getElementById("nama").value = "";
  document.getElementById("jurusan").value = "";
  document.getElementById("tanggal").value = "";
  document.getElementById("keterangan").value = "";
}

// Fungsi untuk mengedit data
function editData(id, noAbsen, nama, jurusan, tanggal, keterangan) {
  // Memasukkan data ke dalam form untuk diedit
  document.getElementById("noabsen").value = noAbsen;
  document.getElementById("nama").value = nama;
  document.getElementById("jurusan").value = jurusan;
  document.getElementById("tanggal").value = tanggal;
  document.getElementById("keterangan").value = keterangan;

  // Simpan ID data yang sedang diedit
  idSiswaSedangDiedit = id;

  // Ubah teks tombol Simpan menjadi Update
  document.getElementById("btnSimpan").innerText = "Update";
}

// Fungsi untuk menghapus data
function hapusData(id) {
  // Konfirmasi sebelum menghapus data
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Data ini akan dihapus!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`http://localhost:3000/siswa/${id}`)
        .then((response) => {
          Swal.fire('Dihapus!', 'Data berhasil dihapus.', 'success');
          ambilData(); // Refresh data setelah penghapusan
        })
        .catch((error) => {
          Swal.fire('Gagal!', 'Terjadi kesalahan dalam menghapus data.', 'error');
        });
    }
  });
}
