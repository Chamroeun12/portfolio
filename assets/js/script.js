/* ========================================================
   CHAMROEUN SARAN PORTFOLIO - SCRIPT ENGINE
   ======================================================== */

// DOM Selectors
const navbar = document.getElementById('navbar');
const changingText = document.getElementById('changing-text');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navBackdrop = document.getElementById('nav-backdrop');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const backToTopBtn = document.getElementById('back-to-top');

// Todo App DOM Selectors
const todoInput = document.getElementById('todo-input');
const todoAdd = document.getElementById('todo-add');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const todoClearCompleted = document.getElementById('todo-clear-completed');

// Contact Form DOM Selectors
const contactForm = document.getElementById('contact-form');
const contactSubmitBtn = document.getElementById('contact-submit-btn');
const btnSpinner = document.getElementById('btn-spinner');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');

/* --- 1. Theme Management (Dark / Light Mode) --- */
function initTheme() {
    const savedTheme = localStorage.getItem('cs_theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
            themeIcon.style.color = '#f59e0b';
        }
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
        localStorage.setItem('cs_theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
            themeIcon.style.color = '';
        }
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        }
        localStorage.setItem('cs_theme', 'dark');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        setTheme(isLight ? 'dark' : 'light');
    });
}

/* --- 2. Navbar Scroll Effect & Scrollspy --- */
const navSections = document.querySelectorAll('header[id], section[id]');
const navItems = document.querySelectorAll('.nav-links a.nav-item');

function handleScroll() {
    const scrollY = window.scrollY;

    // Sticky navbar glass style
    if (navbar) {
        if (scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Back to top button visibility
    if (backToTopBtn) {
        if (scrollY > 350) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    // Scrollspy: active section indicator
    const scrollPos = scrollY + 140;
    navSections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            navItems.forEach(link => {
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', handleScroll, { passive: true });

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* --- 3. Mobile Navigation Toggle --- */
function openMobileMenu() {
    if (!menuToggle || !navLinks) return;
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    if (!menuToggle || !navLinks) return;
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('open');
    document.body.style.overflow = '';
}

if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navLinks.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
}

// Close mobile menu on clicking any navigation link
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

// Close mobile menu or modals on Escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (navLinks && navLinks.classList.contains('open')) {
            closeMobileMenu();
        }
        closeAllModals();
    }
});

/* --- 4. Typing Effect for Hero --- */
const words = ["UI Designer", "JavaScript Enthusiast", "Creative Thinker", "Problem Solver"];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typeSpeed = 150;

function type() {
    if (!changingText) return;
    const currentWord = words[wordIdx];
    if (isDeleting) {
        changingText.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 100;
    } else {
        changingText.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 150;
    }

    if (!isDeleting && charIdx === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

/* --- 5. Project Filtering Logic --- */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projects-grid .glass-card');

if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('card-hidden');
                } else {
                    card.classList.add('card-hidden');
                }
            });
        });
    });
}

/* --- 6. Enhanced Interactive Todo App --- */
let todos = JSON.parse(localStorage.getItem('cs_todos')) || [
    { id: 1, text: "Design my portfolio", completed: true },
    { id: 2, text: "Build Todo App Demo", completed: false },
    { id: 3, text: "Learn Three.js for 3D", completed: false }
];

let currentTodoFilter = 'all';

function renderTodos() {
    if (!todoList) return;
    todoList.innerHTML = '';

    // Filter todos
    const filteredTodos = todos.filter(todo => {
        if (currentTodoFilter === 'active') return !todo.completed;
        if (currentTodoFilter === 'completed') return todo.completed;
        return true;
    });

    if (filteredTodos.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'todo-empty-state';
        emptyLi.innerHTML = `
            <i class="fas fa-clipboard-check"></i>
            <span>No ${currentTodoFilter === 'all' ? 'tasks' : currentTodoFilter + ' tasks'} right now!</span>
        `;
        todoList.appendChild(emptyLi);
    } else {
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span>${escapeHTML(todo.text)}</span>
                <div class="todo-actions">
                    <button class="todo-btn" aria-label="${todo.completed ? 'Undo task' : 'Complete task'}" onclick="toggleTodo(${todo.id})">
                        <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="todo-btn delete" aria-label="Delete task" onclick="deleteTodo(${todo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    // Update remaining count
    const remaining = todos.filter(t => !t.completed).length;
    if (todoCount) {
        todoCount.textContent = `${remaining} task${remaining === 1 ? '' : 's'} left`;
    }

    localStorage.setItem('cs_todos', JSON.stringify(todos));
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function addTodo() {
    if (!todoInput) return;
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ id: Date.now(), text, completed: false });
        todoInput.value = '';
        renderTodos();
    }
}

function toggleTodo(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
}

function clearCompletedTodos() {
    todos = todos.filter(t => !t.completed);
    renderTodos();
}

if (todoAdd) {
    todoAdd.addEventListener('click', addTodo);
}

if (todoInput) {
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTodo();
        }
    });
}

if (todoClearCompleted) {
    todoClearCompleted.addEventListener('click', clearCompletedTodos);
}

// Todo filter buttons
const todoFilterBtns = document.querySelectorAll('.todo-filter-btn');
todoFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        todoFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTodoFilter = btn.getAttribute('data-todo-filter') || 'all';
        renderTodos();
    });
});

/* --- 7. Modal Handlers --- */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        closeModal(modal);
    });
}

// Wire up open modal buttons
document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = btn.getAttribute('data-modal');
        if (modalId) openModal(modalId);
    });
});

