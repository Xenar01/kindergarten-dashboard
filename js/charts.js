// ========== إدارة الرسوم البيانية ==========

class ChartsManager {
    constructor() {
        this.charts = {
            age: null,
            gender: null,
            kg: null
        };
    }

    /**
     * تهيئة جميع الرسوم البيانية
     */
    initializeAll() {
        this.initAgeChart();
        this.initGenderChart();
        this.initKGChart();
    }

    /**
     * رسم بياني للأعمار
     */
    initAgeChart() {
        const ctx = document.getElementById('ageChart')?.getContext('2d');
        if (!ctx) {
            console.error('❌ لم يتم العثور على عنصر ageChart');
            return;
        }

        this.charts.age = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1-2 سنة', '3 سنوات', '4 سنوات', '5 سنوات', '6-8 سنوات'],
                datasets: [
                    {
                        label: 'ذكور',
                        data: [0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(14, 165, 233, 0.85)',
                        borderRadius: 10,
                        borderWidth: 0
                    },
                    {
                        label: 'إناث',
                        data: [0, 0, 0, 0, 0],
                        backgroundColor: 'rgba(236, 72, 153, 0.85)',
                        borderRadius: 10,
                        borderWidth: 0
                    }
                ]
            },
            options: this._getBarChartOptions()
        });
    }

    /**
     * رسم بياني للجنس
     */
    initGenderChart() {
        const ctx = document.getElementById('genderChart')?.getContext('2d');
        if (!ctx) {
            console.error('❌ لم يتم العثور على عنصر genderChart');
            return;
        }

        this.charts.gender = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['ذكور', 'إناث'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: [
                        'rgba(14, 165, 233, 0.9)',
                        'rgba(236, 72, 153, 0.9)'
                    ],
                    borderWidth: 0
                }]
            },
            options: this._getPieChartOptions()
        });
    }

    /**
     * رسم بياني للخبرة السابقة
     */
    initKGChart() {
        const ctx = document.getElementById('kgChart')?.getContext('2d');
        if (!ctx) {
            console.error('❌ لم يتم العثور على عنصر kgChart');
            return;
        }

        this.charts.kg = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['لم يدخل روضة', 'دخل روضة سابقاً'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: [
                        'rgba(251, 146, 60, 0.9)',
                        'rgba(52, 211, 153, 0.9)'
                    ],
                    borderWidth: 0
                }]
            },
            options: this._getPieChartOptions()
        });
    }

    /**
     * تحديث رسم الأعمار
     */
    updateAgeChart(data) {
        if (!this.charts.age) return;

        const ageGroups = this._calculateAgeGroups(data);
        
        this.charts.age.data.datasets[0].data = ageGroups.males;
        this.charts.age.data.datasets[1].data = ageGroups.females;
        this.charts.age.update();
    }

    /**
     * تحديث رسم الجنس
     */
    updateGenderChart(data) {
        if (!this.charts.gender) return;

        const genderCount = this._calculateGenderCount(data);
        
        this.charts.gender.data.datasets[0].data = [
            genderCount.males,
            genderCount.females
        ];
        this.charts.gender.update();
    }

    /**
     * تحديث رسم الخبرة السابقة
     */
    updateKGChart(data) {
        if (!this.charts.kg) return;

        const kgCount = this._calculateKGCount(data);
        
        this.charts.kg.data.datasets[0].data = [
            kgCount.noKG,
            kgCount.hasKG
        ];
        this.charts.kg.update();
    }

    /**
     * تحديث جميع الرسوم البيانية
     */
    updateAll(data) {
        this.updateAgeChart(data);
        this.updateGenderChart(data);
        this.updateKGChart(data);
    }

    // ========== دوال مساعدة خاصة ==========

    /**
     * حساب توزيع الأعمار حسب الفئات
     */
    _calculateAgeGroups(data) {
        return {
            males: [
                data.filter(c => (c.age === 1 || c.age === 2) && c.gender === 'ذكر').length,
                data.filter(c => c.age === 3 && c.gender === 'ذكر').length,
                data.filter(c => c.age === 4 && c.gender === 'ذكر').length,
                data.filter(c => c.age === 5 && c.gender === 'ذكر').length,
                data.filter(c => (c.age >= 6 && c.age <= 8) && c.gender === 'ذكر').length
            ],
            females: [
                data.filter(c => (c.age === 1 || c.age === 2) && c.gender === 'أنثى').length,
                data.filter(c => c.age === 3 && c.gender === 'أنثى').length,
                data.filter(c => c.age === 4 && c.gender === 'أنثى').length,
                data.filter(c => c.age === 5 && c.gender === 'أنثى').length,
                data.filter(c => (c.age >= 6 && c.age <= 8) && c.gender === 'أنثى').length
            ]
        };
    }

    /**
     * حساب عدد الذكور والإناث
     */
    _calculateGenderCount(data) {
        return {
            males: data.filter(c => c.gender === 'ذكر').length,
            females: data.filter(c => c.gender === 'أنثى').length
        };
    }

    /**
     * حساب عدد من دخل ولم يدخل روضة
     */
    _calculateKGCount(data) {
        return {
            noKG: data.filter(c => !c.prevKG).length,
            hasKG: data.filter(c => c.prevKG).length
        };
    }

    /**
     * إعدادات الرسم البياني الشريطي
     */
    _getBarChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { family: 'Cairo', size: 15, weight: 'bold' },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { family: 'Cairo', size: 14 },
                    bodyFont: { family: 'Cairo', size: 13 },
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 2,
                        font: { family: 'Cairo', size: 13, weight: 'bold' }
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                    ticks: { font: { family: 'Cairo', size: 14, weight: 'bold' } },
                    grid: { display: false }
                }
            }
        };
    }

    /**
     * إعدادات الرسم البياني الدائري
     */
    _getPieChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Cairo', size: 14, weight: 'bold' },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { family: 'Cairo', size: 14 },
                    bodyFont: { family: 'Cairo', size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        };
    }
}