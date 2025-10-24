// ملف البيانات - Data Handler
// هذا الملف يحتوي على دوال معالجة البيانات المساعدة

// دالة تنظيف وتنسيق البيانات
function sanitizeData(data) {
    if (!data || !Array.isArray(data)) {
        return [];
    }
    
    return data.map(item => ({
        name: String(item.name || '').trim(),
        age: parseInt(item.age) || 0,
        gender: String(item.gender || '').trim(),
        previousKindergarten: String(item.previousKindergarten || '').trim(),
        fatherName: String(item.fatherName || '').trim(),
        phone: String(item.phone || '').trim()
    })).filter(item => item.name && item.age > 0);
}

// دالة التحقق من صحة البيانات
function validateDataStructure(data) {
    if (!data || !Array.isArray(data)) {
        throw new Error('البيانات يجب أن تكون في شكل مصفوفة');
    }
    
    if (data.length === 0) {
        throw new Error('لا توجد سجلات في البيانات');
    }
    
    const requiredFields = ['name', 'age', 'gender', 'previousKindergarten', 'fatherName', 'phone'];
    const firstRecord = data[0];
    
    for (const field of requiredFields) {
        if (!(field in firstRecord)) {
            throw new Error(`الحقل المطلوب "${field}" مفقود في البيانات`);
        }
    }
    
    return true;
}

// دالة حساب الإحصائيات
function calculateStatistics(data) {
    if (!data || data.length === 0) {
        return {
            total: 0,
            inRange: 0,
            outOfRange: 0,
            experienced: 0,
            genderDistribution: {},
            ageDistribution: {}
        };
    }
    
    const stats = {
        total: data.length,
        inRange: 0,
        outOfRange: 0,
        experienced: 0,
        genderDistribution: {},
        ageDistribution: {}
    };
    
    data.forEach(child => {
        // حساب النطاق العمري
        if (child.age >= CONFIG.MIN_AGE && child.age <= CONFIG.MAX_AGE) {
            stats.inRange++;
        } else {
            stats.outOfRange++;
        }
        
        // حساب الخبرة السابقة
        if (child.previousKindergarten === 'نعم') {
            stats.experienced++;
        }
        
        // توزيع الجنس
        stats.genderDistribution[child.gender] = (stats.genderDistribution[child.gender] || 0) + 1;
        
        // توزيع العمر
        stats.ageDistribution[child.age] = (stats.ageDistribution[child.age] || 0) + 1;
    });
    
    return stats;
}

// دالة تصفية البيانات
function filterData(data, filters = {}) {
    if (!data || data.length === 0) {
        return [];
    }
    
    return data.filter(child => {
        // تصفية الجنس
        if (filters.gender && child.gender !== filters.gender) {
            return false;
        }
        
        // تصفية العمر
        if (filters.age && child.age !== parseInt(filters.age)) {
            return false;
        }
        
        // تصفية الروضة السابقة
        if (filters.previousKindergarten && child.previousKindergarten !== filters.previousKindergarten) {
            return false;
        }
        
        // البحث في الأسماء
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            if (!child.name.toLowerCase().includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
}

// دالة ترتيب البيانات
function sortData(data, sortField = 'name', order = 'asc') {
    if (!data || data.length === 0) {
        return [];
    }
    
    return [...data].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        // تحويل للأرقام إذا كان الحقل رقمي
        if (sortField === 'age') {
            aValue = parseInt(aValue) || 0;
            bValue = parseInt(bValue) || 0;
        } else {
            // تحويل للنص
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
        }
        
        if (order === 'desc') {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        } else {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
    });
}

// دالة تصدير البيانات لـ CSV
function exportToCSV(data, filename = 'kindergarten-data') {
    if (!data || data.length === 0) {
        throw new Error('لا توجد بيانات للتصدير');
    }
    
    const headers = ['الاسم', 'العمر', 'الجنس', 'روضة سابقة', 'اسم الأب', 'رقم الهاتف'];
    const csvContent = [
        headers,
        ...data.map(child => [
            child.name,
            child.age,
            child.gender,
            child.previousKindergarten,
            child.fatherName,
            child.phone
        ])
    ].map(row => row.join(',')).join('\n');

    // إضافة BOM لدعم UTF-8
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// تصدير الدوال للاستخدام العام
if (typeof window !== 'undefined') {
    window.DataHandler = {
        sanitizeData,
        validateDataStructure,
        calculateStatistics,
        filterData,
        sortData,
        exportToCSV
    };
}
