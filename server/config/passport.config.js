const { User } = require('../model/payMeModel')
const bcrypt = require('bcrypt')
const LocalStrategy = require("passport-local").Strategy;


module.exports = function (passport) {

    // This localStrat is what gets ran when we login - and use passport.authenticate. - you may have to modify this slightly if youre using email to login or something
    passport.use(
        new LocalStrategy((username, password, done) => {
            console.log('username', username)
            User.findOne({ username: username }, (err, foundUser) => {
                if (err) return done(null, err);
                if (!foundUser) return done(null, false, { message: 'Incorrect password.' });
                if (!bcrypt.compareSync(password, foundUser.password)) return done(null, false, { message: 'Incorrect password' });
                return done(null, foundUser)
            })
        })
    )

    // serialize user - middleware of controller methods - create a user cookie - store it in the users browser for auth later... 
    passport.serializeUser((user, done) => {
        done(null, user._id) // returns 2nd arg => done is saying == return and proceed with whatever function called this.
    })

    //deserialize user - middleware of controller methods - take a user cookie... read it - return the data
    passport.deserializeUser((_id, done) => {
        User.findOne({ _id: _id }, (err, aUser) => {
            // Note we could return the whole 'aUser' here - but that would be the full user document from Mongo on EVERY Auth check.
            // it makes more sense/security to only return the data that would be useful to pull from a cookie ( username & mongo _id)
            const cookie = {
                username: aUser.username,
                _id: aUser._id
            }
            done(err, cookie) // returns 2nd arg => done is saying == return and proceed with whatever function called this.
        })
    })

}
