// js/risk-assessment.js - Risk Assessment JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Risk Assessment
    initRiskAssessment();
    
    // Initialize charts
    initRiskCharts();
});

let riskChart = null;

function initRiskAssessment() {
    const calculateBtn = document.getElementById('calculateRisk');
    const resetBtn = document.getElementById('resetRiskForm');
    const riskForm = document.getElementById('riskAssessmentForm');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateRisk);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetRiskForm);
    }
    
    if (riskForm) {
        riskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateRisk();
        });
    }
    
    // Load sample data for demonstration
    loadSampleData();
}

function loadSampleData() {
    // Set sample data for demonstration
    document.getElementById('age').value = 45;
    document.getElementById('gender').value = 'male';
    document.getElementById('bloodGlucose').value = 110;
    document.getElementById('bloodPressure').value = '125/85';
    document.getElementById('familyHistory').value = 'parent';
    document.getElementById('bmiValue').value = 25.5;
    document.getElementById('activityLevel').value = 'light';
    document.getElementById('smoking').value = 'never';
    document.getElementById('waistSize').value = 92;
    document.getElementById('sleepHours').value = '6to8';
}

function calculateRisk() {
    // Get all form values
    const age = parseInt(document.getElementById('age').value) || 0;
    const gender = document.getElementById('gender').value;
    const bloodGlucose = parseFloat(document.getElementById('bloodGlucose').value) || 0;
    const bloodPressure = document.getElementById('bloodPressure').value;
    const familyHistory = document.getElementById('familyHistory').value;
    const bmi = parseFloat(document.getElementById('bmiValue').value) || 0;
    const activityLevel = document.getElementById('activityLevel').value;
    const smoking = document.getElementById('smoking').value;
    const waistSize = parseFloat(document.getElementById('waistSize').value) || 0;
    const sleepHours = document.getElementById('sleepHours').value;
    
    // Validate required fields
    if (!age || !gender || !bloodGlucose || !bloodPressure || !familyHistory || !bmi || !activityLevel || !smoking || !sleepHours) {
        DMedicUtils.showToast('দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'warning');
        return;
    }
    
    // Calculate individual risk scores
    const scores = {
        age: calculateAgeScore(age),
        bloodGlucose: calculateGlucoseScore(bloodGlucose),
        bloodPressure: calculateBloodPressureScore(bloodPressure),
        familyHistory: calculateFamilyHistoryScore(familyHistory),
        bmi: calculateBMIScore(bmi),
        activityLevel: calculateActivityScore(activityLevel),
        smoking: calculateSmokingScore(smoking),
        waistSize: calculateWaistScore(waistSize, gender),
        sleepHours: calculateSleepScore(sleepHours)
    };
    
    // Calculate symptoms score
    scores.symptoms = calculateSymptomsScore();
    
    // Calculate total risk score
    const totalScore = calculateTotalRiskScore(scores);
    
    // Get risk level and recommendations
    const riskResult = getRiskLevel(totalScore);
    
    // Display results
    displayRiskResults(totalScore, riskResult, scores);
    
    // Update risk chart
    updateRiskChart(scores);
    
    // Generate recommendations
    generateRecommendations(riskResult.level, scores);
}

function calculateAgeScore(age) {
    if (age < 35) return 0;
    if (age < 45) return 15;
    if (age < 55) return 30;
    if (age < 65) return 45;
    return 60;
}

function calculateGlucoseScore(glucose) {
    if (glucose < 100) return 0;
    if (glucose < 110) return 10;
    if (glucose < 125) return 25;
    if (glucose < 140) return 40;
    if (glucose < 160) return 60;
    return 80;
}

function calculateBloodPressureScore(bp) {
    const [systolic, diastolic] = bp.split('/').map(Number);
    
    let score = 0;
    
    // Systolic score
    if (systolic < 120) score += 0;
    else if (systolic < 130) score += 10;
    else if (systolic < 140) score += 20;
    else if (systolic < 160) score += 40;
    else score += 60;
    
    // Diastolic score
    if (diastolic < 80) score += 0;
    else if (diastolic < 85) score += 5;
    else if (diastolic < 90) score += 15;
    else if (diastolic < 100) score += 30;
    else score += 50;
    
    return Math.min(score, 100);
}

function calculateFamilyHistoryScore(history) {
    switch(history) {
        case 'none': return 0;
        case 'parent': return 30;
        case 'both': return 60;
        case 'sibling': return 25;
        default: return 0;
    }
}

function calculateBMIScore(bmi) {
    if (bmi < 18.5) return 10; // Underweight risk
    if (bmi < 25) return 0;    // Normal
    if (bmi < 30) return 25;   // Overweight
    if (bmi < 35) return 50;   // Obesity I
    if (bmi < 40) return 70;   // Obesity II
    return 90;                 // Obesity III
}

function calculateActivityScore(activity) {
    switch(activity) {
        case 'active': return 0;
        case 'moderate': return 10;
        case 'light': return 25;
        case 'sedentary': return 40;
        default: return 30;
    }
}

function calculateSmokingScore(smoking) {
    switch(smoking) {
        case 'never': return 0;
        case 'former': return 20;
        case 'current': return 50;
        default: return 0;
    }
}

function calculateWaistScore(waist, gender) {
    if (!waist) return 0;
    
    if (gender === 'male') {
        if (waist < 94) return 0;
        if (waist < 102) return 20;
        return 40;
    } else {
        if (waist < 80) return 0;
        if (waist < 88) return 20;
        return 40;
    }
}

function calculateSleepScore(sleep) {
    switch(sleep) {
        case '6to8': return 0;
        case 'less6': return 25;
        case 'more8': return 15;
        default: return 0;
    }
}

function calculateSymptomsScore() {
    const symptoms = [];
    
    // Check all symptom checkboxes
    for (let i = 1; i <= 6; i++) {
        const symptomCheckbox = document.getElementById(`symptom${i}`);
        if (symptomCheckbox && symptomCheckbox.checked) {
            symptoms.push(symptomCheckbox.value);
        }
    }
    
    // Each symptom adds 10 points
    return symptoms.length * 10;
}

function calculateTotalRiskScore(scores) {
    // Weighted average calculation
    const weights = {
        age: 0.12,
        bloodGlucose: 0.20,
        bloodPressure: 0.15,
        familyHistory: 0.15,
        bmi: 0.12,
        activityLevel: 0.08,
        smoking: 0.08,
        waistSize: 0.05,
        sleepHours: 0.03,
        symptoms: 0.02
    };
    
    let totalScore = 0;
    for (const [factor, score] of Object.entries(scores)) {
        totalScore += score * weights[factor];
    }
    
    // Cap at 100
    return Math.min(100, Math.max(0, totalScore));
}

function getRiskLevel(score) {
    if (score <= 25) {
        return {
            level: 'low',
            name: 'নিম্ন ঝুঁকি',
            color: '#4CAF50',
            description: 'আপনার ডায়াবেটিস ঝুঁকি খুবই কম। স্বাস্থ্যকর জীবনযাপন চালিয়ে যান।',
            severity: 1
        };
    } else if (score <= 50) {
        return {
            level: 'moderate',
            name: 'মাঝারি ঝুঁকি',
            color: '#FF9800',
            description: 'আপনার ডায়াবেটিস ঝুঁকি মাঝারি পর্যায়ে। সতর্কতা অবলম্বন করুন এবং জীবনযাপন পরিবর্তন করুন।',
            severity: 2
        };
    } else if (score <= 75) {
        return {
            level: 'high',
            name: 'উচ্চ ঝুঁকি',
            color: '#F44336',
            description: 'আপনার ডায়াবেটিস ঝুঁকি বেশি। জরুরী পদক্ষেপ প্রয়োজন। ডাক্তারের পরামর্শ নিন।',
            severity: 3
        };
    } else {
        return {
            level: 'very-high',
            name: 'অতি উচ্চ ঝুঁকি',
            color: '#9C27B0',
            description: 'আপনার ডায়াবেটিস ঝুঁকি খুবই বেশি। তাত্ক্ষণিক ডাক্তারের পরামর্শ প্রয়োজন।',
            severity: 4
        };
    }
}

function displayRiskResults(totalScore, riskResult, scores) {
    // Update risk indicator
    const riskIndicator = document.getElementById('riskIndicator');
    riskIndicator.className = 'risk-indicator';
    riskIndicator.classList.add(`risk-${riskResult.level}`);
    riskIndicator.style.backgroundColor = riskResult.color;
    
    // Update risk level text
    document.getElementById('riskLevel').textContent = riskResult.name;
    document.getElementById('riskLevel').style.color = riskResult.color;
    
    // Update risk score
    document.getElementById('riskScore').textContent = `${Math.round(totalScore)}%`;
    document.getElementById('riskScore').style.color = riskResult.color;
    
    // Update description
    document.getElementById('riskDescription').textContent = riskResult.description;
    
    // Display risk factors analysis
    displayRiskFactors(scores);
}

function displayRiskFactors(scores) {
    const riskFactorsDiv = document.getElementById('riskFactors');
    const factorLabels = {
        age: 'বয়স',
        bloodGlucose: 'রক্তে গ্লুকোজ',
        bloodPressure: 'রক্তচাপ',
        familyHistory: 'পারিবারিক ইতিহাস',
        bmi: 'বিএমআই',
        activityLevel: 'শারীরিক কার্যকলাপ',
        smoking: 'ধূমপান',
        waistSize: 'কোমরের পরিধি',
        sleepHours: 'ঘুমের সময়',
        symptoms: 'লক্ষণ'
    };
    
    let html = '<div class="row">';
    
    for (const [factor, score] of Object.entries(scores)) {
        const label = factorLabels[factor] || factor;
        const percentage = Math.round(score);
        
        let colorClass = 'success';
        if (score > 50) colorClass = 'danger';
        else if (score > 25) colorClass = 'warning';
        
        html += `
            <div class="col-md-6 mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span>${label}</span>
                    <span>${percentage}%</span>
                </div>
                <div class="progress progress-custom">
                    <div class="progress-bar bg-${colorClass}" role="progressbar" 
                         style="width: ${percentage}%" 
                         aria-valuenow="${percentage}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    riskFactorsDiv.innerHTML = html;
}

function initRiskCharts() {
    const ctx = document.getElementById('riskChart');
    if (!ctx) return;
    
    riskChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['নিম্ন ঝুঁকি', 'মাঝারি ঝুঁকি', 'উচ্চ ঝুঁকি', 'অতি উচ্চ ঝুঁকি'],
            datasets: [{
                data: [25, 25, 25, 25],
                backgroundColor: [
                    '#4CAF50',
                    '#FF9800',
                    '#F44336',
                    '#9C27B0'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

function updateRiskChart(scores) {
    if (!riskChart) return;
    
    // Calculate risk distribution based on scores
    const totalScore = calculateTotalRiskScore(scores);
    const riskResult = getRiskLevel(totalScore);
    
    // Update chart data based on risk level
    let data = [0, 0, 0, 0];
    
    switch(riskResult.level) {
        case 'low':
            data = [100, 0, 0, 0];
            break;
        case 'moderate':
            data = [0, 100, 0, 0];
            break;
        case 'high':
            data = [0, 0, 100, 0];
            break;
        case 'very-high':
            data = [0, 0, 0, 100];
            break;
    }
    
    riskChart.data.datasets[0].data = data;
    riskChart.update();
}

function generateRecommendations(riskLevel, scores) {
    const recommendationsDiv = document.getElementById('recommendations');
    let recommendations = [];
    
    // General recommendations based on risk level
    switch(riskLevel) {
        case 'low':
            recommendations = [
                'স্বাস্থ্যকর জীবনযাপন চালিয়ে যান',
                'নিয়মিত ব্যায়াম করুন (সপ্তাহে ১৫০ মিনিট)',
                'সুষম খাদ্য গ্রহণ করুন',
                'বছরে একবার স্বাস্থ্য পরীক্ষা করুন',
                'ওজন নিয়ন্ত্রণে রাখুন'
            ];
            break;
            
        case 'moderate':
            recommendations = [
                'ওজন কমানোর লক্ষ্য নির্ধারণ করুন (৫-১০% ওজন কমান)',
                'প্রতিদিন ৩০ মিনিট ব্যায়াম শুরু করুন',
                'চিনি ও প্রক্রিয়াজাত খাবার এড়িয়ে চলুন',
                'ফল ও শাকসবজি বেশি খান',
                'ধূমপান থাকলে ত্যাগ করুন',
                '৬ মাস পর পর গ্লুকোজ পরীক্ষা করুন'
            ];
            break;
            
        case 'high':
            recommendations = [
                'ডাক্তারের সাথে পরামর্শ করুন',
                'নিয়মিত গ্লুকোজ মনিটরিং শুরু করুন',
                'কঠোর ডায়েট প্ল্যান অনুসরণ করুন',
                'প্রতিদিন ৪৫ মিনিট ব্যায়াম করুন',
                'চিনি সম্পূর্ণরূপে এড়িয়ে চলুন',
                'নিয়মিত ঔষধ গ্রহণ করুন (ডাক্তারের পরামর্শে)',
                'মাসে একবার সম্পূর্ণ চেকআপ করুন'
            ];
            break;
            
        case 'very-high':
            recommendations = [
                'অবিলম্বে ডায়াবেটিস বিশেষজ্ঞ দেখান',
                'দৈনিক গ্লুকোজ পরীক্ষা করুন',
                'কঠোরভাবে ডায়েট ও ব্যায়াম প্ল্যান অনুসরণ করুন',
                'সকল প্রকার মিষ্টি ও কার্বোহাইড্রেট এড়িয়ে চলুন',
                'নিয়মিত ঔষধ গ্রহণ করুন',
                'সাপ্তাহিক ডাক্তার পরামর্শ নিন',
                'জরুরী অবস্থার জন্য প্রস্তুত থাকুন'
            ];
            break;
    }
    
    // Specific recommendations based on high-risk factors
    if (scores.bloodGlucose > 50) {
        recommendations.push('রক্তের গ্লুকোজ নিয়ন্ত্রণের জন্য বিশেষ ডায়েট অনুসরণ করুন');
    }
    
    if (scores.bloodPressure > 50) {
        recommendations.push('লবণ গ্রহণ কমিয়ে দিন এবং রক্তচাপ নিয়ন্ত্রণে রাখুন');
    }
    
    if (scores.bmi > 50) {
        recommendations.push('ওজন কমানোর জন্য বিশেষায়িত প্ল্যান তৈরি করুন');
    }
    
    if (scores.smoking > 0) {
        recommendations.push('ধূমপান ত্যাগ করার জন্য সাহায্য নিন');
    }
    
    // Generate HTML
    let html = '<div class="row">';
    
    recommendations.forEach((rec, index) => {
        let icon = 'fa-check-circle';
        let color = 'success';
        
        if (riskLevel === 'high' || riskLevel === 'very-high') {
            icon = 'fa-exclamation-triangle';
            color = 'danger';
        } else if (riskLevel === 'moderate') {
            icon = 'fa-info-circle';
            color = 'warning';
        }
        
        html += `
            <div class="col-md-6 mb-3">
                <div class="alert alert-${color} alert-custom">
                    <i class="fas ${icon} me-2"></i>
                    ${rec}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    recommendationsDiv.innerHTML = html;
}

function resetRiskForm() {
    const riskForm = document.getElementById('riskAssessmentForm');
    if (riskForm) riskForm.reset();
    
    // Reset results
    document.getElementById('riskIndicator').className = 'risk-indicator';
    document.getElementById('riskLevel').textContent = '--';
    document.getElementById('riskScore').textContent = '--%';
    document.getElementById('riskDescription').textContent = 'ফলাফল দেখতে ফর্ম পূরণ করুন';
    document.getElementById('recommendations').innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-clipboard-check display-4 text-muted mb-3"></i>
            <h5 class="text-muted">আপনার ব্যক্তিগতকৃত সুপারিশ পেতে ঝুঁকি মূল্যায়ন সম্পন্ন করুন</h5>
        </div>
    `;
    document.getElementById('riskFactors').innerHTML = `
        <div class="text-center py-4">
            <p class="text-muted">ঝুঁকি মূল্যায়ন সম্পন্ন করুন বিশ্লেষণ দেখতে</p>
        </div>
    `;
    
    // Reset chart
    if (riskChart) {
        riskChart.data.datasets[0].data = [25, 25, 25, 25];
        riskChart.update();
    }
    
    DMedicUtils.showToast('ঝুঁকি মূল্যায়ন ফর্ম রিসেট করা হয়েছে', 'info');
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateRisk,
        getRiskLevel,
        calculateTotalRiskScore
    };
}