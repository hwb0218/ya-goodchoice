const ul = document.querySelector('.room_group_list');
const modal = document.querySelector('.modal');

const modalContent = (e) => {
    const form = document.querySelector('form');
    const [firstModalContent, secondModalContent] = document.querySelectorAll('.modal__content');
    if (e.target.className === 'modifyDateBtn') {
        const path = '/api/reservation/updateReservationDates';
        firstModalContent.classList.remove('hidden');
        form.setAttribute('action', path);
    } else if (e.target.className === 'reservationCancellationBtn') {
        const path = '/api/reservation/reservationCancellation';
        secondModalContent.classList.remove('hidden');
        form.setAttribute('action', path);
    }
}

const openModal = (e) => {
    if(!e.target.classList.contains('modifyDateBtn')
        && !e.target.classList.contains('reservationCancellationBtn')) return;
    const {roomType, groupOfRooms, roomId} = e.target.dataset;
    const selectedRoomType = document.querySelector('#roomType');
    const selectedGroupOfRooms = document.querySelector('#groupOfRooms');
    const selectedRoomId = document.querySelector('#roomId');

    modalContent(e);
    modal.classList.remove('hidden');
    selectedRoomType.value = roomType;
    selectedGroupOfRooms.value = groupOfRooms;
    selectedRoomId.value = roomId;

}
ul.addEventListener('click', openModal);

const closeModal = (e) => {
    if(!e.target.classList.contains('closeBtn')) return;
    const roomType = document.querySelector('#roomType');
    const roomId = document.querySelector('#roomId');
    const [firstModalContent, secondModalContent] = document.querySelectorAll('.modal__content');
    firstModalContent.classList.add('hidden');
    secondModalContent.classList.add('hidden');
    modal.classList.add('hidden');
    roomType.removeAttribute('value');
    roomId.removeAttribute('value');
}
modal.addEventListener('click', closeModal);