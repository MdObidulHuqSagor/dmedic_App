// js/health-data.js - Health Data Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Health Data Management
    initHealthData();
    
    // Initialize charts
    initHealthCharts();
});

let glucoseChart = null;
let weightChart = null;
let bpChart = null;

function initHealthData() {
    // Initialize modals
    initModals();
    
    // Initialize export functionality
    initExportData();
    
    // Load health data
    loadHealthData();
    
    // Initialize BMI calculation for weight form
    initBMICalculation();
}

function initModals() {
    // Glucose modal
    const saveGlucoseBtn = document.getElementById('saveGlucose');
    if (saveGlucoseBtn) {
        saveGlucoseBtn.addEventListener('click', saveGlucoseRecord);
    }
    
    // Blood pressure modal
    const saveBPBtn = document.getElementById('saveBP');
    if (saveBPBtn) {
        saveBPBtn.addEventListener('click', saveBPRecord);
    }
    
    // Weight modal
    const saveWeightBtn = document.getElementById('saveWeight');
    if (saveWeightBtn) {
        saveWeightBtn.addEventListener('click', saveWeightRecord);
    }
    
    // Medication modal
    const saveMedicationBtn = document.getElementById('saveMedication');
    if (saveMedicationBtn) {
        saveMedicationBtn.addEventListener('click', saveMedicationRecord);
    }
    
    // Symptoms modal
    const saveSymptomBtn = document.getElementById('saveSymptom');
    if (saveSymptomBtn) {
        saveSymptomBtn.addEventListener('click', saveSymptomRecord);
    }
    
    // Set current date in all forms
    setCurrentDates();
}

function setCurrentDates() {
    const today = DMedicUtils.getCurrentDate();
    const now = new Date();
    const datetime = now.toISOString().slice(0, 16);
    
    // Set date fields
    const dateFields = [
        'glucoseDate',
        'bpDate',
        'weightDate',
        'medicationStartDate',
        'symptomDate'
    ];
    
    dateFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.type === 'date') {
                field.value = today;
            } else if (field.type === 'datetime-local') {
                field.value = datetime;
            }
        }
    });
}

function initBMICalculation() {
    const weightInput = document.getElementById('weightValue');
    const heightInput = document.getElementById('heightValue');
    const bmiOutput = document.getElementById('bmiValue');
    
    if (weightInput && heightInput && bmiOutput) {
        const calculateBMI = () => {
            const weight = parseFloat(weightInput.value);
            const height = parseFloat(heightInput.value);
            
            if (weight && height && height > 0) {
                const heightInMeters = height / 100;
                const bmi = weight / (heightInMeters * heightInMeters);
                bmiOutput.value = bmi.toFixed(1);
            } else {
                bmiOutput.value = '';
            }
        };
        
        weightInput.addEventListener('input', calculateBMI);
        heightInput.addEventListener('input', calculateBMI);
        
        // Try to load height from localStorage
        const userProfile = DMedicUtils.getFromLocalStorage('userProfile');
        if (userProfile && userProfile.height) {
            heightInput.value = userProfile.height;
            calculateBMI();
        }
    }
}

