const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { connection } = require('../lib/database');
const User = require('../lib/User');
const { auth } = require('../middleware/auth');

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
            connection.query(`INSERT INTO user (email, password, name) VALUES (?, ?, ?)`,
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
    connection.query(`SELECT * FROM user WHERE email = ?`, [request.email], (err, users) => {
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
    connection.query(`UPDATE user SET token = ? WHERE email = ?`, [null, req.user.email], (err, user) => {
        if (err) {
            return res.json({ success: false, err });
        }
        const reDirUrl = req.session.returnTo;
        delete req.session.auth;
        return res.status(200).redirect(reDirUrl);
    });
});

module.exports = router;