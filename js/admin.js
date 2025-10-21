// ========== إدارة لوحة الإدارة ==========

class AdminPanel {
    constructor(password, warningsData) {
        this.password = password;
        this.warningsData = warningsData;
        this.elements = {};
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
     * عرض التنبيهات
     */
    displayWarnings() {
        const warningCards = this.elements.warningCards;
        if (!warningCards) return;

        warningCards.innerHTML = '';

        if (this.warningsData.length === 0) {
            warningCards.innerHTML = this._getNoWarningsHTML();
            this._showWarningsSection();
            return;
        }

        this.warningsData.forEach(warning => {
            const card = this._createWarningCard(warning);
            warningCards.appendChild(card);
        });

        this._showWarningsSection();
    }

    /**
     * إخفاء التنبيهات
     */
    hideWarnings() {
        this.elements.warningsSection?.classList.remove('show');
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

    // ========== دوال مساعدة خاصة ==========

    /**
     * تخزين مؤقت للعناصر
     */
    _cacheElements() {
        this.elements = {
            adminBtn: document.getElementById('adminBtn'),
            adminModal: document.getElementById('adminModal'),
            adminPassword: document.getElementById('adminPassword'),
            adminSubmit: document.getElementById('adminSubmit'),
            adminCancel: document.getElementById('adminCancel'),
            adminError: document.getElementById('adminError'),
            warningsSection: document.getElementById('warningsSection'),
            warningCards: document.getElementById('warningCards'),
            closeWarningsBtn: document.getElementById('closeWarningsBtn')
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

        // زر إغلاق التنبيهات
        this.elements.closeWarningsBtn?.addEventListener('click', () => this.hideWarnings());

        // زر الدخول
        this.elements.adminSubmit?.addEventListener('click', () => this._handleLogin());

        // مفتاح Enter
        this.elements.adminPassword?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this._handleLogin();
            }
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
            this.displayWarnings();
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
     * إظهار قسم التنبيهات
     */
    _showWarningsSection() {
        this.elements.warningsSection?.classList.add('show');
    }
}