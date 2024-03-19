// Import the functions you need from the SDKs you need
import { toastGreen, toastRed } from "../Templates/toast.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
    ref,
    set,
    getDatabase,
    push,
    onValue,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCMMYssPldG91mp2lqk04Ee6ra0BedgDEk",
    authDomain: "assignment-19-jp.firebaseapp.com",
    databaseURL: "https://assignment-19-jp-default-rtdb.firebaseio.com",
    projectId: "assignment-19-jp",
    storageBucket: "assignment-19-jp.appspot.com",
    messagingSenderId: "64198250010",
    appId: "1:64198250010:web:d825229ed52c0cf30e4ba3",
    measurementId: "G-METGCEJTNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();
const auth = getAuth();


var questions = [
    {
        question: "HTML Stands For?",
        options: ["Hyper Text Makeup Language",
            "html",
            "Cascading Style Sheets",
            "Hypertext markup language"
        ],
        correctAns: "Hypertext markup language",
    },
    {
        question: "Css Stands For?",
        options: [
            "Cascading Style Sheets",
            "Java",
            "Ram",
            "Hypertext markup language"
        ],
        correctAns: "Cascading Style Sheets",
    },
    {
        question: "Js Stands For?",
        options: [
            "Java Style",
            "JavaScript",
            "Script",
            "Script Src"
        ],
        correctAns: "JavaScript",
    },
    {
        question: "Dom Stands For?",
        options: [
            "Document Object Model",
            "html",
            "Css",
            "Java"
        ],
        correctAns: "Document Object Model",
    },
    {
        question: "Ram Stands For?",
        options: [
            "Read Only Memory",
            "Dom",
            "Random Acccess Memory",
            "For Pc"
        ],
        correctAns: "Random Acccess Memory",
    },
    {
        question: "Rom Stands For?",
        options: [
            "Hyper Text Markup Language",
            "html",
            "HTML",
            "Read Only Memory"
        ],
        correctAns: "Read Only Memory",
    },
];

var modalHeading = document.getElementById("modalHeading");
var modalBody = document.getElementById("modalBody");
var modalBtn = document.getElementById("modalButton");
var modalElement = document.getElementById("modalContainer");
var modalContainer = new bootstrap.Modal(
    document.getElementById("modalContainer")
);

var QuizContainer1 = document.getElementById('QuizContainer1');
var quizContainer = document.querySelector('.quizContainer');
var mainContainer = document.querySelector('.mainContainer');
var resultContainer = document.querySelector('.resultContainer');
var question = document.getElementById('question');
var options = document.getElementById('answersBtnContainer');
var marksSpan = document.getElementById('marks');
var resultMarks = document.getElementById('resultMarks');
var resultMarksEnd = document.getElementById('resultMarksEnd');
var marksEnd = document.getElementById('marksEnd');
var currentQuestion = document.getElementById('starting');
var totalQuestion = document.getElementById('ending');
var nextBtn = document.getElementById('nextBtn');
var index = 0;
var marks = 0;

var userDetailsObj = JSON.parse(localStorage.getItem('userDetails'));
if (userDetailsObj == null || Object.keys(userDetailsObj).length === 0) {
    modalHeading.classList.add('text-danger')
    modalHeading.classList.remove('text-success')
    modalHeading.innerHTML = `Something went Wrong! <i class="fa-solid fa-circle-xmark"></i>`
    modalBody.innerHTML = "We encountered an issue while trying to sign you in. Please try again."
    modalBtn.classList.add("btn-danger")
    modalBtn.classList.remove("btn-success")
    modalBtn.innerHTML = "Go back"
    modalContainer.show();
    modalElement.addEventListener('hidden.bs.modal', () => {
        window.location.href = "../index.html";
    });
}

document.querySelector('.userNameSpan').innerHTML = userDetailsObj.name;
document.querySelector('.userProfilePicImg').setAttribute("src", userDetailsObj.userProfilePic)

window.signOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    modalHeading.classList.remove('text-danger')
    modalHeading.classList.add('text-success')
    modalHeading.innerHTML = `Sign out Successful <i class="fa-solid fa-circle-check"></i>`
    modalBody.innerHTML = "You have successfully signed out."
    modalContainer.show()
    modalElement.addEventListener('hidden.bs.modal', () => {
        window.location.href = "../index.html";
    });
}

