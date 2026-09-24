/* =====================================================
   CODEPULSE
   Smart Coding Progress & Skill Tracker
===================================================== */


/* =====================================================
   GLOBAL DATA
===================================================== */

let codepulseData = JSON.parse(
    localStorage.getItem("codepulseData")
) || {

    problemsSolved: 247,

    streak: 18,

    projects: 7,

    codingScore: 82,

    todayTasks: 4,

    totalTasks: 5,

    activities: [

        {
            name: "Solved Array Problems",
            category: "DSA",
            count: 5,
            time: "Today"
        },

        {
            name: "Python Practice",
            category: "Python",
            count: 1,
            time: "Yesterday"
        },

        {
            name: "SQL Queries",
            category: "SQL",
            count: 8,
            time: "2 days ago"
        }

    ],

    skills: [

        {
            name: "Python",
            level: 85
        },

        {
            name: "Java",
            level: 65
        },

        {
            name: "SQL",
            level: 72
        },

        {
            name: "Web Development",
            level: 78
        }

    ]

};


/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "codepulseData",
        JSON.stringify(codepulseData)
    );

}


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeCodePulse();

    }
);


/* =====================================================
   INITIALIZE APPLICATION
===================================================== */

function initializeCodePulse() {

    loadTheme();

    updateDashboard();

    renderActivities();

    setupNavigation();

    animateCounters();

    setupScrollAnimations();

    setupKeyboardShortcuts();

}


/* =====================================================
   THEME
===================================================== */

function toggleTheme() {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "codepulseTheme",
        isDark ? "dark" : "light"
    );

    updateThemeButtons();

    showToast(
        isDark
            ? "🌙 Dark mode enabled"
            : "☀️ Light mode enabled",
        "success"
    );

}


function loadTheme() {

    const theme =
        localStorage.getItem("codepulseTheme");

    if (theme === "dark") {

        document.body.classList.add("dark");

    }

    updateThemeButtons();

}


function updateThemeButtons() {

    const dark =
        document.body.classList.contains("dark");

    document.querySelectorAll(
        ".theme-btn, .icon-btn"
    ).forEach(function (button) {

        if (button.classList.contains("theme-btn")) {

            button.innerHTML = dark
                ? "☀️ <span>Light Mode</span>"
                : "🌙 <span>Dark Mode</span>";

        } else {

            button.textContent =
                dark ? "☀️" : "🌙";

        }

    });

}


/* =====================================================
   DASHBOARD UPDATE
===================================================== */

function updateDashboard() {

    const problemElement =
        document.getElementById(
            "problemsSolved"
        );

    if (problemElement) {

        problemElement.textContent =
            codepulseData.problemsSolved;

    }


    const streakElement =
        document.getElementById(
            "streakCount"
        );

    if (streakElement) {

        streakElement.textContent =
            codepulseData.streak;

    }


    updateGoal();

}


/* =====================================================
   DAILY GOAL
===================================================== */

function updateGoal() {

    const progress =
        Math.min(
            100,
            Math.round(
                (
                    codepulseData.todayTasks /
                    codepulseData.totalTasks
                ) * 100
            )
        );


    const progressBar =
        document.getElementById(
            "goalProgress"
        );

    if (progressBar) {

        progressBar.style.width =
            progress + "%";

    }


    const percent =
        document.querySelector(
            ".goal-percent"
        );

    if (percent) {

        percent.textContent =
            progress + "%";

    }


    const goalText =
        document.querySelector(
            ".goal-info strong"
        );

    if (goalText) {

        goalText.textContent =
            `${codepulseData.todayTasks} / ${codepulseData.totalTasks} Tasks Completed`;

    }


    const remaining =
        document.querySelector(
            ".goal-info span"
        );

    if (remaining) {

        const left =
            Math.max(
                0,
                codepulseData.totalTasks -
                codepulseData.todayTasks
            );

        remaining.textContent =
            left === 0
                ? "🎉 Goal completed!"
                : `${left} task remaining`;

    }

}


/* =====================================================
   ACTIVITY MODAL
===================================================== */

function openActivityModal() {

    const modal =
        document.getElementById(
            "activityModal"
        );

    if (!modal) return;

    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

    setTimeout(function () {

        const input =
            document.getElementById(
                "activityName"
            );

        if (input) {

            input.focus();

        }

    }, 200);

}


