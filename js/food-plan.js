// js/food-plan.js - Food Plan JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Food Plan
    initFoodPlan();
    
    // Initialize Calorie Calculator
    initCalorieCalculator();
});

let calorieChart = null;

function initFoodPlan() {
    // Generate meal plan
    generateMealPlan();
    
    // Set up meal plan buttons
    const generateBtn = document.getElementById('generateMealPlan');
    const saveBtn = document.getElementById('saveMealPlan');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateMealPlan);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveMealPlan);
    }
}

// Meal plan data
const mealPlanData = {
    breakfast: [
        {
            name: 'ওটমিল',
            items: ['ওটমিল (১ বাটি)', 'সিদ্ধ ডিম (১টি)', 'সবজি সালাদ', 'গ্রিন টি'],
            calories: 300,
            carbs: 45,
            protein: 15,
            fat: 8
        },
        {
            name: 'ডিমের ভাজি',
            items: ['ডিমের ভাজি (২টি)', 'রুটি (১টি)', 'সবজি', 'দুধ (১ গ্লাস)'],
            calories: 350,
            carbs: 30,
            protein: 20,
            fat: 12
        },
        {
            name: 'চপাতি ও সবজি',
            items: ['চপাতি (২টি)', 'সবজি কারি', 'দই (১ বাটি)', 'ফল'],
            calories: 320,
            carbs: 50,
            protein: 12,
            fat: 7
        }
    ],
    
    lunch: [
        {
            name: 'বাদামী চালের ভাত',
            items: ['বাদামী চালের ভাত (১ কাপ)', 'গ্রিলড মাছ', 'সবজি তরকারি', 'ডাল'],
            calories: 500,
            carbs: 60,
            protein: 25,
            fat: 15
        },
        {
            name: 'রুটি ও সবজি',
            items: ['রুটি (২টি)', 'ছোলার ডাল', 'সবজি কারি', 'সালাদ'],
            calories: 450,
            carbs: 55,
            protein: 20,
            fat: 10
        },
        {
            name: 'খিচুড়ি',
            items: ['খিচুড়ি (১ বাটি)', 'সবজি ভাজি', 'সবজি রায়তা', 'পেঁয়াজ সালাদ'],
            calories: 480,
            carbs: 65,
            protein: 18,
            fat: 12
        }
    ],
    
    dinner: [
        {
            name: 'রুটি ও সবজি',
            items: ['রুটি (২টি)', 'সবজি কারি', 'সালাদ', 'দই'],
            calories: 400,
            carbs: 50,
            protein: 20,
            fat: 10
        },
        {
            name: 'স্যুপ ও স্যালাড',
            items: ['সবজি স্যুপ', 'গ্রিলড চিকেন স্যালাড', 'ব্রাউন ব্রেড (১ স্লাইস)'],
            calories: 350,
            carbs: 30,
            protein: 25,
            fat: 8
        },
        {
            name: 'ফিশ কারি',
            items: ['মাছের কারি', 'সাদা ভাত (১/২ কাপ)', 'সবজি ভাজি', 'ডাল'],
            calories: 420,
            carbs: 45,
            protein: 22,
            fat: 14
        }
    ],
    
    snacks: [
        {
            name: 'ফল ও বাদাম',
            items: ['আপেল (১টি)', 'বাদাম (১০টি)', 'গ্রিন টি'],
            calories: 150,
            carbs: 20,
            protein: 5,
            fat: 8
        },
        {
            name: 'দই ও ফল',
            items: ['দই (১ বাটি)', 'জাম্বুরা (১টি)', 'চিয়া সিডস (১ চামচ)'],
            calories: 120,
            carbs: 15,
            protein: 8,
            fat: 5
        },
        {
            name: 'সবজি স্ন্যাকস',
            items: ['গাজর (১টি)', 'শসা (১/২টি)', 'পনির (১ স্লাইস)', 'গ্রিন টি'],
            calories: 100,
            carbs: 10,
            protein: 7,
            fat: 4
        }
    ]
};

