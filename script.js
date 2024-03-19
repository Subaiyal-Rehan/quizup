// Import the functions you need from the SDKs you need
import { toastGreen, toastRed } from "./Templates/toast.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
    ref,
    set,
    getDatabase,
    push,
    onValue,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import {
    getStorage,
    ref as strRef,
    uploadBytesResumable,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
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
const storage = getStorage();

function generateRandomKey() {
    const randomString = Math.random().toString(36).substring(2, 10);
    const timestamp = new Date().getTime();
    const key = timestamp + '_' + randomString;
    return key;
}

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
var modalHeading = document.getElementById("signinModalHeading");
var modalBody = document.getElementById("signinModalBody");
var modalDialog = document.getElementById("modalDialog");
var modalElement = document.getElementById("modalContainer");
var modalContainer = new bootstrap.Modal(
    document.getElementById("modalContainer")
);


var quizContainer = document.querySelector('.quizContainer');
var navbarUl = document.getElementById('navbarUl');
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

var userDetailsObj = {}
var storedUserDetailsObj = {};
window.profileImageDownloadURL = null;
window.uploadProfile = () => {
    var fileInput = document.getElementById("imageInput");
    const storageRef = strRef(storage, `Users Profile Pic/${generateRandomKey()}`);
    const file = fileInput.files[0];
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
        (snapshot) => {
            var uploadImgLabel = document.querySelector('.uploadImgLabel');
            let progressStartValue = 0;
            let progressEndValue = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            let interval = setInterval(() => {
                progressStartValue++;
                if (progressStartValue == progressEndValue) {
                    clearInterval(interval)
                }
                uploadImgLabel.style.background = `conic-gradient(#c40094, ${progressStartValue * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`
            }, 20);
        },
        (error) => {
            toastRed("Oops! Something went wrong. Please try again later.")
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                var uploadImageIn = document.getElementById('uploadImageIn');
                uploadImageIn.innerHTML = `<img class="object-fit-cover" src="${downloadURL}" width="100%" height="100%">`
                window.profileImageDownloadURL = downloadURL;
                document.getElementById("signupBtn").style.pointerEvents = "all";
                document.getElementById("signupBtn").style.opacity = "1";
            });
        }
    );
}



