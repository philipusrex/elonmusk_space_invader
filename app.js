const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
let currentShooterIndex = 202;
const width = 15;
const aliensRemoved = [];
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;

for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(alienInvaders[i])) {
            const invader = document.createElement('img');
            invader.src = 'images/william-robinson-gun-alien-firing-animation.gif'; // Replace with your alien image path
            invader.classList.add('invader');
            invader.style.width = '100%';
            invader.style.height = '100%';
            invader.style.objectFit = 'cover';
            squares[alienInvaders[i]].appendChild(invader);
        }
    }
}

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(alienInvaders[i])) {
            if (squares[alienInvaders[i]].firstChild) {
                squares[alienInvaders[i]].removeChild(squares[alienInvaders[i]].firstChild);
            }
        }
    }
}

function drawShooter() {
    const shooter = document.createElement('img');
    shooter.src = 'images/png-clipart-elon-musk-tesla-motors-investor-the-boring-company-spacex-others-face-head.png'; // Replace with your shooter image path
    shooter.classList.add('shooter');
    shooter.style.width = '130%';
    shooter.style.height = '130%';
    shooter.style.objectFit = 'cover';
    squares[currentShooterIndex].appendChild(shooter);
}

function removeShooter() {
    const shooterImg = squares[currentShooterIndex].querySelector('.shooter');
    if (shooterImg) {
        squares[currentShooterIndex].removeChild(shooterImg);
    }
}

drawShooter();

function moveShooter(e) {
    removeShooter();
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    drawShooter();
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
    // Check if any invader is at the left edge
    const leftEdge = alienInvaders.some(invader => invader % width === 0);
    // Check if any invader is at the right edge
    const rightEdge = alienInvaders.some(invader => invader % width === width - 1);
    remove();

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width;
        }
        direction = -1; // Change direction to left
        isGoingRight = false;
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width;
        }
        direction = 1; // Change direction to right
        isGoingRight = true;
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw();

    // Check for game over
    if (squares[currentShooterIndex].querySelector(".invader")) {
        resultDisplay.innerHTML = "GAME OVER";
        clearInterval(invadersId);
    }

    // Check for win
    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN";
        clearInterval(invadersId);
    }
}

invadersId = setInterval(moveInvaders, 600);

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex -= width;
        if (currentLaserIndex >= 0) {
            squares[currentLaserIndex].classList.add("laser");

            if (squares[currentLaserIndex].querySelector(".invader")) {
                squares[currentLaserIndex].classList.remove("laser");
                squares[currentLaserIndex].querySelector(".invader").remove();
                squares[currentLaserIndex].classList.add("boom");

                setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);
                clearInterval(laserId);

                const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                if (alienRemoved !== -1) {
                    aliensRemoved.push(alienInvaders[alienRemoved]);
                    alienInvaders.splice(alienRemoved, 1); // Remove the alien from the array
                }
                results++;
                resultDisplay.innerHTML = results;
            }
        } else {
            clearInterval(laserId);
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100);
    }
}

document.addEventListener('keydown', shoot);

draw();