const express = require('express');
const router = express.Router();
const { connection } = require('../lib/database');
const { groupBy, getCheckInOut } = require('../lib/myPageOptions');
// Left Join 후 query 간소화 하기
router.get('/', (req, res) => {
    const token = req.session.auth;
    const hotelListQuery = 'SELECT HOTEL_ID, HOTEL_NAME, HOTEL_IMAGE, ROOM_TYPE FROM hotel WHERE HOTEL_ID IN (SELECT HOTEL_ID FROM hotel_reservation WHERE USER_ID IN (SELECT user.id FROM user WHERE token = ?))';
    const motelListQuery = 'SELECT MOTEL_ID, MOTEL_NAME, MOTEL_IMAGE, ROOM_TYPE FROM motel WHERE MOTEL_ID IN (SELECT MOTEL_ID FROM motel_reservation WHERE USER_ID IN (SELECT user.id FROM user WHERE token = ?))';
    const getDatesOfHotel = 'SELECT RESERVATION_DATE, HOTEL_ID FROM hotel_reservation WHERE USER_ID IN (SELECT user.id FROM user WHERE token = ?)';
    const getDatesOfMotel = 'SELECT RESERVATION_DATE, MOTEL_ID FROM motel_reservation WHERE USER_ID IN (SELECT user.id FROM user WHERE token = ?)';
    let hotelList, motelList, hotelReservationDate, motelReservationDate, allRooms, groupedHotel, hotelCheckInOut;
    connection.getConnection().then(conn => {
        return conn.query(hotelListQuery, [token])
            .then(([firstRows, fields]) => {
                hotelList = firstRows;
                return conn.query(motelListQuery, [token])
            })
            .then(([secondRows, fields]) => {
                motelList = secondRows;
                allRooms = motelList.concat(hotelList);
                return conn.query(getDatesOfHotel, [token])
            })
            .then(([thirdRows, fields]) => {
                hotelReservationDate = thirdRows;
                groupedHotel = groupBy(hotelReservationDate, 'HOTEL_ID');
                hotelCheckInOut = getCheckInOut(groupedHotel);
                return conn.query(getDatesOfMotel, [token])
            })
            .then(([fourthRows, fields]) => {
                motelReservationDate = fourthRows;
                const groupedMotel = groupBy(motelReservationDate, 'MOTEL_ID');
                const motelCheckInOut = getCheckInOut(groupedMotel);
                const allRoomsCheckInOut = motelCheckInOut.concat(hotelCheckInOut);
                const arrayToObj = allRoomsCheckInOut.map(([checkIn, checkOut]) => ({checkIn, checkOut}));
                allRooms.forEach((x, i) => {
                    x.checkIn = arrayToObj[i].checkIn;
                    x.checkOut = arrayToObj[i].checkOut;
                });
                const endPoint = req.path;
                req.session.returnTo = endPoint;
                if (req.session.auth) {
                    allRooms['authorized'] = req.session.auth;
                }
                req.session.save(function () {
                    res.render('myPage', { allRooms });
                });
            })
            .catch(err => {
                return res.status(400).json({ success: false, err });
            });
        conn.release();
    });
});

module.exports = router;