window.loginSignup = (order) => {
    modalDialog.classList.add('modal-dialog-centered');
    if (order == "signup") {
        modalHeading.innerHTML = "Please Signup"
        modalBody.innerHTML = `
        <form class="row" onsubmit="SignUpFormSubmitted(event)">
            <div id="modalEmailDiv" class="col-8">
                <div class="form-floating mb-3">
                    <input required type="text" class="form-control rounded-3" id="floatingInputName"
                        placeholder="User Name">
                    <label for="floatingInputName">User Name</label>
                </div>
                <div class="form-floating mb-3">
                    <input required type="email" class="form-control rounded-3" id="floatingInputEmail"
                        placeholder="name@example.com">
                    <label for="floatingInputEmail">Email address</label>
                </div>
                <div class="form-floating mb-3">
                    <input required type="password" class="form-control rounded-3" id="floatingPassword"
                        placeholder="Password">
                    <label for="floatingPassword">Password</label>
                </div>
            </div>
            <div id="modalPicDiv" class="col-4">
                <input onchange="uploadProfile()" type="file" accept="image/*" id="imageInput">
                <label class="uploadImgLabel" for="imageInput">
                    <div class="rounded-circle w-100 h-100 d-flex justify-content-center align-items-center overflow-hidden"
                        id="uploadImageIn">
                        <i class="fa fa-cloud-arrow-up"></i>
                    </div>
                </label>
            </div>
            <button id="signupBtn" class="w-100 mb-2 btn btn-lg rounded-3 specialLink text-white"
                type="submit">Sign
                up</button>
            <small class="text-body-secondary">By clicking Sign up, you agree to the terms of use.</small>
        </form>`
        modalContainer.show()

        function handleMediaQueryChange(mediaQuery) {
            var modalEmailDiv = document.getElementById("modalEmailDiv");
            var modalPicDiv = document.getElementById("modalPicDiv");
            if (!modalEmailDiv || !modalPicDiv) {
                return;
            }
            if (mediaQuery.matches) {
                modalEmailDiv.classList.remove('col-8');
                modalEmailDiv.classList.add('col-12');
                modalPicDiv.classList.remove('col-4');
                modalPicDiv.classList.add('col-12');
            } else {
                modalEmailDiv.classList.add('col-8');
                modalEmailDiv.classList.remove('col-12');
                modalPicDiv.classList.add('col-4');
                modalPicDiv.classList.remove('col-12');
            }
        }
        const mediaQuery = window.matchMedia('(max-width: 991px)');
        handleMediaQueryChange(mediaQuery);
        mediaQuery.addListener(handleMediaQueryChange);

        window.SignUpFormSubmitted = (e) => {
            e.preventDefault();
            var userNameInp = document.getElementById('floatingInputName');
            var userEmailInp = document.getElementById('floatingInputEmail');
            var userPasswordInp = document.getElementById('floatingPassword');
            if (profileImageDownloadURL == null) {
                toastRed("Please upload an image")
                return;
            }

            userDetailsObj.name = userNameInp.value;
            userDetailsObj.email = userEmailInp.value;
            userDetailsObj.password = userPasswordInp.value;
            userDetailsObj.userProfilePic = profileImageDownloadURL;

            createUserWithEmailAndPassword(auth, userEmailInp.value, userPasswordInp.value)
                .then((response) => {
                    userDetailsObj.id = response.user.uid
                    var reference = ref(database, `Users/${userDetailsObj.id}/`)
                    set(reference, userDetailsObj)
                        .then((response) => {
                            toastGreen("Congratulations! Your account has been successfully created.")
                            storeLocalStorage(userDetailsObj)
                        }).catch((response) => {
                            toastRed("Oops! Something went wrong. Please try again later.")
                        })
                    modalContainer.hide()
                }).catch((response) => {
                    if (response.message == "Firebase: Error (auth/email-already-in-use).") {
                        toastRed("This email is already in use.")
                    } else if (response.message === "Firebase: Error (auth/network-request-failed).") {
                        toastRed("Unable to connect. Please check your internet connection and try again.")
                    } else if (response.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") { toastRed("Password must be atleast 6 characters") }
                    else { toastRed("Oops! Something went wrong. Please try again later.") }
                })
        }
    } else {
        modalHeading.innerHTML = "Please Login"
        modalBody.innerHTML = '';
        modalBody.innerHTML = `
            <form class="" onsubmit="loginFormSubmitted(event)">
                <div class="form-floating mb-3">
                    <input required type="email" class="form-control rounded-3" id="floatingInputEmail"
                        placeholder="name@example.com">
                    <label for="floatingInputEmail">Email address</label>
                </div>
                <div class="form-floating mb-3">
                    <input required type="password" class="form-control rounded-3" id="floatingPassword"
                        placeholder="Password">
                    <label for="floatingPassword">Password</label>
                </div>
                <button class="w-100 mb-2 btn btn-lg rounded-3 specialLink text-white" type="submit">Login</button>
                <small class="text-body-secondary">By clicking Login, you will be logged in.</small>
            </form>`
        modalContainer.show()

        window.loginFormSubmitted = (e) => {
            e.preventDefault();

            var userEmailInp = document.getElementById('floatingInputEmail');
            var userPasswordInp = document.getElementById('floatingPassword');

            signInWithEmailAndPassword(auth, userEmailInp.value, userPasswordInp.value)
                .then((response) => {
                    userDetailsObj.id = response.user.uid
                    var reference = ref(database, `Users/${userDetailsObj.id}/`)
                    onValue(reference, (data) => {
                        storeLocalStorage(data.val())
                    })
                    toastGreen("You've successfully logged in to your account.")
                    modalContainer.hide()
                })
                .catch((response) => {
                    if (response.message === "Firebase: Error (auth/invalid-credential).") {
                        toastRed("Authentication failed. Please verify your email and password.")
                    } else if (response.message == "Firebase: Error (auth/network-request-failed).") {
                        toastRed("Authentication failed. Please check your internet connection.")
                    } else { toastRed("Oops! Something went wrong. Please try again later.") }
                })
        }
    }
    modalElement.addEventListener('hidden.bs.modal', () => { modalDialog.classList.remove('modal-dialog-centered'); });
}

function checklocalStorage() {
    var storedUserDetailsString = localStorage.getItem('userDetails');
    if (storedUserDetailsString) { storedUserDetailsObj = JSON.parse(storedUserDetailsString); }
    else { storedUserDetailsObj = null; }
}

checklocalStorage()
storeLocalStorage(storedUserDetailsObj)
function storeLocalStorage(Obj) {
    if (Obj !== null && Object.keys(Obj).length !== 0) {
        localStorage.setItem('userDetails', JSON.stringify(Obj));
        storedUserDetailsObj = JSON.parse(localStorage.getItem('userDetails'));
        changeNavbar(true)
    } else { changeNavbar(false) }
}

window.signOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    if (profileImageDownloadURL !== null) {
        profileImageDownloadURL = ""
    }
    checklocalStorage();
    storeLocalStorage(storedUserDetailsObj)
}

