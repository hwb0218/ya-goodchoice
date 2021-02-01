const { connection } = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.comparePassword = function (plainPassword, users, cb) {
    users.map(user => {
        bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    });
}

exports.generateToken = function (users, cb) {
    users.map(user => {
        const token = jwt.sign(user.email, 'secretToken');
        user.token = token;
        connection.getConnection().then(conn => {
            return conn.query('UPDATE user SET token = ? where email = ?', [token, user.email])
                .then(([rows, fields]) => {
                    cb(null, user);
                }).catch(err => cb(err));
            conn.release();
        });
    });
}

exports.findByToken = function (users, token, cb) {
    jwt.verify(token, 'secretToken', function (err, decoded) {
        users.map(user => {
            connection.getConnection().then(conn => {
                return conn.query('SELECT * FROM user WHERE email = ? AND token = ?', [decoded, user.token])
                    .then(([rows, fields]) => {
                        cb(null, user[0]);
                    }).catch(err => cb(err));
                conn.release();
            });
        });
    });
}