function closeActivityModal() {

    const modal =
        document.getElementById(
            "activityModal"
        );

    if (!modal) return;

    modal.classList.remove("show");

    document.body.style.overflow =
        "";

    const form =
        document.getElementById(
            "activityForm"
        );

    if (form) {

        form.reset();

    }

}


/* =====================================================
   SAVE CODING ACTIVITY
===================================================== */

function saveActivity(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "activityName"
        ).value.trim();


    const category =
        document.getElementById(
            "activityCategory"
        ).value;


    const count =
        Number(
            document.getElementById(
                "activityCount"
            ).value
        );


    if (!name || !category || !count) {

        showToast(
            "⚠️ Please complete all fields",
            "error"
        );

        return;

    }


    const newActivity = {

        name: name,

        category: category,

        count: count,

        time: "Just now"

    };


    codepulseData.activities.unshift(
        newActivity
    );


    codepulseData.problemsSolved += count;


    codepulseData.todayTasks =
        Math.min(
            codepulseData.totalTasks,
            codepulseData.todayTasks + 1
        );


    saveData();

    updateDashboard();

    renderActivities();

    closeActivityModal();


    showToast(
        `🚀 ${count} task${count > 1 ? "s" : ""} added successfully!`,
        "success"
    );


    checkAchievements();

}


/* =====================================================
   RENDER ACTIVITIES
===================================================== */

function renderActivities() {

    const list =
        document.getElementById(
            "activityList"
        );

    if (!list) return;


    list.innerHTML = "";


    codepulseData.activities
        .slice(0, 8)
        .forEach(
            function (activity, index) {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "activity-item activity-new";


                const icon =
                    getActivityIcon(
                        activity.category
                    );


                item.innerHTML = `

                    <div class="activity-icon">
                        ${icon}
                    </div>

                    <div class="activity-info">

                        <strong>
                            ${escapeHTML(activity.name)}
                        </strong>

                        <span>
                            ${escapeHTML(activity.count.toString())}
                            task${activity.count > 1 ? "s" : ""}
                            •
                            ${escapeHTML(activity.category)}
                        </span>

                    </div>

                    <div class="activity-time">
                        ${escapeHTML(activity.time)}
                    </div>

                    <button
                        class="activity-delete"
                        onclick="deleteActivity(${index})"
                        title="Delete activity">

                        ×

                    </button>

                `;


                list.appendChild(item);

            }
        );

}


/* =====================================================
   ACTIVITY ICON
===================================================== */

function getActivityIcon(category) {

    const icons = {

        DSA: "🧠",

        Python: "🐍",

        Java: "☕",

        SQL: "🗄️",

        "Web Development": "🌐",

        Project: "🚀"

    };


    return icons[category] || "💻";

}


/* =====================================================
   DELETE ACTIVITY
===================================================== */

function deleteActivity(index) {

    if (
        !confirm(
            "Delete this coding activity?"
        )
    ) {

        return;

    }


    const activity =
        codepulseData.activities[index];


    if (!activity) return;


    codepulseData.problemsSolved =
        Math.max(
            0,
            codepulseData.problemsSolved -
            activity.count
        );


    codepulseData.todayTasks =
        Math.max(
            0,
            codepulseData.todayTasks - 1
        );


    codepulseData.activities.splice(
        index,
        1
    );


    saveData();

    updateDashboard();

    renderActivities();


    showToast(
        "🗑️ Activity removed",
        "success"
    );

}


/* =====================================================
   SKILL MODAL
===================================================== */

function openSkillModal() {

    const modal =
        document.getElementById(
            "skillModal"
        );

    if (!modal) return;

    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";


    setTimeout(function () {

        const input =
            document.getElementById(
                "skillName"
            );

        if (input) {

            input.focus();

        }

    }, 200);

}


function closeSkillModal() {

    const modal =
        document.getElementById(
            "skillModal"
        );

    if (!modal) return;

    modal.classList.remove("show");

    document.body.style.overflow =
        "";


    const form =
        modal.querySelector(
            "form"
        );

    if (form) {

        form.reset();

    }

}


/* =====================================================
   SAVE SKILL
===================================================== */

