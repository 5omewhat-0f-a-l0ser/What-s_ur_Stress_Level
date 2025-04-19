const startQuizBtn = document.querySelector(".quiz__start-btn");
const quizInput = document.querySelector(".quiz__input");
const submitQuiz = document.querySelector(".quiz__submit-btn");

const quizQuestion = document.querySelector(".quiz__question");
const quizAnswer =document.querySelector(".quiz__answer");

const quizTemplate = document.querySelector("#quiz");
const quizTemplateContent = quizTemplate.textContent.clonenode(true);

const quizEl = document.querySelector(".quiz");
const questions = [{
    question: "How often do you lose focus?", answer: '0,2', options: [{title: 'Always'}, {title: 'Sometimes'}, {title: "Rarely"}]},
    {question: "Do you tend to lost your temper over small things?", answer: '1,2', options:  [{title: 'Always'}, {title: 'Sometimes'}, {title: "Rarely"}] },
    {question: "How often do you get at least 8 hours of sleep?", answer: '0,1', options: [{title: 'Always'}, {title: 'Sometimes'}, {title: "Rarely"}]},
    {question: "Do you drink coffee or any caffiene?", answer: '0,2', options: [{title: 'Always'}, {title: 'Sometimes'}, {title: "Rarely"}]},
    {question: "Have you ever screamed into a pillow to prevent yourself from saying something that will get you in trouble?", answer: '0,1', options: [{title: 'Always'}, {title: 'Sometimes'}, {title: "Rarely"}]
}];
let currentQuestion = 0;
let submitted = false;



div.innerHTML = `
<h3>${quizQuestion}</h3>
<form id="quiz">
    <input type="radio" id="0" name="option" value="0">
    <label for="0">${quizAnswer.options[0].title}

`