// DOM Elements
const quizElements = {
  startButton: document.querySelector(".quiz__start-btn"),
  introSection: document.querySelector(".quiz__intro"),
  resultSection: document.querySelector(".quiz__result"),
  resultText: document.querySelector(".quiz__result-text"),
  retryButton: document.querySelector(".quiz__retry-btn"),
  template: document.getElementById("quiz-template"),
};

// Utility Functions
function calculateScore(form) {
  let total = 0;
  const formData = new FormData(form);
  for (let [, value] of formData.entries()) {
    total += parseInt(value);
  }
  return total;
}

function getResultMessage(score) {
  if (score <= 4) return "😌 You're super chill. Keep doing you!";
  if (score <= 7) return "🙂 You're doing okay, just take some mindful breaks.";
  if (score <= 10) return "😬 You're feeling it — maybe step away for a bit.";
  return "😱 You're very stressed. Deep breath. Water. Rest.";
}

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
function handleQuizStart() {
  const clone = quizElements.template.content.cloneNode(true);
  document.querySelector("main").appendChild(clone);
  quizElements.introSection.style.display = "none";

  const quizForm = document.getElementById("quiz-form");
  setupAutoAdvance();

  quizForm.addEventListener("submit", (e) => handleQuizSubmit(e, quizForm));
}

function handleQuizSubmit(evt, form) {
  evt.preventDefault();
  const score = calculateScore(form);
  const message = getResultMessage(score);

  quizElements.resultText.textContent = message;
  form.style.display = "none";
  quizElements.resultSection.style.display = "block";
}

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
