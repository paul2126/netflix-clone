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
      cardItem.dataset.cardId = index; // Add unique identifier
      cardItem.innerHTML = `
        <img
          src="${imageUrl}"
          alt="카드 이미지 ${index + 1}"
          class="card-image"
        />
        <div class="card-info">
          <h3>콘텐츠 제목 ${index + 1}</h3>
          <div class="card-actions">
            <button class="like-button" data-card-id="${index}" aria-label="Like this content">
              <svg class="like-icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      `;
      cardSlider.appendChild(cardItem);
    });

    console.log(`Successfully populated ${cardUrls.length} card items`);
    
    // Add like button event listeners
    addLikeButtonListeners(cardSlider);
    
    // Add enhanced hover handling for cards
    addCardHoverHandlers(cardSlider);
    
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
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        heroSection.style.backgroundImage = `url("${imgData['hero-url']}")`;
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

// Like button functionality
function addLikeButtonListeners(container) {
  const likeButtons = container.querySelectorAll('.like-button');
  
  likeButtons.forEach(button => {
    button.addEventListener('click', handleLikeClick);
  });
}

function handleLikeClick(event) {
  event.preventDefault(); // Prevent card link from being triggered
  event.stopPropagation(); // Stop event bubbling
  
  const likeButton = event.currentTarget;
  const cardId = likeButton.dataset.cardId;
  const isLiked = likeButton.classList.contains('liked');
  
  // Toggle like state
  if (isLiked) {
    unlikeCard(likeButton, cardId);
  } else {
    likeCard(likeButton, cardId);
  }
}

function likeCard(likeButton, cardId) {
  likeButton.classList.add('liked');
  likeButton.setAttribute('aria-label', 'Unlike this content');
  
  // Add animation class
  likeButton.classList.add('like-animation');
  
  // Remove animation class when animation completes (more reliable than setTimeout)
  const handleAnimationEnd = () => {
    likeButton.classList.remove('like-animation');
    likeButton.removeEventListener('animationend', handleAnimationEnd);
  };
  
  likeButton.addEventListener('animationend', handleAnimationEnd);
  
  // Fallback timeout in case animationend doesn't fire
  setTimeout(() => {
    likeButton.classList.remove('like-animation');
    likeButton.removeEventListener('animationend', handleAnimationEnd);
  }, 350); // Slightly longer than 300ms animation duration as fallback
  
  // Store like state (you can send this to backend later)
  storeLikeState(cardId, true);
  
  console.log(`Card ${cardId} liked!`);
}

function unlikeCard(likeButton, cardId) {
  likeButton.classList.remove('liked');
  likeButton.setAttribute('aria-label', 'Like this content');
  
  // Store like state (you can send this to backend later)
  storeLikeState(cardId, false);
  
  console.log(`Card ${cardId} unliked!`);
}

function storeLikeState(cardId, isLiked) {
  // Store in localStorage (you can replace this with backend API call)
  const likedCards = JSON.parse(localStorage.getItem('likedCards') || '{}');
  
  if (isLiked) {
    likedCards[cardId] = true;
  } else {
    delete likedCards[cardId];
  }
  
  localStorage.setItem('likedCards', JSON.stringify(likedCards));
}

function loadLikeStates() {
  // Load like states from localStorage and apply them
  const likedCards = JSON.parse(localStorage.getItem('likedCards') || '{}');
  
  Object.keys(likedCards).forEach(cardId => {
    const likeButton = document.querySelector(`[data-card-id="${cardId}"]`);
    if (likeButton && likedCards[cardId]) {
      likeButton.classList.add('liked');
      likeButton.setAttribute('aria-label', 'Unlike this content');
    }
  });
}

// Enhanced hover handling for smooth card-info transitions
function addCardHoverHandlers(container) {
  const cards = container.querySelectorAll('.card');
  
  cards.forEach(card => {
    const cardInfo = card.querySelector('.card-info');
    let hoverTimeout;
    
    card.addEventListener('mouseenter', () => {
      // Clear any pending hide timeout
      clearTimeout(hoverTimeout);
      cardInfo.style.transform = 'translateY(0)';
      cardInfo.style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
      // Add small delay to prevent flickering when moving to buttons
      hoverTimeout = setTimeout(() => {
        cardInfo.style.transform = 'translateY(100%)';
        cardInfo.style.opacity = '0';
      }, 100);
    });
    
    // Prevent card-info from hiding when interacting with buttons inside
    cardInfo.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
    });
    
    cardInfo.addEventListener('mouseleave', (e) => {
      // Only hide if mouse is not moving to another element within the card
      if (!card.contains(e.relatedTarget)) {
        hoverTimeout = setTimeout(() => {
          cardInfo.style.transform = 'translateY(100%)';
          cardInfo.style.opacity = '0';
        }, 100);
      }
    });
  });
}

// DOM 로드 완료 후 초기화
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize header modals first
  initHeaderModals();

  const imagesLoaded = await loadAndDisplayImages();
  
  if (imagesLoaded) {
    initSliders();
    // Load like states after cards are populated
    loadLikeStates();
  }
});
