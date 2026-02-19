// js/bmi-calculator.js - BMI Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize BMI Calculator
    initBMICalculator();
    
    // Set current date in forms
    setCurrentDates();
});

function initBMICalculator() {
    const calculateBtn = document.getElementById('calculateBMI');
    const resetBtn = document.getElementById('resetForm');
    const saveBtn = document.getElementById('saveResult');
    const shareBtn = document.getElementById('shareResult');
    const bmiForm = document.getElementById('bmiForm');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateBMI);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetBMICalculator);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveBMIResult);
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareBMIResult);
    }
    
    if (bmiForm) {
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateBMI();
        });
    }
    
    // Load previous BMI data if exists
    loadPreviousBMIData();
}

function calculateBMI() {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    
    // Validation
    if (!height || !weight || height <= 0 || weight <= 0) {
        DMedicUtils.showToast('দয়া করে সঠিক উচ্চতা ও ওজন লিখুন', 'warning');
        return;
    }
    
    if (height < 50 || height > 250) {
        DMedicUtils.showToast('উচ্চতা ৫০-২৫০ সেমির মধ্যে হতে হবে', 'warning');
        return;
    }
    
    if (weight < 20 || weight > 200) {
        DMedicUtils.showToast('ওজন ২০-২০০ কেজির মধ্যে হতে হবে', 'warning');
        return;
    }
    
    // Convert height from cm to meters
    const heightInMeters = height / 100;
    
    // Calculate BMI
    const bmi = weight / (heightInMeters * heightInMeters);
    const roundedBMI = bmi.toFixed(1);
    
    // Get additional data
    const age = ageInput.value ? parseInt(ageInput.value) : null;
    const gender = genderSelect.value;
    
    // Determine BMI category
    const result = getBMICategory(bmi, gender, age);
    
    // Display result
    displayBMIResult(roundedBMI, result);
    
    // Save to history
    saveBMIHistory(height, weight, bmi, result.category, age, gender);
    
    // Scroll to result
    document.getElementById('bmiResult').scrollIntoView({ behavior: 'smooth' });
}

function getBMICategory(bmi, gender, age) {
    let category = '';
    let color = '';
    let description = '';
    let recommendations = [];
    
    if (bmi < 18.5) {
        category = 'কম ওজন';
        color = '#4CAF50';
        description = 'আপনার ওজন স্বাভাবিকের চেয়ে কম। পুষ্টিকর খাবার খেয়ে ওজন বাড়ানোর চেষ্টা করুন।';
        recommendations = [
            'পুষ্টিকর ও শক্তি সমৃদ্ধ খাবার খান',
            'নিয়মিত খাবার খান (দৈনিক ৩ বেলা প্রধান খাবার ও ২-৩ বার স্ন্যাকস)',
            'প্রোটিন সমৃদ্ধ খাবার বাড়ান (ডিম, মাছ, মুরগি, ডাল, দুধ)',
            'স্বাস্থ্যকর ফ্যাট গ্রহণ করুন (বাদাম, বীজ, অলিভ অয়েল)',
            'শক্তি বাড়ানোর ব্যায়াম করুন (ওজন উত্তোলন, প্রতিরোধ ব্যায়াম)',
            'ডাক্তারের পরামর্শ নিন'
        ];
    } else if (bmi < 25) {
        category = 'স্বাভাবিক ওজন';
        color = '#2196F3';
        description = 'আপনার ওজন আদর্শ পর্যায়ে আছে। এই অবস্থা ধরে রাখার চেষ্টা করুন।';
        recommendations = [
            'স্বাস্থ্যকর জীবনযাপন চালিয়ে যান',
            'সুষম খাদ্য গ্রহণ করুন',
            'নিয়মিত ব্যায়াম করুন',
            'পর্যাপ্ত পানি পান করুন',
            'পর্যাপ্ত ঘুমান',
            'নিয়মিত স্বাস্থ্য পরীক্ষা করুন'
        ];
    } else if (bmi < 30) {
        category = 'অতিরিক্ত ওজন';
        color = '#FF9800';
        description = 'আপনার ওজন কিছুটা বেশি। নিয়মিত ব্যায়াম ও সুষম খাদ্য গ্রহণের মাধ্যমে ওজন কমানোর চেষ্টা করুন।';
        recommendations = [
            'ওজন কমানোর লক্ষ্য নির্ধারণ করুন',
            'ক্যালরি গ্রহণ কমিয়ে দিন',
            'চিনি ও প্রক্রিয়াজাত খাবার এড়িয়ে চলুন',
            'শাকসবজি ও ফল বেশি খান',
            'সপ্তাহে ১৫০ মিনিট ব্যায়াম করুন',
            'ধীরে ধীরে ওজন কমান'
        ];
    } else {
        category = 'স্থূলতা';
        color = '#F44336';
        description = 'আপনার ওজন অনেক বেশি। দ্রুত ডাক্তারের পরামর্শ নিন এবং ওজন কমানোর জন্য পদক্ষেপ নিন।';
        recommendations = [
            'তাত্ক্ষণিকভাবে ডাক্তারের পরামর্শ নিন',
            'কঠোর ডায়েট প্ল্যান অনুসরণ করুন',
            'নিয়মিত ব্যায়াম শুরু করুন',
            'চিনি ও ফাস্ট ফুড সম্পূর্ণরূপে এড়িয়ে চলুন',
            'প্রতিদিন কমপক্ষে ৩০ মিনিট ব্যায়াম করুন',
            'ওজন কমানোর টার্গেট সেট করুন'
        ];
    }
    
    // Age-specific adjustments
    if (age && age >= 65) {
        description += ' বয়স্ক ব্যক্তিদের জন্য সামান্য বেশি বিএমআই স্বাভাবিক হতে পারে।';
    }
    
    return {
        category,
        color,
        description,
        recommendations
    };
}