window.sampleQuiz = (e) => {
    e.preventDefault();
    quizContainer.style.transform = "scale(0)";
    quizContainer.style.display = "flex";
    setTimeout(() => {
        QuizContainer1.style.display = "none";
    }, 350);
    quizContainer.offsetHeight;
    quizContainer.style.transform = "scale(1)";
}

window.gotoHome = () => {
    quizContainer.style.transform = "scale(1)";
    quizContainer.style.display = "flex";
    QuizContainer1.style.display = "none";
    QuizContainer1.offsetHeight;
    QuizContainer1.style.display = "flex";
    quizContainer.offsetHeight;
    quizContainer.style.transform = "scale(0)";
    tryAgain();
}


let questionCounter = 1;
let quizInputsArr = [];

var style = 0;
function transform() {
    style = style + 334.2
    return style;
}

window.addAnotherQuestion = () => {
    var quizQnAContainer = document.getElementById('quizQnAContainer')
    const questionInputs = document.querySelectorAll('.quizInputs');
    for (const input of questionInputs) {
        if (input.value.trim() === "") {
            toastRed("Please fill all the required fields.");
            return;
        }
    }
    document.getElementById("QNO2").innerHTML = questionCounter + 1;
    questionCounter++;
    const newQuestion = `
    <div class="col-lg-8 col-12">
        <div class="questionContainer1">
            <h2>Enter Quiz Question</h2>
            <input type="text" class="quizInputs" placeholder="Quiz Question" id="quizQuestion${questionCounter}">
        </div>
        <div class="questionContainer1 my-4">
            <h2>Enter Correct Answer</h2>
            <input type="text" class="quizInputs" placeholder="Quiz Answer" id="quizAnswer${questionCounter}">
        </div>
        <span id="QuizMakeSpan-Visible" class="text-white-50">NOTE: Kindly ensure that one of the options provided represents the correct answer. This is crucial for the functionality and accuracy of your quiz.</span>
    </div>
    <div class="answersBtnContainer1 col-lg-4 col-12" id="answersBtnContainer1">
        <h2>Enter Options</h2>
        <input type="text" class="quizInputs" placeholder="Option 1" id="quizOption${questionCounter}a">
        <input type="text" class="quizInputs" placeholder="Option 2" id="quizOption${questionCounter}b">
        <input type="text" class="quizInputs" placeholder="Option 3" id="quizOption${questionCounter}c">
        <input type="text" class="quizInputs" placeholder="Option 4" id="quizOption${questionCounter}d">
    </div>

    <div>
        <span id="QuizMakeSpan-Invisible" class="text-white-50 mt-3">NOTE: Kindly ensure that one of the options provided represents the correct answer. This is crucial for the functionality and accuracy of your quiz.</span>
    </div>`;
    quizQnAContainer.style.transform = `translateY(-${transform()}px)`

    quizQnAContainer.insertAdjacentHTML('beforeend', newQuestion);
}

document.getElementById('quizTitle').addEventListener('keydown', function (event) {
    if (event.keyCode === 9) {
        event.preventDefault();
    }
});

