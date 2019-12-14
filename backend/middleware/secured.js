// secured.js
// simply checks if the user is logged in

module.exports = function () {
    return function secured (req, res, next) {
        if (req.user) { return next();}
        req.session.returnTo = req.originalUrl
        res.redirect('/login')
    }
}