/* app.js – vanilla JavaScript version of the portfolio with admin CRUD */

// ---------- Data ----------
let projects = [
    {
        id: 1,
        title: "University Database Management",
        description:
            "A comprehensive SQL-based system for managing academic records with optimized ORM integration and secure data handling.",
        tech: ["SQL", "Python", "SQLAlchemy", "SQLite"],
        image: "https://placehold.co/600x400/0f172a/fbbf24?text=Database+Project",
        category: "Backend Development",
    },
    {
        id: 2,
        title: "Linux Backup & SSH Hardening",
        description:
            "Automated bash scripts for secure server backups and SSH configuration hardening to prevent unauthorized access.",
        tech: ["Bash", "Linux", "OpenSSH", "rsync"],
        image: "https://placehold.co/600x400/0f172a/fbbf24?text=Linux+Security",
        category: "System Security",
    },
    {
        id: 3,
        title: "Medical Smart App",
        description:
            "A smart platform for medical appointment scheduling and medication search built with a cross‑platform mobile experience.",
        tech: ["Flutter", "Firebase", "Dart", "Provider"],
        image: "https://placehold.co/600x400/0f172a/fbbf24?text=Medical+App",
        category: "Mobile Development",
    },
    {
        id: 4,
        title: "Supabase Digital Store",
        description:
            "A secure e-commerce storefront utilizing Supabase for real-time database management and user authentication.",
        tech: ["JavaScript", "Supabase", "Bootstrap", "HTML"],
        image: "https://placehold.co/600x400/0f172a/fbbf24?text=Digital+Store",
        category: "Full Stack",
    },
    {
        id: 5,
        title: "Systems Productivity Hub",
        description:
            "A productivity dashboard designed to streamline workflows and manage technical tasks efficiently.",
        tech: ["HTML", "CSS", "JavaScript", "Animation"],
        image: "https://placehold.co/600x400/0f172a/fbbf24?text=Productivity+Hub",
        category: "Internal Tools",
    },
    {
        id: 6,
        title: "Future Cybersecurity Lab",
        description:
            "An ongoing project focused on defensive security testing, network monitoring, and security protocol research.",
        tech: ["Kali Linux", "Wireshark", "Python", "Networking"],
        image: "https://placehold.co/600x400/0f172a/fbbf24?text=Security+Lab",
        category: "Cybersecurity",
    },
];

let skills = [
    { name: "Python", level: 90 },
    { name: "SQL & Databases", level: 85 },
    { name: "Linux Administration", level: 80 },
    { name: "Networking Basics", level: 75 },
    { name: "Cybersecurity Fundamentals", level: 70 },
    { name: "Bootstrap & UI", level: 85 },
    { name: "Teamwork", level: 95 },
    { name: "Analytical Thinking", level: 90 },
    { name: "Adaptability", level: 85 },
];

let isAdmin = false;

// ---------- Helper Functions ----------
function $(selector) {
    return document.querySelector(selector);
}
function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}

function setActiveNav(sectionId) {
    $$(".nav-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.section === sectionId);
    });
}

function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveNav(sectionId);
    }
}

// ---------- Navigation ----------
$$(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.section;
        if (target) {
            scrollToSection(target);
            // Close mobile menu if open
            $(".nav-links").classList.remove("active");
            $(".mobile-menu-btn i").classList.replace("fa-xmark", "fa-bars");
        }
    });
});

const mobileMenuBtn = $('.mobile-menu-btn');
const navLinks = $('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
    } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
    }
});

// ---------- Admin Login / Logout ----------
const adminBtn = $('#admin-btn');
adminBtn.addEventListener('click', () => {
    if (!isAdmin) {
        const pwd = prompt('Enter admin password:');
        if (pwd === 'admin123') {
            isAdmin = true;
            adminBtn.textContent = 'Logout';
            toggleAdminUI(true);
        } else if (pwd !== null) {
            alert('Incorrect password');
        }
    } else {
        if (confirm('Log out of admin mode?')) {
            isAdmin = false;
            adminBtn.textContent = 'Admin';
            toggleAdminUI(false);
        }
    }
});

function toggleAdminUI(show) {
    // Show / hide admin panels
    $('#admin-project-panel').style.display = show ? 'block' : 'none';
    $('#admin-skill-panel').style.display = show ? 'block' : 'none';
    // Re‑render cards to include edit/delete buttons
    renderProjects();
    renderSkills();
}

// ---------- Render Projects ----------
// ---------- Scroll Animations ----------
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            // Animate skill bars if this is the skills section
            if (entry.target.id === 'skills-container') {
                $$('.skill-bar .fill').forEach(bar => {
                    bar.style.width = bar.dataset.width;
                });
            }
        }
    });
}, observerOptions);

$$(".reveal").forEach((el) => observer.observe(el));

