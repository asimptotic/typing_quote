//memuat file suara
const keySound = new Audio('sounds/typewriter-soft-click.wav');
const successSound = new Audio('sounds/success.wav');


const quoteDisplay = document.getElementById("quote");
const input = document.getElementById("input");
const timerElement = document.getElementById("timer");
const result = document.getElementById("result");
const restartBtn = document.getElementById("restart");
const startBtn = document.getElementById("start");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("container");
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

let score = 0;
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
    result.textContent = "";
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
            gameContainer.classList.add("hidden");
            document.getElementById("duration-options").style.display = "block";
            result.innerHTML = `score: <b>${score}</b>`;
            restartBtn.style.display = "inline-block";
        }
    }

    requestAnimationFrame(update);
}

input.addEventListener("input", () => {
    const typedText = input.value;
    if (currentQuote.startsWith(typedText)){
        playKeySound();
        quoteDisplay.classList.remove('wrong');
    } else {
        quoteDisplay.classList.add('wrong');
    }

    if (typedText === currentQuote) {
        playSuccessSound();
        score++;
        input.value = '';
        getRandomQuote();
    }
});

startBtn.addEventListener("click", () => {
    const selectedDuration = document.querySelector('input[name="duration"]:checked');
    timer = parseInt(selectedDuration.value);
    
    score = 0;
    result.textContent = "";
    timerElement.textContent = `${timer}s`;
    input.disabled = false;
    input.focus();
    startBtn.style.display = "none";
    restartBtn.style.display = "none";
    startBtn.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    document.getElementById("duration-options").style.display = "none";
    startCountdown(getRandomQuote);
})

restartBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    const selectedDuration = document.querySelector('input[name="duration"]:checked');
    timer = parseInt(selectedDuration.value);

    score = 0;
    input.disabled = false;
    result.textContent= "";
    timerElement.textContent = `${timer}s`;
    input.focus();
    restartBtn.style.display = "none";
    restartBtn.classList.add('hidden');
    document.getElementById("duration-options").style.display = "none";
    startCountdown(getRandomQuote);
});


//memainkan suara saat mengetik huruf yang benar
function playKeySound(){
    keySound.currentTime = 0;
    keySound.play();
}

//memainkan suara quote selesai
function playSuccessSound(){
    successSound.currentTime = 0;
    successSound.play();
}


//cek mode sebelumnya
if (localStorage.getItem('darkMode') === 'enabled'){
    document.body.classList.add('dark-mode');
    modeIcon.src = 'images/dark.svg';
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    //simpan pilihan dark mode
    if (document.body.classList.contains('dark-mode')) {
        modeIcon.src = 'images/dark.svg';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        modeIcon.src = 'images/light.svg';
        localStorage.removeItem('darkMode');
    }
});

muteToggle.addEventListener('click', () => {
    isMuted = !isMuted;

    muteIcon.src = isMuted ? 'images/mute.svg' : 'images/sound.svg';

    keySound.muted = isMuted;
    successSound.muted = isMuted;
});