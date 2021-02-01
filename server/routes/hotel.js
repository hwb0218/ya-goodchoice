const express = require('express');
const router = express.Router();
const { connection } = require('../lib/database');
const filter = require('../lib/filter');
const date = require('../lib/date');

router.get('/', (req, res) => {
    connection.getConnection().then(conn => {
        return conn.query('SELECT * FROM hotel_filter').then(([filterData, fields]) => {
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
                return conn.query(query.join(''), params)
                    .then(([hotel, fields]) => {
                        render['hotel'] = hotel;
                        const endPoint = req.path;
                        req.session.returnTo = endPoint;
                        if (req.session.auth) {
                            render['authorized'] = req.session.auth;
                        }
                        req.session.save(function () {
                            res.render('hotel', render);
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

            connection.query(query.join(''), params, (err, hotel) => {
                if (err) {
                    res.send(err);
                }
                render['hotel'] = hotel;
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
})

module.exports = router;