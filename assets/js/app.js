/* Variables */
// 0 = empty; 1 = part of a ship; 2 = a sunken part of a ship; 3 = a missed shot
let game_board = [ 
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

const game_board_container = document.querySelector("#game-board");
const total_parts = game_board.map(rows => rows.filter(cell_value => cell_value ===1).length).reduce((x, y) => x +y);
const remaining_parts = document.querySelector("#remaining-parts");
const game_result = document.querySelector("#game-result");
const fire_modal = document.querySelector("#fire-modal");

const show_ships_button = document.querySelector(".show_ships");
let showed_ships = false;

/* Listener */
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("square")) {
        fire_torpedo(e.target);        
    }
});

/* Functions */
const render_board = () => {
    let board = `<div class="blank_guide"></div>`;
    
    // Horizontal guides
    for (let i = 1; i <= 9; i++) {
        board += `<div class="h_guide">${i}</div>`;
    }

    // Vertical guides and squares 
    for (let y = 1; y < 10; y++) { // 9 rows under the horizontal guides
        for (let x = 1; x <= 10; x++) { // Each row has one vertical guide + 9 squares
            if (x === 1) {
                board += `<div class="v_guide"><span>${y}</span></div>`;
            }
            else {
                let status_value = game_board[y - 1][x - 2]; // Search coordinates in game_board values
                let status_class = (status_value === 2) ? "sunken" : (status_value === 3) ? "missed" : "";
                
                let show_ship_class = (showed_ships && (status_value === 1 || status_value === 2)) ? "parts" : "";

                board += `<div class="square ${status_class} ${show_ship_class}"></div>`;
            }
        }
    }

    game_board_container.innerHTML = board;
    check_remaining_parts();
}

const show_ships = () => {
    if (showed_ships) {
        showed_ships = false;
        show_ships_button.innerHTML = "Show";
    }
    else {
        showed_ships = true;
        show_ships_button.innerHTML = "Hide";
    }
    
    render_board();
}

const fire_torpedo = (element) => {
    shoot(get_coordinates(element));
}

const get_coordinates = (element) => {
    let game_board_elements = game_board_container.children;
    let element_index, x, y;

    // Get the index of the element inside the container
    element_index = Object.values(game_board_elements).indexOf(element).toString();

    y = parseInt(element_index[0]); 
    x = parseInt(element_index[1]);

    return [y, x];
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