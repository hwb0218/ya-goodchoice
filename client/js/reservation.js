const form = document.querySelector('#form');
const reservationBtn = document.querySelectorAll('.reservationBtn');
const okBtn = document.querySelector('.modal__content button:nth-child(2)');
const closeBtn = document.querySelector('.modal__content button:last-child');
const modal = document.querySelector('.modal');
const roomType = document.querySelector('#roomType');
const id = document.querySelector('#id');

const openModal = (e) => {
    modal.classList.remove('hidden');
    const path = location.pathname.split('/')[1];
    console.log(path);
    roomType.value = path;
    id.value = e.target.value;
}

const reservation = () => {
    form.setAttribute('action', '/api/users/reservation');
}

Array.from(reservationBtn).forEach((btn, i) => {
    btn.addEventListener('click', openModal);
    btn.value = i + 1;
});

okBtn.addEventListener('click', reservation);

const closeModal = () => {
    modal.classList.add('hidden');
}
closeBtn.addEventListener('click', closeModal);

