const { database } = require('./database');
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
        database.query(`UPDATE user SET token = ? where email = ?`, [token, user.email], (err, x) => {
          if (err) {
              return cb(err);
          }
          cb(null, user);
        });
    });
}

exports.findByToken = function (users, token, cb) {
    jwt.verify(token, 'secretToken', function (err, decoded) {
        users.map(user => {
           database.query(`SELECT * FROM user WHERE email = ? AND token = ?`, [decoded, user.token], (err, user) => {
               if (err) {
                   return cb(err);
               }
               cb(null, user[0]);
           });
        });
    });
}