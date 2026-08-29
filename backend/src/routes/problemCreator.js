const express = require('express');

const problemRouter =  express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem,attemptedAllProblembyUser} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");
const optionalUserMiddleware = require("../middleware/optionalUserMiddleware");


// Create
problemRouter.post("/create",adminMiddleware ,createProblem);
problemRouter.put("/update/:id",adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware, deleteProblem);


problemRouter.get("/problemById/:id", optionalUserMiddleware, getProblemById);
problemRouter.get("/getAllProblem", getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware, solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem);
problemRouter.get("/problemAttemptedByUser",userMiddleware,attemptedAllProblembyUser);


module.exports = problemRouter;

// fetch
// update
// delete 
