// إعدادات لوحة تحكم الروضة - Kindergarten Dashboard Configuration
const CONFIG = {
    // إعدادات الأمان والمصادقة
    ADMIN_PASSWORD: "admin123",
    
    // إعدادات Google Sheets
    GOOGLE_SHEETS_URL: "https://docs.google.com/spreadsheets/d/12xt79hkAjkh3SpEjfwAQNeEDvdhtfna7VkEuL9yVj3A/edit#gid=0",
    USE_LOCAL_DATA: false, // النظام يعتمد حصرياً على Google Sheets
    
    // إعدادات العرض والواجهة
    APP_TITLE: "لوحة تحكم الروضة",
    APP_SUBTITLE: "نظام إدارة وتحليل بيانات الأطفال",
    THEME: "light", // light أو dark
    LANGUAGE: "ar", // ar أو en
    
    // إعدادات العمر المستهدف
    MIN_AGE: 3,
    MAX_AGE: 6,
    SHOW_AGE_WARNINGS: true,
    
    // إعدادات الرسوم البيانية
    CHART_CONFIG: {
        COLORS: {
            PRIMARY: "#4F46E5",
            SECONDARY: "#10B981",
            WARNING: "#F59E0B",
            DANGER: "#EF4444",
            INFO: "#3B82F6"
        },
        ANIMATION: true,
        RESPONSIVE: true,
        SHOW_LABELS: true,
        SHOW_LEGEND: true
    },
    
    // إعدادات التصفية
    FILTER_CONFIG: {
        ENABLE_GENDER_FILTER: true,
        ENABLE_AGE_FILTER: true,
        ENABLE_PREVIOUS_KINDERGARTEN_FILTER: true,
        ENABLE_PHONE_FILTER: true,
        DEFAULT_SORT: "name", // name, age, gender
        DEFAULT_ORDER: "asc" // asc, desc
    },
    
    // إعدادات التنبيهات
    ALERTS_CONFIG: {
        SHOW_AGE_ALERTS: true,
        SHOW_MISSING_DATA_ALERTS: true,
        SHOW_SUCCESS_MESSAGES: true,
        AUTO_HIDE_DELAY: 5000 // بالملي ثانية
    },
    
    // إعدادات الجدول
    TABLE_CONFIG: {
        ITEMS_PER_PAGE: 10,
        SHOW_PAGINATION: true,
        SHOW_SEARCH: true,
        SHOW_EXPORT_BUTTON: true,
        STRIPED_ROWS: true
    },
    
    // إعدادات التصدير
    EXPORT_CONFIG: {
        ENABLE_PDF_EXPORT: true,
        ENABLE_EXCEL_EXPORT: true,
        ENABLE_CSV_EXPORT: true,
        INCLUDE_CHARTS: true
    },
    
    // إعدادات الاتصال بالإنترنت
    NETWORK_CONFIG: {
        TIMEOUT: 10000, // 10 ثوانٍ
        RETRY_ATTEMPTS: 3,
        OFFLINE_MODE: false
    },
    
    // إعدادات النسخ الاحتياطي
    BACKUP_CONFIG: {
        AUTO_BACKUP: false,
        BACKUP_INTERVAL: 24, // بالساعات
        MAX_BACKUPS: 5
    },
    
    // إعدادات المطور
    DEVELOPER_CONFIG: {
        DEBUG_MODE: false,
        CONSOLE_LOGS: false,
        PERFORMANCE_MONITORING: false
    }
};

// التحقق من صحة الإعدادات عند التحميل
function validateConfig() {
    const errors = [];
    
    if (!CONFIG.ADMIN_PASSWORD || CONFIG.ADMIN_PASSWORD.length < 6) {
        errors.push("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }
    
    if (CONFIG.MIN_AGE >= CONFIG.MAX_AGE) {
        errors.push("الحد الأدنى للعمر يجب أن يكون أقل من الحد الأقصى");
    }
    

    if (!CONFIG.GOOGLE_SHEETS_URL || CONFIG.GOOGLE_SHEETS_URL === "https://docs.google.com/spreadsheets/d/12xt79hkAjkh3SpEjfwAQNeEDvdhtfna7VkEuL9yVj3A/edit#gid=0") {
        errors.push("يجب تحديد رابط Google Sheets صحيح");
    }
    
    if (errors.length > 0) {
        console.error("أخطاء في الإعدادات:", errors);
        return false;
    }
    
    return true;
}

// حفظ الإعدادات في التخزين المحلي
function saveConfigToLocalStorage() {
    try {
        localStorage.setItem('kindergarten_config', JSON.stringify(CONFIG));
        return true;
    } catch (error) {
        console.error("خطأ في حفظ الإعدادات:", error);
        return false;
    }
}

// تحميل الإعدادات من التخزين المحلي
function loadConfigFromLocalStorage() {
    try {
        const savedConfig = localStorage.getItem('kindergarten_config');
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            Object.assign(CONFIG, parsedConfig);
        }
    } catch (error) {
        console.error("خطأ في تحميل الإعدادات:", error);
    }
}

// تصدير الإعدادات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, validateConfig, saveConfigToLocalStorage, loadConfigFromLocalStorage };
}

