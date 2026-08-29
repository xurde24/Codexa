const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");

const submitCode = async (req,res)=>{
   
    let submittedResult = null;
    try{
      
       const userId = req.result._id;
       const problemId = req.params.id;

       let {code,language} = req.body;

      if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some field missing");
      

      if(language==='cpp')
        language='c++'
      
      console.log(language);
      
    //    Fetch the problem from database
       const problem =  await Problem.findById(problemId);
       if (!problem) return res.status(404).send("Problem not found");
    //    testcases(Hidden)
    
    //   Kya apne submission store kar du pehle....
    submittedResult = await Submission.create({
          userId,
          problemId,
          code,
          language,
          status:'pending',
          testCasesTotal:problem.hiddenTestCases.length
     })

    //    Judge0 code ko submit karna hai
    
    const languageId = getLanguageById(language);
   
    const submissions = problem.hiddenTestCases.map((testcase)=>({
        source_code:code,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
    }));

    if (submissions.length === 0) {
        submittedResult.status = 'error';
        submittedResult.errorMessage = "No hidden test cases found for this problem to evaluate against.";
        await submittedResult.save();
        return res.status(400).json({ accepted: false, error: "No hidden test cases found for this problem to evaluate against." });
    }

    
    const submitResult = await submitBatch(submissions);
    
    const resultToken = submitResult.map((value)=> value.token);

    const testResult = await submitToken(resultToken);
    

    // submittedResult ko update karo
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = 'accepted';
    let errorMessage = null;


    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time || 0)
           memory = Math.max(memory,test.memory || 0);
        }else{
          if(test.status_id==4){
            status = 'wrong'
            errorMessage = 'Wrong Answer'
          }
          else if(test.status_id==5){
            status = 'tle'
            errorMessage = 'Time Limit Exceeded'
          }
          else if(test.status_id==6){
            status = 'error'
            errorMessage = test.compile_output || test.message || 'Compilation Error'
          }
          else{
            status = 'error'
            errorMessage = test.stderr || test.message || 'Runtime Error'
          }
        }
    }


    // Store the result in Database in Submission
    submittedResult.status   = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();
    
    // ProblemId ko insert karenge userSchema ke problemSolved mein if it is not persent there.
    
    // req.result == user Information

    if(!req.result.problemSolved.includes(problemId)){
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }
    
    const accepted = (status == 'accepted')
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime: submittedResult.runtime,
      memory: submittedResult.memory,
      error: errorMessage
    });
       
    }
    catch(err){
      if (submittedResult) {
          submittedResult.status = 'error';
          submittedResult.errorMessage = err.message || err.toString();
          await submittedResult.save();
      }
      res.status(500).json({ accepted: false, error: err.message || err.toString() });
    }
}


const runCode = async(req,res)=>{
    
     // 
     try{
      const userId = req.result._id;
      const problemId = req.params.id;

      let {code,language} = req.body;

     if(!userId||!code||!problemId||!language)
       return res.status(400).send("Some field missing");

   //    Fetch the problem from database
      const problem =  await Problem.findById(problemId);
      if (!problem) return res.status(404).send("Problem not found");
   //    testcases(Hidden)
      if(language==='cpp')
        language='c++'

   //    Judge0 code ko submit karna hai

   const languageId = getLanguageById(language);

   const submissions = problem.visibleTestCases.map((testcase)=>({
       source_code:code,
       language_id: languageId,
       stdin: testcase.input,
       expected_output: testcase.output
   }));

   if (submissions.length === 0) {
       return res.status(400).json({ success: false, error: "No visible test cases found for this problem to run." });
   }

   const submitResult = await submitBatch(submissions);
   
   const resultToken = submitResult.map((value)=> value.token);

   const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time || 0)
           memory = Math.max(memory,test.memory || 0);
        }else{
          status = false;
          if(test.status_id==4){
            errorMessage = 'Wrong Answer'
          }
          else if(test.status_id==5){
            errorMessage = 'Time Limit Exceeded'
          }
          else if(test.status_id==6){
            errorMessage = test.compile_output || test.message || 'Compilation Error'
          }
          else{
            errorMessage = test.stderr || test.message || 'Runtime Error'
          }
        }
    }

   
  
   res.status(201).json({
    success:status,
    testCases: testResult,
    runtime,
    memory
   });
      
   }
   catch(err){
     res.status(500).json({ success: false, error: err.message || err.toString() });
   }
}


module.exports = {submitCode,runCode};



//     language_id: 54,
//     stdin: '2 3',
//     expected_output: '5',
//     stdout: '5',
//     status_id: 3,
//     created_at: '2025-05-12T16:47:37.239Z',
//     finished_at: '2025-05-12T16:47:37.695Z',
//     time: '0.002',
//     memory: 904,
//     stderr: null,
//     token: '611405fa-4f31-44a6-99c8-6f407bc14e73',


// User.findByIdUpdate({
// })

//const user =  User.findById(id)
// user.firstName = "Mohit";
// await user.save();