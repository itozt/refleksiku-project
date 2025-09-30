// VARIABEL PENTING: Gunakan URL Apps Script Anda yang sudah benar
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbww4d-v_-QkxoJ9z49cJkMBvUx-KUs5Fx5WWb7KA9dBnh8DqMIOb1HUN-QSfq8eWkYi/exec'; 

const form = document.getElementById('reflectionForm');
const simpanButton = form.querySelector('button[type="submit"]');

// Elemen untuk fitur pencarian
const searchButton = document.getElementById('searchButton');
const searchDateInput = document.getElementById('searchDate');
const resultDisplay = document.getElementById('resultDisplay');


// ==========================================================
// 1. LOGIKA PENGIRIMAN FORM (doPost) - Kirim ISO Mentah
// ==========================================================
form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    simpanButton.disabled = true;
    simpanButton.textContent = '⏳ Menyimpan...';

    const formData = new FormData(form);
    
    // TIDAK PERLU FORMAT DI SINI. Biarkan Apps Script yang memformat.
    // data.Tanggal adalah string YYYY-MM-DD mentah.

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' 
    })
    .then(() => {
        alert('✅ Refleksi berhasil disimpan ke Google Sheets!');
        form.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Terjadi kesalahan saat menyimpan data. (Cek Network/URL)');
    })
    .finally(() => {
        simpanButton.disabled = false;
        simpanButton.textContent = '✅ Simpan Refleksi';
    });
});


// ==========================================================
// 2. LOGIKA PENCARIAN (doGet) - Kirim ISO Mentah untuk Dicari
// ==========================================================
function displayResults(headers, data) {
    let html = '<table class="result-table">';
    
    for (let i = 0; i < headers.length; i++) {
        if (i === 0) continue; 

        let title = headers[i].replace(/_/g, ' '); 
        let content = data[i];

        html += `
            <tr>
                <td class="result-title">${title}</td>
                <td>${content}</td>
            </tr>
        `;
    }
    html += '</table>';
    
    // Data[0] sudah diformat di Apps Script, jadi tampilkan langsung
    html = `<h3>Refleksi Tanggal ${data[0]}</h3>` + html;

    resultDisplay.innerHTML = html;
}

searchButton.addEventListener('click', function() {
    const searchDateISO = searchDateInput.value; // Kirim YYYY-MM-DD mentah
    if (!searchDateISO) {
        alert('Mohon pilih tanggal yang ingin dicari.');
        return;
    }
    
    // Tampilkan pesan loading dengan format yang benar (Anda bisa membuat fungsi display terpisah jika mau)
    resultDisplay.innerHTML = `<p>⏳ Mencari refleksi untuk tanggal ${searchDateISO}...</p>`; 
    searchButton.disabled = true;

    // Kirim permintaan GET dengan string YYYY-MM-DD mentah
    const fetchUrl = `${SCRIPT_URL}?searchDate=${encodeURIComponent(searchDateISO)}`;

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
            resultDisplay.innerHTML = `<p style="color: red;">❌ ${data.message || 'Tidak ditemukan refleksi.'}</p>`;
        }
    })
    .catch(error => {
        searchButton.disabled = false;
        console.error('Error fetching data:', error);
        resultDisplay.innerHTML = '<p style="color: red;">❌ Terjadi kesalahan saat mengambil data. (CORS atau Network Error)</p>';
    });
});

