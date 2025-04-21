const themeToggle = document.getElementById("themeToggle");

// Theme constants
const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const THEME_ICONS = {
  [THEMES.LIGHT]: "🌙",
  [THEMES.DARK]: "☀️",
};

// Get theme from localStorage or default to light
const getStoredTheme = () => localStorage.getItem("theme") || THEMES.LIGHT;

// Update theme icon based on current theme
const updateThemeIcon = (theme) => {
  themeToggle.textContent = THEME_ICONS[theme];
};

// Set theme on document and update icon
const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcon(theme);
  localStorage.setItem("theme", theme);
};

// Toggle between light and dark themes
const toggleTheme = () => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || THEMES.LIGHT;
  const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  setTheme(newTheme);
};

// Initialize theme functionality
const initializeThemeToggle = () => {
  if (!themeToggle) return;

  // Set initial theme
  const savedTheme = getStoredTheme();
  setTheme(savedTheme);

  // Add event listener
  themeToggle.addEventListener("click", toggleTheme);
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeThemeToggle);

const JOKE_API_URL =
  "https://raw.githubusercontent.com/Majestyk1/stress-jokes-api/refs/heads/main/stress-jokes.json";

// Fetch a random joke from the JSON file
async function fetchRandomJoke() {
  const jokeBox = document.getElementById("joke-box");

  try {
    const res = await fetch(JOKE_API_URL);
    const jokes = await res.json();
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    jokeBox.textContent = randomJoke;
  } catch (error) {
    jokeBox.textContent =
      "Couldn't fetch a joke. Maybe GitHub is stressed too? 😅";
    console.error(error);
  }
}

// Start rotating jokes every 5 seconds
function startJokeRotation() {
  setInterval(fetchRandomJoke, 8000); // Change joke every 5 seconds
}

// DOM Elements
const quizElements = {
  startButton: document.querySelector(".quiz__start-btn"), //finds the start button
  introSection: document.querySelector(".quiz__intro"), //finds the intro section
  resultSection: document.querySelector(".quiz__result"), //finds the result section
  resultText: document.querySelector(".quiz__result-text"), // finds the result text
  retryButton: document.querySelector(".quiz__retry-btn"), // finds the retry button
  template: document.getElementById("quiz-template"), // finds the quiz template
};

// Utility Functions
// Calculate the total score based on selected radio button values
// Assuming each question has radio buttons with values from 1 to 4
// This is like counting all your marbles and telling you how many you have
function calculateScore(form) {
  let total = 0;
  const formData = new FormData(form);
  for (let [, value] of formData.entries()) {
    total += parseInt(value);
  }
  return total;
}
// This function takes the score and returns a message based on the score
// It's like a fortune teller for your stress level
function getResultMessage(score) {
  if (score <= 4) return "😌 You're super chill. Keep doing you!";
  if (score <= 7) return "🙂 You're doing okay, just take some mindful breaks.";
  if (score <= 10) return "😬 You're feeling it — maybe step away for a bit.";
  return "😱 You're very stressed. Deep breath. Water. Rest.";
}
// hides all questions except the first one and sets up event listeners for radio buttons
// When a radio button is selected, it hides the current question and shows the next one
// when you answer a question, it automatically moves to the next one
// like turning the page of a book when you finish a chapter
function setupAutoAdvance() {
  const questions = document.querySelectorAll(".quiz__question");
  const submitBtn = document.querySelector(".quiz__submit-btn");

  // Hide all questions except the first one
  questions.forEach((q, i) => (q.hidden = i !== 0));
  if (submitBtn) submitBtn.style.display = "none";

  questions.forEach((question, index) => {
    const inputs = question.querySelectorAll("input[type='radio']");
    inputs.forEach((input) => {
      input.addEventListener("change", () =>
        handleQuestionChange(question, questions[index + 1])
      );
    });
  });
}

function handleQuestionChange(currentQuestion, nextQuestion) {
  currentQuestion.hidden = true;

  if (nextQuestion) {
    nextQuestion.hidden = false;
  } else {
    const submitBtn = document.querySelector(".quiz__submit-btn");
    if (submitBtn) submitBtn.style.display = "block";
  }
}

// Event Handlers
// makes the quiz appear
// hides wlelcome message
// gets everything ready to play
function handleQuizStart() {
  const clone = quizElements.template.content.cloneNode(true);
  document.querySelector("main").appendChild(clone);
  quizElements.introSection.style.display = "none";

  const quizForm = document.getElementById("quiz-form");
  setupAutoAdvance();

  quizForm.addEventListener("submit", (e) => handleQuizSubmit(e, quizForm));
}
// adds up your points
// shows you your special message
// like getting a prize at the end of a game
function handleQuizSubmit(evt, form) {
  evt.preventDefault();
  const score = calculateScore(form);
  const message = getResultMessage(score);
  quizElements.resultText.textContent = message;
  form.classList.add("hidden"); // Changed this line
  quizElements.resultSection.classList.remove("hidden"); // Changed this line
  fetchRandomJoke(); // Fetch a joke when the quiz is submitted
  startJokeRotation(); // Start rotating jokes
}
// restarts the quiz
// like hitting the reset button on a game
function handleQuizRetry() {
  location.reload();
}

// Initialize Quiz
function initializeQuiz() {
  quizElements.startButton.addEventListener("click", handleQuizStart);
  quizElements.retryButton.addEventListener("click", handleQuizRetry);
}

// Start when DOM is ready
document.addEventListener("DOMContentLoaded", initializeQuiz);
