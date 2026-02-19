// js/appointment.js - Appointment Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Appointment System
    initAppointmentSystem();
    
    // Load doctors and time slots
    loadDoctors();
    loadTimeSlots();
    
    // Load appointment history
    loadAppointmentHistory();
});

function initAppointmentSystem() {
    const appointmentForm = document.getElementById('appointmentForm');
    const resetBtn = document.getElementById('resetAppointmentForm');
    const startChatBtn = document.getElementById('startLiveChat');
    const bookDoctorBtn = document.getElementById('bookThisDoctor');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            bookAppointment();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAppointmentForm);
    }
    
    if (startChatBtn) {
        startChatBtn.addEventListener('click', startLiveChat);
    }
    
    if (bookDoctorBtn) {
        bookDoctorBtn.addEventListener('click', bookSelectedDoctor);
    }
    
    // Set minimum date to today
    const today = DMedicUtils.getCurrentDate();
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.min = today;
        dateInput.value = today;
    }
}

// Doctors Data
const doctors = [
    {
        id: 'dr_rahman',
        name: 'ডাঃ এ. কে. রহমান',
        specialty: 'এন্ডোক্রিনোলজিস্ট',
        experience: '১৫+ বছর',
        rating: 4.8,
        fee: '১,৫০০ টাকা',
        description: 'ডায়াবেটিস ও হরমোন রোগের বিশেষজ্ঞ। বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয় থেকে এমবিবিএস এবং এফসিপিএস ডিগ্রী অর্জন করেছেন।',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        qualifications: ['এমবিবিএস', 'এফসিপিএস (এন্ডোক্রিনোলজি)', 'এমডি (মেডিসিন)'],
        schedule: 'সোম-বৃহস্পতি: ৯:০০ AM - ৫:০০ PM',
        availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    },
    {
        id: 'dr_akhtar',
        name: 'ডাঃ ফারহানা আখতার',
        specialty: 'ডায়াবেটোলজিস্ট',
        experience: '১২+ বছর',
        rating: 4.7,
        fee: '১,২০০ টাকা',
        description: 'ডায়াবেটিস বিশেষজ্ঞ এবং পুষ্টিবিদ। ঢাকা মেডিকেল কলেজ থেকে এমবিবিএস এবং বিসিএস (স্বাস্থ্য) ক্যাডারে কর্মরত।',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        qualifications: ['এমবিবিএস', 'এফসিপিএস (মেডিসিন)', 'পিজিটি (ডায়াবেটোলজি)'],
        schedule: 'রবি-বুধ: ১০:০০ AM - ৬:০০ PM',
        availableSlots: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00']
    },
    {
        id: 'dr_hossain',
        name: 'ডাঃ মোঃ হোসাইন',
        specialty: 'সাধারণ চিকিৎসক',
        experience: '৮+ বছর',
        rating: 4.5,
        fee: '৫০০ টাকা',
        description: 'সাধারণ চিকিৎসা ও ডায়াবেটিস ব্যবস্থাপনা বিশেষজ্ঞ। কমিউনিটি হেলথ কেয়ারে বিশেষ অভিজ্ঞতা রয়েছে।',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        qualifications: ['এমবিবিএস', 'বিসিএস (স্বাস্থ্য)', 'ডিজিপি (মেডিসিন)'],
        schedule: 'শনি-মঙ্গল: ৮:০০ AM - ৪:০০ PM',
        availableSlots: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00']
    },
    {
        id: 'dr_islam',
        name: 'ডাঃ সাবিনা ইসলাম',
        specialty: 'পুষ্টিবিদ',
        experience: '১০+ বছর',
        rating: 4.6,
        fee: '৮০০ টাকা',
        description: 'ডায়াবেটিস উপযোগী খাদ্য পরিকল্পনা ও পুষ্টি ব্যবস্থাপনা বিশেষজ্ঞ। বাংলাদেশ পুষ্টি সমিতির সদস্য।',
        image: 'https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
        qualifications: ['এমএসসি (পুষ্টি)', 'বিপিএন', 'সিপিডি (ডায়াবেটিস নিউট্রিশন)'],
        schedule: 'বৃহস্পতি-শনিবার: ১১:০০ AM - ৭:০০ PM',
        availableSlots: ['11:00', '12:00', '13:00', '16:00', '17:00', '18:00']
    }
];

