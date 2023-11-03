function getRandomNumber(){
  const randomNumber = Math.floor(Math.random()*194);
  return randomNumber;
}
let randomNumber = getRandomNumber();
const gameStats ={
  correct: 0,
  gameCounter: 0,
  cluesUsed: 0,
  points: 0,
  currentPoints: 10,
};
function initiatePage(){
  const root = document.getElementById('root');
  const container = document.createElement('div');
  container.id = 'container';
  root.appendChild(container);
  const titleContainer = document.createElement('div');
  titleContainer.id = 'titleContainer';
  container.appendChild(titleContainer);
  const title = document.createElement('h1');
  title.id = 'title';
  title.innerText = 'Guess the Country';
  titleContainer.appendChild(title);
  const hiddenName = document.createElement('h2');
  hiddenName.id = 'hiddenName';
  titleContainer.appendChild(hiddenName);
  const pointsContainer = document.createElement('div');
  pointsContainer.id = 'pointsContainer';
  titleContainer.appendChild(pointsContainer);
  const totalPoints = document.createElement('h3');
  totalPoints.id = 'totalPoints';
  pointsContainer.appendChild(totalPoints);
  const gameCount = document.createElement('h4');
  gameCount.id = 'gameCount';
  pointsContainer.appendChild(gameCount);
  const flagContainer = document.createElement('div');
  flagContainer.id = 'flagContainer';
  container.appendChild(flagContainer);
  const gameBoard = document.createElement('div');
  gameBoard.id = 'gameBoard';
  container.appendChild(gameBoard);
  const form = document.createElement('form');
  gameBoard.appendChild(form);
  const clueBoard = document.createElement('div');
  clueBoard.id = 'clueBoard';
  container.appendChild(clueBoard);
  function newGame(){
    gameStats.gameCounter++;
    totalPoints.innerText = `Total Points: ${gameStats.points}/${gameStats.gameCounter*10}`;
    const percentageCorrect = Math.round((gameStats.correct/gameStats.gameCounter)*100);
    gameCount.innerText = `Correct: ${percentageCorrect}%`;
    randomNumber = getRandomNumber();
    const flagImage = document.getElementById('flagImage');
    flagImage.remove();
    printFlagAndName();
    form.reset();
    const currentPointsContainer = document.getElementById('currentPointsContainer');
    currentPointsContainer.innerText = `Current Points: ${gameStats.currentPoints}`;
    gameStats.cluesUsed = 0;
    const clueCounter = document.getElementById('clueCounter');
    clueCounter.innerText = `${gameStats.cluesUsed}/3`;
    const region = document.getElementById('region');
    region.innerText = '';
    const capital = document.getElementById('capital');
    capital.innerText = '';
  }
  function populateGameBoard(){
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter your guess');
    input.setAttribute('autocomplete', 'off');
    input.id = 'textInput';
    form.appendChild(input);
    const submit = document.createElement('input');
    submit.setAttribute('type','submit');
    submit.id = 'submit';
    form.appendChild(submit);
    const giveUp = document.createElement('button');
    giveUp.id = 'giveUp';
    giveUp.innerText = 'I Give Up!';
    form.appendChild(giveUp);
    async function revealAnswer(){
      const countryData = await parseCountryData();
      hiddenName.innerText = await countryData.name;
    }
    giveUp.addEventListener('click',() => {
      revealAnswer();
      gameStats.currentPoints = 10;
      setTimeout(function() {newGame();},2000);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const userGuess = e.target[0].value;
      async function getAnswer(){
        const countryData = await parseCountryData();
        if (userGuess.toLowerCase() == countryData.name.toLowerCase() || userGuess.toLowerCase() == countryData.officialName.toLowerCase()){
          gameStats.correct++;
          gameStats.points += gameStats.currentPoints;
          gameStats.currentPoints = 10;
          revealAnswer();
          setTimeout(function() {newGame();},2000);
        }
        else{
          form.reset();
        }
      }
      getAnswer();
    });
  }
  function populateClueBoard(){
    const currentPointsContainer = document.createElement('h3');
    currentPointsContainer.id = 'currentPointsContainer';
    currentPointsContainer.innerText = `Current Points: ${gameStats.currentPoints}`;
    clueBoard.appendChild(currentPointsContainer);
    const clueButtonContainer = document.createElement('div');
    clueButtonContainer.id = 'clueButtonContainer';
    clueBoard.appendChild(clueButtonContainer);
    const clueButton = document.createElement('button');
    clueButton.innerText = 'Clue';
    clueButton.id = 'clueButton';
    clueButtonContainer.appendChild(clueButton);
    const clueCounter = document.createElement('span');
    clueCounter.id = 'clueCounter';
    clueCounter.innerText = `${gameStats.cluesUsed}/3`;
    clueButtonContainer.appendChild(clueCounter);
    const region = document.createElement('p');
    region.id = 'region';
    clueBoard.appendChild(region);
    const capital = document.createElement('p');
    capital.id = 'capital';
    clueBoard.appendChild(capital);
    async function clue1(){
      const countryData = await parseCountryData();
      region.innerText = `Region: ${countryData.region}`;
    }
    async function clue2(){
      const countryData = await parseCountryData();
      capital.innerText = `Capital: ${countryData.capital}`;
    }
    async function clue3(){
      const countryData = await parseCountryData();
      const countryNameArray = countryData.name.split('');
      const hiddenNameContainer = document.getElementById('hiddenName');
      const hiddenNameArray = hiddenNameContainer.innerText.split('');
      const hasSpaces = countryNameArray.indexOf(' ');
      if (hasSpaces > 0){
        const spaceIndexes = [];
        spaceIndexes.push(0);
        for (let i = 0; i < countryNameArray.length; i++) {
          const letter = countryNameArray[i];
          if (letter === ' '){
            spaceIndexes.push(i+1);
          }
        }
        const slashIndexes = [];
        slashIndexes.push(0);
        for (let i = 0; i < hiddenNameArray.length; i++) {
          const character = hiddenNameArray[i];
          if (character === '/'){
            slashIndexes.push(i+2);
          }
        }
        for (let i = 0; i < spaceIndexes.length; i++) {
          hiddenNameArray[slashIndexes[i]] = countryNameArray[spaceIndexes[i]];
        }
        hiddenName.innerText = hiddenNameArray.join('');
      }
      else{
        const revealedNameText = hiddenName.innerText.replace('_', countryData.name[0]);
        hiddenName.innerText = revealedNameText;
      }
    }
    clueButton.addEventListener('click',() => {
      switch (true){
        case gameStats.cluesUsed === 0:
          clue1();
          gameStats.cluesUsed++;
          clueCounter.innerText = `${gameStats.cluesUsed}/3`;
          gameStats.currentPoints -= 4;
          break;
        case gameStats.cluesUsed === 1:
          clue2();
          gameStats.cluesUsed++;
          clueCounter.innerText = `${gameStats.cluesUsed}/3`;
          gameStats.currentPoints -= 3;
          break;
        case gameStats.cluesUsed === 2:
          clue3();
          gameStats.cluesUsed++;
          clueCounter.innerText = `${gameStats.cluesUsed}/3`;
          gameStats.currentPoints -= 2;
          break;
        default:
          alert('You have used all your guesses!');
          break;
      }
      currentPointsContainer.innerText = `Current Points: ${gameStats.currentPoints}`;
    });
  }

  populateGameBoard();
  populateClueBoard();
}
async function getCountry(){
  const response = await fetch('https://restcountries.com/v3.1/independent?status=true');
  const countries = await response.json();
  const countryData = countries[randomNumber];
  return countryData;
}
async function parseCountryData(){
  const countryData = await getCountry();
  const country = {};
  country.capital = countryData.capital[0];
  country.flag = countryData.flags.svg;
  country.languages = countryData.languages;
  country.name = countryData.name.common;
  country.officialName = countryData.name.official;
  country.region = countryData.subregion;
  return(country);
}
async function printFlagAndName(){
  const countryData = await parseCountryData();
  const flagContainer = document.getElementById('flagContainer');
  const hiddenName = document.getElementById('hiddenName');
  const flagImage = document.createElement('img');
  flagImage.id = 'flagImage';
  flagImage.src = countryData.flag;
  flagContainer.appendChild(flagImage);
  function createHiddenName(){
    const countryNameArray = countryData.name.split('');
    const hiddenCountryNameArray = countryNameArray.map((value) => {
      if (value === ' '){
        return value = '/ ';
      }
      else if (value === '-'){
        return value = '- ';
      }
      else{
        return value = '_ ';
      }
    });
    hiddenName.innerText = hiddenCountryNameArray.join('');
  }
  createHiddenName();
}
initiatePage();
printFlagAndName();