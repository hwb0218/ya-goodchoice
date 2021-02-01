const checkInFormatting = (dateType) => {
    return `${dateType.getFullYear()}.${dateType.getMonth() + 1}.${dateType.getDate()}`;
}

const checkOutFormatting = (dateType) => {
    return `${dateType.getFullYear()}.${dateType.getMonth() + 1}.${dateType.getDate() + 1}`
}

const groupBy = (objectArray, property) => {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        !acc[key] ? acc[key] = [obj.RESERVATION_DATE] : acc[key].push(obj.RESERVATION_DATE);
        return acc;
    }, {});
}

const getCheckInOut = (groupedRoom) => {
    const roomDates = Object.values(groupedRoom);
    return roomDates.map(roomDate => {
        const checkIn = checkInFormatting(roomDate[0]);
        const checkOut = checkOutFormatting(roomDate[roomDate.length - 1]);
        return [checkIn, checkOut];
    });
}

module.exports = {
    groupBy,
    getCheckInOut
}