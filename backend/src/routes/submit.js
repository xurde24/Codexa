
const express = require('express');
const submitRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const {submitCode,runCode} = require("../controllers/userSubmission");
const rateLimit = require('express-rate-limit');

// Max 5 submissions per minute
const minuteLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: { error: 'Too many submissions per minute. Please try again after a minute.' },
    keyGenerator: (req) => req.result?._id?.toString() || req.ip
});

// Max 20 submissions per hour
const hourLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: { error: 'Too many submissions per hour. You have reached the hourly limit of 20. Please try again later.' },
    keyGenerator: (req) => req.result?._id?.toString() || req.ip
});

submitRouter.post("/submit/:id", userMiddleware, minuteLimiter, hourLimiter, submitCode);
submitRouter.post("/run/:id", userMiddleware, minuteLimiter, hourLimiter, runCode);

module.exports = submitRouter;
