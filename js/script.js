// Wildlife Tourism Portal Client Logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation Bar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile Nav Drawer Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate hamburger lines
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
            
            // Basic accessibility support
            const expanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', expanded);
        });
        
        // Close menu on link click (useful for hash links)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Safari Packages Filtering & Searching
    const filterButtons = document.querySelectorAll('.filter-btn');
    const packageCards = document.querySelectorAll('.package-card');
    const searchInput = document.getElementById('search-input');

    function filterPackages() {
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

        packageCards.forEach(card => {
            const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
            
            // Match title/description text
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            const meta = card.querySelector('.card-meta')?.textContent.toLowerCase() || '';
            const matchesSearch = title.includes(searchQuery) || description.includes(searchQuery) || meta.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
                filterPackages();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterPackages);
    }

    // 4. Booking Modal Event Handlers
    const modalOverlay = document.getElementById('booking-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const bookButtons = document.querySelectorAll('.book-btn');
    const modalTourName = document.getElementById('modal-tour-name');
    const bookingForm = document.getElementById('booking-inquiry-form');

    if (bookButtons.length > 0 && modalOverlay) {
        bookButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tourInfo = e.currentTarget.getAttribute('data-tour');
                if (modalTourName) modalTourName.value = tourInfo;
                modalOverlay.classList.add('active');
            });
        });
    }

    if (modalCloseBtn && modalOverlay) {
        modalCloseBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
        
        // Close on clicking outside container
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Client validation check
            const name = document.getElementById('modal-name')?.value;
            const email = document.getElementById('modal-email')?.value;
            const date = document.getElementById('modal-date')?.value;
            
            if (!name || !email || !date) {
                alert('Please enter all required fields.');
                return;
            }

            // Mock success response
            alert(`Thank you, ${name}! Your safari booking inquiry for "${modalTourName.value}" has been submitted successfully. We will email you details at ${email}.`);
            
            // Reset and close
            bookingForm.reset();
            modalOverlay.classList.remove('active');
        });
    }

    // 5. Contact Page Form Handler
    const contactForm = document.getElementById('contact-inquiry-form');
    const formContainer = document.getElementById('form-container');
    const contactSuccessBox = document.getElementById('contact-success-box');

    if (contactForm && formContainer && contactSuccessBox) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name')?.value;
            const email = document.getElementById('contact-email')?.value;
            const subject = document.getElementById('contact-subject')?.value;
            const message = document.getElementById('contact-message')?.value;
            
            if (!name || !email || !subject || !message) {
                alert('Please enter all required fields.');
                return;
            }

            // Toggle success interface panel
            formContainer.style.display = 'none';
            contactSuccessBox.style.display = 'flex';
        });
    }

    // 6. Pre-select destination query parameter in Search widget if present
    const urlParams = new URLSearchParams(window.location.search);
    const destParam = urlParams.get('destination') || urlParams.get('id');
    if (destParam && searchInput) {
        // Set search query and run search
        searchInput.value = destParam;
        filterPackages();
    }

    // 6a. User Dashboard Journal Post Handler
    const journalForm = document.getElementById('journal-post-form');
    const journalLogsContainer = document.getElementById('journal-logs-container');
    if (journalForm && journalLogsContainer) {
        journalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const location = document.getElementById('journal-location').value;
            const dateInput = document.getElementById('journal-date').value;
            const content = document.getElementById('journal-content').value;

            if (!content || !dateInput) {
                alert('Please fill in all entry fields.');
                return;
            }

            // Create new entry DOM
            const newEntry = document.createElement('div');
            newEntry.className = 'journal-entry';
            newEntry.style.marginTop = '20px';
            newEntry.style.animation = 'fadeInUp 0.5s ease';
            
            // Format Date nicely
            const dateObj = new Date(dateInput);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-US', options);

            newEntry.innerHTML = `
                <div class="journal-entry-header">
                    <span class="journal-entry-title">${location}</span>
                    <span>${formattedDate}</span>
                </div>
                <p style="color: var(--text-muted);">${content}</p>
            `;

            // Prepend new entry right below heading
            const firstChild = journalLogsContainer.querySelector('.journal-entry');
            if (firstChild) {
                journalLogsContainer.insertBefore(newEntry, firstChild);
            } else {
                journalLogsContainer.appendChild(newEntry);
            }

            alert('Journal entry successfully added to your records.');
            journalForm.reset();
        });
    }

    // 6b. Admin Price Edit Modal close handlers
    const adminPriceModal = document.getElementById('admin-price-modal-overlay');
    const adminModalCloseBtn = document.getElementById('admin-modal-close-btn');
    if (adminPriceModal && adminModalCloseBtn) {
        adminModalCloseBtn.addEventListener('click', () => {
            adminPriceModal.classList.remove('active');
        });
        adminPriceModal.addEventListener('click', (e) => {
            if (e.target === adminPriceModal) {
                adminPriceModal.classList.remove('active');
            }
        });
    }

    // FAQ Accordion toggle handler
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                if (otherAnswer) otherAnswer.style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Guide Likes Handler
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
        const card = btn.closest('.team-card');
        if (!card) return;
        const guideId = card.getAttribute('data-guide-id');
        const countSpan = btn.querySelector('.like-count');
        
        // Load initial liked status and counts from localStorage
        const isLiked = localStorage.getItem(`like_${guideId}`) === 'true';
        
        // Give them some default base likes so they don't start from 0
        let baseLikes = 0;
        if (guideId === 'joseph-taraya') baseLikes = 142;
        if (guideId === 'elena-rostova') baseLikes = 98;
        if (guideId === 'sipho-khumalo') baseLikes = 115;
        
        let currentLikes = parseInt(localStorage.getItem(`likes_count_${guideId}`)) || (baseLikes + (isLiked ? 1 : 0));
        if (!localStorage.getItem(`likes_count_${guideId}`)) {
            localStorage.setItem(`likes_count_${guideId}`, currentLikes);
        }
        
        // Update DOM
        if (isLiked) {
            btn.classList.add('liked');
        }
        if (countSpan) {
            countSpan.textContent = currentLikes;
        }
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card click events if any
            const liked = btn.classList.toggle('liked');
            localStorage.setItem(`like_${guideId}`, liked ? 'true' : 'false');
            
            if (liked) {
                currentLikes += 1;
            } else {
                currentLikes -= 1;
            }
            localStorage.setItem(`likes_count_${guideId}`, currentLikes);
            if (countSpan) {
                countSpan.textContent = currentLikes;
            }
        });
    });
});

