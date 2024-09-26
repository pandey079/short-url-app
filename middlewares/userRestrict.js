const { validateToken } = require("../Services/authentication");

async function restrictToLoginUserOnly(req, res, next) {
    const tokenValue = req.cookies['token'];
    if(!tokenValue) return res.redirect('/user/login');
    const user = validateToken(tokenValue);
    if(!user) return res.redirect('/signin');
    req.user = user;
    next();
}
module.exports = restrictToLoginUserOnly
