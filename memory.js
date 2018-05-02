/*jslint browser, devel, for, this*/

var tileImgs = ["img/1.png","img/2.png","img/3.png","img/4.png","img/5.png","img/6.png","img/7.png","img/8.png","img/9.png","img/10.png","img/11.png","img/12.png"];
var board = document.getElementById('board');
var front = document.getElementsByClassName('front');
var tilesFlipped = [];
var tilesMatch = [];
var i;

function clickCounter() {
    'use strict';
    if (typeof(Storage) !== "undefined") {

            localStorage.clickcount = Number(localStorage.clickcount) + 1;
            var content = localStorage.clickcount + ' forsøg.';
            document.getElementById('result').innerHTML = content;
    }

}

function drawBoard(event) {
    'use strict';
    event.preventDefault();
    document.getElementById('welcome').style.display = 'none';
    board.style.display = 'flex';

    var gameTiles = document.getElementById('playGame').level.value;
    var gameTileImgs = tileImgs.slice(0, gameTiles / 2);
    gameTileImgs = gameTileImgs.doubleShuffle();


    for (i = 0; i < gameTileImgs.length; i += 1) {
        var content = '';
        content += '<section>';
        content += '<div class="front"></div>';
        content += '<div class="back"><img src="' + gameTileImgs[i] + '"></div>';
        content += '</section>';

        board.insertAdjacentHTML('beforeend', content);
    }
    localStorage.clickcount = '0';

    for (var i = 0; i< front.length; i++ ) {
        front[i].addEventListener('click', clickCounter);
    }

    board.insertAdjacentHTML('beforeend', 'Antal forsøg: <div id="result"></div>');

}

Array.prototype.doubleShuffle = function () {
    'use strict';
    var d;
    //fordobler antallet
    for (d = 0; d < this.length; d = d + 2) { //d+2 er så den ikke sætter det første ind hele tiden
        this.splice(d + 1, 0, this[d]); //sætter +1 en, uden at slette noget (0), den sætter den variabel ind den er nået til
    }
    //fischer yates - shuffle Algorythm
    var k = this.length; //alle pladser i arrayet
    var j;
    var temp;
    while (--k > 0) { //løkke der tager den næste var i rækken(bagfra) -- trækker en fra
        j = Math.floor(Math.random() * (k + 1));//giver en random plads, floor=ingen decimaler
        temp = this[j]; //tager en variabel ud af arrayet, og holder den
        this[j] = this[k];//sætter en tilfældig ind imens [j] bliver holdt i temp
        this[k] = temp;//sætter tempen ind hvor der til sidst er plads
    }
    return this;

}

function endOfGame() {
    'use strict';
    if (board.querySelectorAll('section').length === board.querySelectorAll('.reward').length) {
        document.getElementById('message').classList.add('show');
    }

}

function newGame() {
    'use strict';
    board.innerHTML = '';
    board.style.display = 'none';
    document.getElementById('welcome').style.display = 'flex';
    document.getElementById('message').classList.remove('show');
}

function flipBack() {
    'use strict';
    var tiles = board.querySelectorAll('section');
    tiles[tilesFlipped[0]].classList.remove('flipped');
    tiles[tilesFlipped[1]].classList.remove('flipped');
    tilesFlipped = [];
    tilesMatch = [];
    board.style.pointerEvents = 'auto';
}

function twoTiles(tiles) {
    'use strict';
    if (tilesFlipped.length >= 2) {
        board.style.pointerEvents = 'none';
        if (tilesMatch[0] === tilesMatch[1]) {
            tiles[tilesFlipped[0]].classList.add('reward');
            tiles[tilesFlipped[1]].classList.add('reward');
            tilesFlipped = [];
            tilesMatch = [];
            setTimeout(endOfGame, 500);
            board.style.pointerEvents = 'auto';
        } else {
            setTimeout(flipBack, 1000);
        }

    }

}

function flipTile(event) {
    'use strict';
    var tiles = Array.from(board.querySelectorAll('section'));
    if (event.target !== event.currentTarget && event.touches.length === 1) {
        if (event.target.nodeName !== 'IMG') {
            event.target.parentNode.classList.add('flipped'); //parentnode er section der skal vendes
            tilesFlipped.push(tiles.indexOf(event.target.parentNode));
            tilesMatch.push(event.target.nextElementSibling.innerHTML);
            twoTiles(tiles);
        }
    }

}

board.addEventListener('touchstart', flipTile);
document.getElementById('message').getElementsByTagName('button')[0].addEventListener('click', newGame);
document.getElementById('playGame').addEventListener('submit', drawBoard);