function generateMealPlan() {
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const tableBody = document.querySelector('#mealPlannerTable tbody');
    
    if (!tableBody) return;
    
    let html = '';
    
    days.forEach(day => {
        // Randomly select meals for each category
        const breakfast = mealPlanData.breakfast[Math.floor(Math.random() * mealPlanData.breakfast.length)];
        const lunch = mealPlanData.lunch[Math.floor(Math.random() * mealPlanData.lunch.length)];
        const dinner = mealPlanData.dinner[Math.floor(Math.random() * mealPlanData.dinner.length)];
        const snacks = mealPlanData.snacks[Math.floor(Math.random() * mealPlanData.snacks.length)];
        
        html += `
            <tr>
                <td><strong>${day}</strong></td>
                <td>
                    <small class="text-muted">${breakfast.name}</small><br>
                    <small>${breakfast.items.slice(0, 2).join(', ')}</small>
                </td>
                <td>
                    <small class="text-muted">${lunch.name}</small><br>
                    <small>${lunch.items.slice(0, 2).join(', ')}</small>
                </td>
                <td>
                    <small class="text-muted">${dinner.name}</small><br>
                    <small>${dinner.items.slice(0, 2).join(', ')}</small>
                </td>
                <td>
                    <small class="text-muted">${snacks.name}</small><br>
                    <small>${snacks.items.slice(0, 2).join(', ')}</small>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function saveMealPlan() {
    const table = document.getElementById('mealPlannerTable');
    if (!table) return;
    
    // Get all meal plan data
    const mealPlan = [];
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            mealPlan.push({
                day: cells[0].textContent.trim(),
                breakfast: cells[1].textContent.trim(),
                lunch: cells[2].textContent.trim(),
                dinner: cells[3].textContent.trim(),
                snacks: cells[4].textContent.trim(),
                savedAt: new Date().toISOString()
            });
        }
    });
    
    // Save to localStorage
    DMedicUtils.saveToLocalStorage('mealPlan', mealPlan);
    
    DMedicUtils.showToast('খাবার পরিকল্পনা সংরক্ষণ করা হয়েছে', 'success');
}

function initCalorieCalculator() {
    const calculateBtn = document.getElementById('calculateCalories');
    const calorieForm = document.getElementById('calorieForm');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCalories);
    }
    
    if (calorieForm) {
        calorieForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateCalories();
        });
    }
    
    // Load user data if available
    loadUserData();
}

function loadUserData() {
    const userProfile = DMedicUtils.getFromLocalStorage('userProfile');
    if (userProfile) {
        if (userProfile.age) document.getElementById('calorieAge').value = userProfile.age;
        if (userProfile.gender) document.getElementById('calorieGender').value = userProfile.gender;
        if (userProfile.weight) document.getElementById('calorieWeight').value = userProfile.weight;
        if (userProfile.height) document.getElementById('calorieHeight').value = userProfile.height;
    }
    
    // Load weight from health data
    const weightRecords = DMedicUtils.getFromLocalStorage('weightRecords') || [];
    if (weightRecords.length > 0 && !document.getElementById('calorieWeight').value) {
        weightRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
        document.getElementById('calorieWeight').value = weightRecords[0].weight;
    }
}

function calculateCalories() {
    // Get form values
    const age = parseInt(document.getElementById('calorieAge').value);
    const gender = document.getElementById('calorieGender').value;
    const weight = parseFloat(document.getElementById('calorieWeight').value);
    const height = parseFloat(document.getElementById('calorieHeight').value);
    const activity = document.getElementById('calorieActivity').value;
    const goal = document.getElementById('calorieGoal').value;
    
    // Validation
    if (!age || !gender || !weight || !height || !activity || !goal) {
        DMedicUtils.showToast('দয়া করে সকল তথ্য পূরণ করুন', 'warning');
        return;
    }
    
    if (age < 15 || age > 100) {
        DMedicUtils.showToast('বয়স ১৫-১০০ বছরের মধ্যে হতে হবে', 'warning');
        return;
    }
    
    if (weight < 30 || weight > 200) {
        DMedicUtils.showToast('ওজন ৩০-২০০ কেজির মধ্যে হতে হবে', 'warning');
        return;
    }
    
    if (height < 100 || height > 250) {
        DMedicUtils.showToast('উচ্চতা ১০০-২৫০ সেমির মধ্যে হতে হবে', 'warning');
        return;
    }
    
    // Calculate BMR (Basal Metabolic Rate)
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Apply activity multiplier
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };
    
    let dailyCalories = bmr * activityMultipliers[activity];
    
    // Apply goal adjustment
    const goalAdjustments = {
        weight_loss: 0.85,  // 15% reduction
        weight_maintain: 1.0, // Maintain
        weight_gain: 1.15   // 15% increase
    };
    
    dailyCalories = dailyCalories * goalAdjustments[goal];
    
    // Round to nearest 50
    dailyCalories = Math.round(dailyCalories / 50) * 50;
    
    // Calculate macronutrients
    let carbs, protein, fat;
    
    if (goal === 'weight_loss') {
        protein = Math.round((dailyCalories * 0.35) / 4); // 35% protein
        carbs = Math.round((dailyCalories * 0.40) / 4);   // 40% carbs
        fat = Math.round((dailyCalories * 0.25) / 9);     // 25% fat
    } else if (goal === 'weight_gain') {
        protein = Math.round((dailyCalories * 0.30) / 4); // 30% protein
        carbs = Math.round((dailyCalories * 0.50) / 4);   // 50% carbs
        fat = Math.round((dailyCalories * 0.20) / 9);     // 20% fat
    } else {
        protein = Math.round((dailyCalories * 0.30) / 4); // 30% protein
        carbs = Math.round((dailyCalories * 0.45) / 4);   // 45% carbs
        fat = Math.round((dailyCalories * 0.25) / 9);     // 25% fat
    }
    
    // Display results
    displayCalorieResults(dailyCalories, carbs, protein, fat, goal);
    
    // Save user data
    saveUserData(age, gender, weight, height);
}

function displayCalorieResults(calories, carbs, protein, fat, goal) {
    // Update values
    document.getElementById('calorieValue').textContent = calories;
    
    // Update description based on goal
    let description = '';
    switch(goal) {
        case 'weight_loss':
            description = 'ওজন কমানোর জন্য দৈনিক ক্যালরি';
            break;
        case 'weight_gain':
            description = 'ওজন বাড়ানোর জন্য দৈনিক ক্যালরি';
            break;
        default:
            description = 'ওজন বজায় রাখার জন্য দৈনিক ক্যালরি';
    }
    
    document.getElementById('calorieDescription').textContent = description;
    document.getElementById('carbsValue').textContent = carbs + 'g';
    document.getElementById('proteinValue').textContent = protein + 'g';
    document.getElementById('fatValue').textContent = fat + 'g';
    
    // Update chart
    updateCalorieChart(carbs, protein, fat);
}

function updateCalorieChart(carbs, protein, fat) {
    const ctx = document.getElementById('calorieChart');
    if (!ctx) return;
    
    // Destroy existing chart if exists
    if (calorieChart) {
        calorieChart.destroy();
    }
    
    calorieChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['কার্বোহাইড্রেট', 'প্রোটিন', 'ফ্যাট'],
            datasets: [{
                data: [carbs * 4, protein * 4, fat * 9], // Convert grams to calories
                backgroundColor: ['#FF9800', '#2196F3', '#4CAF50'],
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
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const grams = label === 'কার্বোহাইড্রেট' ? Math.round(value / 4) + 'g' :
                                          label === 'প্রোটিন' ? Math.round(value / 4) + 'g' :
                                          Math.round(value / 9) + 'g';
                            return `${label}: ${grams} (${Math.round(value)} ক্যালরি)`;
                        }
                    }
                }
            }
        }
    });
}

function saveUserData(age, gender, weight, height) {
    const userProfile = DMedicUtils.getFromLocalStorage('userProfile') || {};
    userProfile.age = age;
    userProfile.gender = gender;
    userProfile.weight = weight;
    userProfile.height = height;
    userProfile.updatedAt = new Date().toISOString();
    
    DMedicUtils.saveToLocalStorage('userProfile', userProfile);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateMealPlan,
        calculateCalories,
        displayCalorieResults
    };
}