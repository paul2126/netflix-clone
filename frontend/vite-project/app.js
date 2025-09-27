import { createSimpleModal } from "./modules/modal.js";
import { initSliders } from "./modules/slider.js";

function initHeaderModals() {
  console.log("Initializing header modals...");
  const notificationButton = document.querySelector(".notification-button");
  const profileButton = document.querySelector(".profile-button");

  console.log("Notification button found:", !!notificationButton);
  console.log("Profile button found:", !!profileButton);

  // 알림 모달 생성
  if (notificationButton) {
    createSimpleModal(notificationButton, "notification");
    console.log("Notification modal created");
  }

  // 프로필 모달 생성
  if (profileButton) {
    createSimpleModal(profileButton, "profile");
    console.log("Profile modal created");
  }
}

async function getImgData() {
  const url = `http://localhost:8080/api/getImgData`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // Fetch does not reject on 404/500 status codes, so we throw manually
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const userData = await response.json();

    console.log("Fetched User Data:", userData);
    return userData;
  } catch (error) {
    console.error("Fetch failed:", error.message);
    return null;
  }
}

function populateRankingList(rankingUrls) {
  return new Promise((resolve) => {
    // ← Return a Promise

    const rankingSlider = document.getElementById("ranking-slider");

    if (!rankingSlider || !rankingUrls || !Array.isArray(rankingUrls)) {
      console.error("Ranking slider element not found or invalid ranking URLs");
      return;
    }

    // Clear existing content
    rankingSlider.innerHTML = "";

    // Create ranking items dynamically
    rankingUrls.forEach((imageUrl, index) => {
      const rankingNumber = index + 1;

      const rankingItem = document.createElement("a");
      rankingItem.href = "#";
      rankingItem.className = "ranking-item";

      rankingItem.innerHTML = `
      <span class="ranking-number">${rankingNumber}</span>
      <img
        src="${imageUrl}"
        alt="${rankingNumber}위 콘텐츠 이미지"
        class="ranking-image"
      />
    `;

      rankingSlider.appendChild(rankingItem);
    });

    console.log(`Successfully populated ${rankingUrls.length} ranking items`);
    requestAnimationFrame(() => {
      resolve(); // ← Promise resolves when DOM is visually ready
    });
  });
}

function populateCardList(cardUrls) {
  return new Promise((resolve) => {
    const cardSlider = document.getElementById("card-slider");

    if (!cardSlider || !cardUrls || !Array.isArray(cardUrls)) {
      console.error("Card slider element not found or invalid card URLs");
      return;
    }

    // Clear existing content
    cardSlider.innerHTML = "";

    cardUrls.forEach((imageUrl, index) => {
      const cardItem = document.createElement("a");
      cardItem.href = "#";
      cardItem.className = "card";
      cardItem.innerHTML = `
      <img
        src="${imageUrl}"
        alt="카드 이미지 ${index + 1}"
        class="card-image"
      />
      <div class="card-info">
        <h3>콘텐츠 제목 ${index + 1}</h3>
      </div>
    `;
      cardSlider.appendChild(cardItem);
    });

    console.log(`Successfully populated ${cardUrls.length} card items`);
    requestAnimationFrame(() => {
      resolve(); // ← Promise resolves when DOM is visually ready
    });
  });
}

async function loadAndDisplayImages() {
  const imgData = await getImgData();

  if (imgData) {
    const promises = [];

    // Populate ranking list
    if (imgData["ranking-url"]) {
      promises.push(populateRankingList(imgData["ranking-url"]));
    }

    // Populate card list
    if (imgData["card-url"]) {
      promises.push(populateCardList(imgData["card-url"]));
    }

    // Update other images if needed
    if (imgData["hero-url"]) {
      const heroImg = document.querySelector(".hero img");
      if (heroImg) {
        heroImg.src = imgData["hero-url"];
      }
    }

    if (imgData["netflix-logo"]) {
      const netflixLogo = document.querySelector(".header-logo img");
      if (netflixLogo) {
        netflixLogo.src = imgData["netflix-logo"];
      }
    }

    if (imgData["profile-url"]) {
      const profileImg = document.querySelector(".profile-button img");
      if (profileImg) {
        profileImg.src = imgData["profile-url"];
      }
    }
    await Promise.all(promises);
    return true; // ← Signal success
  }
  return false; // ← Signal failure
}

// DOM 로드 완료 후 초기화
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize header modals first
  initHeaderModals();

  const imagesLoaded = await loadAndDisplayImages();
  
  if (imagesLoaded) {
    initSliders(); 
  }
});
