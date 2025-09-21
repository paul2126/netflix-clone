import { createSimpleModal } from './modules/modal.js';

function initHeaderModals() {
  console.log('Initializing header modals...');
  const notificationButton = document.querySelector('.notification-button');
  const profileButton = document.querySelector('.profile-button');

  console.log('Notification button found:', !!notificationButton);
  console.log('Profile button found:', !!profileButton);

  // 알림 모달 생성
  if (notificationButton) {
    createSimpleModal(notificationButton, 'notification');
    console.log('Notification modal created');
  }

  // 프로필 모달 생성
  if (profileButton) {
    createSimpleModal(profileButton, 'profile');
    console.log('Profile modal created');
  }
}




// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
  initHeaderModals();
});