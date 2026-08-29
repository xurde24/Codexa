const express = require('express');
const aiRouter =  express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const solveDoubt = require('../controllers/solveDoubt');
const generateProblem = require('../controllers/generateProblem');
const adminAiChat = require('../controllers/adminAiChat');

aiRouter.post('/chat', userMiddleware, solveDoubt);
aiRouter.post('/generate-problem', userMiddleware, generateProblem);
aiRouter.post('/admin-chat', userMiddleware, adminAiChat);

module.exports = aiRouter;