var NextStep = document.querySelector(".NextStep");
var currentStep = document.querySelector(".currentStep");
var thirdStep = document.querySelector(".thirdStep");
var stepIteration = 1;
window.MakeQuizNext = () => {
    document.getElementById('questionsAdded').innerHTML = questionCounter;
    const quizTitle = document.getElementById('quizTitle').value;
    document.getElementById('titleName').innerHTML = quizTitle;

    MakeQuizNextBtn.innerHTML = "Next Step"
    if (quizTitle.trim() === "") {
        toastRed("Please fill out the required field.");
        return;
    }

    const questionInputs = document.querySelectorAll('.quizInputs');
    for (const input of questionInputs) {
        if (stepIteration == 2 && input.value.trim() === "") {
            toastRed("Please fill all the required fields.");
            return;
        }
    }

    const firstQuestion = {
        title: quizTitle,
        question: document.getElementById('quizQuestion1').value,
        answer: document.getElementById('quizAnswer1').value,
        options: [
            document.getElementById('quizOption1a').value,
            document.getElementById('quizOption1b').value,
            document.getElementById('quizOption1c').value,
            document.getElementById('quizOption1d').value
        ]
    };

    NextStep.style.left = "0px";
    currentStep.style.right = "1260px";
    if (stepIteration == 2) {
        NextStep.style.left = "-1260px";
        thirdStep.style.left = "0px";
        MakeQuizNextBtn.innerHTML = "Add to Your Quizzes"
        quizInputsArr.unshift(firstQuestion);

        for (let i = 2; i <= questionCounter; i++) {
            const questionInput = document.getElementById(`quizQuestion${i}`).value;
            const answerInput = document.getElementById(`quizAnswer${i}`).value;
            const optionsInput = [
                document.getElementById(`quizOption${i}a`).value,
                document.getElementById(`quizOption${i}b`).value,
                document.getElementById(`quizOption${i}c`).value,
                document.getElementById(`quizOption${i}d`).value
            ];
            const questionData = { question: questionInput, answer: answerInput, options: optionsInput };
            quizInputsArr.push(questionData);
        }
    }

    if (stepIteration == 3) {
        NextStep.style.left = "-1260px";
        thirdStep.style.left = "0px";

        var quizObj = {
            quiz: JSON.stringify(quizInputsArr),
            id: push(ref(database, `Users/${userDetailsObj.id}/Quizzes`)).key
        }
        var reference = ref(database, `Users/${userDetailsObj.id}/Quizzes/${quizObj.id}`)
        set(reference, quizObj).then(() => {
            toastGreen("Congratulations! Quiz Successfully added to Your Quizzes");
        }).catch(() => {
            toastGreen("Oops! something went wrong. Please Try Again");
        })

        for (const input of questionInputs) {
            input.value = "";
        }
        stepIteration = 0;
        questionCounter = 1;
        currentStep.style.right = "0px";
        NextStep.style.left = "1260px";
        thirdStep.style.left = "1260px";
    }
    stepIteration++;
    document.getElementById('QNO').innerHTML = stepIteration;
}


function renderEverything() {
    marksSpan.innerHTML = marks;
    marksEnd.innerHTML = questions.length;
    currentQuestion.innerHTML = index + 1;
    totalQuestion.innerHTML = questions.length;

    question.innerHTML = `${index + 1}. ${questions[index].question}`;

    options.innerHTML = "";
    for (let i = 0; i < questions[index].options.length; i++) {
        var correctAns = questions[index].correctAns;
        var currentOption = questions[index].options[i];
        options.innerHTML += `<button onclick="checkQuestion('${currentOption}', '${correctAns}', this)">${questions[index].options[i]}</button>`
    }
}
renderEverything()

window.checkQuestion = (currentOption, correctAns, element) => {
    var buttons = options.getElementsByTagName("button");
    var correctButton;
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].innerHTML === correctAns) {
            correctButton = buttons[i];
            break;
        }
    }
    if (currentOption == correctAns) {
        element.setAttribute('class', 'correct')
        console.log(element);
        marks++;
    } else {
        element.setAttribute('class', 'wrong')
        correctButton.setAttribute('class', 'correct')
    }
    for (let i = 0; i < options.children.length; i++) {
        options.children[i].classList.add('disabled')
    }
    nextBtn.style.pointerEvents = "all"
    nextBtn.style.backgroundColor = "#c40094"
}

window.next = () => {
    nextBtn.style.pointerEvents = "none"
    if (index + 1 == questions.length) {
        showResult()
    } else {
        index++;
        nextBtn.style.pointerEvents = "none";
        nextBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    }
    renderEverything()
}

function showResult() {
    resultMarks.innerHTML = marks;
    resultMarksEnd.innerHTML = questions.length;
    mainContainer.style.transform = "scale(0)"
    setTimeout(() => {
        resultContainer.style.display = "flex"
        mainContainer.style.display = "none"
        setTimeout(() => {
            resultContainer.style.transform = "scale(1)"
        }, 300);
    }, 200);

    var circularProgress = document.getElementById('percentContainer');
    var progressValue = document.getElementById('percentSpan');
    let progressStartValue = 0;
    let progressEndValue = ((marks / questions.length) * 100).toFixed(0);
    setTimeout(() => {
        let progress = setInterval(() => {
            progressStartValue++;
            if (progressStartValue == progressEndValue) {
                clearInterval(progress)
            }
            progressValue.innerHTML = `${progressStartValue}%`
            circularProgress.style.background = `conic-gradient(#c40094, ${progressStartValue * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`
        }, 20);
    }, 400);
}

window.tryAgain = () => {
    index = 0;
    marks = 0;
    resultContainer.style.transform = "scale(0)"
    setTimeout(() => {
        resultContainer.style.display = "none"
        mainContainer.style.display = "block"
        setTimeout(() => {
            mainContainer.style.transform = "scale(1)"
            nextBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            renderEverything()
        }, 300);
    }, 200);
}