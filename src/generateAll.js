

var selectedDomain = ['Social_Science']
//, History''
var questions = [];


function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

const getQuestions = (domain) => {
    try {
        fetch(`http://localhost:3000/db/${domain}/`, {
            method: 'GET',
            mode: 'cors'
        }).then(function (response) { //consume response
            return response.json();
        }).then(function (response) {
            const data = response
            //console.log(data.map(data => data));
            //console.log (data);
            questions = data.map(data => data);
            var obj = JSON.parse(JSON.stringify(questions));
            console.log(obj[0]);

            updateQuestion(obj, domain, 0);


            // for (var questionValue of questions) {
            //     //console.log(questionValue);
            //     //console.log("currently looking at " + JSON.stringify(questionValue));
            //     var obj = JSON.parse(JSON.stringify(questionValue));
            //     //console.log(obj.question);
            //     console.log('Waiting for 2.2 seconds before continuing..');
            //     wait(2500);
            //     updateQuestion(JSON.parse(JSON.stringify(questionValue)), domain);
            //     //updateQuestion(JSON.parse(JSON.stringify(questionValue)), domain);
            //     //console.print('Waiting for 2.2 seconds before continuing..');
            //     break; //going to have to implement this recurive 
            // }

        })
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
};


for (domain in selectedDomain) {
    console.log("Working on domain: " + selectedDomain[domain]);

    getQuestions(selectedDomain[domain]);
    //console.log(questions);
    // for (var questionValue of questions){
    //     console.log("currently looking at " + questionValue);
    //     //updateQuestion(questions[questionValue], selectedDomain);
    // }

}

//function updateQuestion(questionValue, selectedDomain)
function updateQuestion(questionList, selectedDomain, index) {
    const questionValue = questionList[index];
    console.log("Getting data for " + questionValue.question);

    //It begins. Sending data to backend:
    var time_0 = performance.now();
    fetch('http://localhost:3000/openai/gpt-4/ask/', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        mode: 'cors',
        body: `Fill in the blank, answer the question, or state what is most suitable. Be concise when doing this. Your answer will be compared in similarity to the expected answer, which is often just a few words, and without any periods or punctuation. If the question is missing options to choose from, come up with one or two options, then answer the question. If the question is missing any details or information you might need, you must come up with it yourself using the context derived from the question. Remember to keep your answers concise, therefore, in the event that you have to invent or compensate for missing options, do not not state that you had to do so, as we already know. Remeber that your answers are being compared to the expected answers, which have very little words. The more unnessary words you add to your responses, the lower the similarity score you will get. Just state the answer. Do not state that you had to come with any new style or options. Question: ${questionValue.question}` // body data type must match "Content-Type" header
    }).then(function (response) { //consume response
        return response.json();
    }).then(function (response) {
        //Timing response
        var time_1 = performance.now();

        var gpt4Time = time_1 - time_0;

        console.log("Call to GPT-4 took " + gpt4Time + " milliseconds.");
        var gpt4 = response.message.content;


        //With a successfull response, we need to Compute similarity. 
        fetch('http://127.0.0.1:5000/analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                "expected": `${questionValue.anticipated}`,
                "answer": `${gpt4}`
            }),
        }).then(function (response) { //consume response
            return response.json();
        }).then(function (response) {
            //Timing response
            var time_1 = performance.now();

            var similarityTime = time_1 - time_0;

            console.log("Time to compute similarity took " + similarityTime + " milliseconds.");
            var similarity = response;
            console.log(response);

            //Done with similarity and GPT generation

            //Update DB info with new results.
            fetch(`http://127.0.0.1:3000/db/${selectedDomain}/${questionValue._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    "gpt4": `${gpt4}`,
                    "similarity": `${similarity}`,
                    "gpt4Time": `${gpt4Time}`,
                    "similarityTime": `${similarityTime}`

                }),
            }).then(function (response) { //consume response
                return response.json();
            }).then(function (response) { //finally we get the response from the promise
                console.log("Done, waiting for 2.5 seconds, then moving on to next question...");
                wait(2500);
                updateQuestion(questionList, selectedDomain, index + 1);
            })

        })
    })

}