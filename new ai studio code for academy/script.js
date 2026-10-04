/**
 * Al Huda eQuran Academy - Core JavaScript
 * Clean, lightweight, modular & performant
 */

function initAlHudaApp() {
    'use strict';

    // ==========================================
    // 1. MOBILE NAVIGATION
    // ==========================================
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars-staggered';
            }
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars-staggered';
            });
        });

        // Close when clicking outside
        document.addEventListener('click', function (e) {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars-staggered';
            }
        });
    }

    // ==========================================
    // 2. BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 3. FLOATING CIRCLE TRIAL BADGE (3-DAY FREE TRIAL)
    // ==========================================
    const floatingTrialBox = document.getElementById('floatingTrialBox');
    let floatingTrialManuallyDismissed = false;

    function updateFloatingTrialVisibility() {
        if (!floatingTrialBox || floatingTrialManuallyDismissed) return;
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            const rect = featuresSection.getBoundingClientRect();
            // Appears ONLY after the visitor scrolls down past the "Why Choose Us" section
            if (rect.bottom <= 50) {
                floatingTrialBox.style.display = 'block';
                floatingTrialBox.classList.add('show');
            } else {
                // When visitor scrolls back above Why Choose Us, automatically hide
                floatingTrialBox.classList.remove('show');
            }
        }
    }

    if (floatingTrialBox) {
        window.addEventListener('scroll', updateFloatingTrialVisibility, { passive: true });
        // Initial check on load (ensures hidden on page load)
        updateFloatingTrialVisibility();
    }

    // Global close floating badge
    window.closeFloatingBox = function () {
        floatingTrialManuallyDismissed = true;
        if (floatingTrialBox) {
            floatingTrialBox.classList.remove('show');
            setTimeout(function () {
                floatingTrialBox.style.display = 'none';
            }, 300);
        }
    };

    // ==========================================
    // 4. FAQ ACCORDION (ACCESSIBLE)
    // ==========================================
    window.toggleFAQ = function (button) {
        const currentItem = button.closest('.faq-item');
        if (!currentItem) return;

        const isCurrentlyActive = currentItem.classList.contains('active');

        // Close all other items
        document.querySelectorAll('.faq-item').forEach(function (item) {
            item.classList.remove('active');
            const btn = item.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current item
        if (!isCurrentlyActive) {
            currentItem.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
        } else {
            button.setAttribute('aria-expanded', 'false');
        }
    };

    // Keyboard support for FAQ
    document.querySelectorAll('.faq-question').forEach(function (button) {
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.toggleFAQ(button);
            }
        });
    });

    // ==========================================
    // 5. COURSE SELECTION SYLLABUS BENEFITS POPUP
    // ==========================================
    const courseSelect = document.getElementById('courseSelect');
    const courseIncludesBox = document.getElementById('courseIncludesBox');

    // Popup must ONLY appear when selected course is one of these:
    // - Nazra Quran
    // - Short Course
    // - Madani Qaida
    // - Noorani Qaida
    // For ALL other courses, this popup must NOT appear:
    // - Nazra Hifz Quran -> NO popup
    // - Hifz Quran -> NO popup
    // - Tajweed -> NO popup
    // - Islamic Studies -> NO popup
    // - Any other course -> NO popup
    function isCourseEligibleForPopup(value, text) {
        const val = (value || '').trim().toLowerCase();
        const txt = (text || '').trim().toLowerCase();

        // STRICT EXCLUSION: Nazra Hifz Quran and any Hifz courses
        if (val.includes('hifz') || txt.includes('hifz')) {
            return false;
        }

        // STRICT EXCLUSION: Tajweed, Islamic Studies, Arabic, Translation
        if (val.includes('tajweed') || txt.includes('tajweed') ||
            val.includes('islamic') || txt.includes('islamic') ||
            val.includes('arabic') || txt.includes('arabic') ||
            val.includes('translation') || txt.includes('translation')) {
            return false;
        }

        // ALLOWED COURSE 1: Nazra Quran (strictly without Hifz)
        if (val === 'nazra quran' || txt === 'nazra quran' ||
            (val.includes('nazra') && !val.includes('hifz')) ||
            (txt.includes('nazra') && !txt.includes('hifz'))) {
            return true;
        }

        // ALLOWED COURSE 2: Short Course
        if (val === 'short course' || txt === 'short course' ||
            val.includes('short course') || txt.includes('short course')) {
            return true;
        }

        // ALLOWED COURSE 3: Madani Qaida
        if (val === 'madani qaida' || txt === 'madani qaida' ||
            val.includes('madani qaida') || txt.includes('madani qaida')) {
            return true;
        }

        // ALLOWED COURSE 4: Noorani Qaida
        if (val === 'noorani qaida' || txt === 'noorani qaida' ||
            val.includes('noorani qaida') || txt.includes('noorani qaida')) {
            return true;
        }

        return false;
    }

    function updateCourseBenefits() {
        if (!courseSelect || !courseIncludesBox) return;
        const selectedIndex = courseSelect.selectedIndex;
        if (selectedIndex <= 0) {
            courseIncludesBox.style.display = 'none';
            return;
        }

        const selectedOption = courseSelect.options[selectedIndex];
        const val = selectedOption ? selectedOption.value : '';
        const txt = selectedOption ? selectedOption.text : '';

        if (isCourseEligibleForPopup(val, txt)) {
            courseIncludesBox.style.display = 'flex';
        } else {
            courseIncludesBox.style.display = 'none';
        }
    }

    if (courseSelect) {
        courseSelect.addEventListener('change', updateCourseBenefits);
    }

    window.hideCourseBenefits = function () {
        if (courseIncludesBox) {
            courseIncludesBox.style.display = 'none';
        }
    };

    // Pre-select course when clicking "Enroll Now" from course cards
    document.querySelectorAll('.enroll-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const card = btn.closest('.course-card');
            if (!card || !courseSelect) return;
            const courseTitle = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '';

            // Match option
            for (let i = 0; i < courseSelect.options.length; i++) {
                if (courseSelect.options[i].text.toLowerCase().includes(courseTitle.toLowerCase()) ||
                    courseTitle.toLowerCase().includes(courseSelect.options[i].value.toLowerCase())) {
                    courseSelect.selectedIndex = i;
                    updateCourseBenefits();
                    break;
                }
            }
        });
    });

    // ==========================================
    // 6. ADMISSION FORM SUBMISSION (WEB3FORMS)
    // ==========================================
    const admissionForm = document.getElementById('admission-form');
    const successModal = document.getElementById('successModal');
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = document.getElementById('submitBtnText');

    if (admissionForm) {
        admissionForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!admissionForm.checkValidity()) {
                admissionForm.reportValidity();
                return;
            }

            const originalBtnText = submitBtnText ? submitBtnText.textContent : 'Submit Application & Book Free Trial';
            if (submitBtn) submitBtn.disabled = true;
            if (submitBtnText) submitBtnText.textContent = 'Submitting Application...';

            const formData = new FormData(admissionForm);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    // CRITICAL: Set persistent flag only upon genuine success
                    try {
                        localStorage.setItem('alhuda_form_submitted', 'true');
                    } catch (err) {
                        console.warn('localStorage access error:', err);
                    }

                    // Close exit popup if open & clear any running timer
                    closeExitPopupModal();

                    // Trigger Confetti
                    triggerConfettiCelebration();

                    // Open Success Modal
                    if (successModal) {
                        successModal.classList.add('active');
                        successModal.setAttribute('aria-hidden', 'false');
                    }

                    // Reset Form
                    admissionForm.reset();
                    if (courseIncludesBox) courseIncludesBox.style.display = 'none';
                } else {
                    // Do NOT set alhuda_form_submitted flag if submission failed!
                    alert('Submission failed: ' + (data.message || 'Please contact us directly via WhatsApp (+92 341 6216489).'));
                }
            })
            .catch(function (error) {
                console.error('Submission error:', error);
                // Do NOT set alhuda_form_submitted flag on failure!
                alert('Network connection error. Please contact us directly via WhatsApp (+92 341 6216489).');
            })
            .finally(function () {
                if (submitBtn) submitBtn.disabled = false;
                if (submitBtnText) submitBtnText.textContent = originalBtnText;
            });
        });
    }

    // Close success modal
    window.closeSuccessModal = function () {
        if (successModal) {
            successModal.classList.remove('active');
            successModal.setAttribute('aria-hidden', 'true');
        }
    };

    if (successModal) {
        successModal.addEventListener('click', function (e) {
            if (e.target === successModal) {
                window.closeSuccessModal();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && successModal && successModal.classList.contains('active')) {
            window.closeSuccessModal();
        }
    });

    // Confetti effect helper (Canvas confetti + elegant DOM sparkle fallback)
    function triggerConfettiCelebration() {
        if (typeof confetti === 'function') {
            try {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#f59e0b', '#064e3b', '#fbbf24', '#ffffff', '#10b981'],
                    zIndex: 1000000
                });
                setTimeout(function () {
                    confetti({
                        particleCount: 60,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0, y: 0.6 },
                        colors: ['#f59e0b', '#064e3b', '#fbbf24'],
                        zIndex: 1000000
                    });
                    confetti({
                        particleCount: 60,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1, y: 0.6 },
                        colors: ['#f59e0b', '#064e3b', '#fbbf24'],
                        zIndex: 1000000
                    });
                }, 250);
            } catch (e) {
                console.log('Canvas confetti error:', e);
            }
        }
    }

    // ==========================================
    // 7. EXIT INTENT 20% OFF POPUP
    // ==========================================
    const exitPopup = document.getElementById('exitPopup');
    const closeExitPopupBtn = document.getElementById('closeExitPopup');
    const popupTimer = document.getElementById('popupTimer');
    const claimDiscountBtn = document.getElementById('claimDiscountBtn');
    const claimWhatsAppBtn = document.getElementById('claimWhatsAppBtn');

    let countdownInterval = null;
    let timerStarted = false;
    const pageLoadTime = Date.now();
    let maxScrollY = 0;
    let lastScrollY = window.scrollY;

    // Helper: Check if visitor has ever successfully submitted the form
    function hasFormBeenSubmitted() {
        try {
            return localStorage.getItem('alhuda_form_submitted') === 'true';
        } catch (e) {
            return false;
        }
    }

    // Helper: Check if popup was already shown or dismissed in current session
    function isPopupDismissedInSession() {
        try {
            return sessionStorage.getItem('alhuda_exit_popup_closed') === 'true';
        } catch (e) {
            return false;
        }
    }

    // Helper: Start Countdown Timer (10:00) ONLY when popup opens
    function startCountdownTimer() {
        if (timerStarted || !popupTimer) return;
        timerStarted = true;
        let timeRemaining = 10 * 60; // 10 minutes in seconds

        function updateDisplay() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            popupTimer.textContent =
                (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }

        updateDisplay();

        countdownInterval = setInterval(function () {
            timeRemaining--;
            if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                popupTimer.textContent = '00:00';
                return;
            }
            updateDisplay();
        }, 1000);
    }

    // Safety delay: 6 seconds after page load before exit-intent detection activates (5-10s requirement)
    const EXIT_INTENT_SAFETY_DELAY_MS = 6000;
    let isExitIntentReady = false;
    const exitIntentSafetyTimer = setTimeout(function () {
        isExitIntentReady = true;
    }, EXIT_INTENT_SAFETY_DELAY_MS);

    // Helper: Show Exit Modal
    function showExitModal() {
        // RULE 1: Never show if form was successfully submitted
        if (hasFormBeenSubmitted()) {
            removeExitIntentListeners();
            return;
        }

        // RULE 2: Do not repeatedly show in the same session
        if (isPopupDismissedInSession()) {
            removeExitIntentListeners();
            return;
        }

        const modal = document.getElementById('exitPopup') || exitPopup;
        if (modal) {
            // Mark session as shown immediately so subsequent events or quick mouse shakes won't re-trigger
            try {
                sessionStorage.setItem('alhuda_exit_popup_closed', 'true');
            } catch (e) {}

            removeExitIntentListeners();

            modal.style.display = 'flex';
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');

            // START the timer ONLY when the popup actually appears!
            startCountdownTimer();
        }
    }

    // Helper: Close Exit Modal
    function closeExitPopupModal() {
        const modal = document.getElementById('exitPopup') || exitPopup;
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        removeExitIntentListeners();
    }

    // Close button click
    if (closeExitPopupBtn) {
        closeExitPopupBtn.addEventListener('click', function () {
            try {
                sessionStorage.setItem('alhuda_exit_popup_closed', 'true');
            } catch (e) {}
            closeExitPopupModal();
        });
    }

    // Backdrop click
    if (exitPopup) {
        exitPopup.addEventListener('click', function (e) {
            if (e.target === exitPopup) {
                try {
                    sessionStorage.setItem('alhuda_exit_popup_closed', 'true');
                } catch (err) {}
                closeExitPopupModal();
            }
        });
    }

    // CTA Button Click: "Claim 20% OFF & Book Free Trial"
    if (claimDiscountBtn) {
        claimDiscountBtn.addEventListener('click', function (e) {
            e.preventDefault();
            try {
                sessionStorage.setItem('alhuda_exit_popup_closed', 'true');
            } catch (err) {}
            closeExitPopupModal();

            // Smooth scroll to admission form
            const admissionSection = document.getElementById('admission');
            if (admissionSection) {
                admissionSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Focus on student name field
            setTimeout(function () {
                const nameInput = document.getElementById('student_name');
                if (nameInput) {
                    nameInput.focus();
                }
            }, 600);
        });
    }

    // WhatsApp CTA click
    if (claimWhatsAppBtn) {
        claimWhatsAppBtn.addEventListener('click', function () {
            try {
                sessionStorage.setItem('alhuda_exit_popup_closed', 'true');
            } catch (err) {}
            closeExitPopupModal();
        });
    }

    // Desktop Exit Intent: Mouse Y-position detection
    // Triggers when cursor approaches the top edge of browser window (e.g. clientY <= 15)
    // Works reliably from ANY section of the website without requiring full mouse leave
    function handleMouseMoveExit(e) {
        if (!isExitIntentReady) return;
        if (hasFormBeenSubmitted() || isPopupDismissedInSession()) {
            removeExitIntentListeners();
            return;
        }

        // Reliable detection across browsers when cursor approaches top browser boundary (clientY <= 15px)
        if (typeof e.clientY === 'number' && e.clientY <= 15) {
            showExitModal();
        }
    }

    // Secondary boundary exit trigger if cursor rapidly crosses top boundary
    function handleMouseOutExit(e) {
        if (!isExitIntentReady) return;
        if (hasFormBeenSubmitted() || isPopupDismissedInSession()) {
            removeExitIntentListeners();
            return;
        }

        if (typeof e.clientY === 'number' && e.clientY <= 20 && (!e.relatedTarget && !e.toElement)) {
            showExitModal();
        }
    }

    let exitListenersAttached = false;
    function attachExitIntentListeners() {
        if (exitListenersAttached) return;
        if (hasFormBeenSubmitted() || isPopupDismissedInSession()) return;
        document.addEventListener('mousemove', handleMouseMoveExit, { passive: true });
        document.addEventListener('mouseout', handleMouseOutExit, { passive: true });
        exitListenersAttached = true;
    }

    function removeExitIntentListeners() {
        if (!exitListenersAttached) return;
        document.removeEventListener('mousemove', handleMouseMoveExit);
        document.removeEventListener('mouseout', handleMouseOutExit);
        exitListenersAttached = false;
    }

    // Attach exit intent listeners
    attachExitIntentListeners();

    // Export helpers on window for external / React component mount lifecycle access
    window.initExitIntent = function () {
        attachExitIntentListeners();
        return function cleanup() {
            removeExitIntentListeners();
            if (exitIntentSafetyTimer) clearTimeout(exitIntentSafetyTimer);
        };
    };
    window.showExitModal = showExitModal;
    window.closeExitPopupModal = closeExitPopupModal;

    // Mobile Sensible Exit Intent:
    // 1. Visitor must have spent at least 20 seconds on page
    // 2. Visitor has scrolled down into content (>350px)
    // 3. User rapidly scrolls back up towards address bar OR switches tab
    window.addEventListener('scroll', function () {
        const currentScrollY = window.scrollY;
        if (currentScrollY > maxScrollY) {
            maxScrollY = currentScrollY;
        }

        const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768;
        if (isMobile && isExitIntentReady) {
            const timeSpentMs = Date.now() - pageLoadTime;
            // Only trigger if at least 20 seconds passed and user scrolled > 350px
            if (timeSpentMs > 20000 && maxScrollY > 350) {
                const scrollDelta = currentScrollY - lastScrollY;
                // Rapid upward scroll towards address bar
                if (scrollDelta < -70 && currentScrollY < 200) {
                    showExitModal();
                }
            }
        }
        lastScrollY = currentScrollY;
    }, { passive: true });

    // Mobile / Tab switch visibility exit trigger
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden' && isExitIntentReady) {
            const timeSpentMs = Date.now() - pageLoadTime;
            if (timeSpentMs > 20000 && maxScrollY > 300) {
                // If user leaves tab after engagement, ready the popup for when they return or re-focus
                showExitModal();
            }
        }
    });

    // ==========================================
    // 8. GLOBAL ESCAPE KEY LISTENER
    // ==========================================
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (successModal && successModal.classList.contains('active')) {
                window.closeSuccessModal();
            }
            if (exitPopup && (exitPopup.classList.contains('active') || exitPopup.style.display === 'flex')) {
                try {
                    sessionStorage.setItem('alhuda_exit_popup_closed', 'true');
                } catch (err) {}
                closeExitPopupModal();
            }
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    const icon = menuToggle.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-bars-staggered';
                }
            }
        }
    });
}

// Initialize on DOMContentLoaded or immediately if document is already ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlHudaApp);
} else {
    initAlHudaApp();
}
