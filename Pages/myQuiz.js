// Import the functions you need from the SDKs you need
import { toastGreen, toastRed } from "../Templates/toast.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
    ref,
    set,
    getDatabase,
    push,
    onValue,
    remove
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

var modalHeading = document.getElementById("modalHeading");
var modalBody = document.getElementById("modalBody");
var modalBtn = document.getElementById("modalButton");
var modalElement = document.getElementById("modalContainer");
var modalContainer = new bootstrap.Modal(
    document.getElementById("modalContainer")
);

var accorContainer = document.getElementById('accordionPanelsStayOpenExample');

var QAdded = document.getElementById('QAdded');
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

var reference = ref(database, `Users/${userDetailsObj.id}/Quizzes/`)
onValue(reference, (data) => {
    if (!data.val()) {
        accorContainer.innerHTML = `
        <h2 class="text-white text-center mt-4">It seems like there are no quizzes added yet. Once you add them, they will appear here.</h2>
        <a href="makeQuiz.html" class="text-decoration-none">
            <button class="btn specialLink text-white btn-lg d-block m-auto">Add Your First Quiz</button>
        </a>`;
        return;
    }
    var quizArr = Object.values(data.val());
    QAdded.innerHTML = quizArr.length;
    accorContainer.innerHTML = "";
    for (let i = 0; i < quizArr.length; i++) {
        var quiz = JSON.parse(quizArr[i].quiz)
        accorContainer.innerHTML += `
        <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button accordionHeadings fs-3" type="button" data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapse${i}" aria-expanded="false"
                        aria-controls="panelsStayOpen-collapse${i}">
                        <div class="d-flex justify-content-between flex-column flex-md-row gap-3 w-100 align-items-center">
                            <span class="">${quiz[0].title}</span>
                            <div>
                                <span onclick="PlayQuiz(this)" id="${quizArr[i].id}" class="me-2 btn playQuizBtns btn-warning btn-lg">Play This quiz</span>
                                <span onclick="DeleteQuiz(this)" id="${quizArr[i].id}" class="me-2 btn playQuizBtns btn-danger btn-lg">Delete</span>
                            </div>
                        </div>
                    </button>
                </h2>
                <div id="panelsStayOpen-collapse${i}" class="accordion-collapse collapse">
                    <div class="accordion-body accordionHeadingBody">
                        <h2 class="fs-3"><b>Questions</b></h2>
                        <div class="accorQuestionContainer accorQuestionContainer${i}">
                        </div>
                    </div>
                </div>
            </div>
        `
        var accorQContainer = document.querySelectorAll(`.accorQuestionContainer${i}`);
        for (let index = 0; index < quiz.length; index++) {
            accorQContainer.forEach(e => {
                e.innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button fs-4" type="button" data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapse${i}Questions${index}" aria-expanded="false"
                        aria-controls="panelsStayOpen-collapse${i}Questions${index}">
                        ${quiz[index].question}
                    </button>
                </h2>
                <div id="panelsStayOpen-collapse${i}Questions${index}" class="accordion-collapse collapse">
                    <div class="accordion-body accordionInQBody">
                        <h3><b>Answer</b></h3>
                        <p class="ms-4 fs-5">${quiz[index].answer}</p>
                        <h3><b>Options</b></h3>
                        <ul class="fs-5">
                            <li>${quiz[index].options[0]}</li>
                            <li>${quiz[index].options[1]}</li>
                            <li>${quiz[index].options[2]}</li>
                            <li>${quiz[index].options[3]}</li>
                        </ul>
                    </div>
                </div>
            </div>
            `
            });
        }
    }
})

window.DeleteQuiz = (elem) => {
    var modalFooter = document.querySelector('.modal-footer')
    modalHeading.classList.add('text-danger')
    modalHeading.classList.remove('text-success')
    modalHeading.innerHTML = `Confirm Quiz Deletion`
    modalBody.innerHTML = "Are you sure you want to delete this quiz? This action cannot be undone."
    modalFooter.innerHTML = `
    <button type="button" class="btn btn-danger" id="modalButton1"
    data-bs-dismiss="modal">Yes, Delete!</button>
    <button type="button" class="btn btn-success" id="modalButton2"
    data-bs-dismiss="modal">No, Cancel!</button>`
    modalContainer.show();
    modalElement.addEventListener('hidden.bs.modal', () => {
        return;
    });
    document.getElementById("modalButton2").addEventListener('click', () => {
        modalContainer.hide();
        return;
    })
    document.getElementById("modalButton1").addEventListener('click', () => {
        var reference1 = ref(database, `Users/${userDetailsObj.id}/Quizzes/${elem.id}`);
        remove(reference1).then(() => {
            toastGreen("Quiz Successfully Deleted!")
        })
    })
}

var specificQuizArr;
window.PlayQuiz = (elem) => {
    var reference1 = ref(database, `Users/${userDetailsObj.id}/Quizzes/${elem.id}`);
    onValue(reference1, (snapshot) => {
        specificQuizArr = JSON.parse(snapshot.val().quiz);
        console.log(specificQuizArr)
        sampleQuiz1();
        renderEverything1()

    });
}

window.sampleQuiz1 = () => {
    quizContainer.style.transform = "scale(0)";
    quizContainer.style.display = "flex";
    quizContainer.style.backgroundColor = "#0a001e";
    accorContainer.style.transform = "scale(1)"
    accorContainer.offsetHeight;
    accorContainer.style.transform = "scale(0)"
    quizContainer.offsetHeight;
    quizContainer.style.transform = "scale(1)";
}

window.gotoHome = () => {
    quizContainer.style.transform = "scale(1)";
    quizContainer.style.display = "flex";
    accorContainer.style.transform = "scale(0)"
    accorContainer.offsetHeight;
    quizContainer.offsetHeight;
    accorContainer.style.transform = "scale(1)"
    quizContainer.style.transform = "scale(0)";
    tryAgain1();
}

var index = 0;
var marks = 0;
function renderEverything1() {
    marksSpan.innerHTML = marks;
    marksEnd.innerHTML = specificQuizArr.length;
    currentQuestion.innerHTML = index + 1;
    totalQuestion.innerHTML = specificQuizArr.length;

    question.innerHTML = `${index + 1}. ${specificQuizArr[index].question}`;

    options.innerHTML = "";
    for (let i = 0; i < specificQuizArr[index].options.length; i++) {
        var correctAns = specificQuizArr[index].answer;
        var currentOption = specificQuizArr[index].options[i];
        options.innerHTML += `<button onclick="checkQuestion1('${currentOption}', '${correctAns}', this)">${specificQuizArr[index].options[i]}</button>`
    }
}

window.checkQuestion1 = (currentOption, correctAns, element) => {
    var buttons = options.getElementsByTagName("button");
    console.log(buttons)
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

window.next1 = () => {
    nextBtn.style.pointerEvents = "none"
    if (index + 1 == specificQuizArr.length) {
        showResult1()
    } else {
        index++;
        nextBtn.style.pointerEvents = "none";
        nextBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    }
    renderEverything1()
}

function showResult1() {
    resultMarks.innerHTML = marks;
    resultMarksEnd.innerHTML = specificQuizArr.length;
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
    let progressEndValue = ((marks / specificQuizArr.length) * 100).toFixed(0);
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

window.tryAgain1 = () => {
    index = 0;
    marks = 0;
    resultContainer.style.transform = "scale(0)"
    setTimeout(() => {
        resultContainer.style.display = "none"
        mainContainer.style.display = "block"
        setTimeout(() => {
            mainContainer.style.transform = "scale(1)"
            nextBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            renderEverything1()
        }, 300);
    }, 200);
}