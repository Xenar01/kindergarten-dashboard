// ========== الملف الرئيسي للتطبيق ==========

class KindergartenApp {
    constructor() {
        // البيانات
        this.allData = [];
        this.childrenData = [];
        this.warningsData = [];
        this.filteredData = [];

        // المديرون (Managers)
        this.chartsManager = null;
        this.filtersManager = null;
        this.adminPanel = null;
        this.sheetsLoader = null;
    }

    /**
     * تهيئة التطبيق
     */
    async initialize() {
        try {
            console.log('🚀 بدء تهيئة التطبيق...');

            // تحميل البيانات
            await this._loadData();

            // معالجة البيانات
            this._processData();

            // تهيئة المكونات
            this._initializeComponents();

            // إخفاء شاشة التحميل
            this._hideLoadingScreen();

            // عرض البيانات
            this.updateDashboard();

            console.log('✅ تم تهيئة التطبيق بنجاح');
        } catch (error) {
            console.error('❌ خطأ في تهيئة التطبيق:', error);
            this._showError('فشل في تهيئة التطبيق');
        }
    }

    /**
     * تحديث لوحة البيانات
     */
    updateDashboard() {
        this._updateKPIs();
        this._updateCharts();
        this._updateStudentsList();
    }

    // ========== تحميل البيانات ==========

    /**
     * تحميل البيانات (محلية أو من Google Sheets)
     */
    async _loadData() {
        if (CONFIG.USE_LOCAL_DATA) {
            console.log('📦 استخدام البيانات المحلية...');
            this.allData = [...LOCAL_DATA];
            return;
        }

        console.log('🌐 تحميل البيانات من Google Sheets...');
        this.sheetsLoader = new GoogleSheetsLoader(CONFIG.GOOGLE_SHEETS_URL);
        
        const result = await this.sheetsLoader.loadData();

        if (result.success) {
            this.allData = result.data;
        } else {
            console.warn('⚠️ فشل تحميل البيانات من Google Sheets، استخدام البيانات المحلية...');
            this.allData = [...LOCAL_DATA];
        }
    }

    /**
     * معالجة البيانات وفصلها
     */
    _processData() {
        this.childrenData = [];
        this.warningsData = [];

        this.allData.forEach(child => {
            if (child.age >= CONFIG.MIN_AGE && child.age <= CONFIG.MAX_AGE) {
                // أطفال ضمن النطاق المقبول
                this.childrenData.push({
                    name: child.childName,
                    age: child.age,
                    gender: child.gender,
                    prevKG: child.prevKG
                });
            } else {
                // أطفال خارج النطاق
                this.warningsData.push(child);
            }
        });

        this.filteredData = [...this.childrenData];
        console.log(`✅ تم معالجة ${this.childrenData.length} طفل ضمن النطاق`);
        console.log(`⚠️ تم العثور على ${this.warningsData.length} طفل خارج النطاق`);
    }

    // ========== تهيئة المكونات ==========

    /**
     * تهيئة جميع المكونات
     */
    _initializeComponents() {
        // الرسوم البيانية
        this.chartsManager = new ChartsManager();
        this.chartsManager.initializeAll();

        // التصفية
        this.filtersManager = new FiltersManager(() => this._handleFilterChange());
        this.filtersManager.initialize();

        // لوحة الإدارة - تمرير جميع البيانات
        this.adminPanel = new AdminPanel(CONFIG.ADMIN_PASSWORD, this.warningsData, this.allData);
        this.adminPanel.initialize();
        
        // تفعيل الضغط 7 مرات على الأيقونة
        this._initializeSecretTap();
    }
    
    /**
     * تفعيل الضغط 7 مرات على أيقونة الترويسة لفتح لوحة الإدارة
     */
    _initializeSecretTap() {
        const headerIcon = document.getElementById('headerIcon');
        if (!headerIcon) return;
        
        let tapCount = 0;
        let tapTimer = null;
        
        headerIcon.addEventListener('click', () => {
            tapCount++;
            
            // إلغاء المؤقت السابق
            if (tapTimer) {
                clearTimeout(tapTimer);
            }
            
            // إذا وصل العداد إلى 7، فتح لوحة الإدارة
            if (tapCount >= 7) {
                tapCount = 0;
                if (this.adminPanel) {
                    this.adminPanel.openModal();
                }
            } else {
                // إعادة تعيين العداد بعد 2 ثانية
                tapTimer = setTimeout(() => {
                    tapCount = 0;
                }, 5000);
            }
        });
    }

    /**
     * معالجة تغيير الفلتر
     */
    _handleFilterChange() {
        this.filteredData = this.filtersManager.applyFilters(this.childrenData);
        this.updateDashboard();
    }

    // ========== تحديث الواجهة ==========

    /**
     * تحديث مؤشرات الأداء (KPIs)
     */
    _updateKPIs() {
        const total = this.filteredData.length;
        const avgAge = total > 0 
            ? (this.filteredData.reduce((sum, child) => sum + child.age, 0) / total).toFixed(1) 
            : 0;
        const classrooms = Math.ceil(total / CONFIG.STUDENTS_PER_CLASS);
        const teachers = classrooms;

        this._setElementText('totalChildren', total);
        this._setElementText('avgAge', avgAge);
        this._setElementText('classrooms', classrooms);
        this._setElementText('teachers', teachers);
    }

    /**
     * تحديث الرسوم البيانية
     */
    _updateCharts() {
        if (this.chartsManager) {
            this.chartsManager.updateAll(this.filteredData);
        }
    }

    /**
     * تحديث قائمة الطلاب
     */
    _updateStudentsList() {
        const container = document.getElementById('studentsList');
        if (!container) return;

        container.innerHTML = '';

        this.filteredData.forEach(child => {
            const item = this._createStudentItem(child);
            container.appendChild(item);
        });

        this._setElementText('listCount', this.filteredData.length);
    }

    /**
     * إنشاء عنصر طالب
     */
    _createStudentItem(child) {
        const item = document.createElement('div');
        item.className = 'student-item';

        const genderBadgeClass = child.gender === 'ذكر' ? 'badge-male' : 'badge-female';
        const kgBadgeClass = child.prevKG ? 'badge-kg-yes' : 'badge-kg-no';
        const kgText = child.prevKG ? 'روضة سابقة' : 'جديد';

        item.innerHTML = `
            <div class="student-name">${child.name}</div>
            <div class="student-info">
                <span class="student-badge badge-age">${child.age} سنوات</span>
                <span class="student-badge ${genderBadgeClass}">${child.gender}</span>
                <span class="student-badge ${kgBadgeClass}">${kgText}</span>
            </div>
        `;

        return item;
    }

    // ========== دوال مساعدة ==========

    /**
     * إخفاء شاشة التحميل
     */
    _hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }

    /**
     * عرض رسالة خطأ
     */
    _showError(message) {
        alert(message);
        this._hideLoadingScreen();
    }

    /**
     * تعيين نص لعنصر
     */
    _setElementText(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }
}

// ========== تهيئة التطبيق عند تحميل الصفحة ==========

let app;

function initApp() {
    app = new KindergartenApp();
    app.initialize();
}

// التأكد من تحميل DOM قبل التشغيل
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}