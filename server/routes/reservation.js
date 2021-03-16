const express = require('express');
const router = express.Router();
const { connection } = require('../lib/database');
const { reservation } = require('../lib/reservation');
const filterModule = require('../lib/filter');

router.get('/toMakeAReservation', (req, res) => {
    let userId;
    const selectedDates = filterModule.getObjValues(req, 'sel_date');
    const [checkIn, checkOut] = selectedDates;
    const { id, roomType } = req.query;
    const roomTypeUpperCase = roomType.toUpperCase();
    const selectUserIdQuery = 'SELECT user.id FROM user WHERE token = ?';
    const selectGroupQuery = `SELECT GROUP_OF_ROOMS FROM ${roomType}_reservation WHERE USER_ID = ? ORDER BY RESERVATION_ID DESC LIMIT 1`;
    const insertReservationQuery = `INSERT INTO ${roomType}_reservation (RESERVATION_DATE, ${roomTypeUpperCase}_ID, USER_ID, GROUP_OF_ROOMS) VALUES ?`;

    connection.getConnection().then(conn => {
        return conn.query(selectUserIdQuery, [req.session.auth])
            .then(([firstRows, fields]) => {
                conn.release();
                userId = firstRows[0].id;
                return conn.query(selectGroupQuery, [userId]);
            }).then(([secondRows, fields]) => {
                conn.release();
                const numberOfGroup = secondRows;
                const values = reservation(checkIn, checkOut, id, userId, numberOfGroup);
                return conn.query(insertReservationQuery, [values]);
            }).then(([thirdRows, fields]) => {
                conn.release();
                res.status(200).redirect('/myPage');
            }).catch(err => console.error(err));
        conn.release();
    });
});

router.post('/updateReservationDates',(req, res) => {
    let userId;
    const selectedDates = filterModule.getObjValues(req, 'sel_date');
    const [checkIn , checkOut] = selectedDates;
    const { roomId, groupOfRooms, roomType } = req.body;
    const roomTypeUpperCase = roomType.toUpperCase();
    const token = req.session.auth;
    const deleteQuery = `DELETE FROM ${roomType}_reservation WHERE GROUP_OF_ROOMS = ? AND USER_ID IN (SELECT user.id FROM user WHERE token =?)`;
    const selectUserIdQuery = 'SELECT user.id FROM user WHERE token = ?';
    const selectGroupQuery = `SELECT GROUP_OF_ROOMS FROM ${roomType}_reservation WHERE USER_ID = ? ORDER BY RESERVATION_ID DESC LIMIT 1`;
    const insertReservationQuery = `INSERT INTO ${roomType}_reservation (RESERVATION_DATE, ${roomTypeUpperCase}_ID, USER_ID, GROUP_OF_ROOMS) VALUES ?`

    connection.getConnection().then(conn => {
        return conn.query(deleteQuery, [groupOfRooms, token])
            .then(([firstRows, fields]) => {
                conn.release();
                return conn.query(selectUserIdQuery, [req.session.auth])
            })
            .then(([usersId, fields]) => {
                conn.release();
                userId = usersId[0].id;
                return conn.query(selectGroupQuery, [userId])})
            .then(([group, fields]) => {
                const numberOfGroup = group;
                const values = reservation(checkIn, checkOut, roomId, userId, numberOfGroup);
                return conn.query(insertReservationQuery, [values]);
            })
            .then(([result, fields]) => {
                res.status(200).redirect('/myPage');
            }).catch(err => console.error(err));
        conn.release();
    });
});

router.post('/reservationCancellation', (req, res) => {
    const { groupOfRooms, roomType } = req.body;
    const token = req.session.auth;
    const deleteQuery = `DELETE FROM ${roomType}_reservation WHERE GROUP_OF_ROOMS = ? AND USER_ID IN (SELECT user.id FROM user WHERE token =?)`;

    connection.getConnection().then(conn => {
        return conn.query(deleteQuery, [groupOfRooms, token])
            .then(([result, fields]) => {
                conn.release();
                res.status(200).redirect('/myPage');
            }).catch(err => console.error(err));
        conn.release();
    });
});

module.exports = router;