const isNotFilledZero = (n) => {
    return n < 10 ? `0${n}` : `${n}`;
}

const formatter = (d) => {
    return `${d.getFullYear()}-${isNotFilledZero(d.getMonth() + 1)}-${isNotFilledZero(d.getDate())}`;
}

const reservation = (checkIn, checkOut, id, userId, group) => {
    const result = [];
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);

    let numberOfGroup;
    group.length === 0 ? numberOfGroup = 0 : numberOfGroup = group[0].GROUP_OF_ROOMS + 1;

    while (date1.toDateString() !== date2.toDateString()) {
        result.push(formatter(date1));
        date1.setDate(date1.getDate() + 1);
    }
    return result.map(x => [x, id, userId, numberOfGroup]);
}

module.exports = {
    reservation
};