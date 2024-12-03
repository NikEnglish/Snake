const board = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const speedControl = document.getElementById('speed-control');
const speedLabel = document.getElementById('speed-label');
const foodControl = document.getElementById('food-control');
const foodLabel = document.getElementById('food-label');
const backgroundColorPicker = document.getElementById('background-color');
const foodColorPicker = document.getElementById('food-color');

let snake = [{ x: 10, y: 10 }];
let direction = null;
let food = [];
let score = 0;
let gameInterval;
let speed = 50;
let foodCount = 1;
let backgroundColor = '#f4f4f9';
let foodColor = '#ff0000';

function createBoard() {
    board.style.backgroundColor = backgroundColor;
    for (let i = 0; i < 400; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
    }
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.className = 'cell');
    snake.forEach((segment, index) => {
        const indexInBoard = segment.y * 20 + segment.x;
        if (index === 0) {
            cells[indexInBoard].classList.add('snake-head');
        } else {
            cells[indexInBoard].classList.add('snake');
        }
    });
    food.forEach(item => {
        const foodIndex = item.y * 20 + item.x;
        cells[foodIndex].classList.add('food');
    });
}

function moveSnake() {
    if (!direction) return;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    if (
        head.x < 0 || head.x >= 20 ||
        head.y < 0 || head.y >= 20 ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        alert(`Игра окончена! Ваши очки: ${score}`);
        resetGame();
        return;
    }
    snake.unshift(head);
    let eatenFood = false;
    food.forEach((item, index) => {
        if (head.x === item.x && head.y === item.y) {
            score++;
            food.splice(index, 1);
            eatenFood = true;
        }
    });
    if (eatenFood) {
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    while (food.length < foodCount) {
        const newFood = {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20)
        };
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            food.push(newFood);
        }
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = null;
    food = [];
    score = 0;
    scoreElement.textContent = `Очки: ${score}`;
    generateFood();
    updateBoard();
}

let startX = 0, startY = 0;
board.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
});

board.addEventListener('touchmove', (e) => {
    e.preventDefault();
});

board.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && (!direction || direction.x !== -1)) direction = { x: 1, y: 0 };
        else if (deltaX < 0 && (!direction || direction.x !== 1)) direction = { x: -1, y: 0 };
    } else {
        if (deltaY > 0 && (!direction || direction.y !== -1)) direction = { x: 0, y: 1 };
        else if (deltaY < 0 && (!direction || direction.y !== 1)) direction = { x: 0, y: -1 };
    }
});

speedControl.addEventListener('input', (e) => {
    speed = parseInt(e.target.value);
    speedLabel.textContent = `Скорость: ${speed}`;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 500 - speed * 5);
});

foodControl.addEventListener('input', (e) => {
    foodCount = parseInt(e.target.value);
    foodLabel.textContent = `Яблок за раз: ${foodCount}`;
    food = [];
    generateFood();
});

backgroundColorPicker.addEventListener('input', (e) => {
    backgroundColor = e.target.value;
    board.style.backgroundColor = backgroundColor;
});

foodColorPicker.addEventListener('input', (e) => {
    foodColor = e.target.value;
});

function gameLoop() {
    moveSnake();
    updateBoard();
    scoreElement.textContent = `Очки: ${score}`;
}

createBoard();
generateFood();
gameInterval = setInterval(gameLoop, 500 - speed * 5);
