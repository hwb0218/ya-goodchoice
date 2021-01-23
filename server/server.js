const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const filter = require('../client/lib/filter');
const date = require('../client/lib/date');
const { database } = require('./lib/database');
const session = require('express-session');
const sessionOptions = require('./lib/express-session-options');
app.set('view engine', 'pug');
app.set('views',  path.join(__dirname, '../client/pages'));
app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(sessionOptions));
app.use('/api/users', require('./routes/user'));


const isLoggedIn = (req, res, viewFile, render) => {
    const url = req.path;
    req.session.returnTo = url;
    if (req.session.auth) {
        render['authorized'] = req.session.auth;
    }
    req.session.save(function () {
        res.render(viewFile, render);
    });
}

app.get('/', (req, res) => {
    isLoggedIn(req, res, 'index', {});
});

app.get('/pug/motel', (req, res) => {
    database.query(`SELECT * FROM motel_filter`, (err, filterData) => {
        let query = [];
        let params = [];
        const category1 = filter.findACategory(filterData, '예약');
        const category2 = filter.findACategory(filterData, '이색테마');
        const category3 = filter.findACategory(filterData, '스파시설');
        const category4 = filter.findACategory(filterData, '놀이시설');

        const path = req.path;
        const checkedOption = filter.getCategory(req, 'category');
        const checked = filter.getObjValues(req, 'category');
        const price = filter.getObjValues(req, 'price');
        const [minPrice, maxPrice] = price.map(Number);
        const selectedDate = filter.getObjValues(req, 'sel_date').filter(x => x);
        const checkIn = selectedDate[0];
        const checkOut = date.dateFormatting(new Date(selectedDate[1]));
        const sort = req.query.sort;

        let render = { filterData, category1, category2, category3, category4, checked, selectedDate, path };

        const defaultQuery = "SELECT MOTEL_NAME, MOTEL_OPTION, MOTEL_RENTPRICE, MOTEL_ACCOMMOPRICE, MOTEL_IMAGE FROM motel";
        const priceQuery = " WHERE (MOTEL_ACCOMMOPRICE BETWEEN ? AND ?)";
        const optionQuery = " AND regexp_like(concat(',', MOTEL_OPTION,','), ?)";
        const ascSortQuery = " ORDER BY MOTEL_ACCOMMOPRICE ASC";
        const descSortQuery = " ORDER BY MOTEL_ACCOMMOPRICE DESC";
        const selectDateQuery = " WHERE MOTEL_ID NOT IN (SELECT MOTEL_ID FROM motel_reservation WHERE RESERVATION_DATE BETWEEN ? AND ?)";
        const replacePrice = priceQuery.replace('WHERE', 'AND');

        query = [...query, defaultQuery];
        if (!price.length) {
            render = {...render, price};

            database.query(query.join(''), params, (err, motel) => {
                render['motel'] = motel;
                isLoggedIn(req, res, 'motel', render);
            });
            return;
        }
        render = {...render, price};
        if (selectedDate.length) {
            query = [...query, selectDateQuery, replacePrice];
            params = [...params, checkIn, checkOut, minPrice, maxPrice];
        } else {
            query = [...query, priceQuery];
            params = [...params, minPrice, maxPrice];
        }

        if (checkedOption) {
            query = [...query, optionQuery];
            params = [...params, checkedOption];
        }

        if (sort) {
            const sq = (sort === 'LOWPRICE') ? ascSortQuery : descSortQuery;
            query = [...query, sq];
            render = {...render, sort};
        }

        database.query(query.join(''), params, (err, motel) => {
            if (err) {
                res.send(err);
            }
            render['motel'] = motel;
            isLoggedIn(req, res, 'motel', render);
        });
    });
});

