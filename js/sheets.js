// ========== تحميل البيانات من Google Sheets ==========

class GoogleSheetsLoader {
    constructor(url) {
        this.url = url;
    }

    async loadData() {
        try {
            console.log('🔄 جاري الاتصال بـ Google Sheets...');
            
            // إضافة timeout للطلب
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 ثواني timeout
            
            const response = await fetch(this.url, {
                signal: controller.signal,
                mode: 'cors',
                credentials: 'omit'
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const text = await response.text();
            
            // التحقق من أن الرد ليس فارغاً
            if (!text || text.trim().length === 0) {
                throw new Error('Empty response from Google Sheets');
            }
            
            // إزالة البادئة من Google Visualization API
            const jsonStart = text.indexOf('(') + 1;
            const jsonEnd = text.lastIndexOf(')');
            
            if (jsonStart < 1 || jsonEnd < 0) {
                throw new Error('Invalid response format from Google Sheets');
            }
            
            const jsonText = text.substring(jsonStart, jsonEnd);
            const data = JSON.parse(jsonText);
            
            // التحقق من وجود البيانات
            if (!data.table || !data.table.rows) {
                throw new Error('No data found in Google Sheets');
            }
            
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
            
            // رسائل خطأ واضحة
            let errorMessage = 'فشل الاتصال بـ Google Sheets';
            
            if (error.name === 'AbortError') {
                errorMessage = 'انتهت مهلة الاتصال - تحقق من اتصالك بالإنترنت';
            } else if (error.message.includes('CORS')) {
                errorMessage = 'مشكلة في أذونات Google Sheets - تأكد أن الجدول عام';
            } else if (error.message.includes('Empty response')) {
                errorMessage = 'الجدول فارغ أو الرابط خاطئ';
            }
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }
}