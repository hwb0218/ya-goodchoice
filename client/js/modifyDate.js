// const Axios = require('axios');
const ul = document.querySelector('.room_group_list');
const closeBtn = document.querySelector('.modal__content button:last-child');

const openModal = (e) => {
    const roomType = document.querySelector('#roomType');
    const roomId = document.querySelector('#roomId');
    const modal = document.querySelector('.modal');
    const target = e.target;

    if (target.className !== 'modifyDateBtn') return;

    modal.classList.remove('hidden');
    const roomTypeFromDb = target.parentNode.parentNode.querySelector('.roomType').value;
    const roomIdFromDb = target.parentNode.parentNode.querySelector('.roomId').value;
    roomType.value = roomTypeFromDb;
    roomId.value = roomIdFromDb;
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





