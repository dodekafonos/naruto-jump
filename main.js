// VARIÁVEIS:
const grid = document.querySelector('.grid')
const beto = document.createElement('div')
let betoLeftSpace = 50;
let startPoint = 150;
let betoBottomSpace = startPoint;
let isGameOver = false;
let platformCount = 5;
let platforms = [];
let upTimerId;
let downTimerId;
let leftTimerId;
let rightTimerId;
let isJumping = true;
let isGoingLeft = false;
let isGoingRight = false;
let score = 0; 


// CLASSES:
class Platform {
    constructor(newPlatBottom) {
        this.left = Math.ceil(Math.random() * 315);
        this.bottom = newPlatBottom;
        this.visual = document.createElement('div')

        const visual = this.visual;
        visual.classList.add('platform')
        visual.style.left = this.left + 'px';
        visual.style.bottom = this.bottom + 'px';
        grid.appendChild(visual);
    }
}

//FUNÇÕES:
function criarBeto() {
    grid.appendChild(beto)
    beto.classList.add('beto');
    betoLeftSpace = platforms[0].left
    beto.style.left = betoLeftSpace + 'px';
    beto.style.bottom = betoBottomSpace + 'px';
}

function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
        let platGap = 600 / platformCount;
        let newPlatBottom = 100 + i * platGap;
        let newPlatform = new Platform(newPlatBottom)
        platforms.push(newPlatform);
        console.log(platforms)
    }
}

function movePlatforms() {
    if (betoBottomSpace > 0) {
        platforms.forEach(platform => {
            platform.bottom -= 1;
            let visual = platform.visual
            visual.style.bottom = platform.bottom + 'px';

            if (platform.bottom < 10) {
                let firstPlatform = platforms[0].visual
                firstPlatform.classList.remove('platform')
                platforms.shift()
                score ++
                console.log(platforms)
                let newPlatform = new Platform(585)
                platforms.push(newPlatform)
            }
        })
    }
}

function jump() {
    isJumping = true;
    clearInterval(downTimerId);
    upTimerId = setInterval(function () {
        betoBottomSpace += 4;
        beto.style.bottom = betoBottomSpace + 'px';
        if (betoBottomSpace > startPoint + 200) {
            fall();
        }
    }, 10)
}

function fall() {
    clearInterval(upTimerId);
    
    isJumping = false;
    downTimerId = setInterval(function () {
        betoBottomSpace -= 3;
        beto.style.bottom = betoBottomSpace + 'px';
        if (betoBottomSpace <= 0) {
            gameOver();
        }
        platforms.forEach(platform => {
            if (
                (betoBottomSpace >= platform.bottom) && (betoBottomSpace <= platform.bottom + 15) && ((betoLeftSpace + 60) >= platform.left) &&
                (betoLeftSpace <= (platform.left + 85)) &&
                !isJumping
            ) {
                console.log('hi')
                startPoint = betoBottomSpace;
                jump()
            }
        })

    }, 10)
}

function moveLeft() {
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
    if (isGoingRight) {
        clearInterval(rightTimerId)
        isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function() {
        if (betoLeftSpace >= 0) {
            betoLeftSpace -= 5;
            beto.style.left = betoLeftSpace + 'px';    
        } else moveRight()

    }, 30)
}

function moveRight() {
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
    if (isGoingLeft) {
        clearInterval(leftTimerId)
        isGoingLeft = false;
    }
    isGoingRight = true;
    leftTimerId = setInterval(function() {
        if (betoLeftSpace <= 340) {
            betoLeftSpace += 5;
            beto.style.left = betoLeftSpace + 'px';        
        } else moveLeft();

    }, 30)
}

function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId)
    clearInterval(leftTimerId)
}



function gameOver() {
    console.log('game over')
    isGameOver = true;
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild)
    }
    grid.textContent = 'You climbed ' + score + ' logs. You are a ninja!'
    clearInterval(upTimerId)
    clearInterval(downTimerId)
}

function control(event) {
    let tecla = event.which || event.keyCode;
    switch (tecla) {
        case 38:
            moveStraight();
            break;
        case 37:
            moveLeft();
            break;
        case 39:
            moveRight();
            break;
        case 13:
            start();
    }
}


function start() {
    if (!isGameOver) {
        createPlatforms();
        criarBeto();
        setInterval(movePlatforms, 10);
        jump();
        document.addEventListener('keydown', control)
    }
    //criar botão para iniciar

}
start()
