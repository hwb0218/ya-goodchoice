const { database } = require('../lib/database');
const User = require('../lib/User');

const auth = (req, res, next) => {
    const token = req.session.auth;
    database.query(`SELECT * FROM user WHERE token = ?`, [token], (err, users) => {
        User.findByToken(users, token, (err, user) => {
            if (err) {
                throw err;
            }
            if (!user) {
                return res.json({ isAuth: false, error: true });
            }
            req.token = token;
            req.user = user;
            next();
        });
    });
}

module.exports = { auth };