// التحقق من صحة الإعدادات عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    loadConfigFromLocalStorage();
    validateConfig();
});// إعدادات لوحة تحكم الروضة - Kindergarten Dashboard Configuration
const CONFIG = {
    // إعدادات الأمان والمصادقة
    ADMIN_PASSWORD: "admin123",
    
    // إعدادات Google Sheets
    GOOGLE_SHEETS_URL: "https://docs.google.com/spreadsheets/d/12xt79hkAjkh3SpEjfwAQNeEDvdhtfna7VkEuL9yVj3A/edit#gid=0",
    USE_LOCAL_DATA: false, // النظام يعتمد حصرياً على Google Sheets
    
    // إعدادات العرض والواجهة
    APP_TITLE: "لوحة تحكم الروضة",
    APP_SUBTITLE: "نظام إدارة وتحليل بيانات الأطفال",
    THEME: "light", // light أو dark
    LANGUAGE: "ar", // ar أو en
    
    // إعدادات العمر المستهدف
    MIN_AGE: 3,
    MAX_AGE: 6,
    SHOW_AGE_WARNINGS: true,
    
    // إعدادات الرسوم البيانية
    CHART_CONFIG: {
        COLORS: {
            PRIMARY: "#4F46E5",
            SECONDARY: "#10B981",
            WARNING: "#F59E0B",
            DANGER: "#EF4444",
            INFO: "#3B82F6"
        },
        ANIMATION: true,
        RESPONSIVE: true,
        SHOW_LABELS: true,
        SHOW_LEGEND: true
    },
    
    // إعدادات التصفية
    FILTER_CONFIG: {
        ENABLE_GENDER_FILTER: true,
        ENABLE_AGE_FILTER: true,
        ENABLE_PREVIOUS_KINDERGARTEN_FILTER: true,
        ENABLE_PHONE_FILTER: true,
        DEFAULT_SORT: "name", // name, age, gender
        DEFAULT_ORDER: "asc" // asc, desc
    },
    
    // إعدادات التنبيهات
    ALERTS_CONFIG: {
        SHOW_AGE_ALERTS: true,
        SHOW_MISSING_DATA_ALERTS: true,
        SHOW_SUCCESS_MESSAGES: true,
        AUTO_HIDE_DELAY: 5000 // بالملي ثانية
    },
    
    // إعدادات الجدول
    TABLE_CONFIG: {
        ITEMS_PER_PAGE: 10,
        SHOW_PAGINATION: true,
        SHOW_SEARCH: true,
        SHOW_EXPORT_BUTTON: true,
        STRIPED_ROWS: true
    },
    
    // إعدادات التصدير
    EXPORT_CONFIG: {
        ENABLE_PDF_EXPORT: true,
        ENABLE_EXCEL_EXPORT: true,
        ENABLE_CSV_EXPORT: true,
        INCLUDE_CHARTS: true
    },
    
    // إعدادات الاتصال بالإنترنت
    NETWORK_CONFIG: {
        TIMEOUT: 10000, // 10 ثوانٍ
        RETRY_ATTEMPTS: 3,
        OFFLINE_MODE: false
    },
    
    // إعدادات النسخ الاحتياطي
    BACKUP_CONFIG: {
        AUTO_BACKUP: false,
        BACKUP_INTERVAL: 24, // بالساعات
        MAX_BACKUPS: 5
    },
    
    // إعدادات المطور
    DEVELOPER_CONFIG: {
        DEBUG_MODE: false,
        CONSOLE_LOGS: false,
        PERFORMANCE_MONITORING: false
    }
};

// التحقق من صحة الإعدادات عند التحميل
function validateConfig() {
    const errors = [];
    
    if (!CONFIG.ADMIN_PASSWORD || CONFIG.ADMIN_PASSWORD.length < 6) {
        errors.push("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }
    
    if (CONFIG.MIN_AGE >= CONFIG.MAX_AGE) {
        errors.push("الحد الأدنى للعمر يجب أن يكون أقل من الحد الأقصى");
    }
    
    if (!CONFIG.GOOGLE_SHEETS_URL || CONFIG.GOOGLE_SHEETS_URL === "https://docs.google.com/spreadsheets/d/12xt79hkAjkh3SpEjfwAQNeEDvdhtfna7VkEuL9yVj3A/edit#gid=0") {
        errors.push("يجب تحديد رابط Google Sheets صحيح");
    }
    
    if (errors.length > 0) {
        console.error("أخطاء في الإعدادات:", errors);
        return false;
    }
    
    return true;
}

// حفظ الإعدادات في التخزين المحلي
function saveConfigToLocalStorage() {
    try {
        localStorage.setItem('kindergarten_config', JSON.stringify(CONFIG));
        return true;
    } catch (error) {
        console.error("خطأ في حفظ الإعدادات:", error);
        return false;
    }
}

// تحميل الإعدادات من التخزين المحلي
function loadConfigFromLocalStorage() {
    try {
        const savedConfig = localStorage.getItem('kindergarten_config');
        if (savedConfig) {
            const parsedConfig = JSON.parse(savedConfig);
            Object.assign(CONFIG, parsedConfig);
        }
    } catch (error) {
        console.error("خطأ في تحميل الإعدادات:", error);
    }
}

// تصدير الإعدادات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, validateConfig, saveConfigToLocalStorage, loadConfigFromLocalStorage };
}

// التحقق من صحة الإعدادات عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    loadConfigFromLocalStorage();
    validateConfig();
});

