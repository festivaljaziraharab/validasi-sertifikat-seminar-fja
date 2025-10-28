document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil ID Peserta dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const participantId = urlParams.get('id');

    // Dapatkan elemen-elemen untuk menampilkan data
    const noSertifikatElement = document.getElementById('no-sertifikat');
    const namaPesertaElement = document.getElementById('nama-peserta');
    const peranPesertaElement = document.getElementById('peran-peserta');
    const tglTerbitElement = document.getElementById('tgl-terbit');
    const statusValidasiElement = document.getElementById('status-validasi');

    // Fungsi untuk menampilkan status 'Data tidak ditemukan' atau 'Error'
    function displayErrorState(message, isRed = false) {
        noSertifikatElement.textContent = 'N/A';
        namaPesertaElement.textContent = message;
        peranPesertaElement.textContent = 'N/A';
        tglTerbitElement.textContent = 'N/A';
        statusValidasiElement.textContent = 'INVALID';
        if (isRed) {
            statusValidasiElement.style.color = 'red';
            statusValidasiElement.style.fontWeight = 'bold';
            namaPesertaElement.style.color = 'red'; // Agar pesan error nama juga merah
        }
    }

    // Jika tidak ada ID di URL, tampilkan error
    if (!participantId) {
        displayErrorState('Error: ID Peserta tidak ditemukan di URL.', true);
        return;
    }

    // 2. Ambil data dari file data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal memuat data peserta. Pastikan data.json ada dan benar.');
            }
            return response.json();
        })
        .then(data => {
            // 3. Cari peserta berdasarkan ID yang didapat dari URL
            const participantData = data.find(p => p.id === participantId);

            // 4. Jika data peserta ditemukan, suntikkan ke HTML
            if (participantData) {
                noSertifikatElement.textContent = participantData.no_sertifikat;
                namaPesertaElement.textContent = participantData.nama;
                peranPesertaElement.textContent = participantData.peran;
                tglTerbitElement.textContent = participantData.tgl_terbit;
                
                // Menangani Status Validasi dan warnanya
                statusValidasiElement.textContent = participantData.status.toUpperCase(); 

                if (participantData.status.toUpperCase() === 'VALID') {
                    statusValidasiElement.style.color = 'green';
                    statusValidasiElement.style.fontWeight = 'bold';
                } else {
                    statusValidasiElement.style.color = 'red';
                    statusValidasiElement.style.fontWeight = 'bold';
                }

            } else {
                // 5. Jika ID ditemukan di URL tapi datanya tidak ada
                displayErrorState(`Data untuk ID "${participantId}" tidak ditemukan.`, true);
            }
        })
        .catch(error => {
            console.error('Ada masalah dengan operasi fetch atau JSON:', error);
            displayErrorState('Error: Gagal memproses data.', true);
        });
});