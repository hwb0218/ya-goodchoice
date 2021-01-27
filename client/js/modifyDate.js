// const Axios = require('axios');
const roomType = document.querySelector('#roomType');
const ul = document.querySelector('.room_group_list');
const closeBtn = document.querySelector('.modal__content button:last-child');
const modal = document.querySelector('.modal');

const closeModal = () => {
    modal.classList.add('hidden');
    roomType.removeAttribute('value');
}
closeBtn.addEventListener('click', closeModal);

const handleClick = (e) => {
    const target = e.target;
    if (target.className != 'modifyDateBtn') return;
    modal.classList.remove('hidden');
    const roomTypeFromDb = target.parentNode.parentNode.querySelector('input').value;
    roomType.value = roomTypeFromDb;
}
ul.addEventListener('click', handleClick);



