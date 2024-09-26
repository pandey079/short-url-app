const express = require('express');
const User = require('../modules/user');
const { createTokenForUser } = require('../Services/authentication');
const session = require('express-session');
const router = express.Router();


// Add session middleware
router.use(session({
    secret: 'pandeyji',
    resave: false,
    saveUninitialized: true
}));


router
.get(`/signup`, (req, res) => {res.render('signup')})
.get(`/login`, (req, res) => {
    const error = req.session.error
    req.session.error = null;
    res.render('login', { err: error })
})
.post(`/signup`, async (req, res) => {
    const { username, email, password } = req.body;
    // check if name, email, password valid or not.
    await User.create({
        username, 
        email,
        password
    })
    res.redirect('/user/login');
})

.post(`/login`, async(req, res) => {
    const {email, password} = req.body 

    const user = await User.findOne({email, password});
    console.log((user));
    
    if(!user) {
        req.session.error = 'Invalid E-mail or Password';
        // return res.render('login', { err: 'Invalid E-mail or Password'});
        return res.redirect('/user/login');
    }  
    // generate token:
    const token = createTokenForUser(user);
    res.cookie('token', token).redirect('/home');

})
// make sure to add a middleware to allow only logedin user.
.get('/logout', (req, res) => {res.clearCookie('token').redirect('/')})
.get('/profile', (req, res) => {
    const user = req.user;
    const date = user.createdAt.substr(0, 10);
    const time = user.createdAt.substr(12, 7);
    res.render('profile', {user, date, time}) 
    
})

module.exports = router;