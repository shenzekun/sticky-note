var express = require('express');
var router = express.Router();

var passport = require('passport');

var GitHubStrategy = require('passport-github').Strategy;


passport.serializeUser(function (user, done) {
    console.log('---serializeUser---')
    console.log(user)
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log('---deserializeUser---')
    done(null, obj);
});

passport.use(new GitHubStrategy({
        clientID: '464a82e317f2875fc602',
        clientSecret: '068edebef15daf603a02ef4b07c51e2f8455ac8b',
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
        cb(null, profile);
    }
));




router.get('/github', passport.authenticate('github'));


router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        req.session.user = {
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
        };
        console.log("success");
        // Successful authentication, redirect home.
        res.redirect('/');
    });


router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
})


module.exports = router;