function changeNavbar(userLoggedIn) {
    if (userLoggedIn) {
        navbarUl.innerHTML = `
        <li class="nav-item mx-1"><a href="#" class="rounded-0 nav-link text-white navActiveLink"
        aria-current="page">Home</a></li>
        <li onclick="makeYourQuiz(event, 'MakeQuiz')" class="nav-item mx-1"><a href="" class="rounded-0 nav-link text-white hoverEffect">Make Your Quiz</a></li>
        <li onclick="makeYourQuiz(event, 'YourQuiz')" class="nav-item mx-1"><a href="" class="rounded-0 nav-link text-white hoverEffect">My Quizzes</a></li>
        <li onclick="sampleQuiz(event)" class="nav-item mx-1"><a href=""
            class="rounded-0 nav-link text-white hoverEffect">Sample Quiz</a>
        </li>
        <li>
            <div class="dropdown text-end">
                <a href="#" class="specialLink rounded d-flex align-items-center p-2 gap-1 text-white d-block link-body-emphasis text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    <span class="me-1">${storedUserDetailsObj.name}</span>
                    <div class="profileImageDiv rounded-circle">
                        <img src="${storedUserDetailsObj.userProfilePic}" alt="mdo" width="100%" height="" class="userProfilePicImg">
                    </div>
                </a>
                <ul class="dropdown-menu text-small">
                    <li onclick="signOut(event)"><a class="dropdown-item" href="">Sign out</a></li>
                </ul>
            </div>
        </li>`
    } else {
        navbarUl.innerHTML = `
        <li class="nav-item mx-1"><a href="#" class="rounded-0 nav-link text-white navActiveLink"  aria-current="page">Home</a></li>
        <li onclick="makeYourQuiz(event, 'MakeQuiz')" class="nav-item mx-1"><a href="" class="rounded-0 nav-link text-white hoverEffect">Make Your Quiz</a></li>
        <li onclick="makeYourQuiz(event, 'YourQuiz')" class="nav-item mx-1"><a href="" class="rounded-0 nav-link text-white hoverEffect">My Quizzes</a></li>
        <li onclick="sampleQuiz(event)" class="nav-item mx-1"><a href="" class="rounded-0 nav-link text-white hoverEffect">Sample Quiz</a></li>
        <li onclick="loginSignup('login')" class="nav-item mx-1"><a href="#" class="nav-link text-white specialLink">Login</a></li>
        <li onclick="loginSignup('signup')" class="nav-item mx-1"><a href="#" class="nav-link text-white specialLink">Signup</a></li>`
    }
}


window.sampleQuiz = (e) => {
    e.preventDefault();
    quizContainer.style.transform = "scale(0)";
    quizContainer.style.display = "flex";
    quizContainer.offsetHeight;
    quizContainer.style.transform = "scale(1)";
}

window.gotoHome = () => {
    quizContainer.style.transform = "scale(1)";
    quizContainer.style.display = "flex";
    quizContainer.offsetHeight;
    quizContainer.style.transform = "scale(0)";
    tryAgain();
}

window.makeYourQuiz = (e, order) => {
    e.preventDefault();
    checklocalStorage();
    if (storedUserDetailsObj !== null) {
        if (order == "MakeQuiz") { window.location.href = "Pages/makeQuiz.html" }
        else { window.location.href = "Pages/myQuiz.html" }
    } else { toastRed("Please login to proceed.") }
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