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
const battleship = new Ship('battleship', 40)
const carrier = new Ship('carrier', 50)

const ships = [destroyer, submarine, cruiser, battleship, carrier];

// functions ---
function addShipPiece(ship) {
    const computerBoardBlocks = document.querySelectorAll('#computer div')
    console.log(computerBoardBlocks);
}


let angle = 0;
function flipShips() {
    const shipOptions = Array.from(optionsContainer.children)   
    angle = angle === 0 ? 90 : 0; // toggle between 90 and 0 degrees
    
    shipOptions.forEach(ship => ship.style.transform = `rotate(${angle}deg)`);
}

// game boards
function createBoard(color, user) {
    const gameBoardBox = document.createElement('div');

    gameBoardBox.classList.add('game-board-box');
    gameBoardBox.style.backgroundColor = color;
    gameBoardBox.id = user;

    for (let i = 0; i < 100; i++) {
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