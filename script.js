// VARIABEL PENTING: Gunakan URL Apps Script Anda yang sudah benar
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_wWxA3cwbn1kZR8ZSPJGhtoKvJuTMxrARWOe5DL3hQEiv_heSxS0OM6nHWyZQa40jAw/exec'; 

const form = document.getElementById('reflectionForm');
const simpanButton = form.querySelector('button[type="submit"]');

// Elemen untuk fitur pencarian
const searchButton = document.getElementById('searchButton');
const searchDateInput = document.getElementById('searchDate');
const resultDisplay = document.getElementById('resultDisplay');


// ==========================================================
// 1. LOGIKA PENGIRIMAN FORM (doPost) - Tetap pakai no-cors
// ==========================================================

form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    simpanButton.disabled = true;
    simpanButton.textContent = '⏳ Menyimpan...';

    const formData = new FormData(form);
    
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Dipertahankan untuk stabilitas POST
    })
    .then(() => {
        // Asumsi sukses setelah pengiriman
        alert('✅ Refleksi berhasil disimpan ke Google Sheets!');
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Terjadi kegagalan koneksi jaringan.');
    })
    .finally(() => {
        simpanButton.disabled = false;
        simpanButton.textContent = '✅ Simpan Refleksi';
    });
});


// ==========================================================
// 2. LOGIKA PENCARIAN TANGGAL (doGet) - Kembalikan ke Fetch Standar
// ==========================================================

searchButton.addEventListener('click', function() {
    const date = searchDateInput.value;
    if (!date) {
        alert('Mohon pilih tanggal yang ingin dicari.');
        return;
    }
    
    resultDisplay.innerHTML = `<p>⏳ Mencari refleksi untuk tanggal <strong>${date}</strong>...</p>`;
    searchButton.disabled = true;

    // Tambahkan cacheBuster untuk memastikan browser memuat ulang
    const cacheBuster = new Date().getTime();
    const fetchUrl = `${SCRIPT_URL}?searchDate=${date}&cacheBuster=${cacheBuster}`;

    // Gunakan Fetch API standar yang mengandalkan CORS Apps Script
    fetch(fetchUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        searchButton.disabled = false;
        if (data.result === 'success') {
            displayResults(data.headers, data.data);
        } else {
            // Tampilkan pesan error dari Apps Script (atau 'not found')
            resultDisplay.innerHTML = `<p style="color: red;">❌ ${data.message || 'Tidak ditemukan refleksi.'}</p>`;
        }
    })
    .catch(error => {
        searchButton.disabled = false;
        console.error('Error fetching data:', error);
        resultDisplay.innerHTML = '<p style="color: red;">❌ Terjadi kesalahan saat mengambil data. (CORS atau Network Error)</p>';
    });
});

function displayResults(headers, data) {
    // Memformat hasil data yang diterima dari Apps Script
    let html = '<table class="result-table">';
    
    for (let i = 0; i < headers.length; i++) {
        if (i === 0) continue; 

        let title = headers[i].replace(/_/g, ' '); 
        let content = data[i];

        html += `
            <tr>
                <td class="result-title">${title}</td>
                <td>:</td>
                <td class="result-content">${content}</td>
            </tr>
        `;
    }
    html += '</table>';
    
    resultDisplay.innerHTML = html;
}
