require('dotenv').config()
const express = require('express');
const path = require('path');
const connectToDB = require('./connection');
const restrictToLoginUserOnly = require('./middlewares/userRestrict');
const checkForAuthenticationCookie = require('./middlewares/userPayload');
const cookiesParser = require('cookie-parser')
const app = express();


// const PORT = 4000;
// const DATABASE_URL = `mongodb://localhost:27017/Short-url-generator`

// establish connection with MongoDB:
connectToDB(process.env.DATABASE_URL);

// provied enginee:
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))

// some middlewares to parse some form data:
app.use(express.json());
app.use(cookiesParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.urlencoded({extended: false}))

// import router for userroutes:
const userRouter = require('./Routes/user')

app.use('/user', userRouter);

app.get('/', (req, res) => {
    const user = req.user;
    res.render('home', {user: user})
})

app.get('/home', restrictToLoginUserOnly, (req, res) => {
    const user = req.user;
    res.render('shorturl', {user})
})

// requirement for url shortening:
const shortid = require('shortid');
const Url = require('./modules/url');



app.post('/home', async(req, res) => {
    const { longUrl }  = req.body;
    console.log(longUrl);
    const short_ID = shortid();
    await Url.create({
        urlRedirect: longUrl,
        shortId: short_ID,
        visitedHistory: []
    }) 
    res.json({
        shortLink: `https://short-url-app-gy3g.onrender.com/url/${short_ID}`,
        originalUrl: longUrl,
        createdAt: new Date().toLocaleString(),
        clickCount: 0
    }) // check it
})
app.get('/history', async(req, res) => {
    const user = req.user;
    const urls = await Url.find({})
    res.render('history', { user, urls });
})

// code for redirecting the url:
app.get('/url/:id', async(req, res) => {
    const shortId = req.params.id;
    console.log(shortId);
    
    const entry = await Url.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamps: Date.now()
            } 
        } 
    });
    console.log(entry.visitHistory.length);
    
    res.redirect(entry.urlRedirect) 
})

app.listen(process.env.PORT, () => {console.log(`Server Connected at ${process.env.PORT}`);
})