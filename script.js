const gameBoards = document.querySelector('div#gameboards')
const optionsContainer = document.querySelector('div.options-container')
const flipBtn = document.querySelector('button#flip-btn');
const startBtn = document.querySelector('button#start-btn');
const infoDisplay = document.querySelector('#info')
const turnDisplay = document.querySelector('#turn-display')

// ship class
class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
    }
}

const destroyer = new Ship('destroyer', 2)
const submarine = new Ship('submarine', 3)
const cruiser = new Ship('cruiser', 3)
const battleship = new Ship('battleship', 4)
const carrier = new Ship('carrier', 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier];
let notDropped;

// functions ---

// this function will make sure the blocks do not get cut at the edge of the board 
// this will also make sure that other ships do not overlap one another.
function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
    let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex : 
    width * width - ship.length : 
    // handle vertical ships
    startIndex <= width * width - width * ship.length ? startIndex : 
        startIndex - ship.length * width + width;
    
    // collect the divs that the ship length is taking
    let shipBlocks = [];

    // use ship length property to iterate through it to add the appropriate length for said ship
    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
        } else {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i * width])
        }
    };
    
    let valid;
    if (isHorizontal) {
        shipBlocks.every((_shipBlock, index) => {
            valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1))
        })
    } else { // if is vertical
        shipBlocks.every((_shipBlock, index) => {
            valid = shipBlocks[0].id < 90 + (width * index + 1)
        })
    }

    const notOccupied = shipBlocks.every(shipBlock => !shipBlock.classList.contains('occupied'))

    return {shipBlocks, valid, notOccupied}
}

function addShipPiece(user, ship, startId) {

    // The computer will randomly place battle ships 
    const allBoardBlocks = document.querySelectorAll(`#${user} div`) // grab the gridblocks
    let randomBoolean = Math.random() < 0.5; // random boolean
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean; // if the ship is being added by a user grab the angle, otherwise return a random boolean for the computer
    let randStartIdx = Math.floor(Math.random() * width * width); // This random start index is for the computer and uses a 10 x 10 width

    let startIndex = startId ? startId : randStartIdx; // if there is a startID (from the player when they drop the ship) grab the start id, if not, grab the random start index for the computer

    const { shipBlocks, valid, notOccupied } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship); 

    if (valid && notOccupied) {
        // iterate through shipblocks, add color, and add occupied class
        shipBlocks.forEach(block => {
            block.classList.add(ship.name);
            block.classList.add('occupied'); 
        })
    } else {
        if (user === 'computer') addShipPiece(user, ship, startId);
        if (user === 'player') notDropped = true;
    }

};

let draggedShip;
function dragPlayerShips() {
    const shipOptions = Array.from(optionsContainer.children);
    const allPlayerBlocks = document.querySelectorAll('#player div');
    
    shipOptions.forEach(ship => ship.addEventListener('dragstart', dragStart));
    allPlayerBlocks.forEach(block => {
        block.addEventListener('dragover', dragOver);
        block.addEventListener('drop', dropShip);
    })
};

function dragStart(e) {
    notDropped = false;
    draggedShip = e.target;
}

function dragOver(e) {
    e.preventDefault();
    const ship = ships[draggedShip.id];
    highlightArea(e.target.id, ship)
}

function dropShip(e) {
    const startId = e.target.id;
    const ship = ships[draggedShip.id]
    addShipPiece('player', ship, startId)
    if (!notDropped) {
        draggedShip.remove();
    }
}

let angle = 0;
function flipShips() {
    const shipOptions = Array.from(optionsContainer.children)   
    angle = angle === 0 ? 90 : 0; // toggle between 90 and 0 degrees
    
    shipOptions.forEach(ship => ship.style.transform = `rotate(${angle}deg)`);
}

// game boards
let width = 10;
function createBoard(user) {
    const gameBoardBox = document.createElement('div');

    gameBoardBox.classList.add('game-board-box');
    gameBoardBox.id = user;

    // create grid blocks and append inside the game board box
    for (let i = 0; i < width * width; i++) {
        const gridBlock = document.createElement('div');
        gridBlock.classList.add('grid-block');
        gridBlock.id = i
        gameBoardBox.appendChild(gridBlock)
    }

    gameBoards.appendChild(gameBoardBox);
}

