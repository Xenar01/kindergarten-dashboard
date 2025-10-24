// نظام التكامل مع Google Sheets - محدث للاعتماد الحصري على Google Sheets

class GoogleSheetsConnector {
    constructor() {
        this.isLoading = false;
        this.lastFetchTime = null;
        this.retryCount = 0;
    }

    // تحويل رابط Google Sheets إلى رابط CSV API
    convertToCSVUrl(sheetsUrl) {
        try {
            // استخراج معرف الجدول من الرابط
            const sheetId = this.extractSheetId(sheetsUrl);
            if (!sheetId) {
                throw new Error('رابط Google Sheets غير صحيح');
            }
            
            // تكوين رابط CSV API
            return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        } catch (error) {
            console.error('خطأ في تحويل رابط Google Sheets:', error);
            throw error;
        }
    }

    // استخراج معرف الجدول من الرابط
    extractSheetId(url) {
        const patterns = [
            /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
            /key=([a-zA-Z0-9-_]+)/,
            /id=([a-zA-Z0-9-_]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        
        return null;
    }

    // تحميل البيانات من Google Sheets
    async loadData() {
        if (this.isLoading) {
            console.log('تحميل البيانات قيد التشغيل بالفعل...');
            return null;
        }

        this.isLoading = true;
        this.showLoadingState();
        
        try {
            // التحقق من وجود رابط Google Sheets
            if (!CONFIG.GOOGLE_SHEETS_URL || CONFIG.GOOGLE_SHEETS_URL === "https://docs.google.com/spreadsheets/d/12xt79hkAjkh3SpEjfwAQNeEDvdhtfna7VkEuL9yVj3A/edit#gid=0") {
                throw new Error('لم يتم تكوين رابط Google Sheets. يرجى الاتصال بالمدير لتكوين الرابط.');
            }

            const csvUrl = this.convertToCSVUrl(CONFIG.GOOGLE_SHEETS_URL);
            const data = await this.fetchWithRetry(csvUrl);
            
            if (!data || data.length === 0) {
                throw new Error('لا توجد بيانات في الجدول أو الجدول فارغ');
            }

            this.lastFetchTime = new Date();
            this.retryCount = 0;
            this.hideLoadingState();
            this.showSuccessMessage(`تم تحميل ${data.length} سجل بنجاح`);
            
            return data;

        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            this.handleLoadingError(error);
            return null;
        } finally {
            this.isLoading = false;
        }
    }

    // جلب البيانات مع إعادة المحاولة
    async fetchWithRetry(url) {
        let lastError;
        
        for (let attempt = 1; attempt <= CONFIG.NETWORK_CONFIG.RETRY_ATTEMPTS; attempt++) {
            try {
                console.log(`محاولة تحميل البيانات ${attempt}/${CONFIG.NETWORK_CONFIG.RETRY_ATTEMPTS}`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), CONFIG.NETWORK_CONFIG.TIMEOUT);
                
                const response = await fetch(url, {
                    signal: controller.signal,
                    method: 'GET',
                    mode: 'cors'
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const csvText = await response.text();
                const data = this.parseCSV(csvText);
                
                if (data && data.length > 0) {
                    return data;
                }
                
                throw new Error('البيانات المستلمة فارغة أو غير صحيحة');
                
            } catch (error) {
                lastError = error;
                console.error(`فشلت المحاولة ${attempt}:`, error.message);
                
                if (attempt < CONFIG.NETWORK_CONFIG.RETRY_ATTEMPTS) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    console.log(`إعادة المحاولة خلال ${delay}ms...`);
                    await this.sleep(delay);
                }
            }
        }
        
        throw lastError;
    }

    // تحليل بيانات CSV
    parseCSV(csvText) {
        try {
            const lines = csvText.trim().split('\n');
            
            if (lines.length < 2) {
                throw new Error('الجدول يجب أن يحتوي على رأس وسجل واحد على الأقل');
            }
            
            const headers = this.parseCSVLine(lines[0]);
            const expectedHeaders = ['الاسم', 'العمر', 'الجنس', 'روضة سابقة', 'اسم الأب', 'رقم الهاتف'];
            
            // التحقق من وجود الأعمدة المطلوبة
            const missingHeaders = expectedHeaders.filter(header => 
                !headers.some(h => h.trim() === header)
            );
            
            if (missingHeaders.length > 0) {
                throw new Error(`الأعمدة المطلوبة مفقودة: ${missingHeaders.join(', ')}`);
            }
            
            const data = [];
            
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '') continue;
                
                const values = this.parseCSVLine(lines[i]);
                
                if (values.length >= 6) {
                    const record = {
                        name: values[0]?.trim() || '',
                        age: parseInt(values[1]) || 0,
                        gender: values[2]?.trim() || '',
                        previousKindergarten: values[3]?.trim() || '',
                        fatherName: values[4]?.trim() || '',
                        phone: values[5]?.trim() || ''
                    };
                    
                    // التحقق من صحة البيانات الأساسية
                    if (record.name && record.age > 0 && record.gender) {
                        data.push(record);
                    } else if (CONFIG.DEVELOPER_CONFIG.DEBUG_MODE) {
                        console.warn(`تجاهل السجل ${i}: بيانات غير مكتملة`, record);
                    }
                }
            }
            
            if (data.length === 0) {
                throw new Error('لا توجد سجلات صحيحة في الجدول');
            }
            
            return data;
            
        } catch (error) {
            console.error('خطأ في تحليل بيانات CSV:', error);
            throw new Error(`خطأ في معالجة البيانات: ${error.message}`);
        }
    }

