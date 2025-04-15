let state = []; 
const NUM_QUESTIONS = 10;


function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}


async function getData() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json();

  
  return data.map(country => ({
    name: country.name.common,
    flag: country.flags.svg
  }));
}


function getRandomCountries(data, count) {
  const shuffled = shuffleArray([...data]);
  return shuffled.slice(0, count);
}


function drawTable(questions) {
  const questionList = document.getElementById("question-list");
  questionList.innerHTML = ""; 

  questions.forEach((country, index) => {
    
    let incorrectOptions = getRandomCountries(
      state.filter(c => c.name !== country.name), 3
    );

  
    const options = [...incorrectOptions, country];

 
    const shuffledOptions = shuffleArray(options);

    const block = document.createElement("div");
    block.className = "question-block";
    block.innerHTML = `
      <h3>Question ${index + 1}:</h3>
      <img src="${country.flag}" alt="Country Flag" class="question-img" />
      <div class="options-grid">
        ${shuffledOptions.map(opt => `<button>${opt.name}</button>`).join('')}
      </div>
    `;
    questionList.appendChild(block);
  });
}


async function showAllCountries() {
  state = await getData();
  const selectedCountries = getRandomCountries(state, NUM_QUESTIONS);
  drawTable(selectedCountries);
}

showAllCountries();
