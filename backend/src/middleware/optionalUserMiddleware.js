const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis")

const optionalUserMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return next();

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;
        if (!_id) return next();

        const result = await User.findById(_id);
        if (!result) return next();

        const IsBlocked = await redisClient.exists(`token:${token}`);
        if (IsBlocked) return next();

        req.result = result;
        next();
    } catch (err) {
        next(); // Ignore errors, proceed as unauthenticated
    }
}

module.exports = optionalUserMiddleware;