function saveSkill(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "skillName"
        ).value.trim();


    const level =
        Number(
            document.getElementById(
                "skillLevel"
            ).value
        );


    if (!name || !level) {

        showToast(
            "⚠️ Enter a skill and level",
            "error"
        );

        return;

    }


    const existing =
        codepulseData.skills.find(
            function (skill) {

                return skill.name.toLowerCase() ===
                    name.toLowerCase();

            }
        );


    if (existing) {

        existing.level = level;

        showToast(
            "🧩 Skill updated!",
            "success"
        );

    } else {

        codepulseData.skills.push({

            name: name,

            level: level

        });


        showToast(
            "🧩 New skill added!",
            "success"
        );

    }


    saveData();

    closeSkillModal();

    renderSkills();

}


/* =====================================================
   RENDER SKILLS
===================================================== */

function renderSkills() {

    const panel =
        document.querySelector(
            ".skills-panel"
        );

    if (!panel) return;


    panel.innerHTML = "";


    codepulseData.skills
        .forEach(
            function (skill) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.innerHTML = `

                    <div class="skill-row">

                        <div class="skill-name">

                            <div class="language-icon web">
                                💻
                            </div>

                            <div>

                                <strong>
                                    ${escapeHTML(skill.name)}
                                </strong>

                                <span>
                                    ${getSkillLevel(skill.level)}
                                </span>

                            </div>

                        </div>

                        <strong>
                            ${skill.level}%
                        </strong>

                    </div>

                    <div class="skill-progress">

                        <div
                            style="width:${skill.level}%">
                        </div>

                    </div>

                `;


                panel.appendChild(row);

            }
        );

}


/* =====================================================
   SKILL LEVEL
===================================================== */

function getSkillLevel(level) {

    if (level >= 85) {

        return "Advanced";

    }

    if (level >= 65) {

        return "Intermediate";

    }

    if (level >= 40) {

        return "Beginner";

    }

    return "Learning";

}


/* =====================================================
   COUNTER ANIMATION
===================================================== */

function animateCounters() {

    const counters =
        document.querySelectorAll(
            ".stat-card h2"
        );


    counters.forEach(
        function (counter) {

            const text =
                counter.textContent.trim();


            const match =
                text.match(/\d+/);


            if (!match) return;


            const target =
                Number(match[0]);


            if (target > 1000) return;


            let current = 0;

            const increment =
                Math.max(
                    1,
                    Math.ceil(
                        target / 40
                    )
                );


            const interval =
                setInterval(
                    function () {

                        current += increment;


                        if (current >= target) {

                            current = target;

                            clearInterval(
                                interval
                            );

                        }


                        const span =
                            counter.querySelector(
                                "span"
                            );


                        if (span) {

                            counter.innerHTML =
                                current +
                                " " +
                                span.outerHTML;

                        } else {

                            const suffix =
                                text.includes("%")
                                    ? "%"
                                    : text.includes("Days")
                                        ? " Days"
                                        : "";

                            counter.innerHTML =
                                current +
                                suffix;

                        }

                    },
                    30
                );

        }
    );

}


/* =====================================================
   TOAST NOTIFICATION
===================================================== */

