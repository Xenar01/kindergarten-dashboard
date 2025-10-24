// ========== إدارة لوحة الإدارة ==========

class AdminPanel {
    constructor(password, warningsData, allData) {
        this.password = password;
        this.warningsData = warningsData;
        this.allData = allData; // جميع البيانات للجدول
        this.elements = {};
        
        // إعدادات الجدول
        this.currentPage = 1;
        this.rowsPerPage = 10;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.filteredData = [];
        
        // إعدادات التصفية
        this.ageFilter = 'all';
        this.genderFilter = 'all';
        this.kgFilter = 'all';
    }

    /**
     * تهيئة لوحة الإدارة
     */
    initialize() {
        this._cacheElements();
        this._attachEventListeners();
        console.log('✅ تم تهيئة لوحة الإدارة');
    }

    /**
     * عرض لوحة الإدارة الكاملة
     */
    displayDashboard() {
        // عرض التنبيهات
        this._displayWarnings();
        
        // عرض الجدول
        this._displayDataTable();
        
        // فتح اللوحة
        this._showDashboard();
        
        // التمرير للأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * إخفاء لوحة الإدارة
     */
    hideDashboard() {
        this.elements.adminDashboard?.classList.remove('active');
    }

    /**
     * فتح نافذة كلمة السر
     */
    openModal() {
        if (!this.elements.adminModal) return;
        
        this.elements.adminModal.classList.add('active');
        this.elements.adminPassword.value = '';
        this.elements.adminError.textContent = '';
        this.elements.adminPassword.focus();
    }

    /**
     * إغلاق نافذة كلمة السر
     */
    closeModal() {
        this.elements.adminModal?.classList.remove('active');
    }

    // ========== عرض التنبيهات ==========

    /**
     * عرض بطاقات التنبيهات
     */
    _displayWarnings() {
        const warningCards = this.elements.warningCardsAdmin;
        if (!warningCards) return;

        warningCards.innerHTML = '';

        if (this.warningsData.length === 0) {
            warningCards.innerHTML = this._getNoWarningsHTML();
            return;
        }

        this.warningsData.forEach(warning => {
            const card = this._createWarningCard(warning);
            warningCards.appendChild(card);
        });
    }

    // ========== الجدول التفاعلي ==========

    /**
     * عرض جدول البيانات
     */
    _displayDataTable() {
        this.filteredData = [...this.allData];
        this._applySearch();
        this._applySort();
        this._renderTable();
        this._renderPagination();
    }
    
    /**
     * إعادة تعيين جميع الفلاتر
     */
    _resetTableFilters() {
        // إعادة تعيين قيم الفلاتر
        this.ageFilter = 'all';
        this.genderFilter = 'all';
        this.kgFilter = 'all';
        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        
        // تحديث عناصر الواجهة
        if (this.elements.tableAgeFilter) this.elements.tableAgeFilter.value = 'all';
        if (this.elements.tableGenderFilter) this.elements.tableGenderFilter.value = 'all';
        if (this.elements.tableKgFilter) this.elements.tableKgFilter.value = 'all';
        
        // إزالة أيقونات الفرز
        document.querySelectorAll('.data-table th').forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
        });
        
        // تحديث البيانات
        this._displayDataTable();
        
