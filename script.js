const questions = [
  { question: "Which planet is known as the Red Planet?", answers: ["Venus", "Mars", "Jupiter", "Mercury"], correct: 1 },
  { question: "What is the largest ocean on Earth?", answers: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], correct: 2 },
  { question: "How many continents are there?", answers: ["Five", "Six", "Seven", "Eight"], correct: 2 },
  { question: "Which language runs in a web browser?", answers: ["JavaScript", "Python", "C++", "SQL"], correct: 0 },
  { question: "What is the capital city of Japan?", answers: ["Kyoto", "Tokyo", "Osaka", "Sapporo"], correct: 1 }
];

const welcomeScreen = document.querySelector("#welcome-screen");
const quizScreen = document.querySelector("#quiz-screen");
const resultScreen = document.querySelector("#result-screen");
const nameInput = document.querySelector("#player-name");
const nameMessage = document.querySelector("#name-message");
const questionCount = document.querySelector("#question-count");
const questionText = document.querySelector("#question");
const answers = document.querySelector("#answers");
const answerMessage = document.querySelector("#answer-message");
const nextButton = document.querySelector("#next-button");
const timer = document.querySelector("#timer");
const progressBar = document.querySelector("#progress-bar");
const leaderboard = document.querySelector("#leaderboard");
const emptyLeaderboard = document.querySelector("#empty-leaderboard");

let playerName = "";
let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let quizTimer;

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => item.classList.remove("active"));
  screen.classList.add("active");
}

function startQuiz() {
  playerName = nameInput.value.trim();
  if (!playerName) {
    nameMessage.textContent = "Please enter your name before starting.";
    nameInput.focus();
    return;
  }
  nameMessage.textContent = "";
  currentQuestion = 0;
  score = 0;
  timeLeft = 60;
  showScreen(quizScreen);
  renderQuestion();
  startTimer();
}

function renderQuestion() {
  const item = questions[currentQuestion];
  questionCount.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  questionText.textContent = item.question;
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
  answers.innerHTML = "";
  answerMessage.textContent = "";
  nextButton.disabled = true;

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(index));
    answers.appendChild(button);
  });
}

function chooseAnswer(selectedIndex) {
  const isCorrect = selectedIndex === questions[currentQuestion].correct;
  const buttons = answers.querySelectorAll("button");
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === questions[currentQuestion].correct) button.classList.add("correct");
    if (index === selectedIndex && !isCorrect) button.classList.add("wrong");
  });
  if (isCorrect) {
    score += 1;
    answerMessage.textContent = "Correct!";
  } else {
    answerMessage.textContent = "Not quite — the green answer is correct.";
  }
  nextButton.disabled = false;
  nextButton.textContent = currentQuestion === questions.length - 1 ? "See results" : "Next question";
}

function nextQuestion() {
  currentQuestion += 1;
  if (currentQuestion === questions.length) finishQuiz();
  else renderQuestion();
}

function startTimer() {
  clearInterval(quizTimer);
  timer.textContent = timeLeft;
  quizTimer = setInterval(() => {
    timeLeft -= 1;
    timer.textContent = timeLeft;
    if (timeLeft <= 0) finishQuiz();
  }, 1000);
}

function finishQuiz() {
  clearInterval(quizTimer);
  progressBar.style.width = "100%";
  saveScore();
  document.querySelector("#result-name").textContent = playerName;
  document.querySelector("#final-score").textContent = score;
  document.querySelector("#result-message").textContent = timeLeft <= 0 ? "Time ran out, but your score has been saved." : "Your score has been saved on this device.";
  renderLeaderboard();
  showScreen(resultScreen);
}

function getScores() {
  return JSON.parse(localStorage.getItem("quizArenaScores") || "[]");
}

function saveScore() {
  const scores = getScores();
  scores.push({ name: playerName, score, date: new Date().toLocaleDateString() });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem("quizArenaScores", JSON.stringify(scores.slice(0, 10)));
}

function renderLeaderboard() {
  const scores = getScores();
  leaderboard.innerHTML = "";
  emptyLeaderboard.hidden = scores.length > 0;
  scores.forEach(({ name, score: savedScore }) => {
    const item = document.createElement("li");
    const nameLabel = document.createElement("span");
    const scoreLabel = document.createElement("strong");
    nameLabel.textContent = name;
    scoreLabel.textContent = `${savedScore} / ${questions.length}`;
    item.append(nameLabel, scoreLabel);
    leaderboard.appendChild(item);
  });
}

document.querySelector("#start-button").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
document.querySelector("#play-again-button").addEventListener("click", () => showScreen(welcomeScreen));
document.querySelector("#clear-scores-button").addEventListener("click", () => {
  localStorage.removeItem("quizArenaScores");
  renderLeaderboard();
});

renderLeaderboard();
