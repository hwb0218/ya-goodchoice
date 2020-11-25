const sort = document.querySelector('#sort');
const ascBtn = document.querySelector('.btn_wrap-ascend');
const descBtn = document.querySelector('.btn_wrap-descend');

function init() {
    ascBtn.addEventListener('click', function () {
        sort.value = ascBtn.dataset.sort;
    });
    descBtn.addEventListener('click', function () {
        sort.value = descBtn.dataset.sort;
    });
}
init();