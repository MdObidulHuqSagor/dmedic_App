// js/charts.js - Charts JavaScript

function initHealthCharts() {
    initGlucoseChart();
    initWeightChart();
    initBPChart();
}

function initGlucoseChart() {
    const ctx = document.getElementById('glucoseChart');
    if (!ctx) return;
    
    // Get glucose data
    const glucoseRecords = DMedicUtils.getFromLocalStorage('glucoseRecords') || [];
    
    // Prepare data for chart
    const { labels, data } = prepareGlucoseChartData(glucoseRecords);
    
    glucoseChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'গ্লুকোজ মাত্রা (mg/dL)',
                data: data,
                borderColor: '#008080',
                backgroundColor: 'rgba(0, 128, 128, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }, {
                label: 'লক্ষ্যমাত্রা (উচ্চ)',
                data: Array(labels.length).fill(180),
                borderColor: '#F44336',
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }, {
                label: 'লক্ষ্যমাত্রা (নিম্ন)',
                data: Array(labels.length).fill(70),
                borderColor: '#4CAF50',
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 250,
                    title: {
                        display: true,
                        text: 'mg/dL'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            }
        }
    });
}

function prepareGlucoseChartData(records) {
    if (records.length === 0) {
        return {
            labels: ['রেকর্ড নেই'],
            data: [0]
        };
    }
    
    // Sort by date
    records.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Take last 7 records or all if less than 7
    const recentRecords = records.slice(-7);
    
    const labels = recentRecords.map(record => {
        const date = new Date(record.date);
        return DMedicUtils.formatDate(date);
    });
    
    const data = recentRecords.map(record => record.value);
    
    return { labels, data };
}

function updateGlucoseChart() {
    if (!glucoseChart) return;
    
    const glucoseRecords = DMedicUtils.getFromLocalStorage('glucoseRecords') || [];
    const { labels, data } = prepareGlucoseChartData(glucoseRecords);
    
    glucoseChart.data.labels = labels;
    glucoseChart.data.datasets[0].data = data;
    glucoseChart.data.datasets[1].data = Array(labels.length).fill(180);
    glucoseChart.data.datasets[2].data = Array(labels.length).fill(70);
    glucoseChart.update();
}

function initWeightChart() {
    const ctx = document.getElementById('weightChart');
    if (!ctx) return;
    
    // Get weight data
    const weightRecords = DMedicUtils.getFromLocalStorage('weightRecords') || [];
    
    // Prepare data for chart
    const { labels, data, targetWeight } = prepareWeightChartData(weightRecords);
    
    weightChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'ওজন (কেজি)',
                data: data,
                borderColor: '#20B2AA',
                backgroundColor: 'rgba(32, 178, 170, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }, {
                label: 'লক্ষ্যমাত্রা',
                data: Array(labels.length).fill(targetWeight),
                borderColor: '#4CAF50',
                borderWidth: 1,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} kg`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'কেজি'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            }
        }
    });
}

function prepareWeightChartData(records) {
    if (records.length === 0) {
        return {
            labels: ['রেকর্ড নেই'],
            data: [0],
            targetWeight: 0
        };
    }
    
    // Sort by date
    records.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Take last 7 records or all if less than 7
    const recentRecords = records.slice(-7);
    
    const labels = recentRecords.map(record => {
        const date = new Date(record.date);
        return DMedicUtils.formatDate(date);
    });
    
    const data = recentRecords.map(record => record.weight);
    
    // Calculate target weight (5% less than average if overweight)
    const avgWeight = data.reduce((sum, weight) => sum + weight, 0) / data.length;
    let targetWeight = avgWeight;
    
    // Get latest BMI if available
    const latestRecord = records[records.length - 1];
    if (latestRecord.bmi && latestRecord.bmi > 25) {
        targetWeight = avgWeight * 0.95; // 5% less
    }
    
    return { labels, data, targetWeight };
}

function updateWeightChart() {
    if (!weightChart) return;
    
    const weightRecords = DMedicUtils.getFromLocalStorage('weightRecords') || [];
    const { labels, data, targetWeight } = prepareWeightChartData(weightRecords);
    
    weightChart.data.labels = labels;
    weightChart.data.datasets[0].data = data;
    weightChart.data.datasets[1].data = Array(labels.length).fill(targetWeight);
    weightChart.update();
}

function initBPChart() {
    const ctx = document.getElementById('bpChart');
    if (!ctx) return;
    
    // Get BP data
    const bpRecords = DMedicUtils.getFromLocalStorage('bpRecords') || [];
    
    // Prepare data for chart
    const { labels, systolicData, diastolicData } = prepareBPChartData(bpRecords);
    
    bpChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'সিস্টোলিক (উচ্চ)',
                    data: systolicData,
                    borderColor: '#F44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'ডায়াস্টোলিক (নিম্ন)',
                    data: diastolicData,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'সিস্টোলিক লক্ষ্যমাত্রা',
                    data: Array(labels.length).fill(120),
                    borderColor: '#F44336',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'ডায়াস্টোলিক লক্ষ্যমাত্রা',
                    data: Array(labels.length).fill(80),
                    borderColor: '#2196F3',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} mmHg`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 180,
                    title: {
                        display: true,
                        text: 'mmHg'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            }
        }
    });
}

function prepareBPChartData(records) {
    if (records.length === 0) {
        return {
            labels: ['রেকর্ড নেই'],
            systolicData: [0],
            diastolicData: [0]
        };
    }
    
    // Sort by date
    records.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Take last 7 records or all if less than 7
    const recentRecords = records.slice(-7);
    
    const labels = recentRecords.map(record => {
        const date = new Date(record.date);
        return DMedicUtils.formatDate(date);
    });
    
    const systolicData = recentRecords.map(record => record.systolic);
    const diastolicData = recentRecords.map(record => record.diastolic);
    
    return { labels, systolicData, diastolicData };
}

function updateBPChart() {
    if (!bpChart) return;
    
    const bpRecords = DMedicUtils.getFromLocalStorage('bpRecords') || [];
    const { labels, systolicData, diastolicData } = prepareBPChartData(bpRecords);
    
    bpChart.data.labels = labels;
    bpChart.data.datasets[0].data = systolicData;
    bpChart.data.datasets[1].data = diastolicData;
    bpChart.data.datasets[2].data = Array(labels.length).fill(120);
    bpChart.data.datasets[3].data = Array(labels.length).fill(80);
    bpChart.update();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initHealthCharts,
        updateGlucoseChart,
        updateWeightChart,
        updateBPChart
    };
}