// VARIABEL PENTING: Ganti nilai ini!
// Ini adalah URL yang akan Anda dapatkan setelah membuat Google Apps Script (Langkah berikutnya)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_wWxA3cwbn1kZR8ZSPJGhtoKvJuTMxrARWOe5DL3hQEiv_heSxS0OM6nHWyZQa40jAw/exec'; 

const form = document.getElementById('reflectionForm');
const simpanButton = form.querySelector('button[type="submit"]');

// Elemen baru untuk fitur pencarian
const searchButton = document.getElementById('searchButton');
const searchDateInput = document.getElementById('searchDate');
const resultDisplay = document.getElementById('resultDisplay');

form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    simpanButton.disabled = true;
    simpanButton.textContent = '⏳ Menyimpan...';

    const formData = new FormData(form);
    
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Penting untuk testing di localhost
    })
    .then(() => {
        // Asumsi sukses karena 'no-cors' mencegah pengecekan respons
        alert('✅ Refleksi berhasil disimpan ke Google Sheets!');
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Terjadi kegagalan koneksi jaringan. Cek browser console.');
    })
    .finally(() => {
        simpanButton.disabled = false;
        simpanButton.textContent = '✅ Simpan Refleksi';
    });
});

// ... (Bagian POST FORM di atas tetap sama) ...

// ==========================================================
// 2. LOGIKA PENCARIAN TANGGAL (doGet) - Menggunakan JSONP/CALLBACK
// ==========================================================

// Fungsi global untuk menerima respons dari Apps Script
window.handleSearchResponse = function(data) {
    searchButton.disabled = false;
    if (data.result === 'success') {
        displayResults(data.headers, data.data);
    } else {
        resultDisplay.innerHTML = `<p style="color: red;">❌ Tidak ditemukan refleksi untuk tanggal <strong>${searchDateInput.value}</strong>.</p>`;
    }
};

searchButton.addEventListener('click', function() {
    const date = searchDateInput.value;
    if (!date) {
        alert('Mohon pilih tanggal yang ingin dicari.');
        return;
    }
    
    resultDisplay.innerHTML = `<p>⏳ Mencari refleksi untuk tanggal <strong>${date}</strong>...</p>`;
    searchButton.disabled = true;

    // Tambahkan parameter callback ke URL untuk JSONP
    const cacheBuster = new Date().getTime();
    const fetchUrl = `${SCRIPT_URL}?searchDate=${date}&callback=handleSearchResponse&cacheBuster=${cacheBuster}`;

    // Kita tidak menggunakan fetch API, tapi kita inject script ke body
    // Ini adalah cara kerja JSONP
    const script = document.createElement('script');
    script.src = fetchUrl;
    
    // Menghapus script lama dan menambah script baru
    const existingScript = document.getElementById('jsonpScript');
    if (existingScript) existingScript.remove();
    
    script.id = 'jsonpScript';
    document.body.appendChild(script);
    
    // Timer untuk menangani jika script gagal dimuat (timeout)
    setTimeout(() => {
        if (searchButton.disabled) {
            searchButton.disabled = false;
            resultDisplay.innerHTML = '<p style="color: red;">❌ Waktu koneksi habis. Coba lagi.</p>';
        }
    }, 10000); // 10 detik timeout
});

// ... (fungsi displayResults di bawah tetap sama) ...