/* Variables */
// 0 = empty; 1 = part of a ship; 2 = a sunken part of a ship; 3 = a missed shot
const game_board = [ 
    [1,1,1,1,1,0,0,0,1],
    [0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,1],
    [0,0,0,1,1,0,0,0,1],
    [0,0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,1,1,1],
    [0,0,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0,0]
];

const square = 0;
const ship = 1;
const sunken = 2;
const missing = 3;
let showShip = false;

const style = {
    "0": "",
    "1": "parts",
    "2": "sunken",
    "3": "missed"
}


const game_board_container = document.querySelector("#game-board");
const total_parts = game_board.map(rows => rows.filter(cell_value => cell_value === 1).length).reduce((x, y) => x +y);
const remaining_parts = document.querySelector("#remaining-parts");
const game_result = document.querySelector("#game-result");
const fire_modal = document.querySelector("#fire-modal");

const fireShip = (y, x) => {
    const position = game_board[y][x];
    const target = position === ship ? sunken : missing; 
    game_board[y][x] = target;
    render_board();
}

//modificado
const render_board = () => {
    let board = `<div class="blank_guide"></div>`;
    // Horizontal guides
    for (let i = 1; i <= 9; i++) {
        board += `<div class="h_guide">${i}</div>`;
    }
    game_board.map( (rows, y) => {
        rows.map((position, x) => { 
            // Veritcal guides
            if (x === 0) {
                board += `<div class="v_guide"><span>${y}</span></div>`;
            }
            const sytlyBoard = position === sunken || position === missing ? position : square;
            const showShipValue = (showShip && (position === ship || position === sunken)) ? ship : square;
            board += `<div class="square ${style[sytlyBoard ]} ${style[showShipValue]}" onclick="fireShip(${y},${x})"></div>`;
        });
    });
    game_board_container.innerHTML = board;
    check_remaining_parts();
}
//modificado
const showShips = () => {
    const showShipsButton = document.querySelector(".show_ships");
    showShip = !showShip;
    showShipsButton.innerHTML = showShip ? "Show" : "Hide";
    render_board();
}


const shoot = (coordinates) => {
    let y = coordinates[0] - 1; // Substract 1 because arrays index begin at 0
    let x = coordinates[1] - 1;
    let actual_status = game_board[y][x];
    if (actual_status === 2 || actual_status === 3) { return false; }
    game_board[y][x] = (actual_status === 1) ? 2 : 3;
    render_board();
}

const fire_input = (fire = false) => {
    if (!fire) {
        show_modal();
        return false;
    }
    let coordinates = document.querySelector("#fire-positions").value;
    if (coordinates.length === 0) { return false; }

    coordinates = coordinates.split(",");
    if (coordinates.length !== 2) { return false; }

    let x = coordinates[0].trim();
    let y = coordinates[1].trim();

    if (isNaN(x) || isNaN(y)) { return false; }
    if (x > 0 && x < 10 && y > 0 && y < 10) {
        shoot([parseInt(y), parseInt(x)]); // In this moment, input have a comma separated numbers    
        show_modal(false);
    }
}

const check_remaining_parts = () => {
    let sunked_count = game_board.map(rows => rows.filter(cell_value => cell_value === 2).length).reduce((x, y) => x + y);
    remaining_parts.innerHTML = total_parts - sunked_count;
    if (sunked_count === total_parts) {
        game_result.innerHTML = "YOU WIN!!";
        game_result.style.display = "block";
        document.querySelectorAll(".square").forEach(div => div.classList.add("block"));
    }
}

const show_modal = (show = true) => {
    if (show) {
        fire_modal.style.display = "block";
        return false;
    }
    fire_modal.style.display = "none";
}

window.onload = () => render_board();