function highlightArea(startIndex, ship) {
    const allBoardBlocks = document.querySelectorAll('#player div');
    let isHorizontal = angle === 0;

    const { shipBlocks, valid, notOccupied } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)
    if (valid && notOccupied) {
        shipBlocks.forEach(block => {
            block.classList.add('hover');
            setTimeout(() => block.classList.remove('hover'), 1000)
        })
    }
}

let gameOver = false;
let playerTurn;

function startGame() {
    if (playerTurn === undefined) {
        if (optionsContainer.children.length != 0) {
            infoDisplay.textContent = "Plan your fleet positions"
        } else {
            const allBoardBlocks = document.querySelectorAll('#computer div');
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
            playerTurn = true;
            turnDisplay.textContent = "Your turn";
            infoDisplay.textContent = "The battle begins!"
        }
    }
}

let playerHits = [];
let computerHits = [];
const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
    // execute this code when the player makes a move
    if (!gameOver) {
        if (e.target.classList.contains('occupied')) { // if the player hits a ship
            // console.log(e.target);
            e.target.classList.add('boom');
            infoDisplay.textContent = "You hit a ship!"
            let classes = Array.from(e.target.classList);
            classes = classes.filter(className => className !== 'grid-block' && className !== 'boom' && className !== 'occupied')
            playerHits.push(...classes)
            checkScore('player', playerHits, playerSunkShips);
        }

        if (!e.target.classList.contains('occupied')) { // if the player does not hit a ship
            infoDisplay.textContent = 'Miss';
            e.target.classList.add('empty');
        }

        playerTurn = false;
        const allBoardBlocks = document.querySelectorAll('#computer div');
        allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true))) // remove the event listener once the player clicks on the computer board.
        setTimeout(computerGo, 3000);
    }
}

function computerGo(e) {
    if (!gameOver) {
        turnDisplay.textContent = "Opponent's turn"
        infoDisplay.textContent = 'The opponent is planning...'

        setTimeout(() => {
            let randomGo = Math.floor(Math.random() * (width * width));
            const allBoardBlocks = document.querySelectorAll('#player div');

            if (allBoardBlocks[randomGo].classList.contains('occupied') && allBoardBlocks[randomGo].classList.contains('boom') ) {
                computerGo();
                return;
            } else if (allBoardBlocks[randomGo].classList.contains('occupied') && !allBoardBlocks[randomGo].classList.contains('boom')) {
                allBoardBlocks[randomGo].classList.add('boom');
                infoDisplay.textContent = 'The opponent hit your ship.'
                let classes = Array.from(allBoardBlocks[randomGo].classList);
                classes = classes.filter(className => className !== 'grid-block' && className !== 'boom' && className !== 'occupied')
                checkScore('computer', computerHits, computerSunkShips);
            } else {
                infoDisplay.textContent = "Miss";
                allBoardBlocks[randomGo].classList.add('empty')
            }
        }, 3000)

        setTimeout(() => {
            playerTurn = true; 
            turnDisplay.textContent = 'Your turn';
            infoDisplay.textContent = "Waiting for your strike...";
            const allBoardBlocks = document.querySelectorAll('#computer div');
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
        }, 6000)
    }
}

function checkScore(user, userHits, userSunkShips) {
    
    function checkShip(shipName, shipLength) {
        if (
            userHits.filter(storedShipName => storedShipName === shipName).length === shipLength
        ) {
            if (user === 'player') {
                infoDisplay.textContent = `You sunk the opponents ${shipName}.`
                playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            if (user === 'computer') {
                infoDisplay.textContent = `The opponent sunk your ${shipName}.`
                computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            userSunkShips.push(shipName)
        }
    }

    checkShip('destroyer', 2);
    checkShip('submarine', 3);
    checkShip('cruiser', 3);
    checkShip('battleship', 4);
    checkShip('carrier', 5);
    
    console.log('playerHits', playerHits);
    console.log('playerSunkships', playerSunkShips);

    if (playerSunkShips.length === 5) {
        infoDisplay.textContent = "You sunk all the opponents ships!"
        gameOver = true;
    }
    if (computer.length === 5) {
        infoDisplay.textContent = "The opposition has sunk all your ships."
        gameOver = true;
    }
}

//  event listeners ---
flipBtn.addEventListener('click', flipShips)
startBtn.addEventListener('click', startGame)
createBoard("player");
createBoard("computer");

ships.forEach(ship => {
    addShipPiece('computer', ship)
})

dragPlayerShips();
infoDisplay.textContent = "Begin by placing all of your ships"