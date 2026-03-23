const themeToggle = document.getElementById("themeToggle");

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

const THEME_ICONS = {
  [THEMES.LIGHT]: "🌙",
  [THEMES.DARK]: "☀️",
};

const LAST_RESULT_STORAGE_KEY = "calmcheck-last-result";

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
    const response = await fetch(JOKE_API_URL);
    const jokes = await response.json();
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    jokeBox.textContent = randomJoke;
  } catch (error) {
    jokeBox.textContent =
      "Couldn't fetch a joke right now. Take one slow breath and try again.";
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
  startButton: document.querySelector(".quiz__start-btn"),
  introSection: document.querySelector(".quiz__intro"),
  resultSection: document.querySelector(".quiz__result"),
  resultText: document.querySelector(".quiz__result-text"),
  retryButton: document.querySelector(".quiz__retry-btn"),
  template: document.getElementById("quiz-template"),
  submitButton: null,
  progressBar: null,
  progressText: null,
  scoreText: document.getElementById("quiz-score"),
  tipsList: document.getElementById("quiz-tips"),
  lastResultText: document.getElementById("last-result"),
  jokeIntervalId: null,
};

function calculateScore(form) {
  let total = 0;
  const formData = new FormData(form);

  formData.forEach((value) => {
    total += parseInt(value, 10);
  });

  return total;
}

function getResultMessage(score) {
  if (score <= 4) {
    return "😌 You are handling stress very well today. Keep your current routine going.";
  }

  if (score <= 7) {
    return "🙂 You are mostly balanced, but a short break can still help you recharge.";
  }

  if (score <= 10) {
    return "😬 Your stress is rising. Slow down and give yourself recovery time today.";
  }

  return "😰 Your stress level is high right now. Consider rest, support, and a lighter schedule.";
}

function getTipsByScore(score) {
  if (score <= 4) {
    return [
      "Keep your current routine and sleep schedule.",
      "Take short movement breaks to stay balanced.",
    ];
  }

  if (score <= 7) {
    return [
      "Plan one short break block in your day.",
      "Reduce one non-essential task for today.",
    ];
  }

  if (score <= 10) {
    return [
      "Use a 10-minute reset: walk, breathe, hydrate.",
      "Limit caffeine after afternoon hours.",
      "Prioritize your top 1-2 tasks only.",
    ];
  }

  return [
    "Pause and rest before pushing more work.",
    "Reach out to someone you trust for support.",
    "Consider speaking with a professional resource if this feeling continues.",
  ];
}

function renderTips(tips) {
  if (!quizElements.tipsList) {
    return;
  }

  quizElements.tipsList.innerHTML = "";

  tips.forEach((tip) => {
    const tipItem = document.createElement("li");
    tipItem.textContent = tip;
    quizElements.tipsList.append(tipItem);
  });
}

function storeLastResult(score) {
  const payload = {
    score,
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  localStorage.setItem(LAST_RESULT_STORAGE_KEY, JSON.stringify(payload));
}

function renderLastResult() {
  if (!quizElements.lastResultText) {
    return;
  }

  const storedValue = localStorage.getItem(LAST_RESULT_STORAGE_KEY);

  if (!storedValue) {
    quizElements.lastResultText.hidden = true;
    return;
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (
      typeof parsedValue.score !== "number" ||
      typeof parsedValue.date !== "string"
    ) {
      quizElements.lastResultText.hidden = true;
      return;
    }

    quizElements.lastResultText.textContent = `Last check: ${parsedValue.score}/15 on ${parsedValue.date}`;
    quizElements.lastResultText.hidden = false;
  } catch {
    quizElements.lastResultText.hidden = true;
  }
}

function updateQuizProgress(currentIndex, totalQuestions) {
  if (!quizElements.progressBar || !quizElements.progressText) {
    return;
  }

  const safeIndex = Math.min(Math.max(currentIndex, 0), totalQuestions - 1);
  const currentStep = safeIndex + 1;
  const progressPercentage = (currentStep / totalQuestions) * 100;

  quizElements.progressBar.style.width = `${progressPercentage}%`;
  quizElements.progressText.textContent = `Question ${currentStep} of ${totalQuestions}`;
}

function setupAutoAdvance() {
  const questions = document.querySelectorAll(".quiz__question");
  const submitBtn = document.querySelector(".quiz__submit-btn");
  const totalQuestions = questions.length;

  quizElements.progressBar = document.querySelector(".quiz__progress-bar");
  quizElements.progressText = document.querySelector(".quiz__progress-text");

  questions.forEach((question, index) => {
    question.hidden = index !== 0;
  });

  if (submitBtn) {
    submitBtn.classList.add("hidden");
  }

  updateQuizProgress(0, totalQuestions);

  questions.forEach((question, index) => {
    const inputs = question.querySelectorAll("input[type='radio']");

    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        handleQuestionChange(
          question,
          questions[index + 1],
          index + 1,
          totalQuestions
        );
      });
    });
  });
}

function handleQuestionChange(
  currentQuestion,
  nextQuestion,
  nextQuestionIndex,
  totalQuestions
) {
  currentQuestion.hidden = true;

  if (nextQuestion) {
    nextQuestion.hidden = false;
    updateQuizProgress(nextQuestionIndex, totalQuestions);
  } else {
    const submitBtn = document.querySelector(".quiz__submit-btn");

    if (submitBtn) {
      submitBtn.classList.remove("hidden");
    }

    updateQuizProgress(totalQuestions - 1, totalQuestions);
  }
}

function handleQuizStart() {
  const clone = quizElements.template.content.cloneNode(true);
  document.querySelector("main").appendChild(clone);
  quizElements.introSection.classList.add("hidden");

  const quizForm = document.getElementById("quiz-form");
  quizElements.submitButton = document.querySelector(".quiz__submit-btn");

  setupAutoAdvance();
  quizForm.addEventListener("submit", (event) => handleQuizSubmit(event, quizForm));
}

function handleQuizSubmit(event, form) {
  event.preventDefault();

  const score = calculateScore(form);
  const message = getResultMessage(score);
  const tips = getTipsByScore(score);

  quizElements.resultText.textContent = message;
  quizElements.scoreText.textContent = `Score: ${score} / 15`;
  renderTips(tips);

  quizElements.introSection.classList.add("hidden");
  quizElements.resultSection.classList.remove("hidden");

  if (quizElements.submitButton) {
    quizElements.submitButton.classList.add("hidden");
  }

  storeLastResult(score);
  renderLastResult();
  fetchRandomJoke();
  startJokeRotation();
}

function handleQuizRetry() {
  const form = document.getElementById("quiz-form");

  if (form) {
    form.remove();
  }

  stopJokeRotation();
  quizElements.progressBar = null;
  quizElements.progressText = null;

  quizElements.resultSection.classList.add("hidden");
  quizElements.introSection.classList.remove("hidden");
}

function initializeQuiz() {
  renderLastResult();
  quizElements.startButton.addEventListener("click", handleQuizStart);
  quizElements.retryButton.addEventListener("click", handleQuizRetry);
}

document.addEventListener("DOMContentLoaded", initializeQuiz);
