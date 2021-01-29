const express = require('express');
const router = express.Router();
const { connection } = require('../lib/database');
const { reservation } = require('../lib/reservation');
const filterModule = require('../lib/filter');

router.get('/toMakeAReservation', (req, res) => {
    console.log(req.query);
    const selectedDates = filterModule.getObjValues(req, 'sel_date'); // filter(x => x)
    const [checkIn, checkOut] = selectedDates;
    const { id, roomType } = req.query;
    const roomTypeUpperCase = roomType.toUpperCase();
    const selectQuery = 'SELECT user.id FROM user WHERE token = ?';
    const insertQuery = `INSERT INTO ${roomType}_reservation (RESERVATION_DATE, ${roomTypeUpperCase}_ID, USER_ID) VALUES ?`;
    connection.getConnection().then(conn => {
        return conn.query(selectQuery, [req.session.auth])
            .then(([userId, fields]) => {
                const values = reservation(checkIn, checkOut, id, userId[0].id);
                return conn.query(insertQuery, [values])
            }).then(([result, fields]) => {
                res.status(200).redirect('/myPage');
        })
        conn.release();
    })
    // connection.query(`SELECT user.id FROM user WHERE token = ?`, [req.session.auth], (err ,userId) => {
    //     console.log(userId);
    //     const values = reservation(checkIn, checkOut, id, userId[0].id);
    //     connection.query(`INSERT INTO ${roomType}_reservation (RESERVATION_DATE, ${roomTypeUpperCase}_ID, USER_ID) VALUES ?`, [values], (err, result) => {
    //         res.status(200).redirect('/mypage');
    //     });
    // });
});

router.post('/updateReservationDates',(req, res) => {
    const selectedDates = filterModule.getObjValues(req, 'sel_date');
    const [checkIn , checkOut] = selectedDates;
    console.log(checkIn, checkOut);
    const { roomId, roomType } = req.body;
    const roomTypeUpperCase = roomType.toUpperCase();
    const token = req.session.auth;
    const deleteQuery = `DELETE FROM ${roomType}_reservation WHERE ${roomTypeUpperCase}_ID = ? AND USER_ID IN (SELECT user.id FROM user WHERE token =?)`;
    const insertQuery = `INSERT INTO ${roomType}_reservation (RESERVATION_DATE, ${roomTypeUpperCase}_ID, USER_ID) VALUES ?`
    // INSERT INTO QUERY 작업하기
    connection.getConnection().then(conn => {
        return conn.query(deleteQuery, [roomId, token]);
    }).then(([firstRows, fields]) => {
    }).catch(err => {
    });
    // connection.query(deleteQuery, [roomId, token], (err, result1) => {
    //     // const values = reservation(checkIn, checkOut, roomId)
    //     // connection.query(insertQuery, [values], (err, result2) => {
    //     //
    //     // })
    //     res.status(200).redirect('/myPage');
    // });
});

module.exports = router;