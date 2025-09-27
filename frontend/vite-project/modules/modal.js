// 현재 활성화된 모달을 추적
let activeModal = null;
let allModals = [];

// 모든 모달 숨기기 함수
function hideAllModals() {
  allModals.forEach(modal => {
    modal.style.display = 'none';
  });
  activeModal = null;
}

export function createSimpleModal(button, type) {
  console.log(`Creating modal for type: ${type}`, button);
  // 모달 HTML 생성
  const modal = document.createElement('div');
  modal.className = `simple-modal ${type}-modal`;
  modal.style.display = 'none';
  
  if (type === 'notification') {
    modal.innerHTML = `
      <div class="modal-content">
        <div class="notification-item">
          <strong>새로운 알림</strong>
          <p>새로운 콘텐츠가 업데이트되었습니다.</p>
        </div>
        <div class="notification-item">
          <strong>추천 콘텐츠</strong>
          <p>취향에 맞는 시리즈를 확인해보세요.</p>
        </div>
      </div>
    `;
  } else if (type === 'profile') {
    modal.innerHTML = `
      <div class="modal-content">
        <div class="profile-item">프로필 관리</div>
        <div class="profile-item">계정 설정</div>
        <div class="profile-item">로그아웃</div>
      </div>
    `;
  }

  // 버튼 다음에 모달 추가
  button.parentNode.insertBefore(modal, button.nextSibling);
  
  // 모달을 전역 배열에 추가
  allModals.push(modal);

  // 모달 표시 함수
  function showModal() {
    // 다른 모든 모달 숨기기
    hideAllModals();
    console.log(`Showing ${type} modal`);
    modal.style.display = 'block';
    activeModal = modal;
  }

  // 모달 숨기기 함수
  function hideModal() {
    console.log(`Hiding ${type} modal`);
    modal.style.display = 'none';
    if (activeModal === modal) {
      activeModal = null;
    }
  }

  // 마우스 이벤트 추가
  button.addEventListener('mouseenter', showModal);

  button.addEventListener('mouseleave', () => {
    console.log(`Mouse left ${type} button`);
    setTimeout(() => {
      if (!modal.matches(':hover')) {
        hideModal();
      }
    }, 150); // 딜레이를 조금 늘림
  });
}