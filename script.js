//memuat file suara
const keySound = new Audio('sounds/typewriter-soft-click.wav');
const successSound = new Audio('sounds/success.wav');
const compSound = new Audio('sounds/level-completed.mp3');

const quoteDisplay = document.getElementById("quote");
const input = document.getElementById("input");
const timerElement = document.getElementById("timer");
const restartBtn = document.getElementById("restart");
const startBtn = document.getElementById("start");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("container");
const scoreElement = document.getElementById("score");
const accuracyElement = document.getElementById("accuracy");
const countdownElement = document.getElementById("countdown");
const progressBar = document.getElementById("progress-bar");
const darkModeToggle = document.getElementById('dark-mode-toggle');
const muteToggle = document.getElementById("mute-toggle");
const modeIcon = document.getElementById("mode-icon");
const muteIcon = document.getElementById("mute-icon");


const quotes = [
    "Be yourself; everyone else is already taken.",
    "Do what you can, with what you have, where you are.",
    "Believe you can and you're halfway there.",
    "You miss 100% of the shots you don't take.",
    "Happiness depends upon ourselves.",
    "Everything you can imagine is real.",
    "Dream big and dare to fail.",
    "What we think, we become.",
    "If you're going through hell, keep going.",
    "Turn your wounds into wisdom."
];

let correctTypedChars = 0;
let totalTypedChars = 0;
let score = 0;
let lastTypedLength = 0;
let timer = 60 ;
let timeLeft = timer;
let timerInterval;
let currentQuote = "";
let isMuted = false;

function startCountdown(callback){
    let count = 3;
    gameContainer.classList.add('hidden');
    countdownElement.classList.remove('hidden');
    countdownElement.textContent = count;
    countdownElement.style.animation = 'none';
    void countdownElement.offsetWidth;
    countdownElement.style.animation = 'pop 1s ease-in-out';

    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownElement.textContent = count === 0 ? 'Go!' : count;
            countdownElement.style.animation = 'none';
            void countdownElement.offsetWidth;
            countdownElement.style.animation = 'pop 1s ease-in-out';
        } else if (count === 0){
            countdownElement.textContent = "Go!";
            countdownElement.style.animation = 'none';
            void countdownElement.offsetWidth;
            countdownElement.style.animation = 'pop 1s ease-in-out';
        } else {
            clearInterval(interval);
            countdownElement.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            callback();
            startTimer();
        }
    }, 1000);
}

function getRandomQuote(){
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];
    quoteDisplay.textContent = currentQuote;
    input.value = "";
    input.focus();
}

function startTimer(){
    const startTime = Date.now();
    const endTime = startTime + timer * 1000;

    function update(){
        const now = Date.now();
        timeLeft = Math.max(0, Math.floor((endTime-now)/1000));
        const progressPercent = ((endTime-now)/(timer*1000)) * 100;

        timerElement.textContent = ` ${timeLeft}s`;
        progressBar.style.width = `${progressPercent}%`;

        if (now < endTime){
            requestAnimationFrame(update);
        } else {
            input.disabled = true;
            compSound.play();
            compSound.volume = 0.6;
            gameContainer.classList.add("hidden");
            endGame();
        }
    }

    requestAnimationFrame(update);
}

function updateStats() {
    const accuracy = totalTypedChars > 0
        ? ((correctTypedChars / totalTypedChars) * 100).toFixed(2)
        : 100;
    scoreElement.textContent = `Quotes: ${score}`;
    accuracyElement.textContent = `Accuracy: ${accuracy}%`;
}

function resetGameState(){
    // reset semua variabel
    score = 0;
    correctTypedChars = 0;
    totalTypedChars = 0;
    lastTypedLength = 0;
    input.value= '';
    updateStats();
    clearInterval(timerInterval);
}

function showStartScreen(){
    // tampilkan opsi durasi & tombol mulai
    document.getElementById("duration-options").classList.remove('hidden');
    document.getElementById("duration-options").style.display = "block";
    
    startBtn.classList.remove('hidden');
    startBtn.style.display = "inline-block";

    gameContainer.classList.add('hidden');
    restartBtn.style.display = "none";

    document.getElementById("game-summary").classList.add('hidden');
    document.getElementById("game-summary").innerHTML="";
}

