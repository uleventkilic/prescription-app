const xlsx = require('xlsx');
const { Medicine } = require('../models'); // Medicine modelini import edin

const processUploadedExcel = async (filePath) => {
    try {
        console.log('Processing Excel file...');

        const workbook = xlsx.readFile(filePath);
        const sheetName = 'AKTİF ÜRÜNLER LİSTESİ'; // İşlenecek sayfa adı
        const sheet = workbook.Sheets[sheetName];

        const medicines = xlsx.utils.sheet_to_json(sheet);

        const formattedMedicines = medicines.map((row) => ({
            name: row['__EMPTY'], // İlaç adı
            barcode: row['SKRS E-REÇETE İLAÇ VE DİĞER FARMASÖTİK ÜRÜNLER LİSTESİ'], // Barkod
            atcCode: row['__EMPTY_1'], // ATC kodu
            atcName: row['__EMPTY_2'], // ATC adı
            company: row['__EMPTY_3'], // Firma adı
            prescriptionType: row['__EMPTY_4'], // Reçete türü
            status: row['__EMPTY_5'], // Durumu
            description: row['AİK-LST-02/A/ 11.11.2019/ Rev. 00'], // Açıklama
            stock: Math.floor(Math.random() * 100) + 1, // Rastgele stok
            price: 0, // Fiyat varsayılan olarak 0
        })).filter((med) => med.name && med.barcode); // Geçersiz verileri filtrele

        console.log('Formatted medicines:', formattedMedicines);

        let addedCount = 0;
        for (const med of formattedMedicines) {
            const exists = await Medicine.findOne({ name: med.name }); // Aynı isimde kayıt var mı kontrol et
            if (!exists) {
                await Medicine.create(med); // Yoksa kaydet
                addedCount++;
            }
        }

        console.log(`${addedCount} new medicines added to database.`);
    } catch (error) {
        console.error('Error processing Excel file:', error.message);
    }
};

module.exports = processUploadedExcel;