    // تحليل سطر CSV
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    // إظهار حالة التحميل
    showLoadingState() {
        const loadingElement = document.getElementById('loading');
        const dataContent = document.getElementById('data-content');
        
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
            loadingElement.innerHTML = `
                <div class="loading-animation">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>جاري تحميل البيانات من Google Sheets...</p>
                    <small>المحاولة ${this.retryCount + 1} من ${CONFIG.NETWORK_CONFIG.RETRY_ATTEMPTS}</small>
                </div>
            `;
        }
        
        if (dataContent) {
            dataContent.classList.add('hidden');
        }
    }

    // إخفاء حالة التحميل
    hideLoadingState() {
        const loadingElement = document.getElementById('loading');
        const dataContent = document.getElementById('data-content');
        
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
        
        if (dataContent) {
            dataContent.classList.remove('hidden');
        }
    }

    // معالجة خطأ التحميل
    handleLoadingError(error) {
        console.error('خطأ في تحميل البيانات:', error);
        this.hideLoadingState();
        
        // إظهار رسالة خطأ بسيطة
        this.showErrorAlert(error.message);
        
        // إخفاء الإحصائيات
        this.hideStatistics();
        
        // رمي الخطأ للمعالج الأعلى
        throw error;
    }

    // إخفاء الإحصائيات
    hideStatistics() {
        const statElements = [
            'total-children',
            'age-range-children', 
            'out-range-children',
            'experienced-children'
        ];
        
        statElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '---';
            }
        });
    }

    // إظهار رسالة نجاح
    showSuccessMessage(message) {
        if (CONFIG.ALERTS_CONFIG.SHOW_SUCCESS_MESSAGES) {
            this.showAlert(message, 'success');
        }
    }

    // إظهار رسالة خطأ
    showErrorAlert(message) {
        this.showAlert(`خطأ: ${message}`, 'error');
    }

    // إظهار تنبيه
    showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
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

    // دالة مساعدة للتأخير
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // التحقق من حالة الاتصال
    async checkConnection() {
        try {
            const response = await fetch('https://www.google.com', {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    // الحصول على معلومات التحميل الأخير
    getLastFetchInfo() {
        return {
            lastFetchTime: this.lastFetchTime,
            retryCount: this.retryCount,
            isLoading: this.isLoading
        };
    }
}

// إنشاء مثيل واحد من الموصل
const googleSheetsConnector = new GoogleSheetsConnector();

// دالة عامة لتحميل البيانات
async function loadFromGoogleSheets() {
    return await googleSheetsConnector.loadData();
}

// تصدير للاستخدام العام
if (typeof window !== 'undefined') {
    window.googleSheetsConnector = googleSheetsConnector;
    window.loadFromGoogleSheets = loadFromGoogleSheets;
}