function startGame() {
    const selectedDuration = document.querySelector('input[name="duration"]:checked');
    timer = parseInt(selectedDuration.value);
    
    resetGameState();
    input.disabled = false;
    input.focus();

    startBtn.style.display = "none";
    startBtn.classList.add('hidden');
    document.getElementById("duration-options").style.display = "none";
    gameContainer.classList.remove('hidden');
    
    startCountdown(getRandomQuote);
}

function endGame(){
    input.disabled = true;    
    restartBtn.style.display = "inline-block";
    restartBtn.classList.remove('hidden');

    const accuracy = totalTypedChars > 0
        ? ((correctTypedChars / totalTypedChars) * 100).toFixed(2)
        : 0;
    
    const summary = `
        <p class ="summary-line">You typed <strong>${totalTypedChars}</strong> characters,</p>
        <p class ="summary-line">with <strong>${accuracy}%</strong> accuracy.</p>
        <p class ="summary-line">A silent script, well played.</p>
    `;
    document.getElementById("game-summary").innerHTML=summary;
    document.getElementById("game-summary").classList.remove('hidden');
    fadeIn(document.getElementById("game-summary"));
}

function fadeIn(element){
    element.classList.add('fade');
    setTimeout(() => {
        element.classList.add('show');
    }, 10);
}

function fadeOut(element, callback) {
    element.classList.remove('show');
    setTimeout(() => {
        element.classList.remove('fade');
        if (callback) callback();
    }, 500);
}

//memainkan suara saat mengetik huruf yang benar
function playKeySound(){
    keySound.currentTime = 0;
    keySound.play();
}

//memainkan suara quote selesai
function playSuccessSound(){
    successSound.currentTime = 0;
    successSound.volume = 0.6;
    successSound.play();
}

input.addEventListener("input", () => {
    const typedText = input.value;
    const expectedText = currentQuote.substring(0, typedText.length);

    //cek apakah ada karakter baru yang ditambahkan (bukan dihapus)
    if (typedText.length > lastTypedLength) {
        const index = typedText.length - 1
        const newChar = typedText[index];
        const expectedChar = currentQuote[index];

        totalTypedChars++;

        if (newChar === expectedChar){
            correctTypedChars++;
        }
    }

    lastTypedLength = typedText.length;

    //cek apakah masih sesuai
    if (currentQuote.startsWith(typedText)){
        playKeySound();
        quoteDisplay.classList.remove('wrong');
    } else {
        quoteDisplay.classList.add('wrong');
        setTimeout(() => {
            quoteDisplay.classList.remove('wrong');
        }, 300);
    }

    //cek kalau quote selesai
    if (typedText === currentQuote) {
        playSuccessSound();
        score++;
        input.value = '';
        lastTypedLength = 0;
        getRandomQuote();
    } 
    
    updateStats();
    
});

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", () => {
    showStartScreen();    
});

document.addEventListener("keydown", function (e){
    const gameSummaryVisible = !document.getElementById("game-summary").classList.contains("hidden");

    if (e.key === "Enter" && gameSummaryVisible){
        showStartScreen();
    }
});

//cek mode sebelumnya
if (localStorage.getItem('darkMode') === 'enabled'){
    document.body.classList.add('dark-mode');
    modeIcon.src = 'images/light.svg';
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    //simpan pilihan dark mode
    if (document.body.classList.contains('dark-mode')) {
        modeIcon.src = 'images/light.svg';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        modeIcon.src = 'images/dark.svg';
        localStorage.removeItem('darkMode');
    }
});

muteToggle.addEventListener('click', () => {
    isMuted = !isMuted;

    muteIcon.src = isMuted ? 'images/sound.svg' : 'images/mute.svg';

    keySound.muted = isMuted;
    successSound.muted = isMuted;
    compSound.muted = isMuted;
});