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

// functions ---
function addShipPiece(ship) {

    // The computer will randomly place battle ships 
    const computerBoardBlocks = document.querySelectorAll('#computer div') // grab the gridblocks
    let randomBoolean = Math.random() < 0.5;
    let isHorizontal = randomBoolean;
    let randStartIdx = Math.floor(Math.random() * width * width);
    console.log(randStartIdx);

    console.log(randStartIdx);
    
    // collect the divs that the ship length is taking
    let shipBlocks = [];

    // use ship length property to iterate through it to add the appropriate length for said ship
    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(computerBoardBlocks[randStartIdx + i]);
        } else {
            shipBlocks.push(computerBoardBlocks[randStartIdx + i * width])
        }
    };

    // iterate through shipblocks and add color
    shipBlocks.forEach(block => {
        block.classList.add(ship.name);
        block.classList.add('occupied'); 
    })
};


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
    addShipPiece(ship)
})