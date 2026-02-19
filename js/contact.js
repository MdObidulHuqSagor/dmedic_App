// js/contact.js - Contact JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Contact System
    initContactSystem();
    
    // Initialize Google Maps
    initGoogleMap();
});

function initContactSystem() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const startChatBtn = document.getElementById('startLiveChat');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendContactMessage();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            subscribeNewsletter();
        });
    }
    
    if (startChatBtn) {
        startChatBtn.addEventListener('click', startLiveChat);
    }
}

function sendContactMessage() {
    // Get form values
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    // Validation
    if (!name || !email || !phone || !subject || !message) {
        DMedicUtils.showToast('দয়া করে সকল তথ্য পূরণ করুন', 'warning');
        return;
    }
    
    if (!DMedicUtils.validateEmail(email)) {
        DMedicUtils.showToast('সঠিক ইমেইল ঠিকানা লিখুন', 'warning');
        return;
    }
    
    if (!DMedicUtils.validatePhone(phone)) {
        DMedicUtils.showToast('সঠিক মোবাইল নম্বর লিখুন', 'warning');
        return;
    }
    
    // Create contact message
    const contactMessage = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        sentAt: new Date().toISOString(),
        status: 'unread'
    };
    
    // Save to localStorage
    const contactMessages = DMedicUtils.getFromLocalStorage('contactMessages') || [];
    contactMessages.push(contactMessage);
    DMedicUtils.saveToLocalStorage('contactMessages', contactMessages);
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Show success message
    DMedicUtils.showToast('আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।', 'success');
    
    // In a real app, this would send email to admin
    sendEmailNotification(contactMessage);
}

function sendEmailNotification(contactMessage) {
    // In a real app, this would send an actual email
    console.log('Email notification:', contactMessage);
    
    // For demo purposes, just log to console
    const emailContent = `
        নতুন যোগাযোগ মেসেজ:
        
        নাম: ${contactMessage.name}
        ইমেইল: ${contactMessage.email}
        ফোন: ${contactMessage.phone}
        বিষয়: ${contactMessage.subject}
        মেসেজ: ${contactMessage.message}
        
        তারিখ: ${new Date(contactMessage.sentAt).toLocaleString('bn-BD')}
    `;
    
    console.log(emailContent);
}

