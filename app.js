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

draw();

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(alienInvaders[i])) {
            if (squares[alienInvaders[i]].firstChild) {
                squares[alienInvaders[i]].removeChild(squares[alienInvaders[i]].firstChild);
            }
        }
    }
}

// Draw the shooter image
function drawShooter() {
    const shooter = document.createElement('img');
    shooter.src = 'images/png-clipart-elon-musk-tesla-motors-investor-the-boring-company-spacex-others-face-head.png'; // Replace with your shooter image path
    shooter.classList.add('shooter');
    shooter.style.width = '100%';
    shooter.style.height = '100%';
    shooter.style.objectFit = 'cover';
    squares[currentShooterIndex].appendChild(shooter);
}

// Initial drawing of the shooter
drawShooter();

function moveShooter(e) {
    squares[currentShooterIndex].innerHTML = ''; // Clear the current shooter image
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    drawShooter(); // Draw the shooter at the new position
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            isGoingRight = false;
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            isGoingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw();

    if (squares[currentShooterIndex].querySelector(".invader")) {
        resultDisplay.innerHTML = "GAME OVER";
        clearInterval(invadersId);
    }

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

// Initial drawing of the invaders
draw();