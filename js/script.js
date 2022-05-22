//select each card container by id and assign to variables
var startCard = document.querySelector("#start-card");
var questionCard = document.querySelector("#question-card");
var scoreCard = document.querySelector("#score-card");
var leaderboardCard = document.querySelector("#leaderboard-card");
//function to hide card containers, set attribute to "hidden" function
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}
//select result div and text by id and assign to variables
var resultDiv = document.querySelector("#result-div");
var resultText = document.querySelector("#result-text");
//function to hide result div
function hideResultText() {
  resultDiv.style.display = "none";
}
//global variables for interval, time, and currentQuestion
var interval;
var time;
var currentQuestion;
//event listener - listening for user to click button to start quiz
document.querySelector("#start-button").addEventListener("click", startQuiz);
//function starts the quiz
function startQuiz() {
  //hides any visible cards, shows the question card
  hideCards();
  //removes "hidden" attribute function that was previously assigned to this variable to show question
  questionCard.removeAttribute("hidden");
  //assign 0 to currentQuestion when start button is clicked, then display the current question on the page
  currentQuestion = 0;
  displayQuestion();
  //total time for quiz is dependent on number(length) of questions- since there is 5 questions(length is 5) there will be (5*15)75 seconds total time to complete the quiz
  time = questions.length * 15;
  //function "countdown" every 1000ms to update time and display on page
  interval = setInterval(countdown, 1000);
  //call displayTime so time appears on the page when start button is clicked, not after 1 second (default)
  displayTime();
}
//function reduces time by 1 second and displays new value, if time runs out then end quiz
function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}
//display time on page
var timeDisplay = document.querySelector("#time");
//functions displays time on page
function displayTime() {
  timeDisplay.textContent = time;
}
//display the question and answer choices for the current question
function displayQuestion() {
  var question = questions[currentQuestion];
  var choices = question.choices;
  //questions will display in header 2
  var h2QuestionEl = document.querySelector("#question-text");
  h2QuestionEl.textContent = question.questionText;
  //for loop, answer choices will display
  for (var i = 0; i < choices.length; i++) {
    var choice = choices[i];
    var choiceButton = document.querySelector("#choice" + i);
    choiceButton.textContent = choice;
  }
}
//event listener - listening for user to click on an answer choice button
document.querySelector("#quiz-choices").addEventListener("click", checkAnswer);
//compare the text content of the choice button with the answer to the current question
function choiceIsCorrect(choiceButton) {
  return choiceButton.textContent === questions[currentQuestion].answer;
}
//if answer choice is incorrect, deduct 10 seconds from time
//eventObject.target identifies the  answer choice button element that was clicked on
function checkAnswer(eventObject) {
  var choiceButton = eventObject.target;
  resultDiv.style.display = "block";
  //if user's answer choice is correct display "Correct" message and continue quiz
  if (choiceIsCorrect(choiceButton)) {
    resultText.textContent = "Correct";
    setTimeout(hideResultText, 1000);
    //else, if user's answer choice is incorrect display "Incorrect" message and deduct 10 seconds from total time limit
  } else {
    resultText.textContent = "Incorrect";
    setTimeout(hideResultText, 1000);
    //when user's answer choice is incorrect, 10 seconds will be deducted from the total time limit
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
      //if time is less than 10 seconds and user's answer choice is incorrect, display time as 0 and end quiz
      //time is set to 0 for cases where a wrong answer choice is submitted with < 10 seconds left on the timer, this prevents an negative number from displaying on the timer at the end of the quiz
      time = 0;
      displayTime();
      endQuiz();
    }
  }
  //increment current question by 1 second
  currentQuestion++;
  //if questions remain then display next question, else end quiz
  if (currentQuestion < questions.length) {
    displayQuestion();
    //else end quiz
  } else {
    endQuiz();
  }
}
//display score card and hide other divs
var score = document.querySelector("#score");
//at end of quiz, clear the timer, hide any visible cards and display the score card
function endQuiz() {
  clearInterval(interval);
  hideCards();
  scoreCard.removeAttribute("hidden");
  //display the score which is the remaining time
  score.textContent = time;
}
//at end of quiz, submission form asks for user's intials to display on leaderboard highscores
var submitButton = document.querySelector("#submit-button");
var inputElement = document.querySelector("#initials");
//event listener - listening for user to click submit button after inputing intials
submitButton.addEventListener("click", storeScore);
//function stores user's intials that are inputed in submission form
function storeScore(event) {
  //prevent default behavior of form submission
  event.preventDefault();
  //check for input, if user does not input their intials or submit the form alert displays
  if (!inputElement.value) {
    alert("Please enter your initials before pressing submit");
    return;
  }
  //create leaderboardItem variable to store score and initials in an object
  var leaderboardItem = {
    initials: inputElement.value,
    score: time,
  };
  //user's intials and score is updated and stored in the leaderboard
  updateStoredLeaderboard(leaderboardItem);
  //hide the question card, display the leaderboard card
  hideCards();
  //removes "hidden" attribute for leaderboard card to display
  leaderboardCard.removeAttribute("hidden");
  renderLeaderboard();
}
//function updates the leaderboard stored in local storage
function updateStoredLeaderboard(leaderboardItem) {
  //create leaderboardArray variable to store leaderboardItem
  var leaderboardArray = getLeaderboard();
  //append new leaderboardItem to leaderboardArray
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}
//retrieve leaderboardArray from local storage and parse it into a javascript object using JSON.parse
function getLeaderboard() {
  var storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    var leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
}
//function displays leaderboard highscores on leaderboard card
function renderLeaderboard() {
  var sortedLeaderboardArray = sortLeaderboard();
  var highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (var i = 0; i < sortedLeaderboardArray.length; i++) {
    var leaderboardEntry = sortedLeaderboardArray[i];
    var newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}
//sort leaderboard array from highest to lowest
function sortLeaderboard() {
  var leaderboardArray = getLeaderboard();
  if (!leaderboardArray) {
    return;
  }
  leaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return leaderboardArray;
}
//create clearButton variable to clear leaderboard highscores
var clearButton = document.querySelector("#clear-button");
//event listener-listening for user to click on clearButton to clear leaderboard highscores
clearButton.addEventListener("click", clearHighscores);
//function clears local storage and displays empty leaderboard
function clearHighscores() {
  localStorage.clear();
  renderLeaderboard();
}
//create backButton variable to return to start
var backButton = document.querySelector("#back-button");
//event listener- listening for user to click on backButton to return to start
backButton.addEventListener("click", returnToStart);
//function hides leaderboard card shows start card, can restart quiz
function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}
//use link to view highscores
var leaderboardLink = document.querySelector("#leaderboard-link");
//event listener- listening for user to click on leaderboardLink to display leaderboard highscores
leaderboardLink.addEventListener("click", showLeaderboard);
//functions shows leaderboard
function showLeaderboard() {
  hideCards();
  //removes "hidden" attributes to display leaderboard card
  leaderboardCard.removeAttribute("hidden");
  //stops countdown
  clearInterval(interval);
  //assign undefined to time and display so that time does not appear on page
  time = undefined;
  displayTime();
  //display leaderboard on leaderboard card
  renderLeaderboard();
}
