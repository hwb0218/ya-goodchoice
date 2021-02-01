const express = require('express');
const router = express.Router();
const { connection } = require('../lib/database');
const filter = require('../lib/filter');
const date = require('../lib/date');

router.get('/', (req, res) => {
    connection.getConnection().then(conn => {
        return conn.query('SELECT * FROM motel_filter').then(([filterData, fields]) => {
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
                return conn.query(query.join(''), params)
                    .then(([motel, fields]) => {
                        render['motel'] = motel;
                        const endPoint = req.path;
                        req.session.returnTo = endPoint;
                        if (req.session.auth) {
                            render['authorized'] = req.session.auth;
                        }
                        req.session.save(function () {
                            res.render('motel', render);
                        });
                    });
                conn.release();
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
            return conn.query(query.join(''), params)
                .then(([motel, fields]) => {
                    render['motel'] = motel;
                    const endPoint = req.path;
                    req.session.returnTo = endPoint;
                    if (req.session.auth) {
                        render['authorized'] = req.session.auth;
                    }
                    req.session.save(function () {
                        res.render('motel', render);
                    });
                });
        });
        conn.release();
    });
});

module.exports = router;