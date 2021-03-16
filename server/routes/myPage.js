const express = require('express');
const router = express.Router();
const { connection } = require('../lib/database');
const { getCheckInOut } = require('../lib/myPageOptions');

router.get('/', (req, res) => {
    const token = req.session.auth;
    const hotel = 'SELECT HOTEL_NAME, GROUP_OF_ROOMS, hotel_reservation.HOTEL_ID, HOTEL_IMAGE, ROOM_TYPE, MIN(RESERVATION_DATE) AS CHECK_IN, MAX(RESERVATION_DATE) AS CHECK_OUT FROM hotel_reservation LEFT JOIN hotel ON hotel_reservation.HOTEL_ID = hotel.HOTEL_ID WHERE USER_ID IN (SELECT user.id FROM user WHERE token = ?) GROUP BY GROUP_OF_ROOMS';
    const motel = 'SELECT MOTEL_NAME, GROUP_OF_ROOMS, motel_reservation.MOTEL_ID, MOTEL_IMAGE, ROOM_TYPE, MIN(RESERVATION_DATE) AS CHECK_IN, MAX(RESERVATION_DATE) AS CHECK_OUT FROM motel_reservation LEFT JOIN motel ON motel_reservation.MOTEL_ID = motel.MOTEL_ID WHERE USER_ID IN (SELECT user.id FROM user WHERE token = ?) GROUP BY GROUP_OF_ROOMS';
    let hotelList, motelList;
    connection.getConnection().then(conn => {
        return conn.query(hotel, [token])
            .then(([firstRows, fields]) => {
                conn.release();
                hotelList = getCheckInOut(firstRows);
                return conn.query(motel, [token])
        }).then(([secondRows, fields]) => {
            conn.release();
            motelList = getCheckInOut(secondRows);

            const allList = motelList.concat(hotelList);
            const render = { allList }
            if (req.session.auth) {
                render['authorized'] = req.session.auth;
            }
            req.session.save(function () {
                res.render('myPage', render);
            });
        }).catch(err => {
            return res.status(400).json({ success: false, err });
        })
        conn.release();
    });
});

module.exports = router;