function loadDoctors() {
    const doctorsList = document.getElementById('doctorsList');
    const doctorSelect = document.getElementById('selectedDoctor');
    
    if (!doctorsList && !doctorSelect) return;
    
    let doctorsListHTML = '';
    let doctorSelectHTML = '<option value="">একজন ডাক্তার নির্বাচন করুন</option>';
    
    doctors.forEach(doctor => {
        // Doctors list HTML
        doctorsListHTML += `
            <a href="#" class="list-group-item list-group-item-action" data-doctor-id="${doctor.id}">
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${doctor.name}</h6>
                        <small class="text-muted">${doctor.specialty}</small>
                    </div>
                    <span class="badge bg-primary">${doctor.fee}</span>
                </div>
                <div class="mt-2">
                    <small class="text-warning">
                        ${getStarRating(doctor.rating)}
                        <span class="text-muted ms-1">(${doctor.rating})</span>
                    </small>
                </div>
            </a>
        `;
        
        // Doctor select option HTML
        doctorSelectHTML += `<option value="${doctor.id}">${doctor.name} - ${doctor.specialty} (${doctor.fee})</option>`;
    });
    
    if (doctorsList) {
        doctorsList.innerHTML = doctorsListHTML;
        
        // Add click event to doctor list items
        document.querySelectorAll('#doctorsList .list-group-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const doctorId = this.getAttribute('data-doctor-id');
                showDoctorDetails(doctorId);
            });
        });
    }
    
    if (doctorSelect) {
        doctorSelect.innerHTML = doctorSelectHTML;
        
        // Add change event to doctor select
        doctorSelect.addEventListener('change', function() {
            const doctorId = this.value;
            if (doctorId) {
                updateTimeSlots(doctorId);
            }
        });
    }
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function showDoctorDetails(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;
    
    // Update modal content
    document.getElementById('doctorModalTitle').textContent = doctor.name;
    document.getElementById('doctorModalImage').src = doctor.image;
    document.getElementById('doctorModalImage').alt = doctor.name;
    document.getElementById('doctorModalSpecialty').textContent = doctor.specialty + ' • ' + doctor.experience + ' অভিজ্ঞতা';
    document.getElementById('doctorModalRating').innerHTML = getStarRating(doctor.rating) + ` (${doctor.rating})`;
    document.getElementById('doctorModalDescription').textContent = doctor.description;
    document.getElementById('doctorModalFee').textContent = doctor.fee;
    document.getElementById('doctorModalSchedule').textContent = doctor.schedule;
    
    // Update qualifications list
    const qualificationsList = document.getElementById('doctorModalQualifications');
    qualificationsList.innerHTML = '';
    doctor.qualifications.forEach(qual => {
        const li = document.createElement('li');
        li.textContent = qual;
        qualificationsList.appendChild(li);
    });
    
    // Set book button data
    document.getElementById('bookThisDoctor').setAttribute('data-doctor-id', doctor.id);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('doctorDetailsModal'));
    modal.show();
}

function bookSelectedDoctor() {
    const doctorId = this.getAttribute('data-doctor-id');
    const doctorSelect = document.getElementById('selectedDoctor');
    
    if (doctorSelect) {
        doctorSelect.value = doctorId;
        updateTimeSlots(doctorId);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('doctorDetailsModal')).hide();
        
        // Scroll to form
        document.getElementById('appointmentForm').scrollIntoView({ behavior: 'smooth' });
        
        DMedicUtils.showToast('ডাক্তার নির্বাচন করা হয়েছে', 'success');
    }
}

function loadTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (!timeSlotsContainer) return;
    
    // Default time slots (9 AM to 5 PM)
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '02:00 PM', '03:00 PM',
        '04:00 PM', '05:00 PM'
    ];
    
    updateTimeSlotsDisplay(timeSlots);
}

