const optionsContainer = document.querySelector('div.options-container')
const flipBtn = document.querySelector('button#flip-btn');
const startBtn = document.querySelector('button#start-btn');

let angle = 0;
function flipShips() {
    const shipOptions = Array.from(optionsContainer.children)   
    angle = angle === 0 ? 90 : 0; // toggle between 90 and 0 degrees
    
    shipOptions.forEach(ship => ship.style.transform = `rotate(${angle}deg)`);
}

flipBtn.addEventListener('click', flipShips)