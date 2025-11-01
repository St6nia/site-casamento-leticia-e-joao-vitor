// =============================
// Floating Hearts (Butter Palette)
// =============================
const heartColors = [
  "#F8E7A0", // soft yellow
  "#FFF9E3", // cream
  "#E6C872"  // gold
];

function createHeart() {
  const heart = document.createElement("i");
  heart.className = "fa-solid fa-heart absolute select-none pointer-events-none z-0";

  // color from butter palette
  heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];

  // opacity for soft blending
  heart.style.opacity = "0.3";

  // blur for bokeh effect
  heart.style.filter = "blur(1px)";

  // random horizontal position
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.top = "100%";

  // random size
  const size = Math.random() * 1.5 + 0.8;
  heart.style.fontSize = `${size * 2}rem`;

  // floating animation
  heart.style.animation = `floatUp ${4 + Math.random() * 3}s linear forwards`;

  // add to hero only
  const hero = document.querySelector("header");
  if (hero) hero.appendChild(heart);

  // remove after animation
  setTimeout(() => {
    heart.remove();
  }, 7000);
}

// Create hearts every 1s
setInterval(createHeart, 1000);
// Initial burst of hearts
for (let i = 0; i < 5; i++) {
  setTimeout(createHeart, i * 300);
}

// =============================
// Reveal on Scroll (with fade in/out)
// =============================
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");   // fade in
    } else {
      entry.target.classList.remove("show"); // fade out
    }
  });
}, { threshold: 0.2 });

reveals.forEach(el => observer.observe(el));

// =============================
// Countdown Timer
// =============================
const countdownEl = document.getElementById("countdown");
if (countdownEl) {
  const weddingDate = new Date(2026, 0, 11, 16, 0, 0).getTime(); // safer date format

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff <= 0) {
      countdownEl.innerHTML = "<p class='text-2xl'>É o grande dia! 🎉</p>";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    console.log("Countdown:", days, hours, minutes, seconds); // DEBUG

    const timeUnits = [
      { label: "Dias", value: days },
      { label: "Horas", value: hours },
      { label: "Minutos", value: minutes },
      { label: "Segundos", value: seconds }
    ];

    countdownEl.innerHTML = timeUnits.map((unit, index) => `
      <div class="bg-white rounded-2xl p-6 countdown-box reveal show" style="animation-delay:${index * 0.15}s">
        <div class="text-4xl md:text-5xl font-bold text-butter-gold mb-2 fade-number">
          ${unit.value.toString().padStart(2, "0")}
        </div>
        <div class="text-gray-600 font-medium uppercase tracking-wide text-sm">
          ${unit.label}
        </div>
      </div>
    `).join("");
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();
}

