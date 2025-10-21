// ========== تحميل البيانات من Google Sheets ==========

class GoogleSheetsLoader {
    constructor(url) {
        this.url = url;
    }

    async loadData() {
        try {
            console.log('🔄 جاري الاتصال بـ Google Sheets...');
            
            const response = await fetch(this.url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            
            // إزالة البادئة من Google Visualization API
            const jsonText = text.substring(47).slice(0, -2);
            const data = JSON.parse(jsonText);
            
            // استخراج البيانات من الصفوف
            const rows = data.table.rows;
            
            const parsedData = rows.slice(1).map(row => {
                const cells = row.c;
                return {
                    childName: cells[0]?.v || 'غير متوفر',
                    age: parseInt(cells[1]?.v) || 0,
                    gender: cells[2]?.v || 'غير متوفر',
                    prevKG: cells[3]?.v === 'نعم',
                    fatherName: cells[4]?.v || 'غير متوفر',
                    phone: cells[5]?.v || 'غير متوفر'
                };
            });
            
            console.log('✅ تم تحميل البيانات بنجاح:', parsedData.length, 'طفل');
            return {
                success: true,
                data: parsedData
            };
            
        } catch (error) {
            console.error('❌ خطأ في تحميل البيانات:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}