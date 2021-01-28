const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { database } = require('../lib/database');
const User = require('../lib/User');
const filter = require('../lib/filter');
const { reservation } = require('../lib/reservation');
const { auth } = require('../middleware/auth');

router.get('/reservation', (req, res) => {
    const selectedDate = filter.getObjValues(req, 'sel_date').filter(x => x);
    const checkIn = selectedDate[0];
    const checkOut = selectedDate[1];
    const id = req.query.id;
    database.query(`SELECT user.id FROM user WHERE token = ?`, [req.session.auth], (err ,data) => {
        const values = reservation(checkIn, checkOut, id, data[0].id);
        const roomType = req.query.roomType;
        const roomTypeUpperCase = roomType.toUpperCase();
        database.query(`INSERT INTO ${roomType}_reservation (RESERVATION_DATE, ${roomTypeUpperCase}_ID, USER_ID) VALUES ?`, [values], (err, result) => {
            const reDirUrl = req.session.returnTo;
            res.status(200).redirect(reDirUrl);
        });
    });
});



router.post('/register', (req, res) => {
    const request = req.body;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            return res.send(err);
        }
        bcrypt.hash(request.password, salt, (err, hash) => {
            if (err) {
                return res.send(err);
            }
            request.password = hash;
            database.query(`INSERT INTO user (email, password, name) VALUES (?, ?, ?)`,
                [request.email, request.password, request.name],
                (err, users) => {
                    if (err) {
                        return res.status(400).json({
                            success: false, err
                        });
                    }
                    return res.status(200).redirect('/');
                }
            );
        });
    });
});

router.post('/login', (req, res) => {
    const request = req.body;
    database.query(`SELECT * FROM user WHERE email = ?`, [request.email], (err, users) => {
        if (users.length === 0) {
            return res.json({ success: false, message: '제공 된 이메일에 해당하는 유저가 없습니다.' });
        }
        User.comparePassword(request.password, users,function (err, isMatch) {
            if(!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
            }
            User.generateToken(users, function (err, user) {
                if (err) {
                    return res.status(400).send(err);
                }
                req.session.auth = user.token;
                const reDirUrl = req.session.returnTo;
                req.session.save(function () {
                    res.status(200).redirect(reDirUrl);
                });
            });
        });
    });
});

router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        id : req.user.id,
        email : req.user.email,
        name: req.user.name
    });
});

router.get('/logout', auth, (req, res) => {
    database.query(`UPDATE user SET token = ? WHERE email = ?`, [null, req.user.email], (err, user) => {
        if (err) {
            return res.json({ success: false, err });
        }
        const reDirUrl = req.session.returnTo;
        delete req.session.auth;
        return res.status(200).redirect(reDirUrl);
    });
});

module.exports = router;