function showToast(
    message,
    type = "success"
) {

    const existing =
        document.querySelector(
            ".codepulse-toast"
        );


    if (existing) {

        existing.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `codepulse-toast ${type}`;


    toast.innerHTML = `

        <span class="toast-icon">
            ${type === "error" ? "⚠️" : "✓"}
        </span>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        function () {

            toast.classList.add(
                "hide"
            );


            setTimeout(
                function () {

                    toast.remove();

                },
                300
            );

        },
        2800
    );

}


/* =====================================================
   ADD TOAST CSS DYNAMICALLY
===================================================== */

function addToastStyles() {

    if (
        document.getElementById(
            "codepulseToastStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "codepulseToastStyles";


    style.textContent = `

        .codepulse-toast {

            position: fixed;

            right: 25px;

            bottom: 25px;

            z-index: 9999;

            display: flex;

            align-items: center;

            gap: 10px;

            padding: 13px 17px;

            border-radius: 12px;

            background: #172033;

            color: white;

            font-size: 11px;

            font-weight: 600;

            box-shadow:
                0 15px 40px
                rgba(0,0,0,0.2);

            animation:
                toastIn 0.35s ease;

        }


        .toast-icon {

            width: 23px;

            height: 23px;

            display: flex;

            align-items: center;

            justify-content: center;

            border-radius: 50%;

            background: #22c55e;

        }


        .codepulse-toast.error
        .toast-icon {

            background: #ef4444;

        }


        .codepulse-toast.hide {

            animation:
                toastOut 0.3s ease
                forwards;

        }


        .activity-delete {

            width: 24px;

            height: 24px;

            border: none;

            border-radius: 6px;

            background: #fff1f2;

            color: #ef4444;

            font-weight: 800;

            opacity: 0;

            transition: 0.2s;

        }


        .activity-item:hover
        .activity-delete {

            opacity: 1;

        }


        .activity-new {

            animation:
                activityIn 0.4s ease;

        }


        @keyframes toastIn {

            from {

                opacity: 0;

                transform:
                    translateY(20px)
                    scale(0.95);

            }

            to {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }


        @keyframes toastOut {

            to {

                opacity: 0;

                transform:
                    translateY(20px);

            }

        }


        @keyframes activityIn {

            from {

                opacity: 0;

                transform:
                    translateX(-15px);

            }

            to {

                opacity: 1;

                transform:
                    translateX(0);

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {

    const links =
        document.querySelectorAll(
            ".nav-link"
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    links.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );

                }
            );

        }
    );

}


/* =====================================================
   SCROLL ANIMATIONS
===================================================== */

function setupScrollAnimations() {

    const elements =
        document.querySelectorAll(
            ".stat-card, .panel, .problem-card, .dsa-card, .achievement-card"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        function (element) {

            element.classList.add(
                "scroll-hidden"
            );

            observer.observe(
                element
            );

        }
    );


    addScrollStyles();

}


/* =====================================================
   SCROLL ANIMATION CSS
===================================================== */

function addScrollStyles() {

    if (
        document.getElementById(
            "scrollAnimationStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "scrollAnimationStyles";


    style.textContent = `

        .scroll-hidden {

            opacity: 0;

            transform:
                translateY(18px);

            transition:
                opacity 0.6s ease,
                transform 0.6s ease;

        }


        .scroll-hidden.visible {

            opacity: 1;

            transform:
                translateY(0);

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =====================================================
   ACHIEVEMENTS
===================================================== */

function checkAchievements() {

    if (
        codepulseData.problemsSolved >= 250 &&
        codepulseData.problemsSolved -
        codepulseData.activities[
            0
        ]?.count < 250
    ) {

        showToast(
            "🏆 Achievement unlocked: 250 Problems!",
            "success"
        );

    }


    if (
        codepulseData.streak >= 20
    ) {

        showToast(
            "🔥 Amazing! You reached a 20-day streak!",
            "success"
        );

    }


    if (
        codepulseData.projects >= 10
    ) {

        showToast(
            "🚀 Achievement unlocked: 10 Projects!",
            "success"
        );

    }

}


/* =====================================================
   EXPORT DATA
===================================================== */

function exportProgress() {

    const data = {

        application:
            "CodePulse",

        exportedAt:
            new Date().toLocaleString(),

        statistics: {

            problemsSolved:
                codepulseData.problemsSolved,

            streak:
                codepulseData.streak,

            projects:
                codepulseData.projects,

            codingScore:
                codepulseData.codingScore

        },

        activities:
            codepulseData.activities,

        skills:
            codepulseData.skills

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    4
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "codepulse-progress.json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();

    URL.revokeObjectURL(url);


    showToast(
        "📥 Progress exported successfully!",
        "success"
    );

}


/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        function (event) {

            /* Ctrl + K */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                openActivityModal();

            }


            /* Escape */

            if (
                event.key === "Escape"
            ) {

                closeActivityModal();

                closeSkillModal();

            }

        }
    );

}


/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
===================================================== */

window.addEventListener(
    "click",
    function (event) {

        const activityModal =
            document.getElementById(
                "activityModal"
            );


        const skillModal =
            document.getElementById(
                "skillModal"
            );


        if (
            event.target ===
            activityModal
        ) {

            closeActivityModal();

        }


        if (
            event.target ===
            skillModal
        ) {

            closeSkillModal();

        }

    }
);


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   START TOAST SYSTEM
===================================================== */

addToastStyles();


/* =====================================================
   RENDER SAVED SKILLS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderSkills();

    }
);


/* =====================================================
   WELCOME MESSAGE
===================================================== */

setTimeout(
    function () {

        showToast(
            "🧠 Welcome back to CodePulse!",
            "success"
        );

    },
    1200
);
