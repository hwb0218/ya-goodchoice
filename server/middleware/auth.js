const { connection } = require('../lib/database');

const auth = (req, res, next) => {
    const token = req.session.auth;
    connection.getConnection().then(conn => {
        return conn.query('SELECT * FROM user WHERE token = ?', [token])
            .then(([user, fields]) => {
                if (!user) {
                    return res.json({ isAuth: false, error: true });
                }
                req.token = token;
                req.user = user;
                next();
            }).catch(err => {
                throw err
            });
    });
}

module.exports = { auth };