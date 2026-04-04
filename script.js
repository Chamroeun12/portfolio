/* DOM Selectors */
const navbar = document.getElementById('navbar');
const todoInput = document.getElementById('todo-input');
const todoAdd = document.getElementById('todo-add');
const todoList = document.getElementById('todo-list');
const changingText = document.getElementById('changing-text');

/* --- 1. Navbar Scroll Effect --- */
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* --- 2. Typing Effect for Hero --- */
const words = ["UI Designer", "JavaScript Enthusiast", "Creative Thinker", "Problem Solver"];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typeSpeed = 150;

function type() {
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

/* --- 3. Todo App Logic --- */
let todos = JSON.parse(localStorage.getItem('cs_todos')) || [
    { id: 1, text: "Design my portfolio", completed: true },
    { id: 2, text: "Build Todo App Demo", completed: false },
    { id: 3, text: "Learn Three.js for 3D", completed: false }
];

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span>${todo.text}</span>
            <div class="todo-actions">
                <button class="todo-btn" onclick="toggleTodo(${todo.id})">
                    <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button class="todo-btn delete" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        todoList.appendChild(li);
    });
    localStorage.setItem('cs_todos', JSON.stringify(todos));
}

function addTodo() {
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

todoAdd.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

/* --- 4. Scroll Reveal (Intersection Observer) --- */
const observerOptions = {
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add styles for reveal
const style = document.createElement('style');
style.textContent = `
    .reveal { opacity: 0; transform: translateY(40px); transition: 0.8s ease-out; }
    .revealed { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);

/* --- Initialize --- */
document.addEventListener('DOMContentLoaded', () => {
    // Apply reveal class to sections/cards
    document.querySelectorAll('section, .glass-card').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    type();
    renderTodos();
});

// Global functions for inline onclicks
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
