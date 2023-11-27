
import './App.css';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from "react";


function App() {
  return (
    Component()

  );
}


const Component = () => {

  // More hooks to update alle text fields
  const [questionValue, setQuestionValue] = useState({ "_id": "6545de9f5c6e09a711c2daab", "question": "Which of the following styles of fuzzer is more likely to explore paths covering every line of code in the following program?", "anticipated": "Whitebox" });


  try {
    //console.log(JSON.parse(questionValue));
  }
  catch (e) {
    console.log(e);
  }
  // console.log(JSON.parse(JSON.parse(questionValue)));


  const [domains, setDomainList] = useState([
    { id: 'Computer_Security', name: 'Computer Security' },
    { id: 'History', name: 'History' },
    { id: 'Social_Science', name: 'Social Science' },
    // Add more categories as needed
  ]);

  const [selectedDomain, setSelectedDomain] = useState(domains[0].id);
  const [questions, setQuestions] = useState([]);

  const getQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:3000/db/${selectedDomain}/`);
      const data = await response.json();
      //console.log(data.map(data => data.question));
      setQuestions(data.map(data => data));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, [selectedDomain]);



  /*Button code*/
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {

    async function getQuestion() {
      return await fetch(`http://localhost:3000/db/${selectedDomain}/${questionValue._id}`); //Network request
    }

    if (isLoading) {



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
        fetch('http://localhost:5000/analysis', {
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
          fetch(`http://localhost:3000/db/${selectedDomain}/${questionValue._id}`, {
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
          }).then(function(response){
          //Update question boxes!~
          //const questionData = fetch(`http://localhost:3000/db/${selectedDomain}/${questionValue._id}`);

          //get new question info
          fetch(`http://localhost:3000/db/${selectedDomain}/${questionValue._id}`)
            .then(function (response) { //consume response
              return response.json();
            }).then(function (response) { //finally we get the response from the promise
             // console.log(response); //lets see what it is.
              setQuestionValue(JSON.parse(JSON.stringify(response)));
              //console.log(questionValue);
              console.log("done");

            })

          setLoading(false);
          })


          // setLoading(false);
        });



      });

    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);


  return (
    <div className="App">
      <h2>Question selected: {questionValue.question}</h2>
      <p>

      </p>
      <label> Anticipated Answer:</label>
      <div className='textContainer'><p>{questionValue.anticipated}</p></div>

      <p style={{ 'fontWeight': 'bold' }}>Similarity: {questionValue.similarity}</p>

      <label> GPT-4 Answer:</label>
      <div style={{ 'borderStyle': 'dotted' }} className={'textContainer'}><p>{questionValue.gpt4}</p></div>

      <Button
        variant="primary"
        disabled={isLoading} //The button is disabled if it is loading
        onClick={!isLoading ? handleClick : null} //If it's not already loading, then upon a new click, handle it. Otherwise do nothing.
      >
        {isLoading ? 'Loading…' : 'Re-generate GPT-4 Response'}
      </Button>
      <div>
        <p><br /></p>

        <label htmlFor="category">Select Domain:</label>
        <select
          id="category"
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
        >
          {domains.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <br />

        <br />

        <label htmlFor="subcategory">Select Question:</label>
        <select style={{ 'width': '92px' }} id="subcategory" onChange={(e) => setQuestionValue(JSON.parse(e.target.value))}>
          {questions.map((question) => (
            <option key={question._id} value={JSON.stringify(question)}>
              {question.question}
            </option>
          ))}
        </select>

      </div>
      <></>
      <p></p>
      <p style={{ 'fontWeight': 'bold', 'alignText': 'left' }}>Time to generate GPT-4 response: {questionValue.gpt4Time / 1000} seconds.<br />Time to compute similarity analysis: {questionValue.similarityTime / 1000} seconds.</p>

    </div>




  );
};


function updateQuestion() {

}


export default App;
