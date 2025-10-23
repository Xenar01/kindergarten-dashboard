// لوحة التحكم الخاصة بالمدير - Admin Dashboard Controller
class AdminDashboard {
    constructor() {
        this.isLoggedIn = false;
        this.currentConfig = { ...CONFIG };
        this.initializeAdmin();
    }

    // تهيئة لوحة التحكم
    initializeAdmin() {
        this.createAdminInterface();
        this.bindEvents();
        this.loadSavedSettings();
    }

    // إنشاء واجهة الإدارة
    createAdminInterface() {
        this.createLoginModal();
        this.createSettingsPanel();
    }

    // إنشاء نافذة تسجيل الدخول
    createLoginModal() {
        const loginModal = document.createElement('div');
        loginModal.id = 'admin-login-modal';
        loginModal.className = 'modal-overlay';
        loginModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-lock"></i> تسجيل دخول المدير</h2>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="admin-password">كلمة المرور:</label>
                        <input type="password" id="admin-password" class="form-control" placeholder="أدخل كلمة المرور">
                        <div id="password-error" class="error-message"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="login-btn" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i> دخول
                    </button>
                    <button id="cancel-login-btn" class="btn btn-secondary">إلغاء</button>
                </div>
            </div>
        `;
        document.body.appendChild(loginModal);
    }

    // إنشاء لوحة الإعدادات
    createSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'admin-settings-panel';
        settingsPanel.className = 'settings-panel hidden';
        settingsPanel.innerHTML = `
            <div class="settings-header">
                <h2><i class="fas fa-cog"></i> لوحة تحكم المدير</h2>
                <button id="close-settings-btn" class="btn btn-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="settings-content">
                <div class="settings-tabs">
                    <button class="tab-btn active" data-tab="general">
                        <i class="fas fa-home"></i> عام
                    </button>
                    <button class="tab-btn" data-tab="appearance">
                        <i class="fas fa-palette"></i> المظهر
                    </button>
                    <button class="tab-btn" data-tab="data">
                        <i class="fas fa-database"></i> البيانات
                    </button>
                    <button class="tab-btn" data-tab="charts">
                        <i class="fas fa-chart-bar"></i> الرسوم البيانية
                    </button>
                    <button class="tab-btn" data-tab="filters">
                        <i class="fas fa-filter"></i> التصفية
                    </button>
                    <button class="tab-btn" data-tab="alerts">
                        <i class="fas fa-bell"></i> التنبيهات
                    </button>
                    <button class="tab-btn" data-tab="export">
                        <i class="fas fa-download"></i> التصدير
                    </button>
                    <button class="tab-btn" data-tab="advanced">
                        <i class="fas fa-tools"></i> متقدم
                    </button>
                </div>

                <div class="tab-content">
                    ${this.createGeneralTab()}
                    ${this.createAppearanceTab()}
                    ${this.createDataTab()}
                    ${this.createChartsTab()}
                    ${this.createFiltersTab()}
                    ${this.createAlertsTab()}
                    ${this.createExportTab()}
                    ${this.createAdvancedTab()}
                </div>
            </div>

            <div class="settings-footer">
                <button id="save-settings-btn" class="btn btn-success">
                    <i class="fas fa-save"></i> حفظ الإعدادات
                </button>
                <button id="reset-settings-btn" class="btn btn-warning">
                    <i class="fas fa-undo"></i> إعادة تعيين
                </button>
                <button id="export-config-btn" class="btn btn-info">
                    <i class="fas fa-file-export"></i> تصدير الإعدادات
                </button>
                <button id="import-config-btn" class="btn btn-info">
                    <i class="fas fa-file-import"></i> استيراد الإعدادات
                </button>
                <input type="file" id="config-file-input" accept=".json" style="display: none;">
            </div>
        `;
        document.body.appendChild(settingsPanel);
    }

    // إنشاء تبويب الإعدادات العامة
    createGeneralTab() {
        return `
            <div class="tab-panel active" id="general-tab">
                <h3>الإعدادات العامة</h3>
                
                <div class="form-group">
                    <label for="app-title">عنوان التطبيق:</label>
                    <input type="text" id="app-title" class="form-control" value="${this.currentConfig.APP_TITLE}">
                </div>
                
                <div class="form-group">
                    <label for="app-subtitle">العنوان الفرعي:</label>
                    <input type="text" id="app-subtitle" class="form-control" value="${this.currentConfig.APP_SUBTITLE}">
                </div>
                
                <div class="form-group">
                    <label for="admin-password-setting">كلمة مرور المدير:</label>
                    <input type="password" id="admin-password-setting" class="form-control" value="${this.currentConfig.ADMIN_PASSWORD}">
                </div>
                
                <div class="form-group">
                    <label for="language">اللغة:</label>
                    <select id="language" class="form-control">
                        <option value="ar" ${this.currentConfig.LANGUAGE === 'ar' ? 'selected' : ''}>العربية</option>
                        <option value="en" ${this.currentConfig.LANGUAGE === 'en' ? 'selected' : ''}>English</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="min-age">الحد الأدنى للعمر:</label>
                    <input type="number" id="min-age" class="form-control" value="${this.currentConfig.MIN_AGE}" min="1" max="10">
                </div>
                
                <div class="form-group">
                    <label for="max-age">الحد الأقصى للعمر:</label>
                    <input type="number" id="max-age" class="form-control" value="${this.currentConfig.MAX_AGE}" min="1" max="10">
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="show-age-warnings" ${this.currentConfig.SHOW_AGE_WARNINGS ? 'checked' : ''}>
                        عرض تحذيرات العمر
                    </label>
                </div>
            </div>
        `;
    }

    // إنشاء تبويب المظهر
    createAppearanceTab() {
        return `
            <div class="tab-panel" id="appearance-tab">
                <h3>إعدادات المظهر</h3>
                
                <div class="form-group">
                    <label for="theme">المظهر:</label>
                    <select id="theme" class="form-control">
                        <option value="light" ${this.currentConfig.THEME === 'light' ? 'selected' : ''}>فاتح</option>
                        <option value="dark" ${this.currentConfig.THEME === 'dark' ? 'selected' : ''}>داكن</option>
                    </select>
                </div>
                
                <div class="color-settings">
                    <h4>ألوان الرسوم البيانية</h4>
                    
                    <div class="form-group">
                        <label for="primary-color">اللون الأساسي:</label>
                        <input type="color" id="primary-color" value="${this.currentConfig.CHART_CONFIG.COLORS.PRIMARY}">
                    </div>
                    
                    <div class="form-group">
                        <label for="secondary-color">اللون الثانوي:</label>
                        <input type="color" id="secondary-color" value="${this.currentConfig.CHART_CONFIG.COLORS.SECONDARY}">
                    </div>
                    
                    <div class="form-group">
                        <label for="warning-color">لون التحذير:</label>
                        <input type="color" id="warning-color" value="${this.currentConfig.CHART_CONFIG.COLORS.WARNING}">
                    </div>
                    
                    <div class="form-group">
                        <label for="danger-color">لون الخطر:</label>
                        <input type="color" id="danger-color" value="${this.currentConfig.CHART_CONFIG.COLORS.DANGER}">
                    </div>
                    
                    <div class="form-group">
                        <label for="info-color">لون المعلومات:</label>
                        <input type="color" id="info-color" value="${this.currentConfig.CHART_CONFIG.COLORS.INFO}">
                    </div>
                </div>
            </div>
        `;
    }

    // إنشاء تبويب البيانات
    createDataTab() {
        return `
            <div class="tab-panel" id="data-tab">
                <h3>إعدادات البيانات</h3>
                
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <span>النظام يعتمد حصرياً على Google Sheets لتحميل البيانات. تأكد من تكوين الرابط بشكل صحيح.</span>
                </div>
                
                <div class="form-group">
                    <label for="google-sheets-url">رابط Google Sheets (مطلوب):</label>
                    <input type="url" id="google-sheets-url" class="form-control" 
                           value="${this.currentConfig.GOOGLE_SHEETS_URL}" 
                           placeholder="https://docs.google.com/spreadsheets/d/..."
                           required>
                    <small style="color: #6b7280; margin-top: 5px; display: block;">
                        يجب أن يكون الجدول مشاركاً للعامة (يمكن لأي شخص لديه الرابط المشاهدة)
                    </small>
                </div>
                
                <div class="form-group">
                    <label for="network-timeout">مهلة الاتصال (ملي ثانية):</label>
                    <input type="number" id="network-timeout" class="form-control" 
                           value="${this.currentConfig.NETWORK_CONFIG.TIMEOUT}" min="5000" max="60000">
                </div>
                
                <div class="form-group">
                    <label for="retry-attempts">عدد محاولات الإعادة:</label>
                    <input type="number" id="retry-attempts" class="form-control" 
                           value="${this.currentConfig.NETWORK_CONFIG.RETRY_ATTEMPTS}" min="1" max="10">
                </div>
                
                <div class="help-section" style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <h4 style="color: #0369a1; margin-bottom: 15px;">كيفية إعداد Google Sheets:</h4>
                    <ol style="color: #075985; line-height: 1.8;">
                        <li>أنشئ جدولاً جديداً في Google Sheets</li>
                        <li>أضف الأعمدة التالية بالترتيب:
                            <ul style="margin: 10px 0;">
                                <li>الاسم</li>
                                <li>العمر</li>
                                <li>الجنس</li>
                                <li>روضة سابقة</li>
                                <li>اسم الأب</li>
                                <li>رقم الهاتف</li>
                            </ul>
                        </li>
                        <li>اضغط زر "مشاركة" في أعلى يمين الجدول</li>
                        <li>اختر "يمكن لأي شخص لديه الرابط المشاهدة"</li>
                        <li>انسخ رابط الجدول والصقه في الحقل أعلاه</li>
                    </ol>
                </div>
                
                <div class="test-connection" style="margin-top: 20px;">
                    <button type="button" id="test-connection-btn" class="btn btn-info">
                        <i class="fas fa-plug"></i>
                        اختبار الاتصال
                    </button>
                    <div id="connection-result" style="margin-top: 10px;"></div>
                </div>
            </div>
        `;
    }

    // إنشاء تبويب الرسوم البيانية
    createChartsTab() {
        return `
            <div class="tab-panel" id="charts-tab">
                <h3>إعدادات الرسوم البيانية</h3>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="chart-animation" ${this.currentConfig.CHART_CONFIG.ANIMATION ? 'checked' : ''}>
                        تفعيل الحركة
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="chart-responsive" ${this.currentConfig.CHART_CONFIG.RESPONSIVE ? 'checked' : ''}>
                        التصميم المتجاوب
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="show-chart-labels" ${this.currentConfig.CHART_CONFIG.SHOW_LABELS ? 'checked' : ''}>
                        عرض التسميات
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="show-chart-legend" ${this.currentConfig.CHART_CONFIG.SHOW_LEGEND ? 'checked' : ''}>
                        عرض وصف الرسم البياني
                    </label>
                </div>
            </div>
        `;
    }

    // إنشاء تبويب التصفية
    createFiltersTab() {
        return `
            <div class="tab-panel" id="filters-tab">
                <h3>إعدادات التصفية</h3>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enable-gender-filter" ${this.currentConfig.FILTER_CONFIG.ENABLE_GENDER_FILTER ? 'checked' : ''}>
                        تفعيل تصفية الجنس
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enable-age-filter" ${this.currentConfig.FILTER_CONFIG.ENABLE_AGE_FILTER ? 'checked' : ''}>
                        تفعيل تصفية العمر
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enable-previous-kindergarten-filter" ${this.currentConfig.FILTER_CONFIG.ENABLE_PREVIOUS_KINDERGARTEN_FILTER ? 'checked' : ''}>
                        تفعيل تصفية الروضة السابقة
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enable-phone-filter" ${this.currentConfig.FILTER_CONFIG.ENABLE_PHONE_FILTER ? 'checked' : ''}>
                        تفعيل تصفية الهاتف
                    </label>
                </div>
                
                <div class="form-group">
                    <label for="default-sort">الترتيب الافتراضي:</label>
                    <select id="default-sort" class="form-control">
                        <option value="name" ${this.currentConfig.FILTER_CONFIG.DEFAULT_SORT === 'name' ? 'selected' : ''}>الاسم</option>
                        <option value="age" ${this.currentConfig.FILTER_CONFIG.DEFAULT_SORT === 'age' ? 'selected' : ''}>العمر</option>
                        <option value="gender" ${this.currentConfig.FILTER_CONFIG.DEFAULT_SORT === 'gender' ? 'selected' : ''}>الجنس</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="default-order">نوع الترتيب:</label>
                    <select id="default-order" class="form-control">
                        <option value="asc" ${this.currentConfig.FILTER_CONFIG.DEFAULT_ORDER === 'asc' ? 'selected' : ''}>تصاعدي</option>
                        <option value="desc" ${this.currentConfig.FILTER_CONFIG.DEFAULT_ORDER === 'desc' ? 'selected' : ''}>تنازلي</option>
                    </select>
                </div>
            </div>
        `;
    }

    // إنشاء تبويب التنبيهات
    createAlertsTab() {
        return `
            <div class="tab-panel" id="alerts-tab">
                <h3>إعدادات التنبيهات</h3>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="show-age-alerts" ${this.currentConfig.ALERTS_CONFIG.SHOW_AGE_ALERTS ? 'checked' : ''}>
                        عرض تنبيهات العمر
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="show-missing-data-alerts" ${this.currentConfig.ALERTS_CONFIG.SHOW_MISSING_DATA_ALERTS ? 'checked' : ''}>
                        عرض تنبيهات البيانات المفقودة
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="show-success-messages" ${this.currentConfig.ALERTS_CONFIG.SHOW_SUCCESS_MESSAGES ? 'checked' : ''}>
                        عرض رسائل النجاح
                    </label>
                </div>
                
                <div class="form-group">
                    <label for="auto-hide-delay">مدة إخفاء التنبيه تلقائياً (ملي ثانية):</label>
                    <input type="number" id="auto-hide-delay" class="form-control" 
                           value="${this.currentConfig.ALERTS_CONFIG.AUTO_HIDE_DELAY}" min="1000" max="10000">
                </div>
            </div>
        `;
    }

    // إنشاء تبويب التصدير
    createExportTab() {
        return `
            <div class="tab-panel" id="export-tab">
                <h3>إعدادات التصدير</h3>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enable-pdf-export" ${this.currentConfig.EXPORT_CONFIG.ENABLE_PDF_EXPORT ? 'checked' : ''}>
                        تفعيل تصدير PDF
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enable-excel-export" ${this.currentConfig.EXPORT_CONFIG.ENABLE_EXCEL_EXPORT ? 'checked' : ''}>
                        تفعيل تصدير Excel
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enable-csv-export" ${this.currentConfig.EXPORT_CONFIG.ENABLE_CSV_EXPORT ? 'checked' : ''}>
                        تفعيل تصدير CSV
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="include-charts" ${this.currentConfig.EXPORT_CONFIG.INCLUDE_CHARTS ? 'checked' : ''}>
                        تضمين الرسوم البيانية
                    </label>
                </div>
                
                <div class="form-group">
                    <label for="items-per-page">عدد العناصر في الصفحة:</label>
                    <input type="number" id="items-per-page" class="form-control" 
                           value="${this.currentConfig.TABLE_CONFIG.ITEMS_PER_PAGE}" min="5" max="100">
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="show-pagination" ${this.currentConfig.TABLE_CONFIG.SHOW_PAGINATION ? 'checked' : ''}>
                        عرض ترقيم الصفحات
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="show-search" ${this.currentConfig.TABLE_CONFIG.SHOW_SEARCH ? 'checked' : ''}>
                        عرض البحث
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="show-export-button" ${this.currentConfig.TABLE_CONFIG.SHOW_EXPORT_BUTTON ? 'checked' : ''}>
                        عرض زر التصدير
                    </label>
                </div>
            </div>
        `;
    }

    // إنشاء تبويب الإعدادات المتقدمة
    createAdvancedTab() {
        return `
            <div class="tab-panel" id="advanced-tab">
                <h3>الإعدادات المتقدمة</h3>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="debug-mode" ${this.currentConfig.DEVELOPER_CONFIG.DEBUG_MODE ? 'checked' : ''}>
                        وضع التطوير
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="console-logs" ${this.currentConfig.DEVELOPER_CONFIG.CONSOLE_LOGS ? 'checked' : ''}>
                        تفعيل سجلات وحدة التحكم
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="performance-monitoring" ${this.currentConfig.DEVELOPER_CONFIG.PERFORMANCE_MONITORING ? 'checked' : ''}>
                        مراقبة الأداء
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="auto-backup" ${this.currentConfig.BACKUP_CONFIG.AUTO_BACKUP ? 'checked' : ''}>
                        النسخ الاحتياطي التلقائي
                    </label>
                </div>
                
                <div class="form-group">
                    <label for="backup-interval">فترة النسخ الاحتياطي (ساعات):</label>
                    <input type="number" id="backup-interval" class="form-control" 
                           value="${this.currentConfig.BACKUP_CONFIG.BACKUP_INTERVAL}" min="1" max="168">
                </div>
                
                <div class="form-group">
                    <label for="max-backups">أقصى عدد نسخ احتياطية:</label>
                    <input type="number" id="max-backups" class="form-control" 
                           value="${this.currentConfig.BACKUP_CONFIG.MAX_BACKUPS}" min="1" max="20">
                </div>
                
                <div class="danger-zone">
                    <h4 style="color: #dc3545;">المنطقة الخطرة</h4>
                    <button id="reset-all-data-btn" class="btn btn-danger">
                        <i class="fas fa-exclamation-triangle"></i> إعادة تعيين جميع البيانات
                    </button>
                    <p class="text-muted">هذا الإجراء سيحذف جميع البيانات والإعدادات المحفوظة!</p>
                </div>
            </div>
        `;
    }

    // ربط الأحداث
    bindEvents() {
        // أحداث تسجيل الدخول
        document.getElementById('login-btn').addEventListener('click', () => this.handleLogin());
        document.getElementById('cancel-login-btn').addEventListener('click', () => this.hideLoginModal());
        document.getElementById('admin-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });

        // أحداث لوحة الإعدادات
        document.getElementById('close-settings-btn').addEventListener('click', () => this.hideSettingsPanel());
        document.getElementById('save-settings-btn').addEventListener('click', () => this.saveSettings());
        document.getElementById('reset-settings-btn').addEventListener('click', () => this.resetSettings());
        document.getElementById('export-config-btn').addEventListener('click', () => this.exportConfig());
        document.getElementById('import-config-btn').addEventListener('click', () => this.importConfig());
        document.getElementById('config-file-input').addEventListener('change', (e) => this.handleConfigImport(e));

        // أحداث التبويبات
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // أحداث خاصة
        document.getElementById('reset-all-data-btn').addEventListener('click', () => this.resetAllData());
        
        // إضافة حدث اختبار الاتصال
        setTimeout(() => {
            const testBtn = document.getElementById('test-connection-btn');
            if (testBtn) {
                testBtn.addEventListener('click', () => this.testConnection());
            }
        }, 100);

        // إضافة زر إعدادات المدير في الواجهة الرئيسية
        this.addAdminButton();
    }

    // إضافة زر إعدادات المدير
    addAdminButton() {
        const adminBtn = document.createElement('button');
        adminBtn.id = 'admin-settings-trigger';
        adminBtn.className = 'admin-btn';
        adminBtn.innerHTML = '<i class="fas fa-cog"></i>';
        adminBtn.title = 'إعدادات المدير';
        adminBtn.addEventListener('click', () => this.showLoginModal());
        document.body.appendChild(adminBtn);
    }

    // عرض نافذة تسجيل الدخول
    showLoginModal() {
        document.getElementById('admin-login-modal').classList.remove('hidden');
        document.getElementById('admin-password').focus();
    }

    // إخفاء نافذة تسجيل الدخول
    hideLoginModal() {
        document.getElementById('admin-login-modal').classList.add('hidden');
        document.getElementById('admin-password').value = '';
        document.getElementById('password-error').textContent = '';
    }

    // معالجة تسجيل الدخول
    handleLogin() {
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('password-error');

        if (password === this.currentConfig.ADMIN_PASSWORD) {
            this.isLoggedIn = true;
            this.hideLoginModal();
            this.showSettingsPanel();
            errorDiv.textContent = '';
        } else {
            errorDiv.textContent = 'كلمة المرور غير صحيحة';
            document.getElementById('admin-password').focus();
        }
    }

    // عرض لوحة الإعدادات
    showSettingsPanel() {
        document.getElementById('admin-settings-panel').classList.remove('hidden');
        this.updateFormValues();
    }

    // إخفاء لوحة الإعدادات
    hideSettingsPanel() {
        document.getElementById('admin-settings-panel').classList.add('hidden');
        this.isLoggedIn = false;
    }

    // تبديل التبويبات
    switchTab(tabName) {
        // إخفاء جميع التبويبات
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // عرض التبويب المحدد
        document.getElementById(`${tabName}-tab`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    // تحديث قيم النماذج
    updateFormValues() {
        // تحديث القيم في جميع الحقول بناءً على الإعدادات الحالية
        Object.keys(this.currentConfig).forEach(key => {
            const element = document.getElementById(key.toLowerCase().replace(/_/g, '-'));
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.currentConfig[key];
                } else {
                    element.value = this.currentConfig[key];
                }
            }
        });
    }

    // حفظ الإعدادات
    saveSettings() {
        this.collectFormData();
        
        if (this.validateSettings()) {
            // حفظ في التخزين المحلي
            localStorage.setItem('kindergarten_config', JSON.stringify(this.currentConfig));
            
            // تطبيق الإعدادات الجديدة
            Object.assign(CONFIG, this.currentConfig);
            
            // إعادة تحميل التطبيق لتطبيق الإعدادات الجديدة
            this.applySettings();
            
            this.showAlert('تم حفظ الإعدادات بنجاح!', 'success');
        }
    }

    // جمع بيانات النماذج
    collectFormData() {
        // الإعدادات العامة
        this.currentConfig.APP_TITLE = document.getElementById('app-title').value;
        this.currentConfig.APP_SUBTITLE = document.getElementById('app-subtitle').value;
        this.currentConfig.ADMIN_PASSWORD = document.getElementById('admin-password-setting').value;
        this.currentConfig.LANGUAGE = document.getElementById('language').value;
        this.currentConfig.MIN_AGE = parseInt(document.getElementById('min-age').value);
        this.currentConfig.MAX_AGE = parseInt(document.getElementById('max-age').value);
        this.currentConfig.SHOW_AGE_WARNINGS = document.getElementById('show-age-warnings').checked;

        // إعدادات المظهر
        this.currentConfig.THEME = document.getElementById('theme').value;
        this.currentConfig.CHART_CONFIG.COLORS.PRIMARY = document.getElementById('primary-color').value;
        this.currentConfig.CHART_CONFIG.COLORS.SECONDARY = document.getElementById('secondary-color').value;
        this.currentConfig.CHART_CONFIG.COLORS.WARNING = document.getElementById('warning-color').value;
        this.currentConfig.CHART_CONFIG.COLORS.DANGER = document.getElementById('danger-color').value;
        this.currentConfig.CHART_CONFIG.COLORS.INFO = document.getElementById('info-color').value;

        // إعدادات البيانات
        this.currentConfig.GOOGLE_SHEETS_URL = document.getElementById('google-sheets-url').value;
        this.currentConfig.NETWORK_CONFIG.TIMEOUT = parseInt(document.getElementById('network-timeout').value);
        this.currentConfig.NETWORK_CONFIG.RETRY_ATTEMPTS = parseInt(document.getElementById('retry-attempts').value);

        // إعدادات الرسوم البيانية
        this.currentConfig.CHART_CONFIG.ANIMATION = document.getElementById('chart-animation').checked;
        this.currentConfig.CHART_CONFIG.RESPONSIVE = document.getElementById('chart-responsive').checked;
        this.currentConfig.CHART_CONFIG.SHOW_LABELS = document.getElementById('show-chart-labels').checked;
        this.currentConfig.CHART_CONFIG.SHOW_LEGEND = document.getElementById('show-chart-legend').checked;

        // إعدادات التصفية
        this.currentConfig.FILTER_CONFIG.ENABLE_GENDER_FILTER = document.getElementById('enable-gender-filter').checked;
        this.currentConfig.FILTER_CONFIG.ENABLE_AGE_FILTER = document.getElementById('enable-age-filter').checked;
        this.currentConfig.FILTER_CONFIG.ENABLE_PREVIOUS_KINDERGARTEN_FILTER = document.getElementById('enable-previous-kindergarten-filter').checked;
        this.currentConfig.FILTER_CONFIG.ENABLE_PHONE_FILTER = document.getElementById('enable-phone-filter').checked;
        this.currentConfig.FILTER_CONFIG.DEFAULT_SORT = document.getElementById('default-sort').value;
        this.currentConfig.FILTER_CONFIG.DEFAULT_ORDER = document.getElementById('default-order').value;

        // إعدادات التنبيهات
        this.currentConfig.ALERTS_CONFIG.SHOW_AGE_ALERTS = document.getElementById('show-age-alerts').checked;
        this.currentConfig.ALERTS_CONFIG.SHOW_MISSING_DATA_ALERTS = document.getElementById('show-missing-data-alerts').checked;
        this.currentConfig.ALERTS_CONFIG.SHOW_SUCCESS_MESSAGES = document.getElementById('show-success-messages').checked;
        this.currentConfig.ALERTS_CONFIG.AUTO_HIDE_DELAY = parseInt(document.getElementById('auto-hide-delay').value);

        // إعدادات التصدير
        this.currentConfig.EXPORT_CONFIG.ENABLE_PDF_EXPORT = document.getElementById('enable-pdf-export').checked;
        this.currentConfig.EXPORT_CONFIG.ENABLE_EXCEL_EXPORT = document.getElementById('enable-excel-export').checked;
        this.currentConfig.EXPORT_CONFIG.ENABLE_CSV_EXPORT = document.getElementById('enable-csv-export').checked;
        this.currentConfig.EXPORT_CONFIG.INCLUDE_CHARTS = document.getElementById('include-charts').checked;
        this.currentConfig.TABLE_CONFIG.ITEMS_PER_PAGE = parseInt(document.getElementById('items-per-page').value);
        this.currentConfig.TABLE_CONFIG.SHOW_PAGINATION = document.getElementById('show-pagination').checked;
        this.currentConfig.TABLE_CONFIG.SHOW_SEARCH = document.getElementById('show-search').checked;
        this.currentConfig.TABLE_CONFIG.SHOW_EXPORT_BUTTON = document.getElementById('show-export-button').checked;

        // الإعدادات المتقدمة
        this.currentConfig.DEVELOPER_CONFIG.DEBUG_MODE = document.getElementById('debug-mode').checked;
        this.currentConfig.DEVELOPER_CONFIG.CONSOLE_LOGS = document.getElementById('console-logs').checked;
        this.currentConfig.DEVELOPER_CONFIG.PERFORMANCE_MONITORING = document.getElementById('performance-monitoring').checked;
        this.currentConfig.BACKUP_CONFIG.AUTO_BACKUP = document.getElementById('auto-backup').checked;
        this.currentConfig.BACKUP_CONFIG.BACKUP_INTERVAL = parseInt(document.getElementById('backup-interval').value);
        this.currentConfig.BACKUP_CONFIG.MAX_BACKUPS = parseInt(document.getElementById('max-backups').value);
    }

    // التحقق من صحة الإعدادات
    validateSettings() {
        const errors = [];

        if (!this.currentConfig.APP_TITLE.trim()) {
            errors.push('عنوان التطبيق مطلوب');
        }

        if (this.currentConfig.ADMIN_PASSWORD.length < 6) {
            errors.push('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        }

        if (this.currentConfig.MIN_AGE >= this.currentConfig.MAX_AGE) {
            errors.push('الحد الأدنى للعمر يجب أن يكون أقل من الحد الأقصى');
        }

        if (!this.currentConfig.GOOGLE_SHEETS_URL.trim() || this.currentConfig.GOOGLE_SHEETS_URL === "https://docs.google.com/spreadsheets/d/your-sheet-id/edit#gid=0") {
            errors.push('يجب تحديد رابط Google Sheets صحيح');
        }

        if (errors.length > 0) {
            this.showAlert('أخطاء في الإعدادات:\n' + errors.join('\n'), 'error');
            return false;
        }

        return true;
    }

    // تطبيق الإعدادات
    applySettings() {
        // تحديث عنوان الصفحة
        document.title = this.currentConfig.APP_TITLE;
        
        // تطبيق المظهر
        document.body.className = `theme-${this.currentConfig.THEME}`;
        
        // إعادة تحميل البيانات إذا تغيرت الإعدادات
        if (window.loadData) {
            window.loadData();
        }
        
        // إعادة رسم الرسوم البيانية
        if (window.updateCharts) {
            window.updateCharts();
        }
    }

    // إعادة تعيين الإعدادات
    resetSettings() {
        if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
            this.currentConfig = { ...CONFIG };
            this.updateFormValues();
            this.showAlert('تم إعادة تعيين الإعدادات', 'info');
        }
    }

    // تصدير الإعدادات
    exportConfig() {
        const configData = JSON.stringify(this.currentConfig, null, 2);
        const blob = new Blob([configData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `kindergarten-config-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showAlert('تم تصدير الإعدادات بنجاح', 'success');
    }

