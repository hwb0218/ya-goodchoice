const category1 = document.querySelector(".category1_wrap");
const category2 = document.querySelector(".category2_wrap");
const category3 = document.querySelector(".category3_wrap");
const category4 = document.querySelector(".category4_wrap");

function createTag(tagName, tagOption) {
  const tag = document.createElement(tagName);
  // const tag = {};
  for (const [key, value] of Object.entries(tagOption)) {
    tag[key] = value;
  }
  return tag;
}

function duplication(a, b) {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i].storeName === b[j].storeName) {
        b.splice(j, 1);
      }
    }
  }
  return a.concat(b);
}

function searchChecking(check, roomType) {
  //filter는 return이 ture인 요소만 모아서 새로운 배열을 만든다.
  // 대실
  let rentableRooms;
  if (roomType.includes("대실 예약")) {
    rentableRooms = motels.filter((obj) => obj.rentableRooms > 0);
  }
  // 숙박
  let accommodations;
  if (roomType.includes("숙박 예약")) {
    accommodations = motels.filter((obj) => obj.accommodations > 0);
  }
  console.log(rentableRooms, accommodations);

  const opt1Result = motels.filter(
    (obj) => obj.opt1.filter((item) => check.includes(item)).length > 0
  );
  const opt2Result = motels.filter(
    (obj) => obj.opt2.filter((item) => check.includes(item)).length > 0
  );
  const opt3Result = motels.filter(
    (obj) => obj.opt3.filter((item) => check.includes(item)).length > 0
  );
  createRooms(duplication(duplication(opt1Result, opt2Result), opt3Result));
}

function handleCheckedOpt(event) {
  const checkedArr = [];
  if (event.target.checked === true) {
    const checkedRoomType = category1.querySelectorAll("input:checked");
    const checkedOpt1 = category2.querySelectorAll("input:checked");
    const checkedOpt2 = category3.querySelectorAll("input:checked");
    const checkedOpt3 = category4.querySelectorAll("input:checked");
    const roomTypeValue = Array.from(checkedRoomType).map(
      (roomType) => roomType.value
    );
    Array.from(checkedOpt1).forEach((opt1Item) =>
      checkedArr.push(opt1Item.value)
    );
    Array.from(checkedOpt2).forEach((opt2Item) =>
      checkedArr.push(opt2Item.value)
    );
    Array.from(checkedOpt3).forEach((opt3Item) =>
      checkedArr.push(opt3Item.value)
    );
    console.log(checkedArr);
    searchChecking(checkedArr, roomTypeValue);
  }
}

function createCategory2(category2) {
  category2.textContent = " ";
  secondCategory.forEach((obj) => {
    const ul = document.createElement("ul");
    obj.li.forEach((item, i) => {
      const themeLi = document.createElement("li");
      const input = createTag("input", {
        type: "checkbox",
        value: item,
        id: obj.id[i],
      });
      const label = createTag("label", { textContent: item });
      label.setAttribute("for", obj.id[i]);
      label.classList.add("label_chk");
      themeLi.appendChild(input);
      themeLi.appendChild(label);
      ul.appendChild(themeLi);
    });
    category2.appendChild(ul);
  });
}

function createCategory3(category3) {
  category3.textContent = " ";
  thirdCategory.forEach((obj) => {
    const ul = document.createElement("ul");
    obj.li.forEach((item, i) => {
      const themeLi = document.createElement("li");
      const input = createTag("input", {
        type: "checkbox",
        value: item,
        id: obj.id[i],
      });
      const label = createTag("label", { textContent: item });
      label.setAttribute("for", obj.id[i]);
      label.classList.add("label_chk");
      themeLi.appendChild(input);
      themeLi.appendChild(label);
      ul.appendChild(themeLi);
    });
    category3.appendChild(ul);
  });
}

function createCategory4(category4) {
  category4.textContent = " ";
  fourthCategory.forEach((obj) => {
    const ul = document.createElement("ul");
    obj.li.forEach((item, i) => {
      const themeLi = document.createElement("li");
      const input = createTag("input", {
        type: "checkbox",
        value: item,
        id: obj.id[i],
        onclick: "checkRevSelect(this.form)",
      });
      const label = createTag("label", { textContent: item });
      label.setAttribute("for", obj.id[i]);
      label.classList.add("label_chk");
      themeLi.appendChild(input);
      themeLi.appendChild(label);
      ul.appendChild(themeLi);
    });
    category4.appendChild(ul);
  });
}

function createFilters() {
  const filter_wrap = document.querySelector(".filter_wrap");
  const category2 = filter_wrap.querySelector(".category2_wrap");
  const category3 = filter_wrap.querySelector(".category3_wrap");
  const category4 = filter_wrap.querySelector(".category4_wrap");

  createCategory2(category2);
  createCategory3(category3);
  createCategory4(category4);
}

function handleRangeValue() {
  const price_value = document.querySelector(".price_value");
  const value = this.value;
  price_value.textContent = `${value}원 이상`;
}

function handleDscndOrderBtn() {
  motels.sort((a, b) => {
    const accommodations = b.accommodations - a.accommodations;
    if (accommodations === 0) {
      return b.rentableRooms - a.rentableRooms;
    }
    return accommodations;
  });
  createRooms(motels);
}

function handleAscndOrderBtn() {
  motels.sort((a, b) => {
    const accommodations = a.accommodations - b.accommodations;
    if (accommodations === 0) {
      return a.rentableRooms - b.rentableRooms;
    }
    return accommodations;
  });
  createRooms(motels);
}

function createRooms(motels) {
  const sort_list = document.querySelector(".sort_list");
  sort_list.textContent = "";
  motels.forEach((obj) => {
    const storeName = document.createElement("span");
    const rentableRooms = document.createElement("span");
    const accommodations = document.createElement("span");
    const image = document.createElement("img");
    storeName.textContent = obj.storeName;
    rentableRooms.textContent = obj.rentableRooms;
    accommodations.textContent = obj.accommodations;
    image.src = obj.image;
    const div = document.createElement("div");
    div.appendChild(image);
    div.appendChild(storeName);
    div.appendChild(rentableRooms);
    div.appendChild(accommodations);
    sort_list.appendChild(div);
  });
}

function init() {
  const asecndingSortBtn = document.querySelector(".btn_wrap .btn_wrap-ascnd");
  const descendingSortBtn = document.querySelector(".btn_wrap .btn_wrap-dscnd");
  const category5 = document.querySelector(".category5_wrap");
  const range = category5.querySelector(".range_input");

  createFilters();
  createRooms(motels);
  category1.addEventListener("click", handleCheckedOpt);
  category2.addEventListener("click", handleCheckedOpt);
  category3.addEventListener("click", handleCheckedOpt);
  category4.addEventListener("click", handleCheckedOpt);
  range.addEventListener("input", handleRangeValue);

  descendingSortBtn.addEventListener("click", handleDscndOrderBtn);
  asecndingSortBtn.addEventListener("click", handleAscndOrderBtn);
}
init();
