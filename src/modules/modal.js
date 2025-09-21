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

  // 마우스 이벤트 추가
  button.addEventListener('mouseenter', () => {
    console.log(`Showing ${type} modal`);
    modal.style.display = 'block';
  });

  button.addEventListener('mouseleave', () => {
    console.log(`Mouse left ${type} button`);
    setTimeout(() => {
      if (!modal.matches(':hover')) {
        console.log(`Hiding ${type} modal`);
        modal.style.display = 'none';
      }
    }, 100);
  });

  modal.addEventListener('mouseleave', () => {
    console.log(`Mouse left ${type} modal`);
    modal.style.display = 'none';
  });
}