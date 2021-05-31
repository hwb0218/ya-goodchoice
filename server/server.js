const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionOptions = require('./lib/express-session-options');

app.set('view engine', 'pug');
app.set('views',  path.join(__dirname, '../client/views'));

app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session(sessionOptions));

app.use('/api/users', require('./routes/user'));
app.use('/api/reservation', require('./routes/reservation'));
app.use('/motel', require('./routes/motel'));
app.use('/hotel', require('./routes/hotel'));
app.use('/myPage', require('./routes/myPage'));

app.get('/', (req, res) => {
    const url = req.path;
    let render = {};
    req.session.returnTo = url;
    if (req.session.auth) {
        render['authorized'] = req.session.auth;
    }
    req.session.save(function () {
        res.render('index', render);
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

const port = 3030;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