app.get('/pug/hotel', (req, res) => {
    database.query(`SELECT * FROM hotel_filter`, (err, filterData) => {
        let query = [];
        let params = [];

        const category1 = filter.findACategory(filterData, '호텔 유형');
        const category2 = filter.findACategory(filterData, '공용시설');
        const category3 = filter.findACategory(filterData, '객실 내 시설');
        const category4 = filter.findACategory(filterData, '기타');

        const path = req.path;
        const checkedOption = filter.getCategory(req, 'category');
        const checked = filter.getObjValues(req, 'category');
        const price = filter.getObjValues(req, 'price');
        const [minPrice, maxPrice] = price.map(Number);
        const selectedDate = filter.getObjValues(req, 'sel_date').filter(x => x);
        const checkIn = selectedDate[0];
        const checkOut = date.dateFormatting(new Date(selectedDate[1]));
        const sort = req.query.sort;

        let render = { filterData, category1, category2, category3, category4, checked, selectedDate, path };

        const defaultQuery = "SELECT HOTEL_NAME, HOTEL_OPTION, HOTEL_PRICE, HOTEL_IMAGE FROM hotel";
        const priceQuery = " WHERE (HOTEL_PRICE BETWEEN ? AND ?)";
        const optionQuery = " AND regexp_like(concat(',', HOTEL_OPTION,','), ?)";
        const ascSortQuery = " ORDER BY HOTEL_PRICE ASC";
        const descSortQuery = " ORDER BY HOTEL_PRICE DESC";
        const selectDateQuery = " WHERE HOTEL_ID NOT IN (SELECT HOTEL_ID FROM hotel_reservation WHERE RESERVATION_DATE BETWEEN ? AND ?)";
        const replacePrice = priceQuery.replace('WHERE', 'AND');

        query = [...query, defaultQuery];
        if (!price.length) {
            render = {...render, price};

            database.query(query.join(''), params, (err, hotel) => {
                render['hotel'] = hotel;
                isLoggedIn(req, res, 'hotel', render);
            });
            return;
        }

        render = {...render, price};
        if (selectedDate.length) {
            query = [...query, selectDateQuery, replacePrice];
            params = [...params, checkIn, checkOut, minPrice, maxPrice];
        } else {
            query = [...query, priceQuery];
            params = [...params, minPrice, maxPrice];
        }

        if (checkedOption) {
            query = [...query, optionQuery];
            params = [...params, checkedOption];
        }

        if (sort) {
            const sq = (sort === 'LOWPRICE') ? ascSortQuery : descSortQuery;
            query = [...query, sq];
            render = {...render, sort};
        }

        database.query(query.join(''), params, (err, hotel) => {
            if (err) {
                res.send(err);
            }
            render['hotel'] = hotel;
            isLoggedIn(req, res, 'hotel', render);
        });
    })
})

app.get('/register', (req, res) => {
    fs.readFile('./client/views/register.html', 'utf8', (err, data) => {
        if (err) {
            return res.send(err);
        }
        res.send(data);
    });
});

app.get('/login', (req, res) => {
    fs.readFile('./client/views/login.html', 'utf8', (err, data) => {
        if (err) {
            return res.send(err);
        }
        res.send(data);
    });
});


app.get('/motel', (req, res) => {
    fs.readFile('./client/views/motel.html', 'utf8', (err, data) => {
        if (err) {
            return res.send(err);
        }
        res.send(data);
    });
});


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

app.get('/mypage', (req, res) => {
    const token = req.session.auth;
    const hotelListQuery = 'SELECT HOTEL_NAME, HOTEL_IMAGE FROM hotel WHERE HOTEL_ID IN (SELECT HOTEL_ID FROM hotel_reservation WHERE USER_ID IN (SELECT user.id FROM user WHERE token = ?))';
    const motelListQuery = 'SELECT MOTEL_NAME, MOTEL_IMAGE FROM motel WHERE MOTEL_ID IN (SELECT MOTEL_ID FROM motel_reservation WHERE USER_ID IN (SELECT user.id FROM user WHERE token = ?))';
    const getDatesOfHotel = 'SELECT RESERVATION_DATE, HOTEL_ID FROM hotel_reservation WHERE USER_ID IN (SELECT user.id FROM user WHERE token = ?)';
    const getDatesOfMotel = 'SELECT RESERVATION_DATE, MOTEL_ID FROM motel_reservation WHERE USER_ID IN (SELECT user.id FROM user WHERE token = ?)';
    database.query(hotelListQuery, [token], (err, hotelList) => {
        database.query(motelListQuery, [token], (err, motelList) => {
            const allRooms = motelList.concat(hotelList);
            database.query(getDatesOfHotel, [token], (err, hotelReservationDate) => {
                const groupedHotel = groupBy(hotelReservationDate, 'HOTEL_ID');
                const hotelCheckInOut = getCheckInOut(groupedHotel);
                database.query(getDatesOfMotel, [token], (err, motelReservationDate) => {
                    const groupedMotel = groupBy(motelReservationDate, 'MOTEL_ID');
                    const motelCheckInOut = getCheckInOut(groupedMotel);
                    const allRoomsCheckInOut = motelCheckInOut.concat(hotelCheckInOut);
                    const arrayToObj = allRoomsCheckInOut.map(([checkIn, checkOut]) => ({checkIn, checkOut}));
                    allRooms.forEach((x, i) => {
                        x.checkIn = arrayToObj[i].checkIn;
                        x.checkOut = arrayToObj[i].checkOut;
                    });
                    isLoggedIn(req, res, 'mypage', { allRooms });
                });
            });
        });
    });
});

const port = 3030;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

