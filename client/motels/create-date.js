function dateSorting() {
    const a = genRandomDate();
    let b = genRandomDate();
    const date1 = new Date(a);
    let date2 = new Date(b);

    while(date1.toDateString() === date2.toDateString()) {
        b = genRandomDate();
        date2 = new Date(b);
    }
    return date1 < date2 ? [a, b] : [b, a];
}

function genRandomDate() {
    const month = [10, 11];
    const day = [31, 30];
    const minDay = 1;

    const randomMonth = Math.floor(Math.random() * (month[month.length - 1] - month[0] + 1)) + month[0];
    const randomDay = Math.floor(Math.random() * (day[month.indexOf(randomMonth)] - minDay + 1)) + minDay;

    return `2020-${randomMonth}-${randomDay}`
}

function genMotelId(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

for (let i = 1; i <= 10; i++) {
    const date = dateSorting();
    const text =  `INSERT INTO reservation (RESERVATION_ID, RESERVATION_STARTDATE, RESERVATION_ENDDATE, MOTEL_ID)
    VALUES ('${i}', '${date[0]}', '${date[1]}', '${genMotelId(1, 5)}');`;
    console.log(text);
}
