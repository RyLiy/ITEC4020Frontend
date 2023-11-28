
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
  const [questionValue, setQuestionValue] = useState({ "_id": "6545de9f5c6e09a711c2daab", 
  "question": "What style of fuzzer is more likely to explore paths covering every line of code in the following program?",
  "anticipated": "Whitebox",
  "gpt4": "The question is missing the styles of fuzzer to choose from. Possible options could be:\n\n1. Generation-based fuzzer\n2. Mutation-based fuzzer\n\nAnswer: Generation-based fuzzer.",
  "gpt4Time": "3852",
  "similarity": "0",
  "similarityTime": "4748"});


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

  const [customInput, setInput] = useState(false); //React hook for setting custom input.
  const [customSimilarity, SetCustomSimilarity] = useState(false); //React hook for setting computing custom Similarity.
  const [customSimilarityTime, SetCustomSimilarityTime] = useState(false); //React hook for setting computing custom Similarity.
  useEffect(() => {

    async function getQuestion() {
      return await fetch(`http://localhost:3000/db/${selectedDomain}/${questionValue._id}`); //Network request
    }

    if (isLoading) {
      var time_0 = performance.now();
      fetch('http://localhost:5000/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          "expected": `${questionValue.anticipated}`,
          "answer": `${customInput}` //string body in text area.
        }),
      }).then(function (response) { //consume response
        return response.json();
      }).then(function (response) {
        //Timing response
        var time_1 = performance.now();

        var similarityTime = time_1 - time_0;
        SetCustomSimilarityTime(similarityTime);
        console.log("Time to compute similarity took " + similarityTime + " milliseconds.");
        var similarity = response;
        SetCustomSimilarity(similarity);
        console.log(response);
        setLoading(false);
      })
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);


  function UpdateText(value){
    setQuestionValue(value);
    SetCustomSimilarity(0);
    SetCustomSimilarityTime(0);
    document.getElementById('customAnswerField').value = "";
  }

  return (
    <div className="App">
      <h2>Question selected: {questionValue.question}</h2>
      <p>

      </p>
      <label> Anticipated Answer:</label>
      <div className='answerContainer'><p>{questionValue.anticipated}</p></div>

      <p style={{ 'fontWeight': 'bold' }}>Similarity: {customSimilarity}</p>

      <label> Your Answer:</label>
      <div style={{ 'borderStyle': 'dotted' }} className={'textContainer'}>
        
      <input
          style={{  'width': '100%'}}
          id="customAnswerField"
          type="text" 
          onChange={(e) => setInput(e.target.value)}
        />
      
      </div> 

      <Button
        variant="primary"
        disabled={isLoading} //The button is disabled if it is loading
        onClick={!isLoading ? handleClick : null} //If it's not already loading, then upon a new click, handle it. Otherwise do nothing.
      >
        {isLoading ? 'Loading…' : 'Compare your response.'}
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
        <select style={{ 'width': '92px' }} id="subcategory" onChange={(e) => UpdateText(JSON.parse(e.target.value))}>
          {questions.map((question) => (
            <option key={question._id} value={JSON.stringify(question)}>
              {question.question}
            </option>
          ))}
        </select>

      </div>
      <></>
      <p></p>
      <p style={{ 'fontWeight': 'bold', 'alignText': 'left' }}>Time (it would have taken) to generate a GPT-4 answer: {questionValue.gpt4Time / 1000} seconds.<br />Time to compute similarity analysis: {customSimilarityTime / 1000} seconds.</p>

    </div>




  );
};


function updateQuestion() {

}


export default App;
