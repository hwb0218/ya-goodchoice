// const Axios = require('axios');
const ul = document.querySelector('.room_group_list');
const closeBtn = document.querySelector('.modal__content button:last-child');

const openModal = (e) => {
    const {roomType, roomId} = e.target.dataset;
    const selectedRoomType = document.querySelector('#roomType');
    const selectedRoomId = document.querySelector('#roomId');
    const modal = document.querySelector('.modal');
    const target = e.target;
    if (target.className !== 'modifyDateBtn') return;

    modal.classList.remove('hidden');
    selectedRoomType.value = roomType;
    selectedRoomId.value = roomId;
}
ul.addEventListener('click', openModal);

const closeModal = () => {
    const roomType = document.querySelector('#roomType');
    const roomId = document.querySelector('#roomId');
    const modal = document.querySelector('.modal');

    modal.classList.add('hidden');
    roomType.removeAttribute('value');
    roomId.removeAttribute('value');
}
closeBtn.addEventListener('click', closeModal);





