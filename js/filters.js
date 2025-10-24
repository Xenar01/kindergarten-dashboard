// ========== إدارة التصفية ==========

class FiltersManager {
    constructor(onFilterChange) {
        this.onFilterChange = onFilterChange; // callback عند تغيير الفلتر
        this.elements = {};
    }

    /**
     * تهيئة نظام التصفية
     */
    initialize() {
        this._cacheElements();
        this._attachEventListeners();
        console.log('✅ تم تهيئة نظام التصفية');
    }

    /**
     * تطبيق الفلاتر على البيانات
     */
    applyFilters(data) {
        const filters = this._getCurrentFilters();
        
        return data.filter(child => {
            const passAge = this._checkAgeFilter(child, filters.age);
            const passGender = this._checkGenderFilter(child, filters.gender);
            const passKG = this._checkKGFilter(child, filters.kg);
            
            return passAge && passGender && passKG;
        });
    }

    /**
     * إعادة تعيين جميع الفلاتر
     */
    resetFilters() {
        if (this.elements.ageFilter) this.elements.ageFilter.value = 'all';
        if (this.elements.genderFilter) this.elements.genderFilter.value = 'all';
        if (this.elements.kgFilter) this.elements.kgFilter.value = 'all';
        
        if (this.onFilterChange) {
            this.onFilterChange();
        }
    }

    /**
     * فتح لوحة التصفية
     */
    openPanel() {
        this.elements.filterPanel?.classList.add('open');
        this.elements.filterOverlay?.classList.add('active');
    }

    /**
     * إغلاق لوحة التصفية
     */
    closePanel() {
        this.elements.filterPanel?.classList.remove('open');
        this.elements.filterOverlay?.classList.remove('active');
    }

    // ========== دوال مساعدة خاصة ==========

    /**
     * تخزين مؤقت للعناصر
     */
    _cacheElements() {
        this.elements = {
            filterBtn: document.getElementById('filterBtn'),
            resetBtn: document.getElementById('resetBtn'),
            filterPanel: document.getElementById('filterPanel'),
            filterOverlay: document.getElementById('filterOverlay'),
            closePanelBtn: document.getElementById('closePanelBtn'),
            applyFilterBtn: document.getElementById('applyFilterBtn'),
            cancelFilterBtn: document.getElementById('cancelFilterBtn'),
            ageFilter: document.getElementById('ageFilter'),
            genderFilter: document.getElementById('genderFilter'),
            kgFilter: document.getElementById('kgFilter')
        };
    }

    /**
     * ربط مستمعي الأحداث
     */
    _attachEventListeners() {
        // زر فتح لوحة التصفية
        this.elements.filterBtn?.addEventListener('click', () => this.openPanel());
        
        // زر إغلاق لوحة التصفية
        this.elements.closePanelBtn?.addEventListener('click', () => this.closePanel());
        
        // النقر خارج اللوحة
        this.elements.filterOverlay?.addEventListener('click', () => this.closePanel());
        
        // زر تطبيق التصفية
        this.elements.applyFilterBtn?.addEventListener('click', () => {
            if (this.onFilterChange) this.onFilterChange();
            this.closePanel();
        });
        
        // زر إلغاء التصفية
        this.elements.cancelFilterBtn?.addEventListener('click', () => {
            this.closePanel();
        });
        
        // زر إعادة التعيين
        this.elements.resetBtn?.addEventListener('click', () => this.resetFilters());
        
        // تغيير الفلاتر
        this.elements.ageFilter?.addEventListener('change', () => {
            // التطبيق التلقائي معطل - سيتم التطبيق عند الضغط على زر "تطبيق"
        });
        
        this.elements.genderFilter?.addEventListener('change', () => {
            // التطبيق التلقائي معطل - سيتم التطبيق عند الضغط على زر "تطبيق"
        });
        
        this.elements.kgFilter?.addEventListener('change', () => {
            // التطبيق التلقائي معطل - سيتم التطبيق عند الضغط على زر "تطبيق"
        });

        // تأثيرات hover للأزرار
        this._attachHoverEffects();
    }

    /**
     * تأثيرات hover للأزرار العائمة
     */
    _attachHoverEffects() {
        const buttons = [
            this.elements.filterBtn,
            this.elements.resetBtn
        ];

        buttons.forEach(btn => {
            if (!btn) return;
            
            btn.addEventListener('mouseenter', () => {
                btn.classList.add('expanded');
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('expanded');
            });
        });
    }

    /**
     * الحصول على الفلاتر الحالية
     */
    _getCurrentFilters() {
        return {
            age: this.elements.ageFilter?.value || 'all',
            gender: this.elements.genderFilter?.value || 'all',
            kg: this.elements.kgFilter?.value || 'all'
        };
    }

    /**
     * فحص فلتر العمر
     */
    _checkAgeFilter(child, ageFilter) {
        if (ageFilter === 'all') return true;
        return child.age === parseInt(ageFilter);
    }

    /**
     * فحص فلتر الجنس
     */
    _checkGenderFilter(child, genderFilter) {
        if (genderFilter === 'all') return true;
        return child.gender === genderFilter;
    }

    /**
     * فحص فلتر الخبرة السابقة
     */
    _checkKGFilter(child, kgFilter) {
        if (kgFilter === 'all') return true;
        return child.prevKG === (kgFilter === 'true');
    }
}