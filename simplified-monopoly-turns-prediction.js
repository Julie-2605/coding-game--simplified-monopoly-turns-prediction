//https://www.codingame.com/ide/puzzle/simplified-monopoly-turns-prediction

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

//Variables du jeu
const positionsBoard = 40;

// --- Lire les données : Joueurs | Lancers de dés | Plateau de jeu ---
function readPlayers() {
    const P = parseInt(readline());
    const players = [];

    for (let i = 0; i < P; i++) {
        const player = readline();
        const [name, position] = player.split(' ');
        players.push({
            name,
            position: parseInt(position),
            inJail: false,
            jailTurns: 0,
            doubleTurns: 0
        });
    }

    return players;
}

function readDiceRolls() {
    const D = parseInt(readline());
    const diceRolls = [];

    for (let i = 0; i < D; i++) {
        const dice = readline().split(' ').map(d => parseInt(d));
        diceRolls.push(dice);
    }

    return diceRolls;
}

function readGameBoard() {
    const gameBoard = [];

    for (let i = 0; i < positionsBoard; i++) {
        const boardline = readline();
        gameBoard.push(boardline);
    }

    return gameBoard;
}

// Appel des fonctions
const players = readPlayers();
const diceRolls = readDiceRolls();
const gameBoard = readGameBoard();
const positionGoToJail = findPosition(gameBoard, "Go To Jail");
const positionJail = findPosition(gameBoard, "Visit Only / In Jail");

// === Logique du jeu ===
//Recherche Position
function findPosition(gameBoard, target) {
    return gameBoard.indexOf(target);
}

//Règles Prison
function moveToJail(player) {
    player.position = positionJail;
    player.inJail = true;
    player.jailTurns = 0;
    player.doubleTurns = 0;
}

function quitJail(player, sumDice) {
    player.inJail = false;
    player.jailTurns = 0;
    player.doubleTurns = 0;
    player.position = (player.position + sumDice) % positionsBoard;
}

function checkJail(player, dice1, dice2) {
    const sumDice = dice1 + dice2;

    if (player.inJail === true) {
        if (dice1 === dice2) {
            quitJail(player, sumDice);
        } else {
            player.jailTurns++;
            if (player.jailTurns === 3) {
                quitJail(player, sumDice);
            }
        }
        return true;
    }
    return false;
}

//Mouvement Joueur
function positionPlayer(player, dice1, dice2) {
    const sumDice = dice1 + dice2;

    //Règles Double
    if (dice1 === dice2) {
        player.doubleTurns++;
    } else {
        player.doubleTurns = 0;
    }

    //Règles Prison Triple Double
    if (player.doubleTurns === 3) {
        moveToJail(player);
        return;
    }

    //Mouvement Joueur
    player.position = (player.position + sumDice) % positionsBoard;

    //Règle Prison Position
    if (player.position === positionGoToJail) {
        moveToJail(player);
    }
}

// --- Simulation du jeu ---
function playGame(players, diceRolls) {
    let currentIndex = 0;

    diceRolls.forEach(([dice1, dice2]) => {
        const player = players[currentIndex];

        //Check Prison Joueur
        if (checkJail(player, dice1, dice2)) {
            currentIndex = (currentIndex + 1) % players.length;
            return;
        }

        positionPlayer(player, dice1, dice2);

        //Joueur Suivant
        if (dice1 !== dice2 || player.inJail) {
            currentIndex = (currentIndex + 1) % players.length;
        }
    });
}

playGame(players, diceRolls);

// Write an answer using console.log()
// To debug: console.error('Debug messages...');

players.forEach(player => {
    console.log(`${player.name} ${player.position}`);
})