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
  // PROJECT FILTERS + SEARCH (works together)
  // =========================================================
  const searchInput = document.getElementById("project-search");
  const filterButtons = document.querySelectorAll(".filter-row .chip[data-filter]");
  const projects = document.querySelectorAll(".projects-grid .project-tile");

  if (!projects.length) return;

  let activeFilter = "all";
  let query = "";

  // Map "human" search terms to your internal tags
  const aliasMap = {
    "augmented reality": "ar",
    "mixed reality": "ar",
    "mobile ar": "ar",
    "ar foundation": "ar",
    "vr": "vr",
    "virtual reality": "vr",
    "oculus": "vr",
    "quest": "vr",
    "hardware": "hardware",
    "arduino": "hardware",
    "robot": "hardware",
    "robotics": "hardware",
    "3d": "3d",
    "3d printing": "3d",
    "printing": "3d",
    "game": "game",
    "game dev": "game",
    "unity": "unity",
    "c#": "c#",
    "csharp": "c#",
  };

  function norm(str) {
    return (str || "").toLowerCase().trim();
  }

  function tokenizeSearch(raw) {
    // Split into words, remove empty, normalize, and expand aliases
    const words = norm(raw)
      .split(/[\s,]+/g)
      .map((w) => w.trim())
      .filter(Boolean);

    const expanded = new Set();

    words.forEach((w) => {
      expanded.add(w);
      // Expand known phrases/aliases
      Object.keys(aliasMap).forEach((phrase) => {
        if (phrase.includes(" ") && norm(raw).includes(phrase)) expanded.add(aliasMap[phrase]);
      });
      if (aliasMap[w]) expanded.add(aliasMap[w]);
    });

    return Array.from(expanded);
  }

  function buildHaystack(card) {
    const title = norm(card.querySelector(".project-title")?.textContent);

    // description: take FIRST muted paragraph in the card body (not the page)
    const body = card.querySelector(".project-body");
    const desc = norm(body?.querySelector("p.muted")?.textContent);

    // visible pill tags text
    const pillTags = norm(
      Array.from(card.querySelectorAll(".project-tags .tag"))
        .map((t) => t.textContent)
        .join(" ")
    );

    // data-tags attribute (your canonical filter tags)
    const dataTags = norm(card.getAttribute("data-tags"));

    return `${title} ${desc} ${pillTags} ${dataTags}`;
  }

  function matchesFilter(card) {
    const tags = norm(card.getAttribute("data-tags"));
    return activeFilter === "all" || tags.split(/\s+/).includes(activeFilter);
  }

  function matchesSearch(card) {
    if (!query) return true;

    const tokens = tokenizeSearch(query);
    const haystack = buildHaystack(card);

    // AND logic: every token must match somewhere (feels more “correct”)
    return tokens.every((t) => haystack.includes(t));
  }

  function applyAll() {
    projects.forEach((card) => {
      const show = matchesFilter(card) && matchesSearch(card);
      card.style.display = show ? "" : "none";
    });
  }

  // Filter button clicks
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.getAttribute("data-filter") || "all";

      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      applyAll();
    });
  });

  // Search typing
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      query = e.target.value || "";
      applyAll();
    });

    // Escape clears search quickly
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        query = "";
        applyAll();
      }
    });
  }

  // Default render
  applyAll();
});