// Wire up modal close buttons and backdrop clicks
document.querySelectorAll('.modal-overlay').forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

/* --- 8. Certificate Lightbox Viewer --- */
const certCards = document.querySelectorAll('.cert-card[data-cert-title]');
certCards.forEach(card => {
    function handleCertOpen() {
        const title = card.getAttribute('data-cert-title') || 'Certificate of Achievement';
        const category = card.getAttribute('data-cert-category') || 'Verified Credential';
        const issuer = card.getAttribute('data-cert-issuer') || 'Authorized Institution';
        const id = card.getAttribute('data-cert-id') || 'MOS-2026-VERIFIED';
        const desc = card.getAttribute('data-cert-desc') || '';
        const skills = (card.getAttribute('data-cert-skills') || '').split(',').map(s => s.trim()).filter(Boolean);
        const customImg = card.getAttribute('data-cert-img');

        // Target DOM elements
        const titleEl = document.getElementById('cert-lightbox-title');
        const catEl = document.getElementById('cert-lightbox-category');
        const descEl = document.getElementById('cert-lightbox-desc');
        const idEl = document.getElementById('cert-lightbox-id');
        const issuerEl = document.getElementById('cert-lightbox-issuer');
        const skillsWrap = document.getElementById('cert-lightbox-skills-wrap');
        const diploma = document.getElementById('cert-diploma');
        const imgPreview = document.getElementById('cert-image-preview');
        const customImgEl = document.getElementById('cert-lightbox-custom-img');

        if (titleEl) titleEl.textContent = title;
        if (catEl) catEl.textContent = category;
        if (descEl) descEl.textContent = desc;
        if (idEl) idEl.textContent = id;
        if (issuerEl) issuerEl.textContent = issuer;

        if (skillsWrap) {
            skillsWrap.innerHTML = skills.map(s => `<span class="tag tag-ui">${escapeHTML(s)}</span>`).join('');
        }

        // If user configured a high-res image file, show the image; otherwise show the digital diploma
        if (customImg && customImgEl) {
            customImgEl.src = customImg;
            if (imgPreview) imgPreview.style.display = 'block';
            if (diploma) diploma.style.display = 'none';
        } else {
            if (imgPreview) imgPreview.style.display = 'none';
            if (diploma) diploma.style.display = 'block';
        }

        // Configure PDF download button
        const customPdf = card.getAttribute('data-cert-pdf');
        const downloadBtn = document.getElementById('cert-download-btn');
        if (downloadBtn) {
            if (customPdf) {
                downloadBtn.href = customPdf;
                downloadBtn.setAttribute('download', customPdf.split('/').pop());
                downloadBtn.style.display = 'inline-flex';
            } else {
                downloadBtn.style.display = 'none';
            }
        }

        openModal('cert-lightbox-modal');
    }

    card.addEventListener('click', handleCertOpen);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCertOpen();
        }
    });
});

const certPrintBtn = document.getElementById('cert-print-btn');
if (certPrintBtn) {
    certPrintBtn.addEventListener('click', () => {
        window.print();
    });
}

document.querySelectorAll('.cert-lightbox-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = document.getElementById('cert-lightbox-modal');
        if (modal) closeModal(modal);
    });
});

/* --- 8. Dynamic Skill Progress Animation --- */
const skillsCard = document.getElementById('skills-bars');
if (skillsCard) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = skillsCard.querySelectorAll('.skill-progress-fill');
                fills.forEach(fill => {
                    const percent = fill.getAttribute('data-percent') || '90';
                    fill.style.width = `${percent}%`;
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillsObserver.observe(skillsCard);
}

/* --- 9. Toast Notification System --- */
let toastTimeout = null;
function showToast(message, isError = false) {
    if (!toast) return;
    
    if (toastTitle) {
        toastTitle.textContent = isError ? 'Error' : 'Success';
    }
    if (toastMessage) {
        toastMessage.textContent = message;
    }

    const icon = toast.querySelector('.toast-icon i');
    if (icon) {
        icon.className = isError ? 'fas fa-exclamation-circle text-accent' : 'fas fa-check-circle text-primary';
    }

    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
}

/* --- 10. Formspree AJAX Submission --- */
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtnText = contactSubmitBtn ? contactSubmitBtn.querySelector('.btn-text') : null;
        const spinner = document.getElementById('btn-spinner');

        // Loading state
        if (contactSubmitBtn) contactSubmitBtn.disabled = true;
        if (submitBtnText) submitBtnText.textContent = 'Sending...';
        if (spinner) spinner.style.display = 'inline-flex';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                contactForm.reset();
                showToast('Thank you! Your message has been received. I will reply soon.');
            } else {
                const data = await response.json();
                const errMsg = (data && data.errors && data.errors.map(err => err.message).join(', ')) || 'Failed to submit form.';
                showToast(errMsg, true);
            }
        } catch (error) {
            showToast('Network error. Please try again or email directly.', true);
        } finally {
            if (contactSubmitBtn) contactSubmitBtn.disabled = false;
            if (submitBtnText) submitBtnText.textContent = 'Send Message';
            if (spinner) spinner.style.display = 'none';
        }
    });
}

/* --- 11. Scroll Reveal (Intersection Observer) --- */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); will-change: opacity, transform; }
    .revealed { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(revealStyle);

/* --- Initialize --- */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    document.querySelectorAll('.section, .glass-card:not(.modal-container)').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    type();
    renderTodos();
    handleScroll();
});

// Global bindings for inline events
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
