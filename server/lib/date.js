const minusOneDay = (date) => {
    date.setDate(date.getDate() - 1);
    return date;
}

const formatting = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const dateFormatting = (date) => {
   return [minusOneDay, formatting]
    .reduce((a, b) => {
        return b(a);
    }, date);
}
module.exports = {
    dateFormatting
}