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

const getStoredTheme = () => localStorage.getItem("theme") || THEMES.LIGHT;

const updateThemeIcon = (theme) => {
  themeToggle.textContent = THEME_ICONS[theme];
};

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcon(theme);
  localStorage.setItem("theme", theme);
};

const toggleTheme = () => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || THEMES.LIGHT;
  const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  setTheme(newTheme);
};

const initializeThemeToggle = () => {
  if (!themeToggle) return;

  const savedTheme = getStoredTheme();
  setTheme(savedTheme);
  themeToggle.addEventListener("click", toggleTheme);
};

document.addEventListener("DOMContentLoaded", initializeThemeToggle);

const JOKE_API_URL =
  "https://raw.githubusercontent.com/Majestyk1/stress-jokes-api/refs/heads/main/stress-jokes.json";

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

function startJokeRotation() {
  quizElements.jokeIntervalId = setInterval(() => {
    fetchRandomJoke();
  }, 8000);
}

function stopJokeRotation() {
  if (quizElements.jokeIntervalId) {
    clearInterval(quizElements.jokeIntervalId);
    quizElements.jokeIntervalId = null;
  }
}

const quizElements = {
  startButton: document.querySelector(".quiz__start-btn"), //finds the start button
  introSection: document.querySelector(".quiz__intro"), //finds the intro section
  resultSection: document.querySelector(".quiz__result"), //finds the result section
  resultText: document.querySelector(".quiz__result-text"), // finds the result text
  retryButton: document.querySelector(".quiz__retry-btn"), // finds the retry button
  template: document.getElementById("quiz-template"), // finds the quiz template
  submitButton: document.querySelector(".quiz__submit-btn"), // finds the submit button
  jokeIntervalId: null, // ID for the joke rotation interval
};

function calculateScore(form) {
  let total = 0;
  const formData = new FormData(form);
  for (let [name, value] of formData.entries()) {
    console.log(`Question: ${name}, Value: ${value}`);
    total += parseInt(value, 10);
  }
  console.log(`Total Score: ${total}`);
  return total;
}

function getResultMessage(score) {
  console.log(`Score for message: ${score}`);
  if (score <= 4)
    return "😌 Zen Master Mode Activated You're cruising through like a pro on a Sunday stroll. Keep vibing high, you're doing amazing!";
  if (score <= 7)
    return "🙂 Mellow but Mindful Stress Level: You're holding it together like a champion in yoga class...🧘‍♀️";
  if (score <= 10)
    return "😬 On the Edge (But Still Hanging On) Stress level: popcorn in a microwave — things are starting to pop. Might be time to hit pause before you go full bag o' kernels.";
  return "😱 Full Tilt Stress Monster Emergency! Stress level: lava. 🫠 You need a reset, stat. Your brain is in survival mode — time to treat yourself like a tired puppy.";
}

function setupAutoAdvance() {
  const questions = document.querySelectorAll(".quiz__question");
  const submitBtn = document.querySelector(".quiz__submit-btn");

  questions.forEach((q, i) => (q.hidden = i !== 0));
  if (submitBtn) submitBtn.classList.add("hidden");

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
    if (submitBtn) submitBtn.classList.remove("hidden");
  }
}

function handleQuizStart() {
  const clone = quizElements.template.content.cloneNode(true);
  document.querySelector("main").appendChild(clone);
  quizElements.introSection.classList.add("hidden");
  const quizForm = document.getElementById("quiz-form");
  quizElements.submitButton = document.querySelector(".quiz__submit-btn");
  setupAutoAdvance();
  quizForm.addEventListener("submit", (e) => handleQuizSubmit(e, quizForm));
}

function handleQuizSubmit(evt, form) {
  evt.preventDefault();
  const score = calculateScore(form);
  const message = getResultMessage(score);
  quizElements.resultText.textContent = message;
  quizElements.introSection.classList.add("hidden");
  quizElements.resultSection.classList.remove("hidden");
  const submitButton = document.querySelector(".quiz__submit-btn");
  if (submitButton) submitButton.classList.add("hidden");
  fetchRandomJoke();
  startJokeRotation();
}

function handleQuizRetry() {
  const form = document.getElementById("quiz-form");
  if (form) {
    form.remove();
  }
  stopJokeRotation();
  quizElements.resultSection.classList.add("hidden");
  quizElements.introSection.classList.remove("hidden");
}

function initializeQuiz() {
  quizElements.startButton.addEventListener("click", handleQuizStart);
  quizElements.retryButton.addEventListener("click", handleQuizRetry);
}

document.addEventListener("DOMContentLoaded", initializeQuiz);
