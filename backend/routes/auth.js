
// EXAMPLE AUTH PAGE
var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');

dotenv.config();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), function (req, res) {
    res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/user');
        });
    })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
    req.logout();

    var returnTo = req.protocol + '://' + req.hostname;
    var port = req.connection.localPort;
    if (port !== undefined && port !== 80 && port !== 443) {
        returnTo += ':' + port;
    }

    var logoutURL = new url.URL(
        util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
    );
    var searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    });
    logoutURL.search = searchString;

    res.redirect(logoutURL);
});

module.exports = router;










// OG ADI AUTH PAGE
//
// var express = require('express');
// const router = express.Router();
// var passport = require('passport')
// var dotenv = require('dotenv')
//
// const util = require('util'); // node utility functions, encoding strings, etc.
// const url = require('url'); // url resolution & parsing
// const querystring = require("querystring"); // parsing url query strings
//
// dotenv.config()
//
//
// // updating the GET login endpoint with 2 callback functions, 1 for passport authentication and a custom one that redirects
// router.get('/login',
//     passport.authenticate("auth0", {scope: "openid email profile"}),
//     (req, res) => {
//         res.redirect("/")
//     })
//
// router.get('/callback',(req, res, next)=>{
//     passport.authenticate('auth0', (err, user, info)=>{
//         if (err) {
//             return next(err)
//         }
//         if (!user) {
//             return res.redirect('/login')
//         }
//         req.logIn(user, (err)=>{
//             if(err) {
//                 return next(err)
//             }
//             const returnTo = req.session.returnTo
//             delete req.session.returnTo
//             res.redirect(returnTo || '/')
//         })
//     })(req, res, next)
// })
//
// /*
// The GET logout endpoint leverages different Node APIs to dynamically build a logout path depending on the active
// Node environment, the port that the server is using, and the configuration variables.
//  */
// router.get('/logout', (req, res)=>{
//     req.logOut(); // clears user property and login session
//
//     let returnTo = req.protocol + '://' + req.hostname
//     const port = req.connection.localPort;
//
//     if (port !== undefined && port !== 80  && port !==433){
//         returnTo =
//             process.env.NODE_ENV === "production"
//                 ? `${returnTo}/`
//                 : `${returnTo}:${port}/`;
//     }
//
//     const logoutURL = new url.URL(util.format("https://%s/logout", process.env.AUTH0_DOMAIN));
//
//     const searchString = querystring.stringify({
//         client_id: process.env.AUTH0_CLIENT_ID,
//         returnTo: returnTo
//     });
//     logoutURL.search = searchString;
//
//     res.redirect(logoutURL)
// })
//
// module.exports = router