        // عرض رسالة تأكيد
        this._showTableNotification('تم إعادة تعيين جميع الفلاتر');
    }
    
    /**
     * عرض رسالة إشعار للجدول
     */
    _showTableNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'table-notification';
        notification.textContent = `✓ ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('active'), 10);
        
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    /**
     * تطبيق التصفية
     */
    _applySearch() {
        this.filteredData = [...this.allData];
        
        // تطبيق فلاتر العمر والجنس والخبرة السابقة
        this.filteredData = this.filteredData.filter(item => {
            // فلتر العمر
            if (this.ageFilter !== 'all') {
                if (this.ageFilter === 'older') {
                    if (item.age <= 8) return false;
                } else {
                    if (item.age !== parseInt(this.ageFilter)) return false;
                }
            }
            
            // فلتر الجنس
            if (this.genderFilter !== 'all') {
                if (item.gender !== this.genderFilter) return false;
            }
            
            // فلتر الخبرة السابقة
            if (this.kgFilter !== 'all') {
                const hasPrevKG = this.kgFilter === 'true';
                if (item.prevKG !== hasPrevKG) return false;
            }
            
            return true;
        });
    }

    /**
     * تطبيق الفرز
     */
    _applySort() {
        if (!this.sortColumn) return;

        this.filteredData.sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];

            // معالجة الأرقام
            if (this.sortColumn === 'age') {
                aVal = parseInt(aVal);
                bVal = parseInt(bVal);
            }

            // معالجة القيم المنطقية
            if (this.sortColumn === 'prevKG') {
                aVal = aVal ? 1 : 0;
                bVal = bVal ? 1 : 0;
            }

            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * رسم الجدول
     */
    _renderTable() {
        const tbody = this.elements.dataTableBody;
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.filteredData.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="6" class="table-empty">
                    <div class="table-empty-icon">🔍</div>
                    <div>لا توجد نتائج مطابقة للبحث</div>
                </td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }

        // حساب الصفوف المعروضة
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        pageData.forEach((item, index) => {
            const row = this._createTableRow(item, startIndex + index + 1);
            tbody.appendChild(row);
        });
    }

    /**
     * إنشاء صف في الجدول
     */
    _createTableRow(item, number) {
        const row = document.createElement('tr');
        
        const genderBadge = item.gender === 'ذكر' ? 'table-badge-male' : 'table-badge-female';
        const kgBadge = item.prevKG ? 'table-badge-yes' : 'table-badge-no';
        const kgText = item.prevKG ? 'نعم' : 'لا';

        row.innerHTML = `
            <td>${number}</td>
            <td>${item.childName}</td>
            <td>${item.age} سنوات</td>
            <td><span class="table-badge ${genderBadge}">${item.gender}</span></td>
            <td><span class="table-badge ${kgBadge}">${kgText}</span></td>
            <td>${item.fatherName}</td>
            <td class="table-phone">${item.phone}</td>
        `;

        return row;
    }

    /**
     * رسم أزرار التنقل
     */
    _renderPagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.rowsPerPage);
        
        // تحديث المعلومات
        const paginationInfo = this.elements.paginationInfo;
        if (paginationInfo) {
            const start = (this.currentPage - 1) * this.rowsPerPage + 1;
            const end = Math.min(start + this.rowsPerPage - 1, this.filteredData.length);
            paginationInfo.textContent = `عرض ${start}-${end} من ${this.filteredData.length}`;
        }

        // تحديث الأزرار
        const prevBtn = this.elements.paginationPrev;
        const nextBtn = this.elements.paginationNext;
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }

    /**
     * تصدير البيانات إلى CSV
     */
    _exportToCSV() {
        if (this.filteredData.length === 0) {
            this._showTableNotification('لا توجد بيانات للتصدير');
            return;
        }
        
        const headers = ['#', 'الاسم', 'العمر', 'الجنس', 'روضة سابقة', 'اسم الأب', 'رقم الهاتف'];
        const rows = this.filteredData.map((item, index) => [
            index + 1,
            item.childName,
            item.age,
            item.gender,
            item.prevKG ? 'نعم' : 'لا',
            item.fatherName,
            item.phone
        ]);

        // إنشاء CSV
        let csv = '\uFEFF'; // BOM لدعم العربية
        csv += headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        // تحميل الملف
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().split('T')[0];
        link.download = `بيانات-الروضة-${timestamp}-${this.filteredData.length}-سجل.csv`;
        link.click();
        
        // عرض رسالة نجاح
        this._showTableNotification(`تم تصدير ${this.filteredData.length} سجل بنجاح`);
    }

    // ========== دوال مساعدة خاصة ==========

    /**
     * تخزين مؤقت للعناصر
     */
    _cacheElements() {
        this.elements = {
            // نافذة كلمة السر
            adminBtn: document.getElementById('adminBtn'),
            adminModal: document.getElementById('adminModal'),
            adminPassword: document.getElementById('adminPassword'),
            adminSubmit: document.getElementById('adminSubmit'),
            adminCancel: document.getElementById('adminCancel'),
            adminError: document.getElementById('adminError'),
            
            // لوحة الإدارة الكاملة
            adminDashboard: document.getElementById('adminDashboard'),
            adminCloseBtn: document.getElementById('adminCloseBtn'),
            warningCardsAdmin: document.getElementById('warningCardsAdmin'),
            
            // الجدول
            exportBtn: document.getElementById('exportBtn'),
            resetTableBtn: document.getElementById('resetTableBtn'),
            dataTableBody: document.getElementById('dataTableBody'),
            paginationInfo: document.getElementById('paginationInfo'),
            paginationPrev: document.getElementById('paginationPrev'),
            paginationNext: document.getElementById('paginationNext'),
            
            // فلاتر الجدول
            tableAgeFilter: document.getElementById('tableAgeFilter'),
            tableGenderFilter: document.getElementById('tableGenderFilter'),
            tableKgFilter: document.getElementById('tableKgFilter')
        };
    }

    /**
     * ربط مستمعي الأحداث
     */
    _attachEventListeners() {
        // زر فتح لوحة الإدارة
        this.elements.adminBtn?.addEventListener('click', () => this.openModal());

        // زر الإلغاء
        this.elements.adminCancel?.addEventListener('click', () => this.closeModal());

        // النقر خارج النافذة
        this.elements.adminModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.adminModal) {
                this.closeModal();
            }
        });

        // زر إغلاق اللوحة
        this.elements.adminCloseBtn?.addEventListener('click', () => this.hideDashboard());

        // إغلاق عند النقر خارج المحتوى
        this.elements.adminDashboard?.addEventListener('click', (e) => {
            if (e.target === this.elements.adminDashboard) {
                this.hideDashboard();
            }
        });

        // زر الدخول
        this.elements.adminSubmit?.addEventListener('click', () => this._handleLogin());

        // مفتاح Enter
        this.elements.adminPassword?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this._handleLogin();
            }
        });

        // تصدير البيانات
        this.elements.exportBtn?.addEventListener('click', () => this._exportToCSV());
        
        // إعادة تعيين الفلاتر
        this.elements.resetTableBtn?.addEventListener('click', () => this._resetTableFilters());
        
        // فلاتر الجدول
        this.elements.tableAgeFilter?.addEventListener('change', (e) => {
            this.ageFilter = e.target.value;
            this.currentPage = 1;
            this._applySearch();
            this._applySort();
            this._renderTable();
            this._renderPagination();
        });
        
        this.elements.tableGenderFilter?.addEventListener('change', (e) => {
            this.genderFilter = e.target.value;
            this.currentPage = 1;
            this._applySearch();
            this._applySort();
            this._renderTable();
            this._renderPagination();
        });
        
        this.elements.tableKgFilter?.addEventListener('change', (e) => {
            this.kgFilter = e.target.value;
            this.currentPage = 1;
            this._applySearch();
            this._applySort();
            this._renderTable();
            this._renderPagination();
        });

        // أزرار التنقل
        this.elements.paginationPrev?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this._renderTable();
                this._renderPagination();
            }
        });

        this.elements.paginationNext?.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredData.length / this.rowsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this._renderTable();
                this._renderPagination();
            }
        });

        // الفرز عند النقر على عناوين الأعمدة
        document.querySelectorAll('.data-table th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const column = th.dataset.column;
                
                if (this.sortColumn === column) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = column;
                    this.sortDirection = 'asc';
                }

                // تحديث UI
                document.querySelectorAll('.data-table th').forEach(header => {
                    header.classList.remove('sort-asc', 'sort-desc');
                });
                
                th.classList.add(this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');

                this._applySort();
                this._renderTable();
            });
        });

        // تأثيرات hover
        this._attachHoverEffects();
    }

    /**
     * معالجة تسجيل الدخول
     */
    _handleLogin() {
        const enteredPassword = this.elements.adminPassword?.value;

        if (enteredPassword === this.password) {
            this.closeModal();
            this.displayDashboard();
        } else {
            this.elements.adminError.textContent = '❌ كلمة السر غير صحيحة';
            this.elements.adminPassword.value = '';
            this.elements.adminPassword.focus();
        }
    }

    /**
     * تأثيرات hover لزر الإدارة
     */
    _attachHoverEffects() {
        const adminBtn = this.elements.adminBtn;
        if (!adminBtn) return;

        adminBtn.addEventListener('mouseenter', () => {
            adminBtn.classList.add('expanded');
        });

        adminBtn.addEventListener('mouseleave', () => {
            adminBtn.classList.remove('expanded');
        });
    }

    /**
     * إنشاء بطاقة تنبيه
     */
    _createWarningCard(warning) {
        const card = document.createElement('div');
        card.className = 'warning-card';

        const ageStatus = warning.age > 8 
            ? 'أكبر من 8 سنوات' 
            : 'أقل من سنة واحدة';

        const icon = warning.gender === 'ذكر' ? '👦' : '👧';

        card.innerHTML = `
            <div class="warning-card-header">
                <span class="warning-icon">${icon}</span>
                <span class="warning-child-name">${warning.childName}</span>
            </div>
            <div class="warning-details">
                <div class="warning-detail-row">
                    <span class="warning-label">العمر:</span>
                    <span class="warning-value">${warning.age} سنوات (${warning.gender}) - ${ageStatus}</span>
                </div>
                <div class="warning-detail-row">
                    <span class="warning-label">ولي الأمر:</span>
                    <span class="warning-value">${warning.fatherName}</span>
                </div>
                <div class="warning-detail-row">
                    <span class="warning-label">رقم الهاتف:</span>
                    <span class="warning-phone">📞 ${warning.phone}</span>
                </div>
            </div>
        `;

        return card;
    }

    /**
     * HTML عند عدم وجود تنبيهات
     */
    _getNoWarningsHTML() {
        return '<div class="no-warnings">✅ ممتاز! جميع الأطفال ضمن النطاق العمري المقبول (1-8 سنوات)</div>';
    }

    /**
     * إظهار لوحة الإدارة
     */
    _showDashboard() {
        this.elements.adminDashboard?.classList.add('active');
    }
}