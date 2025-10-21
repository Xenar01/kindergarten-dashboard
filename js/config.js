// ========== إعدادات المشروع ==========

const CONFIG = {
    // كلمة سر لوحة الإدارة
    ADMIN_PASSWORD: "Masaken2025",
    
    // رابط Google Sheets API
    GOOGLE_SHEETS_URL: 'https://docs.google.com/spreadsheets/d/12xt79hkAjkh3SpEjfwAQNeEDvdhtfna7VkEuL9yVj3A/gviz/tq?tqx=out:json',
    
    // استخدام البيانات المحلية (true) أو Google Sheets (false)
    USE_LOCAL_DATA: true, // غيّرها إلى false عند الاستخدام الحقيقي
    
    // إعدادات الصفوف
    STUDENTS_PER_CLASS: 20,
    
    // النطاق العمري المقبول
    MIN_AGE: 1,
    MAX_AGE: 8
};
