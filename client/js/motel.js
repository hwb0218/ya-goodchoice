const category1 = document.querySelector(".category1_wrap");
const category2 = document.querySelector(".category2_wrap");
const category3 = document.querySelector(".category3_wrap");
const category4 = document.querySelector(".category4_wrap");
const asecndingSortBtn = document.querySelector(".btn_wrap .btn_wrap-ascnd");
const descendingSortBtn = document.querySelector(".btn_wrap .btn_wrap-dscnd");


function duplication(a, b) {
  const result = b.reduce((acc, x) => a.filter(y => x === y).length === 0 ? [...acc, x] : acc, []);
  return [...a, ...result];
}

function isCheckedIncludes(option, checked) {
  return option.filter((item) => checked.includes(item)).length > 0;
}

function getRentableRooms() {
  return motels.filter((o) => o.rentableRooms > 0);
}

function getAccommodations() {
  return motels.filter((o) => o.accommodations > 0);
}

function getRoomType() {
  const checked = getCheckedInputValue(category1);
  const rentableRooms = checked.includes('대실 예약') ? getRentableRooms() : [];
  const accommodations = checked.includes('숙박 예약') ? getAccommodations() : [];
  return duplication(rentableRooms, accommodations);
}

function getInfra() {
  const check = getCheckedCategorys();
  const opt1Result = motels.filter((o) => isCheckedIncludes(o.opt1, check));
  const opt2Result = motels.filter((o) => isCheckedIncludes(o.opt2, check));
  const opt3Result = motels.filter((o) => isCheckedIncludes(o.opt3, check));
  return [opt1Result, opt2Result, opt3Result]
    .reduce((a, b) => duplication(a, b));
}

function searchChecking() {
  const a = getRoomType();
  const b = getInfra();
  const result = duplication(a, b);
  console.log('result', result);
  return result.length === 0 ? motels : result;
}

function getCheckedInputValue(element, selector = "input:checked") {
  console.log(element);
  const elements = element.querySelectorAll(selector);
  console.log(elements);
  return Array.from(elements).map((input) => input.value);
}

function getCheckedCategorys() {
  const category2 = document.querySelector(".category2_wrap");
  const category3 = document.querySelector(".category3_wrap");
  const category4 = document.querySelector(".category4_wrap");
  return [category2, category3, category4]
    .map((x) => getCheckedInputValue(x))
    .reduce((a, b) => {
      return [...a, ...b]
    });
}

function handleCheckedOpt(event) {
  if (event.target.checked === true) {
    createRooms();
  } else if(event.target.checked === false) {
    createRooms();
  }
}

function template(id, item) {
  return `<li>
            <input type="checkbox" id="${id}" value="${item}" />
            <label for="${id}" class="label_chk">${item}</label>
         </li>`
}

function createCategory(container, selectCategory) {
  container.innerHTML = selectCategory.map((obj) =>
      '<ul>' + obj.li.map((item, i) =>
          template(obj.id[i], item)).join('') + '</ul>').join('');
}

function createFilters() {
  createCategory(category2, secondCategory);
  createCategory(category3, thirdCategory);
  createCategory(category4, fourthCategory);
}

function handleRangeValue() {
  const priceValue = document.querySelector(".price_value");
  const value = this.value;
  priceValue.textContent = `${value}원 이상`;
  createRooms();
}

function handleOrderBtn(option) {
  return function () {
    createRooms(option);
  };
}

function template2(src, storeName, rentableRooms, accommodations) {
  return `<div>
            <img src="${src}">
            <span>${storeName}</span>
            <span>${rentableRooms}</span>
            <span>${accommodations}</span>
          </div>`;
}

function createRooms(option = 'asc') {
  const range = document.querySelector(".range_input");
  const motels = searchChecking()
    .filter((o) => o.accommodations >= range.value)
    .sort((a, b) => {
      if (option === "desc") {
        [b, a] = [a, b];
      }
      const accommodations = a.accommodations - b.accommodations;
      return accommodations === 0 ? a.rentableRooms - b.rentableRooms : accommodations;
    });

  const sort_list = document.querySelector(".sort_list");
  sort_list.innerHTML = motels
    .map((obj) => template2(obj.image, obj.storeName, obj.rentableRooms, obj.accommodations)).join('');
}

function init() {
  const category5 = document.querySelector(".category5_wrap");
  const range = category5.querySelector(".range_input");

  createFilters();
  createRooms();
  category1.addEventListener("click", handleCheckedOpt);
  category2.addEventListener("click", handleCheckedOpt);
  category3.addEventListener("click", handleCheckedOpt);
  category4.addEventListener("click", handleCheckedOpt);
  range.addEventListener("input", handleRangeValue);

  descendingSortBtn.addEventListener("click", handleOrderBtn('desc'));
  asecndingSortBtn.addEventListener("click", handleOrderBtn('asc'));
}
init();
