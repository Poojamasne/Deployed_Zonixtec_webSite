// Booking Modal Functions - Zonixtec
// This file handles the 30-minute call booking modal functionality

// Open booking modal
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('bookingDate');
        if (dateInput) {
            dateInput.setAttribute('min', today);
        }
    } else {
        console.error('Booking modal not found');
    }
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize booking modal functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBookingModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBookingModal();
        }
    });

    // Handle booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-booking-btn');
            const successMessage = document.getElementById('bookingSuccess');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

            // Collect form data
            const bookingData = {
                name: document.getElementById('bookingName').value.trim(),
                email: document.getElementById('bookingEmail').value.trim(),
                phone: document.getElementById('bookingPhone').value.trim(),
                company: document.getElementById('bookingCompany').value.trim(),
                bookingDate: document.getElementById('bookingDate').value,
                bookingTime: document.getElementById('bookingTime').value,
                service: document.getElementById('bookingService').value,
                message: document.getElementById('bookingMessage').value.trim()
            };

            try {
                // Use production API endpoint
                const apiPath = 'https://zonixtec.com/server/booking/save-booking.php';
                
                console.log('📤 Sending booking to:', apiPath);
                console.log('📋 Data:', bookingData);
                
                // Send to server
                const response = await fetch(apiPath, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingData)
                });

                console.log('📡 Response status:', response.status);
                
                const result = await response.json();
                console.log('📥 Response data:', result);

                if (result.success) {
                    console.log('✅ SUCCESS! Booking saved to database. ID:', result.bookingId);

                    // Show success message
                    setTimeout(() => {
                        if (successMessage) {
                            successMessage.classList.add('show');
                        }
                        bookingForm.reset();
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;

                        // Close modal after 3 seconds
                        setTimeout(() => {
                            closeBookingModal();
                            if (successMessage) {
                                successMessage.classList.remove('show');
                            }
                        }, 3000);
                    }, 500);
                } else {
                    console.error('❌ FAILED:', result.message);
                    if (result.error) console.error('🔍 Details:', result.error);
                    throw new Error(result.message || 'Failed to save booking');
                }

            } catch (error) {
                console.error('💥 ERROR:', error.message);
                alert('Error submitting booking:\n\n' + error.message + '\n\nCheck console (F12) for details.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});
