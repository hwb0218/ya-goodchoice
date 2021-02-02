// const Axios = require('axios');
const ul = document.querySelector('.room_group_list');
const [firstCloseBtn, secondCloseBtn] = document.querySelectorAll('.modal__content button:last-child');

const modalContent = (e) => {
    const form = document.querySelector('form');
    const [firstModalContent, secondModalContent] = document.querySelectorAll('.modal__content');
    if (e.target.className === 'modifyDateBtn') {
        const path = '/api/users/updateReservationDates';
        firstModalContent.classList.remove('hidden');
        form.setAttribute('action', path);
    } else if (e.target.className === 'reservationCancellationBtn') {
        const path = '/api/users/reservationCancellation';
        secondModalContent.classList.remove('hidden');
        form.setAttribute('action', path);
    }
}

const openModal = (e) => {
    const {roomType, roomId} = e.target.dataset;
    const selectedRoomType = document.querySelector('#roomType');
    const selectedRoomId = document.querySelector('#roomId');
    const modal = document.querySelector('.modal');
    if(e.target.className !== 'modifyDateBtn' && e.target.className !== 'reservationCancellationBtn') return;
    modalContent(e);
    modal.classList.remove('hidden');
    selectedRoomType.value = roomType;
    selectedRoomId.value = roomId;
}

ul.addEventListener('click', openModal);

const closeModal = () => {
    const roomType = document.querySelector('#roomType');
    const roomId = document.querySelector('#roomId');
    const modal = document.querySelector('.modal');
    const [firstModalContent, secondModalContent] = document.querySelectorAll('.modal__content');
    firstModalContent.classList.add('hidden');
    secondModalContent.classList.add('hidden');
    modal.classList.add('hidden');
    roomType.removeAttribute('value');
    roomId.removeAttribute('value');
}
// 이 부분 이벤트 위임 처리하기
firstCloseBtn.addEventListener('click', closeModal);
secondCloseBtn.addEventListener('click', closeModal);