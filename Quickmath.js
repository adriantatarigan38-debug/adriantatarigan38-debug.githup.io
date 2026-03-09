// Quickmath.js - Game QuickMath yang sudah diperbaiki

let currentQuestion = 0;
let score = 0;
let timeLeft = 10;
let timerInterval;
let gameData = [];
let currentAnswer = 0;

const startScreen = document.getElementById("start-screen");
const playScreen = document.getElementById("play-screen");
const resultScreen = document.getElementById("result-screen");
const inputField = document.getElementById("answer-input");
const progress = document.getElementById("progress");
const questionDisplay = document.getElementById("display-question");
const questNumberDisplay = document.getElementById("quest-number");
const finalScoreDisplay = document.getElementById("final-score");
const resultBody = document.getElementById("result-body");

// Event listener untuk tekan Enter
inputField.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const userAnswer = parseFloat(inputField.value);
        processAnswer(userAnswer);
    }
});

function startGame() {
    currentQuestion = 0;
    score = 0;
    gameData = [];
    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    playScreen.classList.remove("hidden");
    nextQuestion();
}

function generateQuestion() {
    const ops = ["+", "-", "*", "/"];
    
    // Level random
    const level = Math.floor(Math.random() * 3) + 1; // 1, 2, atau 3
    
    let a, b;
    
    switch(level) {
        case 1: // Satuan (1-10)
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
            break;
        case 2: // Puluhan (10-99)
            a = Math.floor(Math.random() * 20) + 10;
            b = Math.floor(Math.random() * 20) + 10;
            break;
        case 3: // Ratusan (100-999)
            a = Math.floor(Math.random() * 30) + 10;
            b = Math.floor(Math.random() * 30) + 10;
            break;
        default:
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
    }
    
    let op = ops[Math.floor(Math.random() * 4)];
    let qText = a + " " + op + " " + b;
    let ans = 0;
    
    // Validasi untuk pembagian
    if (op === "/") {
        // Buat pembagian yang menghasilkan bilangan bulat
        b = Math.floor(Math.random() * 9) + 1; // Pembagi kecil dulu
        a = a * b; // a jadi kelipatan b
        qText = a + " " + op + " " + b;
        ans = a / b;
    }
    // Validasi untuk pengurangan (hasil tidak negatif)
    else if (op === "-") {
        if (b > a) {
            [a, b] = [b, a];
            qText = a + " " + op + " " + b;
        }
        ans = a - b;
    }
    else {
        // Untuk penjumlahan dan perkalian
        if (op === "+") ans = a + b;
        if (op === "*") ans = a * b;
    }

    return { qText, ans };
}

function nextQuestion() {
    if (currentQuestion >= 10) {
        endGame();
        return;
    }

    currentQuestion++;
    questNumberDisplay.innerText = 'Soal ' + currentQuestion + ' / 10';
    
    const q = generateQuestion();
    questionDisplay.innerText = q.qText;
    currentAnswer = q.ans;

    inputField.value = "";
    inputField.focus();
    
    // Hapus class shake jika ada
    questionDisplay.classList.remove("shake");
    
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 10;
    progress.style.width = "100%";
    progress.style.transition = "none";

    // Force reflow
    progress.offsetHeight;

    progress.style.transition = "width 10s linear";
    progress.style.width = "0%";

    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft < 0) {
            processAnswer(null); // Waktu habis
        }
    }, 1000);
}

function processAnswer(userValue) {
    clearInterval(timerInterval);
    
    let isCorrect = false;
    let userAnswer = userValue;
    
    // Cek apakah jawaban benar
    if (userValue !== null && !isNaN(userValue)) {
        // Untuk pembagian, kita bandingkan dengan toleransi kecil
        if (Number.isInteger(currentAnswer)) {
            isCorrect = (userValue === currentAnswer);
        } else {
            // Untuk pembagian desimal, bulatkan ke 2 angka desimal
            isCorrect = (Math.abs(userValue - currentAnswer) < 0.01);
        }
    }
    
    // Simpan data game
    gameData.push({
        question: questionDisplay.innerText,
        userAnswer: userValue !== null ? userValue : "Waktu habis",
        correctAnswer: currentAnswer,
        isCorrect: isCorrect
    });
    
    // Tambah skor jika benar
    if (isCorrect) {
        score++;
        // Animasi sukses
        questionDisplay.style.color = "var(--correct)";
        setTimeout(() => {
            questionDisplay.style.color = "var(--text)";
        }, 300);
    } else {
        // Animasi salah (shake)
        questionDisplay.classList.add("shake");
        setTimeout(() => {
            questionDisplay.classList.remove("shake");
        }, 400);
    }
    
    // Lanjut ke soal berikutnya setelah jeda sebentar
    setTimeout(() => {
        nextQuestion();
    }, 500);
}

function endGame() {
    // Sembunyikan layar bermain, tampilkan layar hasil
    playScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    
    // Tampilkan skor akhir
    finalScoreDisplay.innerText = "Skor: " + score + " / 10";
    
    // Tampilkan tabel hasil
    displayResults();
}

function displayResults() {
    let html = "";
    
    gameData.forEach((data, index) => {
        let rowClass = data.isCorrect ? "row-correct" : "row-wrong";
        let userAnswerText = data.userAnswer;
        
        // Jika waktu habis, tampilkan pesan khusus
        if (data.userAnswer === "Waktu habis") {
            userAnswerText = "⏰ Waktu habis";
        }
        
        html += "<tr>";
        html += "<td>" + (index + 1) + ". " + data.question + "</td>";
        html += "<td class='" + rowClass + "'>" + userAnswerText + "</td>";
        html += "<td class='" + rowClass + "'>" + data.correctAnswer + "</td>";
        html += "</tr>";
    });
    
    resultBody.innerHTML = html;
}

// Fungsi restart game
function restartGame() {
    startGame();
}