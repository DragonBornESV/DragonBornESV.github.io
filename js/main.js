document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // PROJECT IMAGE CAROUSELS (click only, no auto-rotation)
  // =========================================================
  document.querySelectorAll(".project-thumb.carousel").forEach((carousel) => {
    const images = carousel.querySelectorAll(".carousel-img");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");

    if (!images.length || !prevBtn || !nextBtn) return;

    let index = 0;

    function show(i) {
      images.forEach((img) => img.classList.remove("is-active"));
      images[i].classList.add("is-active");
    }

    prevBtn.addEventListener("click", () => {
      index = (index - 1 + images.length) % images.length;
      show(index);
    });

    nextBtn.addEventListener("click", () => {
      index = (index + 1) % images.length;
      show(index);
    });
  });

  // =========================================================
  // PROJECT FILTERS + SEARCH (UPDATED)
  // =========================================================
  const searchInput = document.getElementById("project-search");
  const filterButtons = document.querySelectorAll(".filter-row .chip[data-filter]");
  const projects = document.querySelectorAll(".projects-grid .project-tile");

  if (!projects.length) return;

  let activeFilter = "all";
  let query = "";

  // 🔥 UPDATED alias map (includes your new project)
  const aliasMap = {
    // AR / VR
    "augmented reality": "ar",
    "mixed reality": "ar",
    "mobile ar": "ar",
    "ar foundation": "ar",
    "virtual reality": "vr",
    "oculus": "vr",
    "quest": "vr",

    // Game / Unity
    "game dev": "game",
    "game development": "game",
    "unity": "unity",
    "csharp": "c#",

    // Hardware
    "arduino": "hardware",
    "robot": "hardware",
    "robotics": "hardware",

    // 3D
    "3d printing": "3d",
    "printing": "3d",

    // 🔥 NEW: WEB / SOFTWARE
    "web": "web",
    "web dev": "web",
    "web development": "web",
    "software": "web",
    "software development": "web",

    // 🔥 TECH STACK
    "react": "react",
    "node": "node.js",
    "nodejs": "node.js",
    "mongodb": "mongodb",
    "mongo": "mongodb",
    "database": "mongodb",

    // 🔥 FEATURES
    "api": "api",
    "rest": "api",
    "map": "map",
    "maps": "map",
    "satellite": "satellite",
    "satellites": "satellite",
    "tracking": "tracking",
    "tracker": "tracking",
    "full stack": "full-stack",
    "fullstack": "full-stack",
  };

  function norm(str) {
    return (str || "").toLowerCase().trim();
  }

  function tokenizeSearch(raw) {
    const rawNorm = norm(raw);

    const words = rawNorm
      .split(/[\s,]+/g)
      .map((w) => w.trim())
      .filter(Boolean);

    const expanded = new Set();

    words.forEach((w) => {
      expanded.add(w);
      if (aliasMap[w]) expanded.add(aliasMap[w]);
    });

    // Handle multi-word aliases (IMPORTANT FIX)
    Object.keys(aliasMap).forEach((phrase) => {
      if (phrase.includes(" ") && rawNorm.includes(phrase)) {
        expanded.add(aliasMap[phrase]);
      }
    });

    return Array.from(expanded);
  }

  function buildHaystack(card) {
    const title = norm(card.querySelector(".project-title")?.textContent);

    const body = card.querySelector(".project-body");
    const desc = norm(body?.querySelector("p.muted")?.textContent);

    const pillTags = norm(
      Array.from(card.querySelectorAll(".project-tags .tag"))
        .map((t) => t.textContent)
        .join(" ")
    );

    const dataTags = norm(card.getAttribute("data-tags"));

    const meta = norm(
      Array.from(card.querySelectorAll(".project-meta li"))
        .map((li) => li.textContent)
        .join(" ")
    );

    return `${title} ${desc} ${pillTags} ${dataTags} ${meta}`;
  }

  function matchesFilter(card) {
    const tags = norm(card.getAttribute("data-tags"));
    return activeFilter === "all" || tags.split(/\s+/).includes(activeFilter);
  }

  function matchesSearch(card) {
    if (!query) return true;

    const tokens = tokenizeSearch(query);
    const haystack = buildHaystack(card);

    return tokens.every((t) => haystack.includes(t));
  }

  function applyAll() {
    projects.forEach((card) => {
      const show = matchesFilter(card) && matchesSearch(card);
      card.style.display = show ? "" : "none";
    });
  }

  // Filter buttons
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.getAttribute("data-filter") || "all";

      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      applyAll();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      query = e.target.value || "";
      applyAll();
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        query = "";
        applyAll();
      }
    });
  }

  applyAll();
});

// =========================================================
// GALLERY LIGHTBOX (unchanged)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  const galleryImages = Array.from(document.querySelectorAll(".lightbox-gallery img"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");
  const backdrop = document.querySelector(".lightbox-backdrop");

  if (!galleryImages.length || !lightbox || !lightboxImage || !lightboxCaption) return;

  let currentIndex = 0;

  function showImage(index) {
    const img = galleryImages[index];
    if (!img) return;

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || "";
    lightboxCaption.textContent = img.dataset.caption || "";
    currentIndex = index;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showNext() {
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    showImage(nextIndex);
  }

  function showPrev() {
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage(prevIndex);
  }

  galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);
  if (nextBtn) nextBtn.addEventListener("click", showNext);
  if (prevBtn) prevBtn.addEventListener("click", showPrev);

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
});