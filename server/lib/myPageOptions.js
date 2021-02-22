const checkInFormatting = (dateType) => {
    return `${dateType.getFullYear()}.${dateType.getMonth() + 1}.${dateType.getDate()}`;
}

const checkOutFormatting = (dateType) => {
    return `${dateType.getFullYear()}.${dateType.getMonth() + 1}.${dateType.getDate() + 1}`
}

const getCheckInOut = (reservationLists) => {
    return reservationLists.map((list) => {
        const { CHECK_IN, CHECK_OUT } = list;
        list.CHECK_IN = checkInFormatting(CHECK_IN);
        list.CHECK_OUT = checkOutFormatting(CHECK_OUT);
        return list;
    });
}

module.exports = {
    getCheckInOut
}