function subscribeNewsletter() {
    const emailInput = document.querySelector('#newsletterForm input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : '';
    
    if (!email || !DMedicUtils.validateEmail(email)) {
        DMedicUtils.showToast('সঠিক ইমেইল ঠিকানা লিখুন', 'warning');
        return;
    }
    
    // Save subscription
    const subscriptions = DMedicUtils.getFromLocalStorage('newsletterSubscriptions') || [];
    
    // Check if already subscribed
    if (subscriptions.includes(email)) {
        DMedicUtils.showToast('আপনি ইতিমধ্যেই সাবস্ক্রাইব করেছেন', 'info');
        return;
    }
    
    subscriptions.push(email);
    DMedicUtils.saveToLocalStorage('newsletterSubscriptions', subscriptions);
    
    // Reset form
    if (emailInput) emailInput.value = '';
    
    DMedicUtils.showToast('আপনি সফলভাবে নিউজলেটারে সাবস্ক্রাইব করেছেন। ধন্যবাদ!', 'success');
}

function startLiveChat() {
    // In a real app, this would connect to a live chat service
    DMedicUtils.showToast('শীঘ্রই লাইভ চ্যাট সিস্টেম চালু হবে', 'info');
    
    // For demo, show a chat window
    showDemoChat();
}

function showDemoChat() {
    const chatWindow = `
        <div class="position-fixed bottom-0 end-0 m-3" style="z-index: 1050; width: 350px;">
            <div class="card shadow-lg">
                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <h6 class="mb-0"><i class="fas fa-comments me-2"></i> লাইভ চ্যাট সহায়তা</h6>
                    <button type="button" class="btn btn-sm btn-light" onclick="closeChat()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body p-3" style="height: 300px; overflow-y: auto;" id="chatBody">
                    <div class="chat-message mb-3">
                        <div class="message-bubble bg-light p-2 rounded">
                            <small class="text-muted">ডি-মেডিক সহায়তা:</small>
                            <p class="mb-0">আসসালামু আলাইকুম! ডি-মেডিক সেন্টারে আপনাকে স্বাগতম। কিভাবে আপনাকে সাহায্য করতে পারি?</p>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="আপনার মেসেজ লিখুন..." id="chatInput">
                        <button class="btn btn-success" type="button" onclick="sendChatMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing chat if any
    const existingChat = document.querySelector('.chat-window');
    if (existingChat) {
        existingChat.remove();
    }
    
    // Add new chat window
    const chatDiv = document.createElement('div');
    chatDiv.className = 'chat-window';
    chatDiv.innerHTML = chatWindow;
    document.body.appendChild(chatDiv);
}

window.closeChat = function() {
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow) {
        chatWindow.remove();
    }
};

window.sendChatMessage = function() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatBody = document.getElementById('chatBody');
    
    // Add user message
    const userMessage = `
        <div class="chat-message mb-3 text-end">
            <div class="message-bubble bg-primary text-white p-2 rounded">
                <p class="mb-0">${message}</p>
            </div>
        </div>
    `;
    chatBody.innerHTML += userMessage;
    
    // Clear input
    input.value = '';
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Simulate bot response after delay
    setTimeout(() => {
        const responses = [
            "ধন্যবাদ আপনার মেসেজের জন্য। আমাদের বিশেষজ্ঞ শীঘ্রই উত্তর দেবেন।",
            "আপনার প্রশ্নটি রেকর্ড করা হয়েছে। আমরা দ্রুত আপনার সাথে যোগাযোগ করব।",
            "আপনি কি অ্যাপয়েন্টমেন্ট সম্পর্কে তথ্য চান?",
            "ডায়াবেটিস নিয়ন্ত্রণে আরও সাহায্য প্রয়োজন?",
            "আমাদের ওয়েবসাইটের বিভিন্ন টুলস ব্যবহার করে আপনার স্বাস্থ্য মনিটরিং করতে পারেন।"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const botMessage = `
            <div class="chat-message mb-3">
                <div class="message-bubble bg-light p-2 rounded">
                    <small class="text-muted">ডি-মেডিক সহায়তা:</small>
                    <p class="mb-0">${randomResponse}</p>
                </div>
            </div>
        `;
        
        chatBody.innerHTML += botMessage;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
};

// Google Maps Integration
function initGoogleMap() {
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        // If Google Maps API is not available, show a static map
        showStaticMap();
        return;
    }
    
    // Try to initialize Google Map
    try {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;
        
        // Dhaka, Bangladesh coordinates
        const dhakaLocation = { lat: 23.8103, lng: 90.4125 };
        
        const map = new google.maps.Map(mapElement, {
            center: dhakaLocation,
            zoom: 15,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        });
        
        // Add marker
        const marker = new google.maps.Marker({
            position: dhakaLocation,
            map: map,
            title: "ডি-মেডিক সেন্টার",
            icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
        });
        
        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h5 style="margin: 0 0 10px 0; color: #008080;">ডি-মেডিক সেন্টার</h5>
                    <p style="margin: 0 0 5px 0;">১২৩ আফতাব নগর, ঢাকা-১২১২</p>
                    <p style="margin: 0 0 5px 0;">বাংলাদেশ</p>
                    <p style="margin: 0;"><strong>ফোন:</strong> +৮৮০ ১৭০০-১২৩৪৫৬</p>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        
        // Open info window by default
        infoWindow.open(map, marker);
        
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        showStaticMap();
    }
}

function showStaticMap() {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;
    
    // Show a static map image
    mapContainer.innerHTML = `
        <div style="height: 100%; width: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-map-marker-alt display-1 text-primary-custom mb-3"></i>
                <h5 class="mb-2">ডি-মেডিক সেন্টার</h5>
                <p class="text-muted mb-1">১২৩ আফতাব নগর, ঢাকা-১২১২</p>
                <p class="text-muted">বাংলাদেশ</p>
                <div class="mt-4">
                    <a href="https://www.google.com/maps/search/?api=1&query=23.8103,90.4125" 
                       target="_blank" 
                       class="btn btn-custom">
                        <i class="fas fa-external-link-alt me-2"></i> গুগল ম্যাপে দেখুন
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Load Google Maps API if not already loaded
function loadGoogleMapsAPI() {
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initGoogleMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    } else {
        initGoogleMap();
    }
}

// Note: Replace YOUR_API_KEY with actual Google Maps API key
// For demo purposes, we're using a fallback static map

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initContactSystem,
        sendContactMessage,
        subscribeNewsletter,
        initGoogleMap
    };
}