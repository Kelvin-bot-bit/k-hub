// ----- Navbar scroll state -----
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

// ----- Hamburger menu -----
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ----- Typing effect -----
const phrases = [
  "Full Stack Developer",
  "Ethical Hacker",
  "Penetration Tester",
  "Software Engineer",
  "Security Analyst",
];
let phraseIdx = 0,
  charIdx = 0,
  isDeleting = false;
const typingEl = document.getElementById("typingText");

function typeLoop() {
  const current = phrases[phraseIdx];
  typingEl.textContent = current.substring(0, charIdx);

  if (!isDeleting && charIdx < current.length) {
    charIdx++;
    setTimeout(typeLoop, 80);
  } else if (isDeleting && charIdx > 0) {
    charIdx--;
    setTimeout(typeLoop, 45);
  } else if (!isDeleting && charIdx === current.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1800);
  } else {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    setTimeout(typeLoop, 300);
  }
}
typeLoop();

// ----- Scroll reveal -----
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
          // Animate skill bars inside
          entry.target.querySelectorAll(".skill-bar-fill").forEach((bar) => {
            bar.style.width = bar.getAttribute("data-width") + "%";
          });
        }, i * 100);
      }
    });
  },
  { threshold: 0.12 },
);

revealEls.forEach((el) => observer.observe(el));

// ----- Counter animation -----
const counters = document.querySelectorAll("[data-target]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-target"));
        let count = 0;
        const step = Math.ceil(target / 50);
        const interval = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count + (target === 100 ? "%" : "+");
          if (count >= target) clearInterval(interval);
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);

counters.forEach((c) => counterObserver.observe(c));

// ----- Contact form -----
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const success = document.getElementById("formSuccess");
  success.style.display = "block";
  this.reset();
  setTimeout(() => {
    success.style.display = "none";
  }, 5000);
});

// ----- Footer year -----
document.getElementById("footerYear").textContent = new Date().getFullYear();

// ----- Light/Dark Mode Toggle -----
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  root.setAttribute("data-theme", "light");
} else if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
} else {
  // Check system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", prefersDark ? "dark" : "light");
}

// Toggle theme function
function toggleTheme() {
  const currentTheme = root.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// Add click event to theme toggle button
themeToggle.addEventListener("click", toggleTheme);

// ============================================================
// ----- PROJECT FILTERING -----
// ============================================================
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

function filterProjects(category) {
  let visibleCount = 0;

  projectCards.forEach((card, index) => {
    const cardCategory = card.getAttribute("data-category");

    if (category === "all" || cardCategory === category) {
      card.classList.remove("filtered-out");
      card.classList.add("filtered-in");
      visibleCount++;

      // Stagger animation
      setTimeout(() => {
        card.style.opacity = "1";
      }, index * 50);
    } else {
      card.classList.add("filtered-out");
      card.classList.remove("filtered-in");
    }
  });

  // Optional: Show "no results" message
  const projectsGrid = document.querySelector(".projects-grid");
  let noResultsMsg = document.querySelector(".no-results-msg");

  if (visibleCount === 0) {
    if (!noResultsMsg) {
      noResultsMsg = document.createElement("div");
      noResultsMsg.className = "no-results-msg";
      noResultsMsg.innerHTML = `
        <div class="terminal-block" style="text-align: center; grid-column: 1/-1;">
          <span class="t-yellow">⚠</span> No projects found in this category.
          <br><span class="t-muted">Try another filter →</span>
        </div>
      `;
      projectsGrid.appendChild(noResultsMsg);
    }
  } else if (noResultsMsg) {
    noResultsMsg.remove();
  }
}

// Add click event to each filter button (if they exist)
if (filterBtns.length > 0) {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active button styling
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter projects
      const category = btn.getAttribute("data-filter");
      filterProjects(category);
    });
  });

  // Initialize with no filtering (show all projects)
  filterProjects("all");
}
