// VARIABEL PENTING: Gunakan URL Apps Script Anda yang sudah benar
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_wWxA3cwbn1kZR8ZSPJGhtoKvJuTMxrARWOe5DL3hQEiv_heSxS0OM6nHWyZQa40jAw/exec'; 

const form = document.getElementById('reflectionForm');
const simpanButton = form.querySelector('button[type="submit"]');

// Elemen untuk fitur pencarian
const searchButton = document.getElementById('searchButton');
const searchDateInput = document.getElementById('searchDate');
const resultDisplay = document.getElementById('resultDisplay');

// ==========================================================
// FUNGSI UTILITY: Mengubah format YYYY-MM-DD menjadi DD Bulan YYYY
// ==========================================================
function formatDateToIndonesian(isoDate) {
    if (!isoDate) return '';
    const dateParts = isoDate.split('-'); // Contoh: ['2025', '07', '09']
    const year = dateParts[0];
    const monthIndex = parseInt(dateParts[1]) - 1; // Bulan 0-based
    const day = dateParts[2];
    
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // Hasilnya: '09 Juli 2025'
    return `${day} ${monthNames[monthIndex]} ${year}`;
}


// ==========================================================
// 1. LOGIKA PENGIRIMAN FORM (doPost)
// ==========================================================
form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    simpanButton.disabled = true;
    simpanButton.textContent = '⏳ Menyimpan...';

    const formData = new FormData(form);
    
    // LANGKAH PENTING: FORMAT TANGGAL SEBELUM DIKIRIM
    const isoDate = formData.get('Tanggal'); 
    const formattedDate = formatDateToIndonesian(isoDate); 
    
    // GANTI nilai 'Tanggal' di form data dengan string teks yang sudah diformat
    formData.set('Tanggal', formattedDate); 

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
// 2. LOGIKA PENCARIAN (doGet)
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
    
    // Menampilkan tanggal yang dicari di atas tabel
    html = `<h3>Refleksi Tanggal ${data[0]}</h3>` + html; // data[0] sudah berisi string DD Bulan YYYY

    resultDisplay.innerHTML = html;
}

searchButton.addEventListener('click', function() {
    const isoDate = searchDateInput.value; // Ambil YYYY-MM-DD
    if (!isoDate) {
        alert('Mohon pilih tanggal yang ingin dicari.');
        return;
    }
    
    // LANGKAH PENTING: FORMAT TANGGAL SEBELUM DIKIRIM SEBAGAI PARAMETER PENCARIAN
    const searchDateText = formatDateToIndonesian(isoDate);

    resultDisplay.innerHTML = `<p>⏳ Mencari refleksi untuk tanggal <strong>${searchDateText}</strong>...</p>`;
    searchButton.disabled = true;

    // Kirim tanggal string teks yang sudah diformat ke Apps Script
    const fetchUrl = `${SCRIPT_URL}?searchDate=${encodeURIComponent(searchDateText)}`;

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
