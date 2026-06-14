
const STORAGE_KEY = 'pco_courses';
const MAX_COURSES = 5;

function getCourses() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveCourses(courses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}


function initAddCourse() {
    const form = document.getElementById('course-form');
    const feedback = document.getElementById('form-feedback');

    if (!form) return;

    // Warn the user before they even start typing if they're at the limit
    updateFormAvailability(feedback);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const courses = getCourses();

        if (courses.length >= MAX_COURSES) {
            showFeedback(feedback, `You've reached the ${MAX_COURSES}-course limit. Remove a course first.`, 'error');
            return;
        }

        const newCourse = {
            id: Date.now(),
            name: document.getElementById('course-name').value.trim(),
            lecturer: document.getElementById('course-lecturer').value.trim(),
            creditHours: document.getElementById('credit-hours').value.trim(),
            notes: document.getElementById('course-notes').value.trim(),
        };

        courses.push(newCourse);
        saveCourses(courses);

        showFeedback(feedback, 'Course saved! Redirecting to My Courses…', 'success');

        setTimeout(() => {
            window.location.href = 'mycourses.html';
        }, 900);
    });
}

function updateFormAvailability(feedback) {
    const courses = getCourses();
    if (courses.length >= MAX_COURSES) {
        showFeedback(feedback, `You already have ${MAX_COURSES} courses saved. Remove one from My Courses before adding more.`, 'error');
        const btn = document.querySelector('.save-btn');
        if (btn) btn.disabled = true;
    } else {
        const remaining = MAX_COURSES - courses.length;
        showFeedback(feedback, `You can add ${remaining} more course${remaining !== 1 ? 's' : ''}.`, 'info');
    }
}

function showFeedback(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = 'form-feedback ' + type;
    el.style.display = 'block';
}

function initMyCourses() {
    const tbody = document.getElementById('courses-tbody');
    const emptyMsg = document.getElementById('empty-message');

    if (!tbody) return;

    renderTable(tbody, emptyMsg);


    tbody.addEventListener('click', function (e) {
        const btn = e.target.closest('.delete-btn');
        if (!btn) return;

        const id = Number(btn.dataset.id);
        let courses = getCourses();
        courses = courses.filter(c => c.id !== id);
        saveCourses(courses);
        renderTable(tbody, emptyMsg);
    });
}

function renderTable(tbody, emptyMsg) {
    const courses = getCourses();


    tbody.innerHTML = '';

    if (courses.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';

        for (let i = 0; i < MAX_COURSES; i++) {
            tbody.appendChild(emptyRow());
        }
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';


    courses.forEach(course => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(course.name)}</td>
            <td>${escapeHtml(course.lecturer)}</td>
            <td>${escapeHtml(course.creditHours)}</td>
            <td class="notes-cell">${escapeHtml(course.notes)}</td>
            <td><button class="delete-btn" data-id="${course.id}" title="Remove course">✕</button></td>
        `;
        tbody.appendChild(tr);
    });


    for (let i = courses.length; i < MAX_COURSES; i++) {
        tbody.appendChild(emptyRow());
    }
}

function emptyRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td></td><td></td><td></td><td></td><td></td>';
    return tr;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}


document.addEventListener('DOMContentLoaded', function () {
    const page = window.location.pathname.split('/').pop();

    if (page === 'addcourse.html' || page === '') {
        initAddCourse();
    }
    if (page === 'mycourses.html') {
        initMyCourses();
    }
});
