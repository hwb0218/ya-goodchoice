const express = require('express');
const router = express.Router();
const { database } = require('../lib/database');
const { reservation } = require('../lib/reservation');

router.post('/updateReservationDates',(req, res) => {
    const token = req.session.auth;
    const { roomType, roomId } = req.body;
    const roomTypeUpperCase = roomType.toUpperCase();
    const query = `DELETE FROM ${roomType}_reservation WHERE ${roomTypeUpperCase}_ID = ? AND USER_ID IN (SELECT user.id FROM user WHERE token =?)`;
    database.query(query, [roomId, token], (err, result) => {
        res.status(200).redirect('/mypage');
    });
});

module.exports = router;

// DELETE FROM ${roomType}_reservation WHERE ${roomTypeUpperCase}_ID = ? AND USER_ID IN (SELECT user.id FROM user WHERE token =?)
// SELECT * FROM ${roomType}_reservation WHERE ${roomTypeUpperCase}_ID = 1 AND USER_ID IN (SELECT user.id FROM user WHERE token = 'eyJhbGciOiJIUzI1NiJ9.YXJpQG5hdmVyLmNvbQ.Zd82SeMjXcDSJP1JDXcaK1xZcVYK0np91-k2-JdfFxo')