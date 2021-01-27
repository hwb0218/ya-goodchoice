const express = require('express');
const router = express.Router();
const { database } = require('../lib/database');

router.post('/updateReservationDates',(req, res) => {
    console.log(req.body);
    // database.query(`UPDATE SET WHERE`)
});

module.exports = router;
