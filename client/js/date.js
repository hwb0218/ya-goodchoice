const firstDatePicker = document.querySelector('input[name = sel_date]');
const secondDatePicker = document.querySelector('input[name = sel_date2]');

const plusOneDay = (date) => {
    date.setDate(date.getDate() + 1);
    return date;
}

const lessThanTen = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
}

const formatting = (date) => {
    const years = date.getFullYear();
    const months = date.getMonth() + 1;
    const dates = date.getDate();
    return `${years}-${lessThanTen(months)}-${lessThanTen(dates)}`;
}

const inArrayOfDates = (datePicker) => {
    return datePicker.value.split("-");
}

const compareDates = (checkIn, checkOut = 0) => {
    const [checkInYear, checkInMonth, checkInDate] = checkIn.map(x => x);
    const [checkOutYear, checkOutMonth, checkOutDate] = checkOut.map(x => x);

    return ((checkInYear > checkOutYear)
        || (checkInYear === checkOutYear && checkInMonth > checkOutMonth)
        || (checkInDate >= checkOutDate));
}

function handleClick(e) {
    const checkIn = inArrayOfDates(firstDatePicker);
    const checkOut = inArrayOfDates(secondDatePicker);
    const checkOutValue = plusOneDay(new Date(e.target.value));
    secondDatePicker.setAttribute('min', formatting(checkOutValue));

    if (compareDates(checkIn, checkOut)) {
        secondDatePicker.value = formatting(checkOutValue);
    }
}

firstDatePicker.addEventListener('input', handleClick);