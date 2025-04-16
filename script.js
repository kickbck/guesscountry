let state = []; 
const NUM_QUESTIONS = 10;
let currentQuestion = 0;
let score = 0;
let questions = [];


function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

//access flags by continents
async function getData(continent) {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json();

  let countries = data.map(country => ({
    name: country.name.common,
    flag: country.flags.svg,
    continent: country.continents[0]
  }));

   //filters countries
   if (continent && continent !== 'All Countries') {
    countries = countries.filter(country => country.continent === continent);
  }
  
  return countries;
}


function getRandomCountries(data, count) {
  const shuffled = shuffleArray([...data]);
  return shuffled.slice(0, count);
}


function displayQuestion(index) {
  const questionList = document.getElementById("question-list");
  questionList.innerHTML = ""; 

  const country = questions[index];
    
    let incorrectOptions = getRandomCountries(
      state.filter(c => c.name !== country.name), 3
    );

  
    const options = [...incorrectOptions, country];
    const shuffledOptions = shuffleArray(options);

    const block = document.createElement("div");
    block.className = "question-block";
    block.innerHTML = `
      <h3>Question ${index + 1} of ${NUM_QUESTIONS}:</h3>
      <img src="${country.flag}" alt="Country Flag" class="question-img" />
      <div class="options-grid">
      ${shuffledOptions.map(opt => 
        `<button onclick="checkAnswer('${opt.name.replace(/'/g, "\\'")}', '${country.name.replace(/'/g, "\\'")}')">${opt.name}</button>`
      ).join('')}
      </div>
    `;
    questionList.appendChild(block);
  };

// end of quiz recap !
function showFinalResults() {
  const questionList = document.getElementById("question-list");
  questionList.innerHTML = "";
  
  const results = document.createElement("div");
  results.className = "question-block";
  results.innerHTML = `
    <h2>Quiz Completed!</h2>
    <div class="final-score">Your Score: ${score}/${NUM_QUESTIONS * 100}</div>
    <p>${getScoreFeedback(score)}</p>
    <div class ="button-group">
      <div class="button-row">
        <button onclick="playAgain()">Play Again</button>
        <button onclick="returnToMenu()">Return to Menu</button>
      </div>
      
    </div>
  `;
  // <button id="logout">Log Out</button> this button is suppose to go in the div above 
  // but im not getting it to work up to you if you wanna leave it
  questionList.appendChild(results);
}

function getScoreFeedback(score) {
  const percentage = (score / (NUM_QUESTIONS * 100)) * 100;
  if (percentage >= 90) return "You're a geography expert !";
  if (percentage >= 70) return "You know your flags well !";
  if (percentage >= 50) return "Keep practicing !";
  return "Try Studying or Try Again ! 😧";
}

function playAgain() {
  // set everything to 0 so users can play again
  currentQuestion = 0;
  score = 0;
  questions = getRandomCountries(state, NUM_QUESTIONS);
  
  // first question
  displayQuestion(0);
}

function checkAnswer(selectedName, correctName) {
  const questionList = document.getElementById("question-list");
  const currentBlock = questionList.querySelector(".question-block");
  
  // to show feedback
  let feedback = document.createElement("div"); 
  feedback.className = "feedback";
  
  //feedbacks
  if (selectedName === correctName) {
    score = score +100;
    feedback.textContent = "✓ Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `✗ Wrong! You answered: ${selectedName}`;
    feedback.style.color = "red";
  }
  
  // hide the buttons when the user answers the question
  const optionsGrid = currentBlock.querySelector(".options-grid");
  optionsGrid.style.display = "none";
  
  // place the correct answer above the flag
  const questionText = currentBlock.querySelector("h3");
  questionText.innerHTML += `<div class="correct-answer">${correctName}</div>`;
  
  // show the feedback in the question block
  currentBlock.appendChild(feedback);
  
 // next button stuff
  const nextButton = document.createElement("button");
  nextButton.className = "next-btn";
  nextButton.textContent = "Next Question";
  nextButton.onclick = () => {
    currentQuestion++;
    if (currentQuestion < NUM_QUESTIONS) {
      displayQuestion(currentQuestion);
    } else {
      showFinalResults();
    }
  };
  currentBlock.appendChild(nextButton);
}

// back to the menu
function returnToMenu() {
  window.location.href = 'menu.html';
}

// display for all quizzes
async function initQuiz(continent) {
  state = await getData(continent);
  questions = getRandomCountries(state, NUM_QUESTIONS);
  displayQuestion(0);
}

// direct to game.html since it's default is all coutries
async function showAllCountries() {
  localStorage.setItem('quizcontinent', 'All Countries');
  window.location.href = 'game.html';
}

// initialize quiz when game page loads
if (window.location.pathname.includes('game.html')) {
  const continent = localStorage.getItem('quizcontinent') || 'All Countries';
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('quiz-continent').textContent = continent;
    initQuiz(continent);
  });
}