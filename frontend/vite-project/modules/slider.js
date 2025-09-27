export function initSliders() {
  // Initialize all slider controls
  const sliderButtons = document.querySelectorAll(".slider-btn");

  sliderButtons.forEach((button) => {
    button.addEventListener("click", handleSliderClick);
  });

  // Generate page indicators dynamically for both sliders
  generatePageIndicators("ranking");
  generatePageIndicators("cards");

  // Add click listeners to page indicator dots (after generation)
  const pageDots = document.querySelectorAll(".page-dot");
  pageDots.forEach((dot) => {
    dot.addEventListener("click", handlePageDotClick);
  });

  // Add scroll listeners to update page indicators
  const rankingSlider = document.getElementById("ranking-slider");
  if (rankingSlider) {
    rankingSlider.addEventListener("scroll", () =>
      updatePageIndicator("ranking")
    );
  }

  const cardSlider = document.getElementById("card-slider");
  if (cardSlider) {
    cardSlider.addEventListener("scroll", () => updatePageIndicator("cards"));
  }
}

function generatePageIndicators(sliderType) {
  let slider, pageIndicator, itemSelector;

  if (sliderType === "ranking") {
    slider = document.getElementById("ranking-slider");
    pageIndicator = document.querySelector(".ranking-section .page-indicator");
    itemSelector = ".ranking-item";
  } else if (sliderType === "cards") {
    slider = document.getElementById("card-slider");
    pageIndicator = document.getElementById("card-page-indicator");
    itemSelector = ".card";
  }

  if (slider && pageIndicator) {
    const totalItems = slider.querySelectorAll(itemSelector).length;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Clear existing dots
    pageIndicator.innerHTML = "";

    // Generate new dots based on total pages
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("span");
      dot.className = "page-dot";
      if (i === 0) dot.classList.add("active"); // First page is active by default
      dot.dataset.page = i.toString();
      dot.dataset.sliderType = sliderType;
      pageIndicator.appendChild(dot);
    }
  }
}

function handleSliderClick(event) {
  console.log("Slider button clicked");
  const button = event.currentTarget;
  const sliderType = button.dataset.slider;
  const isNext = button.classList.contains("slider-btn-next");

  console.log("Slider type:", sliderType, "Is next:", isNext);

  let slider;
  if (sliderType === "ranking") {
    slider = document.getElementById("ranking-slider");
  } else if (sliderType === "cards") {
    slider = document.getElementById("card-slider");
  }

  console.log("Slider element found:", !!slider);

  if (slider) {
    const items = slider.querySelectorAll(
      sliderType === "ranking" ? ".ranking-item" : ".card"
    );
    console.log("Items found:", items.length);
    slideItems(slider, sliderType, isNext);
  } else {
    console.error("Slider element not found for type:", sliderType);
  }
}

function slideItems(slider, sliderType, isNext) {
  let itemSelector, itemWidth;

  if (sliderType === "ranking") {
    itemSelector = ".ranking-item";
    const firstItem = slider.querySelector(itemSelector);
    if (!firstItem) {
      console.error("No ranking items found");
      return;
    }
    itemWidth =
      firstItem.offsetWidth + (parseInt(getComputedStyle(slider).gap) || 24);
  } else if (sliderType === "cards") {
    itemSelector = ".card";
    const firstItem = slider.querySelector(itemSelector);
    if (!firstItem) {
      console.error("No card items found");
      return;
    }
    itemWidth =
      firstItem.offsetWidth + (parseInt(getComputedStyle(slider).gap) || 19);
  }

  const itemsPerPage = 5; // Items shown per page
  const scrollAmount = itemWidth * itemsPerPage;
  const currentScroll = slider.scrollLeft;

  // Calculate total number of items and pages dynamically
  const totalItems = slider.querySelectorAll(itemSelector).length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate current page
  const currentPage = Math.round(currentScroll / scrollAmount);

  if (isNext) {
    let targetPage = currentPage + 1;

    // If we're at the last page, loop back to first page
    if (targetPage >= totalPages) {
      targetPage = 0;
    }

    const targetScroll = targetPage * scrollAmount;
    slider.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  } else {
    let targetPage = currentPage - 1;

    // If we're at the first page, loop to last page
    if (targetPage < 0) {
      targetPage = totalPages - 1;
    }

    const targetScroll = targetPage * scrollAmount;
    slider.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  }

  // Update page indicator immediately
  setTimeout(() => updatePageIndicator(sliderType), 100);
}

function handlePageDotClick(event) {
  const dot = event.currentTarget;
  const pageIndex = parseInt(dot.dataset.page);
  const sliderType = dot.dataset.sliderType;

  let slider, itemSelector, itemWidth;

  if (sliderType === "ranking") {
    slider = document.getElementById("ranking-slider");
    itemSelector = ".ranking-item";
    const firstItem = slider?.querySelector(itemSelector);
    if (!firstItem) return;
    itemWidth =
      firstItem.offsetWidth + (parseInt(getComputedStyle(slider).gap) || 24);
  } else if (sliderType === "cards") {
    slider = document.getElementById("card-slider");
    itemSelector = ".card";
    const firstItem = slider?.querySelector(itemSelector);
    if (!firstItem) return;
    itemWidth =
      firstItem.offsetWidth + (parseInt(getComputedStyle(slider).gap) || 19);
  }

  if (slider) {
    const itemsPerPage = 5;
    const scrollAmount = itemWidth * itemsPerPage;
    const targetScroll = pageIndex * scrollAmount;

    slider.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });

    // Update page indicator after scrolling
    setTimeout(() => updatePageIndicator(sliderType), 100);
  }
}

function updatePageIndicator(sliderType) {
  let slider, pageDots, itemSelector, itemWidth;

  if (sliderType === "ranking") {
    slider = document.getElementById("ranking-slider");
    pageDots = document.querySelectorAll(".ranking-section .page-dot");
    itemSelector = ".ranking-item";
    const firstItem = slider?.querySelector(itemSelector);
    if (!firstItem) return;
    itemWidth =
      firstItem.offsetWidth + (parseInt(getComputedStyle(slider).gap) || 24);
  } else if (sliderType === "cards") {
    slider = document.getElementById("card-slider");
    pageDots = document.querySelectorAll("#card-page-indicator .page-dot");
    itemSelector = ".card";
    const firstItem = slider?.querySelector(itemSelector);
    if (!firstItem) return;
    itemWidth =
      firstItem.offsetWidth + (parseInt(getComputedStyle(slider).gap) || 19);
  }

  if (slider && pageDots.length > 0) {
    const itemsPerPage = 5;
    const scrollAmount = itemWidth * itemsPerPage;
    const currentScroll = slider.scrollLeft;

    // Calculate total pages dynamically
    const totalItems = slider.querySelectorAll(itemSelector).length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate current page with better accuracy
    let currentPage = Math.round(currentScroll / scrollAmount);

    // Ensure currentPage is within bounds
    currentPage = Math.max(0, Math.min(totalPages - 1, currentPage));

    // Update active dot
    pageDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentPage);
    });
  }
}

// Legacy function for backward compatibility
export function slide() {
  const slider = document.querySelector(".ranking-list");
  if (slider) {
    slider.scrollLeft -= 100;
  }
}