// ---------- Render Projects ----------
function renderProjects() {
    const container = $('#projects-container');
    container.innerHTML = '';
    projects.forEach((proj) => {
        const card = document.createElement('div');
        card.className = 'card reveal';
        card.innerHTML = `
      <img src="${proj.image}" alt="${proj.title}" />
      <div class="content">
        <h3>${proj.title}</h3>
        <p>${proj.description}</p>
        <div class="tech-tags">${proj.tech
                .map((t) => `<span class="tech-tag">${t}</span>`)
                .join(' ')}</div>
        ${isAdmin ? `<div class="admin-actions">
            <button class="edit-project btn btn-outline" data-id="${proj.id}"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="delete-project btn btn-outline" data-id="${proj.id}"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>` : ''}
      </div>
    `;
        container.appendChild(card);
        observer.observe(card); // Observe new elements
    });

    // Attach admin handlers if needed
    if (isAdmin) {
        $$(".edit-project").forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.target.dataset.id);
                const proj = projects.find((p) => p.id === id);
                if (proj) openProjectForm(proj);
            });
        });
        $$(".delete-project").forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = Number(e.target.dataset.id);
                if (confirm('Delete this project?')) {
                    projects = projects.filter((p) => p.id !== id);
                    renderProjects();
                }
            });
        });
    }
}

// ---------- Render Skills ----------
function renderSkills() {
    const container = $('#skills-container');
    container.innerHTML = '';
    skills.forEach((skill) => {
        const card = document.createElement('div');
        card.className = 'card reveal';
        card.innerHTML = `
      <div class="content">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3>${skill.name}</h3>
          <span style="color:var(--accent-gold); font-weight:bold;">${skill.level}%</span>
        </div>
        <div class="skill-bar"><div class="fill" style="width: 0%" data-width="${skill.level}%"></div></div>
        ${isAdmin ? `<div class="admin-actions">
            <button class="edit-skill btn btn-outline" data-name="${skill.name}"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-skill btn btn-outline" data-name="${skill.name}"><i class="fa-solid fa-trash"></i></button>
          </div>` : ''}
      </div>
    `;
        container.appendChild(card);
        observer.observe(card); // Observe new elements
    });

    // Trigger animation for initial load if visible
    setTimeout(() => {
        $$('.skill-bar .fill').forEach(bar => {
            bar.style.width = bar.dataset.width;
        });
    }, 500);

    if (isAdmin) {
        $$(".edit-skill").forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                const skill = skills.find((s) => s.name === name);
                if (skill) openSkillForm(skill);
            });
        });
        $$(".delete-skill").forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                if (confirm('Delete this skill?')) {
                    skills = skills.filter((s) => s.name !== name);
                    renderSkills();
                }
            });
        });
    }
}

// ---------- Project Form ----------
const projectForm = $('#project-form');
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = $('#project-id').value;
    const newProj = {
        id: id ? Number(id) : Date.now(),
        title: $('#project-title').value.trim(),
        category: $('#project-category').value.trim(),
        image: $('#project-image').value.trim(),
        tech: $('#project-tech').value.split(',').map((t) => t.trim()).filter(Boolean),
        description: $('#project-description').value.trim(),
    };
    if (id) {
        // update existing
        projects = projects.map((p) => (p.id === Number(id) ? newProj : p));
    } else {
        projects.push(newProj);
    }
    projectForm.reset();
    $('#project-id').value = '';
    renderProjects();
});
$('#cancel-project').addEventListener('click', () => {
    projectForm.reset();
    $('#project-id').value = '';
});

function openProjectForm(proj) {
    $('#project-id').value = proj.id;
    $('#project-title').value = proj.title;
    $('#project-category').value = proj.category;
    $('#project-image').value = proj.image;
    $('#project-tech').value = proj.tech.join(', ');
    $('#project-description').value = proj.description;
    // scroll to form
    $('#admin-project-panel').scrollIntoView({ behavior: 'smooth' });
}

// ---------- Skill Form ----------
const skillForm = $('#skill-form');
skillForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const oldName = $('#skill-name-old').value;
    const newSkill = {
        name: $('#skill-name').value.trim(),
        level: Number($('#skill-level').value),
    };
    if (oldName) {
        skills = skills.map((s) => (s.name === oldName ? newSkill : s));
    } else {
        skills.push(newSkill);
    }
    skillForm.reset();
    $('#skill-name-old').value = '';
    renderSkills();
});
$('#cancel-skill').addEventListener('click', () => {
    skillForm.reset();
    $('#skill-name-old').value = '';
});

function openSkillForm(skill) {
    $('#skill-name-old').value = skill.name;
    $('#skill-name').value = skill.name;
    $('#skill-level').value = skill.level;
    $('#admin-skill-panel').scrollIntoView({ behavior: 'smooth' });
}

// ---------- Initial Render ----------
renderProjects();
renderSkills();

// ---------- Hero Buttons (scroll) ----------
$$("[data-scroll]").forEach((btn) => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.scroll;
        scrollToSection(target);
    });
});
