const inputLeft = document.getElementById('input-left');
const inputRight = document.getElementById('input-right');
const thumbLeft = document.querySelector(".slider > .thumb.left");
const thumbRight = document.querySelector(".slider > .thumb.right");
const range = document.querySelector(".slider > .range");

function setLeftValue() {
    const _this = inputLeft; // element 가 들어감
    const min = parseInt(_this.min); // min = "0" 타입이 string 이기 때문에 Number 로 바꿔줌
    const max = parseInt(_this.max); // max = "100" 타입이 string 이기 때문에 Number 로 바꿔줌
    // _this.value (type string >> parseInt number) inputLeft 값이랑, inputRight 값이중 작은 수를 _this.value 에 넣음
    _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 20000);

    const percent = ((_this.value - min) / (max - min) * 100);
    thumbLeft.style.left = percent + "%";
    range.style.left = percent + "%";
    const minPrice = document.querySelector(".price_value.min_price");
    const text = this.value;
    minPrice.textContent = `${text}원 ~`;
}

function setRightValue() {
    const _this = inputRight;
    const min = parseInt(_this.min);
    const max = parseInt(_this.max);
    _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 20000);

    const percent = ((_this.value - min) / (max - min) * 100);
    thumbRight.style.right = (100 - percent) + "%";
    range.style.right = (100 - percent) + "%";
    const maxPrice = document.querySelector(".price_value.max_price");
    const text = this.value;
    maxPrice.textContent = ` ${text}원`;
}

function init() {
    inputLeft.addEventListener("input", setLeftValue);
    inputRight.addEventListener("input", setRightValue);
    inputLeft.value = minPrice;
    setLeftValue.call(inputLeft);
    inputRight.value = maxPrice;
    setRightValue.call(inputRight);
}
init();