// الملف الرئيسي - Main Application Controller
class KindergartenApp {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.charts = {};
        this.isInitialized = false;
    }

    // تهيئة التطبيق
    async initialize() {
        try {
            console.log('بدء تهيئة التطبيق...');
            
            // تحميل الإعدادات المحفوظة
            this.loadSavedConfig();
            
            // تطبيق المظهر
            this.applyTheme();
            
            // تحديث النصوص
            this.updateTexts();
            
            // ربط الأحداث
            this.bindEvents();
            
            // تحميل البيانات
            await this.loadData();
            
            this.isInitialized = true;
            console.log('تم تهيئة التطبيق بنجاح');
            
        } catch (error) {
            console.error('خطأ في تهيئة التطبيق:', error);
            this.handleInitializationError(error);
        }
    }

    // تحميل الإعدادات المحفوظة
    loadSavedConfig() {
        try {
            const savedConfig = localStorage.getItem('kindergarten_config');
            if (savedConfig) {
                const parsedConfig = JSON.parse(savedConfig);
                Object.assign(CONFIG, parsedConfig);
                console.log('تم تحميل الإعدادات المحفوظة');
            }
        } catch (error) {
            console.error('خطأ في تحميل الإعدادات:', error);
        }
    }

    // تطبيق المظهر
    applyTheme() {
        document.body.className = `theme-${CONFIG.THEME}`;
    }

    // تحديث النصوص
    updateTexts() {
        const titleElement = document.getElementById('app-title');
        const subtitleElement = document.getElementById('app-subtitle');
        
        if (titleElement) titleElement.textContent = CONFIG.APP_TITLE;
        if (subtitleElement) subtitleElement.textContent = CONFIG.APP_SUBTITLE;
        
        // تحديث عنوان الصفحة
        document.title = CONFIG.APP_TITLE;
    }

    // ربط الأحداث
    bindEvents() {
        // أحداث التصفية
        const genderFilter = document.getElementById('gender-filter');
        const ageFilter = document.getElementById('age-filter');
        const kindergartenFilter = document.getElementById('kindergarten-filter');
        const searchInput = document.getElementById('search-input');

        if (genderFilter) genderFilter.addEventListener('change', () => this.applyFilters());
        if (ageFilter) ageFilter.addEventListener('change', () => this.applyFilters());
        if (kindergartenFilter) kindergartenFilter.addEventListener('change', () => this.applyFilters());
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => this.applyFilters(), 300));
        }

        // أحداث التصدير
        const exportExcel = document.getElementById('export-excel');
        const exportPDF = document.getElementById('export-pdf');
        const exportCSV = document.getElementById('export-csv');

        if (exportExcel) exportExcel.addEventListener('click', () => this.exportData('excel'));
        if (exportPDF) exportPDF.addEventListener('click', () => this.exportData('pdf'));
        if (exportCSV) exportCSV.addEventListener('click', () => this.exportData('csv'));
    }

    // تحميل البيانات
    async loadData() {
        try {
            console.log('بدء تحميل البيانات...');
            
            // التحقق من وجود رابط Google Sheets
            if (!CONFIG.GOOGLE_SHEETS_URL || CONFIG.GOOGLE_SHEETS_URL === "https://docs.google.com/spreadsheets/d/your-sheet-id/edit#gid=0") {
                throw new Error('لم يتم تكوين رابط Google Sheets');
            }
            
            // تحميل البيانات
            const rawData = await loadFromGoogleSheets();
            
            if (!rawData || rawData.length === 0) {
                throw new Error('لا توجد بيانات في الجدول');
            }
            
            // تنظيف وتنسيق البيانات
            this.data = DataHandler.sanitizeData(rawData);
            
            if (this.data.length === 0) {
                throw new Error('لا توجد سجلات صحيحة في البيانات');
            }
            
            // معالجة البيانات وعرضها
            this.processData();
            this.showInterface();
            
            console.log(`تم تحميل ${this.data.length} سجل بنجاح`);
            
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            this.handleDataError(error);
        }
    }

    // معالجة البيانات
    processData() {
        if (!this.data || this.data.length === 0) {
            return;
        }

        // حساب الإحصائيات
        const stats = DataHandler.calculateStatistics(this.data);
        this.updateStatistics(stats);

        // إنشاء الرسوم البيانية
        this.createCharts(stats);

        // ملء الجدول
        this.filteredData = [...this.data];
        this.updateTable();
    }

    // تحديث الإحصائيات
    updateStatistics(stats) {
        const elements = {
            'total-children': stats.total,
            'age-range-children': stats.inRange,
            'out-range-children': stats.outOfRange,
            'experienced-children': stats.experienced
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    // إنشاء الرسوم البيانية
    createCharts(stats) {
        // رسم بياني للجنس
        this.createGenderChart(stats.genderDistribution);
        
        // رسم بياني للعمر
        this.createAgeChart(stats.ageDistribution);
    }

    // رسم بياني للجنس
    createGenderChart(genderData) {
        const ctx = document.getElementById('genderChart');
        if (!ctx) return;

        // تدمير الرسم البياني السابق إذا وجد
        if (this.charts.gender) {
            this.charts.gender.destroy();
        }

        this.charts.gender = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(genderData),
                datasets: [{
                    data: Object.values(genderData),
                    backgroundColor: [
                        CONFIG.CHART_CONFIG.COLORS.PRIMARY,
                        CONFIG.CHART_CONFIG.COLORS.SECONDARY
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: CONFIG.CHART_CONFIG.ANIMATION,
                plugins: {
                    legend: {
                        display: CONFIG.CHART_CONFIG.SHOW_LEGEND,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // رسم بياني للعمر
    createAgeChart(ageData) {
        const ctx = document.getElementById('ageChart');
        if (!ctx) return;

        // تدمير الرسم البياني السابق إذا وجد
        if (this.charts.age) {
            this.charts.age.destroy();
        }

        const sortedAges = Object.keys(ageData).sort((a, b) => parseInt(a) - parseInt(b));

        this.charts.age = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedAges.map(age => `${age} سنوات`),
                datasets: [{
                    label: 'عدد الأطفال',
                    data: sortedAges.map(age => ageData[age]),
                    backgroundColor: CONFIG.CHART_CONFIG.COLORS.INFO
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: CONFIG.CHART_CONFIG.ANIMATION,
                plugins: {
                    legend: {
                        display: CONFIG.CHART_CONFIG.SHOW_LEGEND
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // تطبيق التصفية
    applyFilters() {
        if (!this.data || this.data.length === 0) {
            return;
        }

        const filters = {
            gender: document.getElementById('gender-filter')?.value || '',
            age: document.getElementById('age-filter')?.value || '',
            previousKindergarten: document.getElementById('kindergarten-filter')?.value || '',
            search: document.getElementById('search-input')?.value || ''
        };

        this.filteredData = DataHandler.filterData(this.data, filters);
        this.updateTable();
    }

    // تحديث الجدول
    updateTable() {
        const tbody = document.getElementById('table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!this.filteredData || this.filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #6B7280;">لا توجد نتائج مطابقة للتصفية</td></tr>';
            return;
        }

        this.filteredData.forEach(child => {
            const row = document.createElement('tr');
            
            // تحديد ما إذا كان العمر خارج النطاق
            const isOutOfRange = child.age < CONFIG.MIN_AGE || child.age > CONFIG.MAX_AGE;
            if (isOutOfRange && CONFIG.SHOW_AGE_WARNINGS) {
                row.classList.add('age-warning');
            }

            row.innerHTML = `
                <td>${child.name}</td>
                <td>${child.age}</td>
                <td>${child.gender}</td>
                <td>${child.previousKindergarten}</td>
                <td>${child.fatherName}</td>
                <td>${child.phone}</td>
                <td>${isOutOfRange ? '<i class="fas fa-exclamation-triangle"></i> خارج النطاق' : '<i class="fas fa-check"></i> مناسب'}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // عرض الواجهة
    showInterface() {
        const loading = document.getElementById('loading');
        const dataContent = document.getElementById('data-content');
        
        if (loading) loading.classList.add('hidden');
        if (dataContent) dataContent.classList.remove('hidden');
    }

    // معالجة خطأ البيانات
    handleDataError(error) {
        this.showDefaultInterface();
        this.showConnectionError(error);
    }

    // معالجة خطأ التهيئة
    handleInitializationError(error) {
        console.error('فشل في تهيئة التطبيق:', error);
        this.showAlert('فشل في تهيئة التطبيق. يرجى إعادة تحميل الصفحة.', 'error');
    }

    // عرض الواجهة الافتراضية
    showDefaultInterface() {
        this.showInterface();
        
        // إعادة تعيين الإحصائيات
        const statElements = ['total-children', 'age-range-children', 'out-range-children', 'experienced-children'];
        statElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '0';
        });
        
        // إفراغ الجدول
        const tbody = document.getElementById('table-body');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #6B7280;">لا توجد بيانات للعرض</td></tr>';
        }
    }

    // عرض خطأ الاتصال
    showConnectionError(error) {
        const container = document.querySelector('.container');
        const header = document.querySelector('.header');
        
        if (!container || !header) return;
        
        // إزالة رسائل الخطأ السابقة
        const existingErrors = container.querySelectorAll('.connection-error');
        existingErrors.forEach(el => el.remove());
        
        const errorHTML = `
            <div class="connection-error alert alert-warning" style="margin: 20px 0; position: relative; top: auto; left: auto; transform: none;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>تعذر تحميل البيانات: ${error.message}</span>
            </div>
            <div class="connection-error" style="text-align: center; margin: 20px 0;">
                <button onclick="location.reload()" class="btn btn-primary" style="margin: 5px;">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
                <button onclick="window.adminDashboard && window.adminDashboard.showLoginModal()" class="btn btn-secondary" style="margin: 5px;">
                    <i class="fas fa-cog"></i> الإعدادات
                </button>
            </div>
        `;
        
        const errorContainer = document.createElement('div');
        errorContainer.innerHTML = errorHTML;
        container.insertBefore(errorContainer, header.nextSibling);
    }

    // تصدير البيانات
    exportData(format) {
        try {
            const dataToExport = this.filteredData.length > 0 ? this.filteredData : this.data;
            
            if (!dataToExport || dataToExport.length === 0) {
                this.showAlert('لا توجد بيانات للتصدير', 'warning');
                return;
            }

            switch (format) {
                case 'csv':
                    DataHandler.exportToCSV(dataToExport);
                    this.showAlert('تم تصدير البيانات بصيغة CSV بنجاح', 'success');
                    break;
                case 'excel':
                    this.showAlert('ميزة تصدير Excel قيد التطوير', 'info');
                    break;
                case 'pdf':
                    this.showAlert('ميزة تصدير PDF قيد التطوير', 'info');
                    break;
                default:
                    this.showAlert('صيغة تصدير غير مدعومة', 'error');
            }
        } catch (error) {
            console.error('خطأ في التصدير:', error);
            this.showAlert('فشل في تصدير البيانات', 'error');
        }
    }

    // عرض التنبيهات
    showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.left = '50%';
        alert.style.transform = 'translateX(-50%)';
        alert.style.zIndex = '10000';
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        `;
        
        document.body.appendChild(alert);
        
        // إخفاء التنبيه تلقائياً
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, CONFIG.ALERTS_CONFIG.AUTO_HIDE_DELAY);
        
        // إضافة حدث الإغلاق اليدوي
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.remove();
        });
    }

    // دالة مساعدة لتأخير التنفيذ
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // إعادة تحميل البيانات
    async reloadData() {
        this.data = [];
        this.filteredData = [];
        await this.loadData();
    }

    // تطبيق الإعدادات الجديدة
    applyNewSettings() {
        this.applyTheme();
        this.updateTexts();
        
        if (this.data.length > 0) {
            this.processData();
        }
    }
}

// إنشاء مثيل التطبيق وتهيئته عند تحميل الصفحة
let app;

document.addEventListener('DOMContentLoaded', async function() {
    try {
        app = new KindergartenApp();
        await app.initialize();
        
        // ربط التطبيق بالنافذة للوصول العام
        window.kindergartenApp = app;
        
    } catch (error) {
        console.error('فشل في بدء التطبيق:', error);
        
        // عرض رسالة خطأ عامة
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                    <h2>فشل في تحميل التطبيق</h2>
                    <p>حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.</p>
                    <button onclick="location.reload()" class="btn btn-primary">إعادة تحميل</button>
                </div>
            `;
        }
    }
});
