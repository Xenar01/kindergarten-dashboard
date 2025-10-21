
# 📊 لوحة بيانات روضة المساكن

لوحة تحكم تفاعلية لدراسة جدوى إنشاء روضة أطفال في الحي المستهدف.

## ✨ المميزات

- 📈 رسوم بيانية تفاعلية
- 🔍 نظام تصفية متقدم
- ⚠️ تنبيهات للأطفال خارج النطاق العمري
- 🔐 لوحة إدارة محمية بكلمة سر
- 📱 تصميم متجاوب (Responsive)
- 🌐 الاتصال بـ Google Sheets

## 🚀 معاينة مباشرة

[اضغط هنا للمعاينة](https://YOUR_USERNAME.github.io/kindergarten-dashboard/)

## 📁 هيكل المشروع
```
kindergarten-dashboard/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── config.js
    ├── data.js
    ├── sheets.js
    ├── charts.js
    ├── filters.js
    ├── admin.js
    └── main.js
```

## ⚙️ الإعداد

1. **تعديل الإعدادات** في `js/config.js`:
```javascript
   ADMIN_PASSWORD: "كلمتك_السرية"
   GOOGLE_SHEETS_URL: "رابط_جدولك"
   USE_LOCAL_DATA: false  // للاتصال بـ Google Sheets
```

2. **تجهيز Google Sheets**:
   - أنشئ جدول بالأعمدة: الاسم، العمر، الجنس، روضة سابقة، اسم الأب، رقم الهاتف
   - اجعله عاماً للمشاهدة
   - احصل على رابط API

## 🔐 كلمة السر الافتراضية
```
Masaken2025
```

## 🛠️ التقنيات المستخدمة

- HTML5
- CSS3 (Clean & Organized)
- JavaScript (ES6+)
- Chart.js
- Google Sheets API

## 📄 الترخيص

MIT License

---

تم التطوير بـ ❤️ لخدمة المجتمع
EOF