function updateTimeSlots(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;
    
    // Convert 24-hour format to 12-hour format
    const timeSlots = doctor.availableSlots.map(slot => {
        const [hour, minute] = slot.split(':');
        const hourNum = parseInt(hour);
        const period = hourNum >= 12 ? 'PM' : 'AM';
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${minute} ${period}`;
    });
    
    updateTimeSlotsDisplay(timeSlots);
}

function updateTimeSlotsDisplay(slots) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (!timeSlotsContainer) return;
    
    let html = '';
    
    slots.forEach(slot => {
        html += `
            <div class="time-slot" data-time="${slot}">
                ${slot}
            </div>
        `;
    });
    
    timeSlotsContainer.innerHTML = html;
    
    // Add click event to time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selected class from all slots
            document.querySelectorAll('.time-slot').forEach(s => {
                s.classList.remove('selected');
            });
            
            // Add selected class to clicked slot
            this.classList.add('selected');
        });
    });
}

function bookAppointment() {
    // Get form values
    const patientName = document.getElementById('patientName').value.trim();
    const patientAge = parseInt(document.getElementById('patientAge').value);
    const patientPhone = document.getElementById('patientPhone').value.trim();
    const patientEmail = document.getElementById('patientEmail').value.trim();
    const doctorId = document.getElementById('selectedDoctor').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const appointmentType = document.getElementById('appointmentType').value;
    const healthIssue = document.getElementById('healthIssue').value.trim();
    const previousHistory = document.getElementById('previousHistory').value.trim();
    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    
    // Validation
    if (!patientName || !patientAge || !patientPhone || !doctorId || !appointmentDate || 
        !appointmentType || !healthIssue || !selectedTimeSlot) {
        DMedicUtils.showToast('দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'warning');
        return;
    }
    
    if (!DMedicUtils.validatePhone(patientPhone)) {
        DMedicUtils.showToast('সঠিক মোবাইল নম্বর লিখুন', 'warning');
        return;
    }
    
    if (patientEmail && !DMedicUtils.validateEmail(patientEmail)) {
        DMedicUtils.showToast('সঠিক ইমেইল ঠিকানা লিখুন', 'warning');
        return;
    }
    
    if (patientAge < 1 || patientAge > 120) {
        DMedicUtils.showToast('সঠিক বয়স লিখুন', 'warning');
        return;
    }
    
    // Get selected doctor
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) {
        DMedicUtils.showToast('দয়া করে একজন ডাক্তার নির্বাচন করুন', 'warning');
        return;
    }
    
    // Generate reference number
    const refNumber = 'DM' + Date.now().toString().slice(-8);
    
    // Create appointment record
    const appointment = {
        id: Date.now(),
        refNumber: refNumber,
        patientName: patientName,
        patientAge: patientAge,
        patientPhone: patientPhone,
        patientEmail: patientEmail || '',
        doctorId: doctorId,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        appointmentDate: appointmentDate,
        appointmentTime: selectedTimeSlot.textContent,
        appointmentType: appointmentType,
        healthIssue: healthIssue,
        previousHistory: previousHistory || '',
        fee: doctor.fee,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const appointments = DMedicUtils.getFromLocalStorage('appointments') || [];
    appointments.push(appointment);
    DMedicUtils.saveToLocalStorage('appointments', appointments);
    
    // Show confirmation
    showAppointmentConfirmation(appointment);
    
    // Reset form
    resetAppointmentForm();
    
    // Reload history
    loadAppointmentHistory();
}

function showAppointmentConfirmation(appointment) {
    // Update confirmation details
    document.getElementById('confirmationRef').textContent = appointment.refNumber;
    document.getElementById('confirmationName').textContent = appointment.patientName;
    document.getElementById('confirmationDoctor').textContent = appointment.doctorName;
    document.getElementById('confirmationDate').textContent = DMedicUtils.formatDate(new Date(appointment.appointmentDate));
    document.getElementById('confirmationTime').textContent = appointment.appointmentTime;
    document.getElementById('confirmationFee').textContent = appointment.fee;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
    
    // Send confirmation notification
    sendConfirmationNotification(appointment);
}

function sendConfirmationNotification(appointment) {
    // In a real app, this would send email/SMS
    console.log('Appointment confirmation sent:', appointment);
    
    // For demo, just show a toast
    DMedicUtils.showToast(`অ্যাপয়েন্টমেন্ট কনফার্মেশন রেফারেন্স: ${appointment.refNumber}`, 'success');
}

function loadAppointmentHistory() {
    const appointments = DMedicUtils.getFromLocalStorage('appointments') || [];
    const tableBody = document.getElementById('appointmentHistoryBody');
    
    if (!tableBody) return;
    
    if (appointments.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-calendar-times display-4 text-muted mb-3"></i>
                    <p class="text-muted">কোন অ্যাপয়েন্টমেন্ট ইতিহাস পাওয়া যায়নি</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by date (newest first)
    appointments.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
    
    let html = '';
    
    appointments.forEach(appointment => {
        const date = new Date(appointment.appointmentDate);
        const dateStr = DMedicUtils.formatDate(date);
        
        // Determine status badge
        let statusClass = 'success';
        let statusText = 'কনফার্মড';
        
        if (appointment.status === 'pending') {
            statusClass = 'warning';
            statusText = 'পেন্ডিং';
        } else if (appointment.status === 'cancelled') {
            statusClass = 'danger';
            statusText = 'ক্যান্সেলড';
        } else if (appointment.status === 'completed') {
            statusClass = 'info';
            statusText = 'সম্পন্ন';
        }
        
        html += `
            <tr>
                <td>${dateStr}</td>
                <td>
                    <strong>${appointment.doctorName}</strong><br>
                    <small class="text-muted">${appointment.doctorSpecialty}</small>
                </td>
                <td>${appointment.appointmentTime}</td>
                <td>
                    <span class="badge bg-${statusClass}">${statusText}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="viewAppointmentDetails(${appointment.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="cancelAppointment(${appointment.id})" ${appointment.status === 'cancelled' || appointment.status === 'completed' ? 'disabled' : ''}>
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

window.viewAppointmentDetails = function(appointmentId) {
    const appointments = DMedicUtils.getFromLocalStorage('appointments') || [];
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
        DMedicUtils.showToast('অ্যাপয়েন্টমেন্ট তথ্য পাওয়া যায়নি', 'error');
        return;
    }
    
    // Create modal content
    const modalContent = `
        <div class="modal-header modal-header-custom">
            <h5 class="modal-title">অ্যাপয়েন্টমেন্ট বিস্তারিত</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-6">
                    <p><strong>রেফারেন্স নম্বর:</strong><br>${appointment.refNumber}</p>
                    <p><strong>রোগীর নাম:</strong><br>${appointment.patientName}</p>
                    <p><strong>বয়স:</strong><br>${appointment.patientAge} বছর</p>
                    <p><strong>মোবাইল:</strong><br>${appointment.patientPhone}</p>
                    ${appointment.patientEmail ? `<p><strong>ইমেইল:</strong><br>${appointment.patientEmail}</p>` : ''}
                </div>
                <div class="col-md-6">
                    <p><strong>ডাক্তার:</strong><br>${appointment.doctorName}</p>
                    <p><strong>বিশেষজ্ঞতা:</strong><br>${appointment.doctorSpecialty}</p>
                    <p><strong>তারিখ:</strong><br>${DMedicUtils.formatDate(new Date(appointment.appointmentDate))}</p>
                    <p><strong>সময়:</strong><br>${appointment.appointmentTime}</p>
                    <p><strong>ফি:</strong><br>${appointment.fee}</p>
                </div>
            </div>
            
            <div class="row mt-3">
                <div class="col-12">
                    <p><strong>স্বাস্থ্য সমস্যা:</strong></p>
                    <div class="alert alert-light">
                        ${appointment.healthIssue}
                    </div>
                </div>
            </div>
            
            ${appointment.previousHistory ? `
            <div class="row mt-3">
                <div class="col-12">
                    <p><strong>পূর্ববর্তী ইতিহাস:</strong></p>
                    <div class="alert alert-light">
                        ${appointment.previousHistory}
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="row mt-3">
                <div class="col-12">
                    <p><strong>স্ট্যাটাস:</strong> <span class="badge bg-${getStatusClass(appointment.status)}">${getStatusText(appointment.status)}</span></p>
                    <p><strong>বুকিং তারিখ:</strong> ${DMedicUtils.formatDate(new Date(appointment.bookedAt))}</p>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">বন্ধ করুন</button>
            <button type="button" class="btn btn-custom" onclick="printAppointment(${appointment.id})">
                <i class="fas fa-print me-2"></i> প্রিন্ট করুন
            </button>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'appointmentDetailsModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content modal-content-custom">
                ${modalContent}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // Remove modal when hidden
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
};

window.cancelAppointment = function(appointmentId) {
    if (!confirm('আপনি কি এই অ্যাপয়েন্টমেন্টটি বাতিল করতে চান?')) {
        return;
    }
    
    const appointments = DMedicUtils.getFromLocalStorage('appointments') || [];
    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex === -1) {
        DMedicUtils.showToast('অ্যাপয়েন্টমেন্ট পাওয়া যায়নি', 'error');
        return;
    }
    
    // Update status to cancelled
    appointments[appointmentIndex].status = 'cancelled';
    DMedicUtils.saveToLocalStorage('appointments', appointments);
    
    // Reload history
    loadAppointmentHistory();
    
    DMedicUtils.showToast('অ্যাপয়েন্টমেন্ট বাতিল করা হয়েছে', 'success');
};

function getStatusClass(status) {
    switch(status) {
        case 'confirmed': return 'success';
        case 'pending': return 'warning';
        case 'cancelled': return 'danger';
        case 'completed': return 'info';
        default: return 'secondary';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'confirmed': return 'কনফার্মড';
        case 'pending': return 'পেন্ডিং';
        case 'cancelled': return 'ক্যান্সেলড';
        case 'completed': return 'সম্পন্ন';
        default: return status;
    }
}

function resetAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    if (form) form.reset();
    
    // Reset time slots selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Set default date
    const today = DMedicUtils.getCurrentDate();
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.value = today;
    }
    
    DMedicUtils.showToast('ফর্ম রিসেট করা হয়েছে', 'info');
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
                    <h6 class="mb-0"><i class="fas fa-comments me-2"></i> লাইভ চ্যাট</h6>
                    <button type="button" class="btn btn-sm btn-light" onclick="closeChat()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body p-3" style="height: 300px; overflow-y: auto;">
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
    
    const chatBody = document.querySelector('.chat-window .card-body');
    
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
            "আপনার প্রশ্নটি বুঝতে পেরেছি। আমাদের বিশেষজ্ঞ শীঘ্রই উত্তর দেবেন।",
            "অ্যাপয়েন্টমেন্ট সম্পর্কে আরও তথ্য চান?",
            "ডায়াবেটিস নিয়ন্ত্রণে আরও সাহায্য প্রয়োজন?",
            "আপনার স্বাস্থ্য তথ্য আপডেট করতে সাহায্য করতে পারি।"
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

window.printConfirmation = function() {
    window.print();
};

window.shareConfirmation = function() {
    const refNumber = document.getElementById('confirmationRef').textContent;
    const shareText = `আমার ডি-মেডিক অ্যাপয়েন্টমেন্ট কনফার্ম হয়েছে। রেফারেন্স নম্বর: ${refNumber}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'ডি-মেডিক অ্যাপয়েন্টমেন্ট',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText)
            .then(() => DMedicUtils.showToast('কনফার্মেশন টেক্সট কপি করা হয়েছে', 'success'))
            .catch(err => DMedicUtils.showToast('শেয়ার করতে সমস্যা হয়েছে', 'error'));
    }
};

window.printAppointment = function(appointmentId) {
    // In a real app, this would generate a printable version
    DMedicUtils.showToast('প্রিন্ট অপশন শীঘ্রই চালু হবে', 'info');
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAppointmentSystem,
        loadDoctors,
        bookAppointment,
        loadAppointmentHistory
    };
}