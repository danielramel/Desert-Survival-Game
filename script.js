var setup = document.getElementById('setup');
var table = document.getElementById('gameTable');
var nrOfPlayers;

var players = [];
var components = [];
var components_hints = [];
var oasis_positions = [];
var nfOfComponentsFound = 0;
var gameEnded = false;
var selectedPlayer = 0;
var timeHTML = document.getElementById('time');
var time = 0;
var intervalID;
var easter_egg = false;
var timeDelta;


function createTable() {
    var tbody = document.createElement('tbody');
    nrOfPlayers = document.getElementById('nrOfPlayers').value;
    
    setup.hidden = true;
    document.getElementById('container').style.display = 'flex';

    var seconds = document.getElementById('mt').value;
    if (seconds){
        if (seconds < 0) seconds = 60;
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        timeHTML.innerHTML = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        time = minutes * 60 + seconds;
        timeDelta = -1;
    }
    else {
        timeHTML.innerHTML = '0:00';
        timeDelta = 1;
    }
    
    intervalID = setInterval(everySecond, 1000);

    for (var i = 0; i < 5; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < 5; j++) {
            var cell = document.createElement('td');
            cell.id = 'cell' + (i) + '_' + (j);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    var i;
    var box;
    if (nrOfPlayers > 4) nrOfPlayers = 4;
    if (nrOfPlayers < 1) nrOfPlayers = 1;

    for (i = 0; i < nrOfPlayers; i++) {

        var img = document.createElement('img');
        img.src = 'Assets/Player.png';
        img.style = 'position: absolute; left: 207px; top: 219px; width: 100px; height: 100px;';
        players.push({'position' : [2, 2], 'Name': 'Player ' + (i+1), 'Water': 6, 'Moves': 3, 'img': img});
        var water = document.getElementById('p' + (i+1) + 'w').value;
        if (water < 0) water = 0;
        if (water === '') water = 6;
        players[i].Water = water;
        
        document.getElementById('water'+(i+1)).innerHTML = players[i].Water;
        document.getElementById('moves'+(i+1)).innerHTML = players[i].Moves;
        var name = document.getElementById('p' + (i+1) + 'n').value;
        if (name === '') name = 'Player ' + (i+1);
        document.getElementById('player' + (i+1) + 'name').innerHTML = name;

        
        box = document.getElementById('player' + (i+1));
        box.addEventListener('click', createEventListener(i));

        table.appendChild(img);
        document.getElementById('cell2_2').style.borderColor = 'red';
    }
    for (i; i < 4; i++) {
        box = document.getElementById('player' + (i+1));
        box.style.backgroundColor = 'grey';
    }
    document.getElementById('player1').style.backgroundColor = 'green';
    
    for (var i = 0; i < 3; i++) {
        var cell = getRandomPos();
        components.push({'position':cell, 'Name': 'Item ' + (i+1), 'Found': false});
        putImage(components[i].position, 'assets/item ' + (i+1)+ '.png', true);

        var j = 0;
        do {
            var col = Math.floor(Math.random() * 5);
            j++;
            if  (j > 100) location.reload();
        } while (!isEmpty([cell[0], col]));

        components_hints.push({'position' : [cell[0], col], 'Found': false, 'src': 'assets/Item ' + (i+1) + ' - clue_' + (col < cell[1] ? 'RIGHT' : 'LEFT') + '.png'});
        putImage(components_hints[components_hints.length - 1].position, components_hints[components_hints.length - 1].src, true);

        j = 0;
        do {
            var row = Math.floor(Math.random() * 5);
            j++;
            if  (j > 100) location.reload();
        } while (!isEmpty([row, cell[1]]));

        components_hints.push({'position' : [row, cell[1]], 'Found': false, 'src': 'assets/Item ' + (i+1) + ' - clue_' + (row < cell[0] ? 'DOWN' : 'UP') + '.png'});
        putImage(components_hints[components_hints.length - 1].position, components_hints[components_hints.length - 1].src, true);
    }
    oasis_positions = [{'position' : getRandomPos(), 'Found': false, 'water':false}];
    putImage(oasis_positions[0].position, 'assets/Oasis marker.png');
    for (var i = 1; i < 4; i++) {
        oasis_positions.push({'position' : getRandomPos(), 'Found': false, 'water':true});
        putImage(oasis_positions[i].position, 'assets/Oasis marker.png');
    }
}

function putImage(position, src, hidden = false) {
    var cell = document.getElementById('cell' + position[0] + '_' + position[1]);
    if (cell) {
        var img = document.createElement('img');
        img.hidden = hidden;
        img.src = src;
        cell.appendChild(img);
    }
}
function getRandomPos(){
    var i = 0;
    do {
        var row = Math.floor(Math.random() * 5);
        var column = Math.floor(Math.random() * 5);
        i++;
        if  (i > 100) location.reload();

    } while (!isEmpty([row, column]));

    return [row, column];
}
function isEmpty(pos) {
    if (pos == [2, 2]) return false;
    var cell = document.getElementById('cell' + pos[0] + '_' + pos[1]);
    return cell.innerHTML === '';
}
function playerMoved(){
    var player = players[selectedPlayer];
    player.Moves--;
    
    document.getElementById('moves'+(selectedPlayer+1)).innerHTML = player.Moves;
    document.getElementById('cell' + player.position[0] + '_' + player.position[1]).style.borderColor = 'red';
    
    

    player.img.style.left = (player.position[1] * 101 + 5) + 'px';
    player.img.style.top = (player.position[0] * 107 + 5) + 'px';

    if (player.Moves === 0) {
        player.Moves = 3;
        document.getElementById('moves'+(selectedPlayer+1)).innerHTML = player.Moves;
        player.Water--;
        document.getElementById('water'+(selectedPlayer+1)).innerHTML = player.Water;
        if (player.Water === -1) {
            alert('You lost!');
            gameEnded = true;
            clearInterval(intervalID);
        }
        removeSelection();
        selectPlayer((selectedPlayer + 1) % nrOfPlayers);
    }
}

function moveRight() {
    if (players[selectedPlayer].position[1] > 3) return
    removeSelection();
    players[selectedPlayer].position[1]++;
}
function moveLeft() {
    if (players[selectedPlayer].position[1] < 1) return
    removeSelection();
    players[selectedPlayer].position[1]--;
}
function moveUp() {
    if (players[selectedPlayer].position[0] < 1) return
    removeSelection();
    players[selectedPlayer].position[0]--;
}
function moveDown() {
    if (players[selectedPlayer].position[0] > 3) return
    removeSelection();
    players[selectedPlayer].position[0]++;
}

function dig(){
    var pos = players[selectedPlayer].position;
    var player = players[selectedPlayer];
    for (var i = 0; i < 4; i++) {
        if (oasis_positions[i].position[0] === pos[0] && oasis_positions[i].position[1] === pos[1]) {
            var cell = document.getElementById('cell' + pos[0] + '_' + pos[1]);
            if (cell) {
                cell.innerHTML = cell.innerHTML.replace('<img src="assets/Oasis marker.png">', '');
            }
            if (oasis_positions[i].water) {
                if (!oasis_positions[i].Found) {
                    putImage(pos, 'assets/Oasis.png');
                }
                if (player.Water < 6)                player.Water = 6;
                document.getElementById('water'+(selectedPlayer+1)).innerHTML = player.Water;
            }
            else {
                if (!oasis_positions[i].Found) {
                    putImage(pos, 'assets/Drought.png');
                }
            }
            oasis_positions[i].Found = true;
            return;
        }
    }
    for (var i = 0; i < components_hints.length; i++) {
        if (components_hints[i].position[0] === pos[0] && components_hints[i].position[1] === pos[1]) {
            if (!components_hints[i].Found) {
                putImage(pos, components_hints[i].src);
            }
            components_hints[i].Found = true;
            return;
        }
    }
    for (var i = 0; i < components.length; i++) {
        if (components[i].position[0] === pos[0] && components[i].position[1] === pos[1]) {
            if (!components_hints[i*2].Found || !components_hints[i*2 + 1].Found){
                return;
            }
            if (!components[i].Found) {
                putImage(pos, 'assets/Item ' + (i+1) + '.png');
                document.getElementById('item' + (i+1)).hidden = false;
                nfOfComponentsFound++;
                if (nfOfComponentsFound === 3) {
                    alert('You won!');
                    gameEnded = true;
                    clearInterval(intervalID);
                }
            }
            components[i].Found = true;
            return;
        }
    }
}

document.addEventListener("keydown", function(event) {
    if (gameEnded) return;
    if (event.key === 'ArrowRight') {
        moveRight();
    } else if (event.key === 'ArrowLeft') {
        moveLeft();
    } else if (event.key === 'ArrowUp') {
        moveUp();
    } else if (event.key === 'ArrowDown') {
        moveDown();
    }
    else if (event.key === ' ') {
        dig();
    } else {
        return;
    }
    playerMoved();
});


function selectPlayer(i){
    if (selectedPlayer === i) return;
    var box = document.getElementById('player' + (selectedPlayer + 1));
    box.style.backgroundColor = '#FFEBB2';
    document.getElementById('cell' + players[selectedPlayer].position[0] + '_' + players[selectedPlayer].position[1]).style.borderColor = 'black';
    selectedPlayer = i;
    box = document.getElementById('player' + (selectedPlayer + 1));
    box.style.backgroundColor = 'green';
    document.getElementById('cell' + players[selectedPlayer].position[0] + '_' + players[selectedPlayer].position[1]).style.borderColor = 'red';

}

function createEventListener(index) {
    if (!easter_egg) return ;
    return function() {
        selectPlayer(index);
    };
}

function removeSelection(){
    document.getElementById('cell' + players[selectedPlayer].position[0] + '_' + players[selectedPlayer].position[1]).style.borderColor = 'black';
}

function everySecond(){
    time += timeDelta;
    timeHTML.innerHTML = Math.floor(time/60) + ':' + (time%60 < 10 ? '0' : '') + time%60;
    if (time <= 0) {
        alert("Time is up!");
        gameEnded=true;
        clearInterval(intervalID);
        return;
    }
}