    // استيراد الإعدادات
    importConfig() {
        document.getElementById('config-file-input').click();
    }

    // معالجة استيراد الإعدادات
    handleConfigImport(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedConfig = JSON.parse(e.target.result);
                    this.currentConfig = { ...importedConfig };
                    this.updateFormValues();
                    this.showAlert('تم استيراد الإعدادات بنجاح', 'success');
                } catch (error) {
                    this.showAlert('خطأ في ملف الإعدادات', 'error');
                }
            };
            reader.readAsText(file);
        }
    }

    // إعادة تعيين جميع البيانات
    resetAllData() {
        if (confirm('تحذير: هذا الإجراء سيحذف جميع البيانات والإعدادات المحفوظة!\nهل أنت متأكد؟')) {
            localStorage.clear();
            location.reload();
        }
    }

    // اختبار الاتصال بـ Google Sheets
    async testConnection() {
        const testBtn = document.getElementById('test-connection-btn');
        const resultDiv = document.getElementById('connection-result');
        const urlInput = document.getElementById('google-sheets-url');
        
        if (!urlInput.value.trim()) {
            resultDiv.innerHTML = '<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> يرجى إدخال رابط Google Sheets أولاً</div>';
            return;
        }
        
        testBtn.disabled = true;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الاختبار...';
        resultDiv.innerHTML = '<div class="alert alert-info"><i class="fas fa-clock"></i> جاري اختبار الاتصال...</div>';
        
        try {
            // إنشاء موصل مؤقت للاختبار
            const tempConfig = { ...this.currentConfig };
            tempConfig.GOOGLE_SHEETS_URL = urlInput.value;
            
            // محاولة تحويل الرابط والاتصال
            const connector = new GoogleSheetsConnector();
            const csvUrl = connector.convertToCSVUrl(tempConfig.GOOGLE_SHEETS_URL);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(csvUrl, {
                signal: controller.signal,
                method: 'GET',
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const csvText = await response.text();
                const lines = csvText.trim().split('\n');
                
                if (lines.length >= 2) {
                    resultDiv.innerHTML = `
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i> 
                            الاتصال ناجح! تم العثور على ${lines.length - 1} سجل في الجدول.
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle"></i> 
                            الاتصال ناجح لكن الجدول فارغ أو يحتوي على رأس فقط.
                        </div>
                    `;
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            let errorMessage = 'فشل الاتصال: ';
            
            if (error.name === 'AbortError') {
                errorMessage += 'انتهت مهلة الاتصال';
            } else if (error.message.includes('CORS')) {
                errorMessage += 'مشكلة في أذونات الوصول. تأكد من أن الجدول مشارك للعامة';
            } else {
                errorMessage += error.message;
            }
            
            resultDiv.innerHTML = `
                <div class="alert alert-error">
                    <i class="fas fa-times-circle"></i> 
                    ${errorMessage}
                </div>
            `;
        } finally {
            testBtn.disabled = false;
            testBtn.innerHTML = '<i class="fas fa-plug"></i> اختبار الاتصال';
        }
    }

    // تحميل الإعدادات المحفوظة
    loadSavedSettings() {
        const savedConfig = localStorage.getItem('kindergarten_config');
        if (savedConfig) {
            try {
                this.currentConfig = { ...JSON.parse(savedConfig) };
                Object.assign(CONFIG, this.currentConfig);
            } catch (error) {
                console.error('خطأ في تحميل الإعدادات المحفوظة:', error);
            }
        }
    }

    // عرض التنبيهات
    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // إخفاء التنبيه تلقائياً
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, this.currentConfig.ALERTS_CONFIG.AUTO_HIDE_DELAY);
        
        // إضافة حدث الإغلاق اليدوي
        alertDiv.querySelector('.alert-close').addEventListener('click', () => {
            alertDiv.remove();
        });
    }
}

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboard = new AdminDashboard();
});