// 7. Login / Signup Tab switching logic
function switchAuthTab(tabName) {
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const formLogin = document.getElementById('form-login-view');
    const formSignup = document.getElementById('form-signup-view');

    if (tabName === 'login') {
        tabLogin?.classList.add('active');
        tabSignup?.classList.remove('active');
        formLogin?.classList.add('active');
        formSignup?.classList.remove('active');
    } else {
        tabSignup?.classList.add('active');
        tabLogin?.classList.remove('active');
        formSignup?.classList.add('active');
        formLogin?.classList.remove('active');
    }
}

// 8. Authentication Form Submits handling (routes users to respective dashboards)
function handleAuthSubmit(event, actionType) {
    event.preventDefault();
    if (actionType === 'login') {
        const email = document.getElementById('login-email')?.value.toLowerCase().trim();
        alert(`Successfully logged in! Redirecting to your dashboard portal...`);
        
        if (email === 'admin@wildjourneys.com') {
            window.location.href = 'admindashboard.html';
        } else {
            window.location.href = 'userdashboard.html';
        }
    } else {
        const name = document.getElementById('signup-name')?.value;
        const password = document.getElementById('signup-password')?.value;
        const confirm = document.getElementById('signup-confirm')?.value;

        if (password !== confirm) {
            alert('Passwords do not match.');
            return;
        }

        alert(`Account created successfully for ${name}! Redirecting to Traveler Dashboard...`);
        window.location.href = 'userdashboard.html';
    }
}

// 9. User Dashboard View toggle switcher
function toggleDashboardView(viewId) {
    const views = document.querySelectorAll('.dashboard-view');
    const buttons = document.querySelectorAll('.sidebar-menu-item button');
    
    views.forEach(view => view.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeView = document.getElementById(`view-${viewId}`);
    const activeBtn = document.getElementById(`menu-btn-${viewId}`);

    if (activeView) activeView.classList.add('active');
    if (activeBtn) activeBtn.classList.add('active');
}

// 10. Admin Dashboard View toggle switcher
function toggleAdminView(viewId) {
    const views = document.querySelectorAll('.dashboard-view');
    const buttons = document.querySelectorAll('.sidebar-menu-item button');
    
    views.forEach(view => view.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeView = document.getElementById(`view-${viewId}`);
    const activeBtn = document.getElementById(`menu-btn-${viewId}`);

    if (activeView) activeView.classList.add('active');
    if (activeBtn) activeBtn.classList.add('active');
}

// 11. Admin Audit Inquiry action
function auditInquiry(inquiryId, action) {
    const statusSpan = document.getElementById(`status-span-${inquiryId}`);
    const actionsTd = document.getElementById(`actions-td-${inquiryId}`);
    const pendingCount = document.getElementById('pending-count');

    if (statusSpan && actionsTd) {
        if (action === 'approve') {
            statusSpan.textContent = 'Approved';
            statusSpan.className = 'badge-status approved';
            alert('Inquiry successfully approved and ticket itinerary dispatched.');
        } else {
            statusSpan.textContent = 'Rejected';
            statusSpan.className = 'badge-status rejected';
            alert('Inquiry rejected. Traveler has been notified.');
        }

        // Change actions column to complete text
        actionsTd.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-muted);">Audited</span>`;

        // Update pending counts badge
        if (pendingCount) {
            let count = parseInt(pendingCount.textContent);
            if (count > 0) {
                count -= 1;
                pendingCount.textContent = `${count} Pending`;
            }
        }
    }
}

// 12. Admin Package Price Editor Modals
function openPriceModal(pkgId, pkgName) {
    const modal = document.getElementById('admin-price-modal-overlay');
    const inputId = document.getElementById('edit-pkg-id');
    const inputName = document.getElementById('edit-pkg-name');
    const inputPrice = document.getElementById('edit-pkg-price');
    const priceText = document.getElementById(`pkg-price-${pkgId}`)?.textContent || '';

    if (modal && inputId && inputName && inputPrice) {
        inputId.value = pkgId;
        inputName.value = pkgName;
        
        // Strip non-digits from price text and populate
        const numericalPrice = priceText.replace(/[^0-9]/g, '');
        inputPrice.value = numericalPrice;

        modal.classList.add('active');
    }
}

function handlePriceUpdateSubmit(event) {
    event.preventDefault();
    const pkgId = document.getElementById('edit-pkg-id').value;
    const newPrice = document.getElementById('edit-pkg-price').value;
    const targetPriceSpan = document.getElementById(`pkg-price-${pkgId}`);
    const modal = document.getElementById('admin-price-modal-overlay');

    if (targetPriceSpan && newPrice) {
        // Format price nicely
        const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(newPrice);
        targetPriceSpan.textContent = formattedPrice;
        alert('Safari pricing tier updated in registry catalog.');
    }

    if (modal) {
        modal.classList.remove('active');
    }
}

