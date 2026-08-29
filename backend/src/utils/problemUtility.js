const axios = require('axios');


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{

const encodedSubmissions = submissions.map(sub => ({
  ...sub,
  source_code: sub.source_code ? Buffer.from(sub.source_code).toString('base64') : null,
  stdin: sub.stdin ? Buffer.from(sub.stdin).toString('base64') : null,
  expected_output: sub.expected_output ? Buffer.from(sub.expected_output).toString('base64') : null
}));

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'true'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions: encodedSubmissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error("Judge0 API Error in submitBatch:", error.response ? error.response.data : error.message);
		throw new Error("Judge0 API Error: " + (error.response ? JSON.stringify(error.response.data) : error.message));
	}
}

 return await fetchData();

}


const waiting = (timer) => {
  return new Promise((resolve) => setTimeout(resolve, timer));
};

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async(resultToken)=>{

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'true',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error("Judge0 API Error in submitToken:", error.response ? error.response.data : error.message);
		throw new Error("Judge0 API Error: " + (error.response ? JSON.stringify(error.response.data) : error.message));
	}
}


 while(true){

 const result =  await fetchData();

  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

  if(IsResultObtained) {
    return result.submissions.map(r => ({
      ...r,
      stdout: r.stdout ? Buffer.from(r.stdout, 'base64').toString('utf8') : null,
      stderr: r.stderr ? Buffer.from(r.stderr, 'base64').toString('utf8') : null,
      compile_output: r.compile_output ? Buffer.from(r.compile_output, 'base64').toString('utf8') : null,
      message: r.message ? Buffer.from(r.message, 'base64').toString('utf8') : null,
      stdin: r.stdin ? Buffer.from(r.stdin, 'base64').toString('utf8') : null,
      expected_output: r.expected_output ? Buffer.from(r.expected_output, 'base64').toString('utf8') : null,
    }));
  }

  
  await waiting(1000);
}



}


module.exports = {getLanguageById,submitBatch,submitToken};








// 


