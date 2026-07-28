/*==============================
    PROJECT FILTER
==============================*/

const filterButtons = document.querySelectorAll(".project-filter button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active class
        filterButtons.forEach(btn => btn.classList.remove("active"));

        // Add active class
        button.classList.add("active");

        const filter = button.dataset.filter;

        projectCards.forEach(card => {

            if (filter === "all" || card.dataset.category === filter) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

});


/*==============================
    SCROLL ANIMATION
==============================*/

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

            observer.unobserve(entry.target);

        }

    });

});

const hiddenElements = document.querySelectorAll(".hidden");

hiddenElements.forEach(el => observer.observe(el));


/*==============================
    PAGE LOAD TO HOME
==============================*/

window.addEventListener("load", () => {

    history.replaceState("", document.title, window.location.pathname);

    window.scrollTo({
        top: 0,
        behavior: "auto"
    });

});

/*=============================
    THEME TOGGLE
=============================*/

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const logo = document.getElementById("logo");

// Restore saved theme

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-mode");

    themeIcon.src = "icons/bulb-off.png";
    logo.src = "image/signature-white.png";

} else {

    themeIcon.src = "icons/bulb-on.png";
    logo.src = "image/signature-black.png";

}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        themeIcon.src = "icons/bulb-off.png";
        logo.src = "image/signature-white.png";

        localStorage.setItem("theme", "dark");

    } else {

        themeIcon.src = "icons/bulb-on.png";
        logo.src = "image/signature-black.png";

        localStorage.setItem("theme", "light");

    }

});