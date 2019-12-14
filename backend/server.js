const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require("path")

const expressSession = require('express-session')

const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 8000;

const authRouter = require('./routes/auth')
const userInViews = require('./middleware/userInViews')
const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')


const session = {
    secret: 'LoxodontaElephasMammuthusPalaeoloxodonPrimelephas',
    cookie: {},
    resave: false,
    saveUninitialized: false
}

if (app.get('env') === 'production'){
    session.cookie.secure = true
    // Uncomment the line below if your application is behind a proxy (like on Heroku)
    // or if you're encountering the error message:
    // "Unable to verify authorization request state"
    // app.set('trust proxy', 1);
}

//below: example code from article
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession(session))

//configuring passport
const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL:
            process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/callback"
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile)
    }
)


passport.use(strategy)
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser((user, done) => {
    done(null, user);
})

// adding a route, using the route

app.use(userInViews())
app.use('/', authRouter)
app.use('/', indexRouter)
app.use('/', userRouter)


app.use(cors())
app.use(express.json())


const uri = process.env.ATLAS_URI



const MongoClient = require('mongodb').MongoClient;
const uri = process.env.ATLAS_URI // make sure to set this value
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    client.close();
});

//fix the mongodb implementation
// perform actions on the collection object
//examples below




app.listen(port, () => {
    console.log(`Server is running at port ${port}`)
}) // this starts the server, listens on certain port
