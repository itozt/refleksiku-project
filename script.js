// VARIABEL PENTING: Gunakan URL Apps Script Anda yang sudah benar
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-ym99DggXSCNkK8tMDmdTUCXkTYYGFy8NogQ0332agIOm6nw7Jyk_oeP56-LUKZpi/exec'; 

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
        simpanButton.disabled = false;
        simpanButton.textContent = '✅ Simpan Refleksi';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Terjadi kesalahan saat menyimpan data. (Cek Network/URL)');
        simpanButton.disabled = false;
        simpanButton.textContent = '✅ Simpan Refleksi';
    });
});


// ==========================================================
// 2. LOGIKA PENCARIAN (doGet)
// ==========================================================
function displayResults(headers, data) {
    // ... (Fungsi ini tetap sama untuk menampilkan hasil) ...
    let html = '<table class="result-table">';
    
    for (let i = 0; i < headers.length; i++) {
        // Abaikan header (Kolom 0) karena sudah ditampilkan di judul hasil
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
    
    // Menambahkan tanggal yang dicari di atas tabel
    html = `<h3>Refleksi Tanggal ${data[0]}</h3>` + html;

    resultDisplay.innerHTML = html;
}

searchButton.addEventListener('click', function() {
    const isoDate = searchDateInput.value;
    if (!isoDate) {
        alert('Mohon pilih tanggal yang ingin dicari.');
        return;
    }
    
    // LANGKAH PENTING: FORMAT TANGGAL SEBELUM DIKIRIM SEBAGAI PARAMETER PENCARIAN
    const searchDateText = formatDateToIndonesian(isoDate);

    resultDisplay.innerHTML = `<p>⏳ Mencari refleksi untuk tanggal <strong>${searchDateText}</strong>...</p>`;
    searchButton.disabled = true;

    // Kirim tanggal yang sudah diformat ke Apps Script
    const fetchUrl = `${SCRIPT_URL}?searchDate=${encodeURIComponent(searchDateText)}`;

    // Menggunakan Fetch API untuk GET
    fetch(fetchUrl)
    .then(response => {
        // Apps Script mengembalikan JSON dengan header X-Content-Type-Options: nosniff
        // Kita harus memastikan respons OK
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
