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
  let searchQuery = "";

  function normalize(str) {
    return (str || "").toLowerCase().trim();
  }

  function matchesFilter(card) {
    const tags = normalize(card.getAttribute("data-tags"));
    return activeFilter === "all" || tags.includes(activeFilter);
  }

  function matchesSearch(card) {
    if (!searchQuery) return true;

    // Search through: title + description + tags text
    const title = normalize(card.querySelector(".project-title")?.textContent);
    const desc = normalize(card.querySelector(".muted")?.textContent);
    const tags = normalize(card.getAttribute("data-tags"));

    const haystack = `${title} ${desc} ${tags}`;
    return haystack.includes(searchQuery);
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
      searchQuery = normalize(e.target.value);
      applyAll();
    });
  }

  // Default render
  applyAll();
});
