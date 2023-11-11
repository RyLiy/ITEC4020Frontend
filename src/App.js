import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from "react";
import Select from 'react-select';
import axios from "axios"; //Easy HTTP get requests

function App() {
  return (

    <div className="App">
      <header className="App-header">  </header>
      <div className="App">
        <h2>Question selected: {getQuestion()}</h2>
        <p>

        </p>
        <label> Anticipated Answer:</label>
        <div className='textContainer'><p>Blah, </p></div>

        <p style={{ 'font-weight': 'bold' }}>Similarity: {getSimilarity()}</p>

        <label> GPT-4 Answer:</label>
        <div style={{ 'border-style': 'dotted' }} className={'textContainer'}><p>Blah, </p></div>

        {LoadingButton()}
        <div>
          <p><br /></p>
          {/*onChange={(event)=>SelectDomain(event)}*/}
          <select name="domain" id="domain" >
            <option value="Computer_Security">Computer Security</option>
            <option value="Social Sciences">Social Sciences</option>
            <option value="History">History</option>
          </select>

          {SelectDomain()}

          {/*populateDropDown()*/}
          {DynamicDropdowns()}

        </div>
        <></>
        
      </div>

    </div>

  );
}


const DynamicDropdowns = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' },
    // Add more categories as needed
  ]);

  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [subcategories, setSubcategories] = useState([]);

  const getSubcategories = async () => {
    try {
      const response = await fetch(`https://example.com/api/subcategories?category=${selectedCategory}`);
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  useEffect(() => {
    getSubcategories();
  }, [selectedCategory]);

  return (
    <div>
      <label htmlFor="category">Select Category:</label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <br />

      <br />

      <label htmlFor="subcategory">Select Subcategory:</label>
      <select id="subcategory">
        {subcategories.map((subcategory) => (
          <option key={subcategory.id} value={subcategory.id}>
            {subcategory.name}
          </option>
        ))}
      </select>
    </div>
  );
};


function SelectDomain() {
  //`http://localhost:3000/db/${evt.target.value}/`

  // The REST API endpoint
  const API_URL = 'https://jsonplaceholder.typicode.com/posts';


    // At the beginning, posts is an empty array
  const [questions, setQuestions] = useState([]);

    // Define the function that fetches the data from API
    const fetchData = async () => {
      const { data } = await axios.get(API_URL);
      setQuestions(data);
    };

    // Trigger the fetchData after the initial render by using the useEffect hook
    useEffect(() => {
      fetchData();
    }, []);

    return (

      
      <select name="domain" id="domain" >
      <option value="Computer_Security">Computer Security</option>
      <option value="Social Sciences">Social Sciences</option>
      <option value="History">History</option>
    </select>



      // <div className="wrapper">
      //   {questions.length > 0 ? (
      //     <div className="content">
      //       {questions.map((post) => (
      //         <div className="post">
      //           <h2>{post.title}</h2>
      //           <p>{post.body}</p>
      //         </div>
      //       ))}
      //     </div>
      //   ) : (
      //     <p className="loading">Loading... </p>
      //   )}
      // </div>
    );


}


function populateDropDown() {
  const people = [
    'Creola Katherine Johnson: mathematician',
    'Mario José Molina-Pasquel Henríquez: chemist',
    'Mohammad Abdus Salam: physicist',
    'Percy Lavon Julian: chemist',
    'Subrahmanyan Chandrasekhar: astrophysicist'
  ];

  const listItems = people.map(person => <option>{person}</option>);
  return (
    <select name="questions">

      {listItems}

    </select>);
}

function getSimilarity() {
  return '98%'
}
function getQuestion() {
  return "What describes color?"

}
function LoadingButton() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    function simulateNetworkRequest() {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  return (
    <Button
      variant="primary"
      disabled={isLoading} //The button is disabled if it is loading
      onClick={!isLoading ? handleClick : null} //If it's not already loading, then upon a new click, handle it. Otherwise do nothing.
    >
      {isLoading ? 'Loading…' : 'Re-generate GPT-4 Response'}
    </Button>
  );
}




export default App;
