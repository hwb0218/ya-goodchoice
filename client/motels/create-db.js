const fs = require("fs");

function readOptions(f) {
  return fs.readFileSync(f, "utf8").split("\n");
}

// function getOnce(iter, cnt = 1) {
//   if (iter.length === 0) {
//     return;
//   }
//
//   return iter.splice(. 0, cnt)[0];
// }
// const shift = (iter, cnt = 1) => iter.splice(0, cnt)[0];
const shift = (iter) => iter.shift();

function shuffle(iter) {
  const copy = Array.prototype.slice.call(iter); // 인자를 array로 변환하겠다.
  return copy.sort(() => 0.5 - Math.random());
}

function sample(iter, cnt) {
  const len = iter.length;
  if (!cnt) {
    cnt = Math.floor(Math.random() * len);
  }
  return shuffle(iter).slice(0, cnt);
}

function limitPrice(limit = 100) {
  return Math.floor(Math.random() * limit);
}

function randomPrice(min, max) {
  return Math.floor((Math.random() * (max - min)) / 1000) * 1000 + min;
}
// console.log(randomPrice(30000, 60000));

const motelNames = readOptions("motel_names.txt", "utf8");
const option1 = readOptions("option_1.txt", "utf8");
const option2 = readOptions("option_2.txt", "utf8");
const option3 = readOptions("option_3.txt", "utf8");

const motels = [];
const shuffleMotelNames = shuffle(motelNames);
for (let i = 0; i < 10; i++) {
  const storeName = shift(shuffleMotelNames) || "noname";
  const price1 = limitPrice(5) === 1 ? 0 : randomPrice(randomPrice(10000, 30000), randomPrice(30000, 40000)); // 대실
  const price2 = limitPrice(100) === 1 ? 0 : randomPrice(randomPrice(30000, 50000), randomPrice(50000, 70000)); // 숙박
  const opt1 = sample(option1, undefined);
  const opt2 = sample(option2, undefined);
  const opt3 = sample(option3, undefined);
  const image = "";
  motels.push({ storeName, price1, price2, opt1, opt2, opt3, image });
}

console.log(motels);
