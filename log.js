// Получение элементов DOM
const game = document.getElementById("game");
const bird = document.getElementById("bird");
const scoreDiv = document.getElementById("score");
const maxScoreCon = document.getElementById('maxScore');
const musickBtn = document.getElementById('MusickBtn');
const musick = document.getElementById('Musick');
const jumpSound = document.getElementById('jumpSound');
var btn = document.getElementById('restart');
var NpButton = document.getElementById('Np');

let birdTop = 200;
let gravity = 1.5;
let isGameOver = false;
let pipes = [];
let pipeSpeed = 2;
let score = 0;
let hasIncreasedSpeed = false;

var maxScore = parseInt(localStorage.getItem('maxScore')) || 0;
maxScoreCon.textContent = 'Max score ' + maxScore;


function saveToLocalStorege() {
    localStorage.setItem('maxScore', maxScore);
}


function LoadFromLocalstorege() {
    const savedScore = localStorage.getItem('maxScore');
    if (savedScore !== null) {
        maxScore = parseInt(savedScore);
    }
}


LoadFromLocalstorege();
maxScoreCon.textContent = 'Max score ' + maxScore;


document.addEventListener("keydown", () => {
    birdTop -= 80;
    jumpSound.currentTime = 0;
    jumpSound.play();
    console.log('Jump sound played'); 
});


document.addEventListener("click", () => {
    birdTop -= 80;



    jumpSound.currentTime = 0;
    jumpSound.play();
    console.log('Jump sound played'); 

});

// Функция для рисования труб
function createPipe() {
    var pipeHeight = Math.random() * 150 + 100;
    var gap;

    if (score >= 15) {
        gap = 80;
    } else if (score >= 10) {
        gap = 100;
    } else {
        gap = 120;
    }

    var lowerPipe = document.createElement('div');
    lowerPipe.classList.add('pipe');
    lowerPipe.style.height = pipeHeight + 'px';
    lowerPipe.style.left = '300px';

    var upperPipe = document.createElement('div');
    upperPipe.classList.add('pipe', 'upper');
    upperPipe.style.height = 500 - pipeHeight - gap + 'px';
    upperPipe.style.left = '300px';

    game.appendChild(lowerPipe);
    game.appendChild(upperPipe);

    pipes.push({ lower: lowerPipe, upper: upperPipe });
}

// Функция для обновления труб и проверки их пересечения с птичкой
function updatePipes() {
    pipes.forEach((pipe, index) => {
        var lowerPipe = pipe.lower;
        var upperPipe = pipe.upper;
        var pipeLeft = parseInt(lowerPipe.style.left);

        if (pipeLeft <= -50) {
            lowerPipe.remove();
            upperPipe.remove();
            pipes.splice(index, 1);
            score++;

            // Обновление максимального счёта
            if (score > maxScore) {
                maxScore = score;
                maxScoreCon.textContent = 'Max score ' + maxScore;
                saveToLocalStorege();
            }

            if (score >= 16) {
                NpButton.style.display = "block";
            } else {
                NpButton.style.display = "none";
            }

        } else {
            lowerPipe.style.left = pipeLeft - pipeSpeed + 'px';
            upperPipe.style.left = pipeLeft - pipeSpeed + 'px';
        }

        const birdRect = bird.getBoundingClientRect();
        const lowerRect = lowerPipe.getBoundingClientRect();
        const upperRect = upperPipe.getBoundingClientRect();

        // Проверка столкновений с нижней трубой
        if (
            birdRect.left < lowerRect.right &&
            birdRect.right > lowerRect.left &&
            birdRect.bottom > lowerRect.top
        ) {
            endGame();
        }

        // Проверка столкновений с верхней трубой
        if (
            birdRect.left < upperRect.right &&
            birdRect.right > upperRect.left &&
            birdRect.top < upperRect.bottom
        ) {
            endGame();
        }
    });
}

// Функция для обновления движения птички
function updateBird() {
    birdTop += gravity;
    bird.style.top = birdTop + 'px';

    // Ограничение для падения птички
    if (birdTop >= 470 || birdTop <= 0) {
        endGame();
    }

    if (score % 3 === 0 && !hasIncreasedSpeed) {
        pipeSpeed += 0.5;
        hasIncreasedSpeed = true;
    }

    if (score % 3 !== 0) {
        hasIncreasedSpeed = false;
    }
}

function endGame() {
    isGameOver = true;
}

function gameLoop() {
    if (isGameOver) return;

    updateBird();  // Обновляем движение птички
    updatePipes(); // Обновляем трубы

    scoreDiv.textContent = "score " + score;  // Обновляем отображаемый счёт
    requestAnimationFrame(gameLoop);  // Запускаем следующий кадр
}


// Перезапуск игры
btn.addEventListener('click', () => {
    // Сброс состояния игры, но музыка продолжается
    birdTop = 200;
    gravity = 2.5;
    isGameOver = false;
    pipes.forEach(pipe => {
        pipe.lower.remove();  // Удаляем все трубы с экрана
        pipe.upper.remove();
    });
    pipes = [];  // Очищаем массив с трубами
    pipeSpeed = 2;
    score = 0;
    hasIncreasedSpeed = false;

    scoreDiv.textContent = "score " + score;  // Обновляем отображаемый счёт
    maxScoreCon.textContent = 'Max score ' + maxScore;

    // Перезапуск игры, не перезагружая страницу
    gameLoop();
});

setInterval(createPipe, 2000);
gameLoop();

// Работа с музыкой
window.addEventListener('load', () => {
    const savedTime = localStorage.getItem('videoTime');
    const isPaused = localStorage.getItem('videoPaused') === 'true';

    if (savedTime !== null) {
        musick.currentTime = savedTime;
    }

    if (isPaused) {
        musick.pause();
    } else {
        musick.play();
    }
});

musick.addEventListener('timeupdate', () => {
    localStorage.setItem('videoTime', musick.currentTime);
});

musick.addEventListener('pause', () => {
    localStorage.setItem('videoPaused', 'true');
});

musick.addEventListener('play', () => {
    localStorage.setItem('videoPaused', 'false');
});

musickBtn.addEventListener('click', (event) => {
    event.stopPropagation();

    if (musick.paused) {
        musick.play();
        console.log('Music started playing');  // Debugging log
    } else {
        musick.pause();
        console.log('Music paused');  // Debugging log
    }
});

NpButton.addEventListener('click', () => {
    window.location.href = 'Np.html';
});
