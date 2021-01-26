// const Axios = require('axios');
const roomType = document.querySelector('#roomType');
const modifyDateBtns = document.querySelectorAll('.modifyDateBtn');
const closeBtn = document.querySelector('.modal__content button:last-child');
const modal = document.querySelector('.modal');

const openModal = () => {
    modal.classList.remove('hidden');
    roomType.value
}

const closeModal = () => {
    modal.classList.add('hidden');
}

Array.from(modifyDateBtns).forEach((btn, i) => {
    btn.addEventListener('click', openModal)
    btn.value = i + 1;
})

closeBtn.addEventListener('click', closeModal)

// const handleDateBtn = (e) => {
//     console.log(e.target);
// }
//
// modifyDateBtn.addEventListener('click', handleDateBtn)

