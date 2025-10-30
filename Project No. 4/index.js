const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const helmet = require('helmet');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { body, validationResult } = require('express-validator');
const db = require('./queries'); 
const app = express();
const port = 3000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username === 'user' && password === 'pass') {
            return done(null, { username });
        } else {
            return done(null, false);
        }
    }
));
app.use(passport.initialize());

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'Permission denied' });
    }
}

app.post('/users', [
    body('name').isString(),
    body('email').isEmail()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    db.createUser(req, res);
});

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.put('/users/:id', isAdmin, db.updateUser);
app.delete('/users/:id', isAdmin, db.deleteUser);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});