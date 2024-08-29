const gameBoards = document.querySelector('div#gameboards')
const optionsContainer = document.querySelector('div.options-container')
const flipBtn = document.querySelector('button#flip-btn');
const startBtn = document.querySelector('button#start-btn');

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
function addShipPiece(user, ship, startId) {

    // The computer will randomly place battle ships 
    const computerBoardBlocks = document.querySelectorAll(`#${user} div`) // grab the gridblocks
    let randomBoolean = Math.random() < 0.5;
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
    let randStartIdx = Math.floor(Math.random() * width * width);

    let startIndex = startId ? startId : randStartIdx;

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
            shipBlocks.push(computerBoardBlocks[Number(validStart) + i]);
        } else {
            shipBlocks.push(computerBoardBlocks[Number(validStart) + i * width])
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
    
    if (valid && notOccupied) {
        // iterate through shipblocks, add color, and add occupied class
        shipBlocks.forEach(block => {
            block.classList.add(ship.name);
            block.classList.add('occupied'); 
        })
    } else {
        if (user === 'computer') addShipPiece(ship);
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
function createBoard(color, user) {
    const gameBoardBox = document.createElement('div');

    gameBoardBox.classList.add('game-board-box');
    gameBoardBox.style.backgroundColor = color;
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



//  event listeners ---
flipBtn.addEventListener('click', flipShips)
createBoard("#77DD77", "player");
createBoard("#FFD1DC", "computer");

ships.forEach(ship => {
    addShipPiece('computer', ship)
})

dragPlayerShips();