function displayBMIResult(bmiValue, result) {
    const bmiResultDiv = document.getElementById('bmiResult');
    const bmiValueDiv = document.getElementById('bmiValue');
    const bmiCategoryDiv = document.getElementById('bmiCategory');
    const bmiFillDiv = document.getElementById('bmiFill');
    const bmiDescriptionDiv = document.getElementById('bmiDescription');
    
    // Update values
    bmiValueDiv.textContent = bmiValue;
    bmiCategoryDiv.textContent = result.category;
    bmiCategoryDiv.style.color = result.color;
    
    // Update progress bar
    let fillPercentage = 0;
    const bmi = parseFloat(bmiValue);
    
    if (bmi > 40) fillPercentage = 100;
    else if (bmi < 15) fillPercentage = (bmi / 15) * 25;
    else if (bmi < 25) fillPercentage = 25 + ((bmi - 15) / 10) * 25;
    else if (bmi < 35) fillPercentage = 50 + ((bmi - 25) / 10) * 25;
    else fillPercentage = 75 + ((bmi - 35) / 5) * 25;
    
    // Set color based on BMI
    let fillColor = result.color;
    bmiFillDiv.style.background = fillColor;
    
    // Animate fill
    setTimeout(() => {
        bmiFillDiv.style.width = `${fillPercentage}%`;
    }, 100);
    
    // Update description
    bmiDescriptionDiv.innerHTML = `
        <p class="mb-3">${result.description}</p>
        <div class="alert alert-light alert-custom">
            <h6 class="mb-2"><i class="fas fa-lightbulb me-2" style="color: ${result.color};"></i> সুপারিশসমূহ:</h6>
            <ul class="mb-0">
                ${result.recommendations.map(rec => `<li class="mb-1">${rec}</li>`).join('')}
            </ul>
        </div>
        <div class="mt-3">
            <p class="mb-1"><strong>আপনার বিএমআই তথ্য:</strong></p>
            <p class="mb-1">বিএমআই মান: <strong>${bmiValue}</strong></p>
            <p class="mb-1">শ্রেণী: <strong>${result.category}</strong></p>
            <p class="mb-0">সুস্থ বিএমআই রেঞ্জ: <strong>১৮.৫ - ২৪.৯</strong></p>
        </div>
    `;
    
    // Show result section
    bmiResultDiv.style.display = 'block';
}

function resetBMICalculator() {
    const bmiForm = document.getElementById('bmiForm');
    const bmiResultDiv = document.getElementById('bmiResult');
    const bmiFillDiv = document.getElementById('bmiFill');
    
    if (bmiForm) bmiForm.reset();
    if (bmiResultDiv) bmiResultDiv.style.display = 'none';
    if (bmiFillDiv) bmiFillDiv.style.width = '0%';
    
    DMedicUtils.showToast('বিএমআই ক্যালকুলেটর রিসেট করা হয়েছে', 'info');
}

