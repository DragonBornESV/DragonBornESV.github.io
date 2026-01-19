// /js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // Carousel (click only)
  // ==========================
  document.querySelectorAll(".project-thumb.carousel").forEach((carousel) => {
    const images = Array.from(carousel.querySelectorAll(".carousel-img"));
    const prevBtn = carousel.querySelector("button.prev");
    const nextBtn = carousel.querySelector("button.next");

    // If markup is missing something, skip safely
    if (images.length < 2 || !prevBtn || !nextBtn) return;

    let index = images.findIndex((img) => img.classList.contains("is-active"));
    if (index < 0) index = 0;

    function show(i) {
      images.forEach((img) => img.classList.remove("is-active"));
      images[i].classList.add("is-active");
    }

    // Make sure the current one is shown
    show(index);

    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      index = (index - 1 + images.length) % images.length;
      show(index);
    });

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      index = (index + 1) % images.length;
      show(index);
    });
  });

  // ==========================
  // Filters + Search
  // ==========================
  const searchInput = document.getElementById("project-search");
  const filterButtons = Array.from(document.querySelectorAll(".filter-row .chip[data-filter]"));
  const projects = Array.from(document.querySelectorAll(".projects-grid .project-tile"));

  if (!projects.length) return;

  let activeFilter = "all";
  let searchQuery = "";

  const normalize = (s) => (s || "").toLowerCase().trim();

  function matchesFilter(card) {
    const tags = normalize(card.getAttribute("data-tags"));
    return activeFilter === "all" || tags.split(/\s+/).includes(activeFilter);
  }

  function matchesSearch(card) {
    if (!searchQuery) return true;

    const title = normalize(card.querySelector(".project-title")?.textContent);
    // only the first .muted inside the card is your description — that's fine
    const desc = normalize(card.querySelector(".project-body .muted")?.textContent);
    const tags = normalize(card.getAttribute("data-tags"));
    return `${title} ${desc} ${tags}`.includes(searchQuery);
  }

  function applyAll() {
    projects.forEach((card) => {
      const show = matchesFilter(card) && matchesSearch(card);
      card.style.display = show ? "" : "none";
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.getAttribute("data-filter") || "all";
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyAll();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = normalize(e.target.value);
      applyAll();
    });
  }

  applyAll();
});