function saveGlucoseRecord() {
    const glucoseValue = parseFloat(document.getElementById('glucoseValue').value);
    const glucoseTime = document.getElementById('glucoseTime').value;
    const glucoseDate = document.getElementById('glucoseDate').value;
    const glucoseNotes = document.getElementById('glucoseNotes').value;
    
    // Validation
    if (!glucoseValue || !glucoseTime || !glucoseDate) {
        DMedicUtils.showToast('দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'warning');
        return;
    }
    
    if (glucoseValue < 50 || glucoseValue > 500) {
        DMedicUtils.showToast('গ্লুকোজ মান ৫০-৫০০ mg/dL এর মধ্যে হতে হবে', 'warning');
        return;
    }
    
    // Create record
    const record = {
        id: Date.now(),
        type: 'glucose',
        value: glucoseValue,
        time: glucoseTime,
        date: glucoseDate,
        notes: glucoseNotes,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const glucoseRecords = DMedicUtils.getFromLocalStorage('glucoseRecords') || [];
    glucoseRecords.push(record);
    DMedicUtils.saveToLocalStorage('glucoseRecords', glucoseRecords);
    
    // Update UI
    updateGlucoseTable();
    updateSummaryCards();
    updateGlucoseChart();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('glucoseModal')).hide();
    document.getElementById('glucoseForm').reset();
    setCurrentDates();
    
    DMedicUtils.showToast('গ্লুকোজ রেকর্ড সংরক্ষণ করা হয়েছে', 'success');
}

function saveBPRecord() {
    const systolic = parseInt(document.getElementById('systolic').value);
    const diastolic = parseInt(document.getElementById('diastolic').value);
    const pulse = parseInt(document.getElementById('pulse').value) || null;
    const bpDate = document.getElementById('bpDate').value;
    const bpNotes = document.getElementById('bpNotes').value;
    
    // Validation
    if (!systolic || !diastolic || !bpDate) {
        DMedicUtils.showToast('দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'warning');
        return;
    }
    
    if (systolic < 70 || systolic > 200 || diastolic < 40 || diastolic > 130) {
        DMedicUtils.showToast('সঠিক রক্তচাপ মান লিখুন', 'warning');
        return;
    }
    
    // Create record
    const record = {
        id: Date.now(),
        type: 'blood_pressure',
        systolic: systolic,
        diastolic: diastolic,
        pulse: pulse,
        date: bpDate,
        notes: bpNotes,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const bpRecords = DMedicUtils.getFromLocalStorage('bpRecords') || [];
    bpRecords.push(record);
    DMedicUtils.saveToLocalStorage('bpRecords', bpRecords);
    
    // Update UI
    updateBPTable();
    updateSummaryCards();
    updateBPChart();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('bloodPressureModal')).hide();
    document.getElementById('bpForm').reset();
    setCurrentDates();
    
    DMedicUtils.showToast('রক্তচাপ রেকর্ড সংরক্ষণ করা হয়েছে', 'success');
}

function saveWeightRecord() {
    const weightValue = parseFloat(document.getElementById('weightValue').value);
    const heightValue = parseFloat(document.getElementById('heightValue').value) || null;
    const bmiValue = document.getElementById('bmiValue').value;
    const weightDate = document.getElementById('weightDate').value;
    const weightNotes = document.getElementById('weightNotes').value;
    
    // Validation
    if (!weightValue || !weightDate) {
        DMedicUtils.showToast('দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'warning');
        return;
    }
    
    if (weightValue < 30 || weightValue > 200) {
        DMedicUtils.showToast('ওজন ৩০-২০০ কেজির মধ্যে হতে হবে', 'warning');
        return;
    }
    
    // Save height to user profile if provided
    if (heightValue) {
        const userProfile = DMedicUtils.getFromLocalStorage('userProfile') || {};
        userProfile.height = heightValue;
        DMedicUtils.saveToLocalStorage('userProfile', userProfile);
    }
    
    // Create record
    const record = {
        id: Date.now(),
        type: 'weight',
        weight: weightValue,
        height: heightValue,
        bmi: bmiValue ? parseFloat(bmiValue) : null,
        date: weightDate,
        notes: weightNotes,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const weightRecords = DMedicUtils.getFromLocalStorage('weightRecords') || [];
    weightRecords.push(record);
    DMedicUtils.saveToLocalStorage('weightRecords', weightRecords);
    
    // Update UI
    updateWeightTable();
    updateSummaryCards();
    updateWeightChart();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('weightModal')).hide();
    document.getElementById('weightForm').reset();
    setCurrentDates();
    
    DMedicUtils.showToast('ওজন রেকর্ড সংরক্ষণ করা হয়েছে', 'success');
}

function saveMedicationRecord() {
    const name = document.getElementById('medicationName').value.trim();
    const dose = document.getElementById('medicationDose').value.trim();
    const frequency = document.getElementById('medicationFrequency').value;
    const startDate = document.getElementById('medicationStartDate').value;
    const notes = document.getElementById('medicationNotes').value.trim();
    
    // Get selected times
    const times = [];
    if (document.getElementById('morningTime').checked) times.push('সকাল');
    if (document.getElementById('afternoonTime').checked) times.push('দুপুর');
    if (document.getElementById('eveningTime').checked) times.push('রাত');
    
    // Validation
    if (!name || !dose || !frequency || !startDate || times.length === 0) {
        DMedicUtils.showToast('দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'warning');
        return;
    }
    
    // Create record
    const record = {
        id: Date.now(),
        type: 'medication',
        name: name,
        dose: dose,
        frequency: frequency,
        times: times,
        startDate: startDate,
        notes: notes,
        status: 'active',
        lastTaken: null,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const medicationRecords = DMedicUtils.getFromLocalStorage('medicationRecords') || [];
    medicationRecords.push(record);
    DMedicUtils.saveToLocalStorage('medicationRecords', medicationRecords);
    
    // Update UI
    updateMedicationTable();
    updateSummaryCards();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('medicationModal')).hide();
    document.getElementById('medicationForm').reset();
    setCurrentDates();
    
    DMedicUtils.showToast('ঔষধ রেকর্ড সংরক্ষণ করা হয়েছে', 'success');
}

function saveSymptomRecord() {
    const type = document.getElementById('symptomType').value;
    const severity = document.getElementById('symptomSeverity').value;
    const date = document.getElementById('symptomDate').value;
    const description = document.getElementById('symptomDescription').value.trim();
    const duration = document.getElementById('symptomDuration').value.trim();
    
    // Validation
    if (!type || !severity || !date || !description) {
        DMedicUtils.showToast('দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'warning');
        return;
    }
    
    // Create record
    const record = {
        id: Date.now(),
        type: 'symptom',
        symptomType: type,
        severity: severity,
        date: date,
        description: description,
        duration: duration,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const symptomRecords = DMedicUtils.getFromLocalStorage('symptomRecords') || [];
    symptomRecords.push(record);
    DMedicUtils.saveToLocalStorage('symptomRecords', symptomRecords);
    
    // Update UI
    updateSummaryCards();
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('symptomsModal')).hide();
    document.getElementById('symptomsForm').reset();
    setCurrentDates();
    
    DMedicUtils.showToast('লক্ষণ রেকর্ড সংরক্ষণ করা হয়েছে', 'success');
}

function loadHealthData() {
    updateGlucoseTable();
    updateBPTable();
    updateWeightTable();
    updateMedicationTable();
    updateSummaryCards();
}

function updateGlucoseTable() {
    const glucoseRecords = DMedicUtils.getFromLocalStorage('glucoseRecords') || [];
    const tableBody = document.getElementById('glucoseTableBody');
    
    if (!tableBody) return;
    
    if (glucoseRecords.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-tint display-4 text-muted mb-3"></i>
                    <p class="text-muted">কোন গ্লুকোজ রেকর্ড পাওয়া যায়নি</p>
                    <button class="btn btn-sm btn-custom" data-bs-toggle="modal" data-bs-target="#glucoseModal">
                        <i class="fas fa-plus me-1"></i> প্রথম রেকর্ড যোগ করুন
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by date (newest first)
    glucoseRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    const timeLabels = {
        'fasting': 'খালি পেটে',
        'after_breakfast': 'নাস্তার পর',
        'before_lunch': 'দুপুরের আগে',
        'after_lunch': 'দুপুরের পর',
        'before_dinner': 'রাতের আগে',
        'after_dinner': 'রাতের পর',
        'bedtime': 'ঘুমানোর আগে',
        'random': 'যেকোন সময়'
    };
    
    glucoseRecords.slice(0, 10).forEach(record => {
        const date = new Date(record.date);
        const dateStr = DMedicUtils.formatDate(date);
        
        // Determine glucose level color
        let glucoseClass = 'text-success';
        if (record.value > 180) glucoseClass = 'text-danger';
        else if (record.value > 140) glucoseClass = 'text-warning';
        
        html += `
            <tr>
                <td>${dateStr}</td>
                <td>${timeLabels[record.time] || record.time}</td>
                <td class="${glucoseClass} fw-bold">${record.value}</td>
                <td>${timeLabels[record.time] || record.time}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord('glucose', ${record.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function updateBPTable() {
    const bpRecords = DMedicUtils.getFromLocalStorage('bpRecords') || [];
    const tableBody = document.getElementById('bpTableBody');
    
    if (!tableBody) return;
    
    if (bpRecords.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-heartbeat display-4 text-muted mb-3"></i>
                    <p class="text-muted">কোন রক্তচাপ রেকর্ড পাওয়া যায়নি</p>
                    <button class="btn btn-sm btn-custom" data-bs-toggle="modal" data-bs-target="#bloodPressureModal">
                        <i class="fas fa-plus me-1"></i> প্রথম রেকর্ড যোগ করুন
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by date (newest first)
    bpRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    
    bpRecords.slice(0, 10).forEach(record => {
        const date = new Date(record.date);
        const dateStr = DMedicUtils.formatDate(date);
        
        // Determine BP category
        let bpClass = 'text-success';
        if (record.systolic >= 140 || record.diastolic >= 90) {
            bpClass = 'text-danger';
        } else if (record.systolic >= 130 || record.diastolic >= 85) {
            bpClass = 'text-warning';
        }
        
        html += `
            <tr>
                <td>${dateStr}</td>
                <td class="${bpClass} fw-bold">${record.systolic}</td>
                <td class="${bpClass} fw-bold">${record.diastolic}</td>
                <td>${record.pulse || '--'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord('blood_pressure', ${record.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function updateWeightTable() {
    const weightRecords = DMedicUtils.getFromLocalStorage('weightRecords') || [];
    const tableBody = document.getElementById('weightTableBody');
    
    if (!tableBody) return;
    
    if (weightRecords.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-weight display-4 text-muted mb-3"></i>
                    <p class="text-muted">কোন ওজন রেকর্ড পাওয়া যায়নি</p>
                    <button class="btn btn-sm btn-custom" data-bs-toggle="modal" data-bs-target="#weightModal">
                        <i class="fas fa-plus me-1"></i> প্রথম রেকর্ড যোগ করুন
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by date (newest first)
    weightRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    
    weightRecords.slice(0, 10).forEach((record, index) => {
        const date = new Date(record.date);
        const dateStr = DMedicUtils.formatDate(date);
        
        // Calculate weight change
        let change = '--';
        if (index < weightRecords.length - 1) {
            const prevWeight = weightRecords[index + 1].weight;
            const diff = record.weight - prevWeight;
            if (diff > 0) {
                change = `<span class="text-danger">+${diff.toFixed(1)} kg</span>`;
            } else if (diff < 0) {
                change = `<span class="text-success">${diff.toFixed(1)} kg</span>`;
            } else {
                change = `<span class="text-muted">০ kg</span>`;
            }
        }
        
        // Determine BMI category
        let bmiClass = 'text-success';
        let bmiCategory = '';
        if (record.bmi) {
            if (record.bmi < 18.5) {
                bmiClass = 'text-info';
                bmiCategory = 'কম ওজন';
            } else if (record.bmi < 25) {
                bmiClass = 'text-success';
                bmiCategory = 'স্বাভাবিক';
            } else if (record.bmi < 30) {
                bmiClass = 'text-warning';
                bmiCategory = 'অতিরিক্ত';
            } else {
                bmiClass = 'text-danger';
                bmiCategory = 'স্থূল';
            }
        }
        
        html += `
            <tr>
                <td>${dateStr}</td>
                <td class="fw-bold">${record.weight.toFixed(1)}</td>
                <td class="${bmiClass} fw-bold">${record.bmi ? record.bmi.toFixed(1) : '--'}</td>
                <td>${change}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord('weight', ${record.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function updateMedicationTable() {
    const medicationRecords = DMedicUtils.getFromLocalStorage('medicationRecords') || [];
    const tableBody = document.getElementById('medicationTableBody');
    
    if (!tableBody) return;
    
    if (medicationRecords.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-pills display-4 text-muted mb-3"></i>
                    <p class="text-muted">কোন ঔষধ রেকর্ড পাওয়া যায়নি</p>
                    <button class="btn btn-sm btn-custom" data-bs-toggle="modal" data-bs-target="#medicationModal">
                        <i class="fas fa-plus me-1"></i> প্রথম রেকর্ড যোগ করুন
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    medicationRecords.forEach(record => {
        const startDate = new Date(record.startDate);
        const dateStr = DMedicUtils.formatDate(startDate);
        
        // Determine status
        let statusClass = 'success';
        let statusText = 'সক্রিয়';
        if (record.status === 'completed') {
            statusClass = 'secondary';
            statusText = 'সম্পন্ন';
        } else if (record.status === 'missed') {
            statusClass = 'danger';
            statusText = 'মিসড';
        }
        
        html += `
            <tr>
                <td>
                    <strong>${record.name}</strong><br>
                    <small class="text-muted">শুরু: ${dateStr}</small>
                </td>
                <td>${record.dose}</td>
                <td>${record.times.join(', ')}</td>
                <td><span class="badge bg-${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-success me-1" onclick="markMedicationTaken(${record.id})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord('medication', ${record.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function updateSummaryCards() {
    // Get all records
    const glucoseRecords = DMedicUtils.getFromLocalStorage('glucoseRecords') || [];
    const bpRecords = DMedicUtils.getFromLocalStorage('bpRecords') || [];
    const weightRecords = DMedicUtils.getFromLocalStorage('weightRecords') || [];
    const medicationRecords = DMedicUtils.getFromLocalStorage('medicationRecords') || [];
    const symptomRecords = DMedicUtils.getFromLocalStorage('symptomRecords') || [];
    
    // Update latest glucose
    const latestGlucoseDiv = document.getElementById('latestGlucose');
    if (latestGlucoseDiv) {
        if (glucoseRecords.length > 0) {
            glucoseRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
            latestGlucoseDiv.textContent = glucoseRecords[0].value;
        } else {
            latestGlucoseDiv.textContent = '--';
        }
    }
    
    // Update latest BP
    const latestBPDiv = document.getElementById('latestBP');
    if (latestBPDiv) {
        if (bpRecords.length > 0) {
            bpRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
            latestBPDiv.textContent = `${bpRecords[0].systolic}/${bpRecords[0].diastolic}`;
        } else {
            latestBPDiv.textContent = '--';
        }
    }
    
    // Update latest weight
    const latestWeightDiv = document.getElementById('latestWeight');
    if (latestWeightDiv) {
        if (weightRecords.length > 0) {
            weightRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
            latestWeightDiv.textContent = weightRecords[0].weight.toFixed(1);
        } else {
            latestWeightDiv.textContent = '--';
        }
    }
    
    // Update total records
    const totalRecordsDiv = document.getElementById('totalRecords');
    if (totalRecordsDiv) {
        const total = glucoseRecords.length + bpRecords.length + weightRecords.length + 
                     medicationRecords.length + symptomRecords.length;
        totalRecordsDiv.textContent = total;
    }
}

// Function to delete records
window.deleteRecord = function(type, id) {
    if (!confirm('আপনি কি এই রেকর্ডটি ডিলিট করতে চান?')) {
        return;
    }
    
    let storageKey = '';
    switch(type) {
        case 'glucose':
            storageKey = 'glucoseRecords';
            break;
        case 'blood_pressure':
            storageKey = 'bpRecords';
            break;
        case 'weight':
            storageKey = 'weightRecords';
            break;
        case 'medication':
            storageKey = 'medicationRecords';
            break;
        case 'symptom':
            storageKey = 'symptomRecords';
            break;
        default:
            return;
    }
    
    const records = DMedicUtils.getFromLocalStorage(storageKey) || [];
    const updatedRecords = records.filter(record => record.id !== id);
    
    DMedicUtils.saveToLocalStorage(storageKey, updatedRecords);
    
    // Update UI
    switch(type) {
        case 'glucose':
            updateGlucoseTable();
            updateGlucoseChart();
            break;
        case 'blood_pressure':
            updateBPTable();
            updateBPChart();
            break;
        case 'weight':
            updateWeightTable();
            updateWeightChart();
            break;
        case 'medication':
            updateMedicationTable();
            break;
        case 'symptom':
            // Update summary only
            break;
    }
    
    updateSummaryCards();
    DMedicUtils.showToast('রেকর্ড ডিলিট করা হয়েছে', 'success');
};

// Function to mark medication as taken
window.markMedicationTaken = function(id) {
    const records = DMedicUtils.getFromLocalStorage('medicationRecords') || [];
    const updatedRecords = records.map(record => {
        if (record.id === id) {
            return {
                ...record,
                lastTaken: new Date().toISOString()
            };
        }
        return record;
    });
    
    DMedicUtils.saveToLocalStorage('medicationRecords', updatedRecords);
    updateMedicationTable();
    DMedicUtils.showToast('ঔষধ গ্রহণ চিহ্নিত করা হয়েছে', 'success');
};

function initExportData() {
    const exportBtn = document.getElementById('exportData');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportAllData);
    }
}

function exportAllData() {
    // Get all data
    const allData = {
        glucose: DMedicUtils.getFromLocalStorage('glucoseRecords') || [],
        blood_pressure: DMedicUtils.getFromLocalStorage('bpRecords') || [],
        weight: DMedicUtils.getFromLocalStorage('weightRecords') || [],
        medication: DMedicUtils.getFromLocalStorage('medicationRecords') || [],
        symptoms: DMedicUtils.getFromLocalStorage('symptomRecords') || [],
        export_date: new Date().toISOString(),
        source: 'DMEDIC Health Data'
    };
    
    // Convert to JSON
    const jsonData = JSON.stringify(allData, null, 2);
    
    // Create download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dmedic-health-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    DMedicUtils.showToast('সমস্ত ডাটা ডাউনলোড করা হয়েছে', 'success');
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveGlucoseRecord,
        saveBPRecord,
        saveWeightRecord,
        saveMedicationRecord,
        saveSymptomRecord,
        updateSummaryCards
    };
}