function saveBMIResult() {
    const bmiValue = document.getElementById('bmiValue').textContent;
    const bmiCategory = document.getElementById('bmiCategory').textContent;
    
    if (bmiValue === '--') {
        DMedicUtils.showToast('প্রথমে বিএমআই গণনা করুন', 'warning');
        return;
    }
    
    // Get form values
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    
    // Create BMI record
    const bmiRecord = {
        date: new Date().toISOString(),
        height: parseFloat(height),
        weight: parseFloat(weight),
        bmi: parseFloat(bmiValue),
        category: bmiCategory,
        age: age ? parseInt(age) : null,
        gender: gender
    };
    
    // Save to localStorage
    const bmiHistory = DMedicUtils.getFromLocalStorage('bmiHistory') || [];
    bmiHistory.push(bmiRecord);
    
    // Keep only last 20 records
    if (bmiHistory.length > 20) {
        bmiHistory.splice(0, bmiHistory.length - 20);
    }
    
    const saved = DMedicUtils.saveToLocalStorage('bmiHistory', bmiHistory);
    
    if (saved) {
        DMedicUtils.showToast('বিএমআই ফলাফল সংরক্ষণ করা হয়েছে', 'success');
    } else {
        DMedicUtils.showToast('সংরক্ষণে সমস্যা হয়েছে', 'error');
    }
}

function shareBMIResult() {
    const bmiValue = document.getElementById('bmiValue').textContent;
    const bmiCategory = document.getElementById('bmiCategory').textContent;
    
    if (bmiValue === '--') {
        DMedicUtils.showToast('প্রথমে বিএমআই গণনা করুন', 'warning');
        return;
    }
    
    const shareText = `আমার বিএমআই ফলাফল: ${bmiValue} (${bmiCategory}) - ডি-মেডিক`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'আমার বিএমআই ফলাফল',
            text: shareText,
            url: shareUrl
        })
        .then(() => DMedicUtils.showToast('শেয়ার সফল হয়েছে', 'success'))
        .catch(error => {
            console.log('Error sharing:', error);
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => DMedicUtils.showToast('ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে', 'success'))
        .catch(err => {
            console.error('Could not copy text: ', err);
            DMedicUtils.showToast('কপি করতে সমস্যা হয়েছে', 'error');
        });
}

function saveBMIHistory(height, weight, bmi, category, age, gender) {
    const bmiHistory = DMedicUtils.getFromLocalStorage('bmiHistory') || [];
    
    const record = {
        date: new Date().toISOString(),
        height: height,
        weight: weight,
        bmi: bmi,
        category: category,
        age: age,
        gender: gender
    };
    
    bmiHistory.push(record);
    
    // Keep only last 10 records
    if (bmiHistory.length > 10) {
        bmiHistory.splice(0, bmiHistory.length - 10);
    }
    
    DMedicUtils.saveToLocalStorage('bmiHistory', bmiHistory);
}

function loadPreviousBMIData() {
    const bmiHistory = DMedicUtils.getFromLocalStorage('bmiHistory');
    
    if (bmiHistory && bmiHistory.length > 0) {
        const latestRecord = bmiHistory[bmiHistory.length - 1];
        
        // Fill form with latest data
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        const ageInput = document.getElementById('age');
        const genderSelect = document.getElementById('gender');
        
        if (heightInput && latestRecord.height) {
            heightInput.value = latestRecord.height;
        }
        
        if (weightInput && latestRecord.weight) {
            weightInput.value = latestRecord.weight;
        }
        
        if (ageInput && latestRecord.age) {
            ageInput.value = latestRecord.age;
        }
        
        if (genderSelect && latestRecord.gender) {
            genderSelect.value = latestRecord.gender;
        }
        
        // Show message
        const lastDate = new Date(latestRecord.date);
        const dateStr = DMedicUtils.formatDate(lastDate);
        DMedicUtils.showToast(`সর্বশেষ গণনা (${dateStr}) লোড করা হয়েছে`, 'info');
    }
}

function setCurrentDates() {
    const today = DMedicUtils.getCurrentDate();
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateBMI,
        getBMICategory,
        displayBMIResult
    };
}