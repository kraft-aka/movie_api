const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models');
const passportJWT = require('passport-jwt');


let Users = Models.User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

// basic HTTP authentication for login requests
passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
}, (username, password, callback) => {
    console.log(username + ' '+ password);
    Users.findOne({ Username: username }, (error, user)=> { // Mongoose used to check the username in DB
        if (error) {
            console.log(error);
            return callback(error);
        }

        if(!user) {
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username.'});
        }

        if(!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null,false, {message:'Incorrect password.'})
        }

        console.log('finished');
        return callback(null, user);
    });
}));

// authentication of users based on JWT
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error)=> {
            return callback(error)
        });
}));