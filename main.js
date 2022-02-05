var myGamePiece;
var myObstacles = [];
var pont = 0;
var chave1 = true;
var chave2 = true;
var restart = false;

var btnRestart = document.getElementById("btnRestart");
var scorePoints = document.getElementById("score");
var level = document.getElementById("nmFase");

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    myObstacle = new component(30, 30, "blue", 300, 120);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.getElementById('gameScreen'),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener("keydown", function (e) {
             myGameArea.keys = (myGameArea.keys || []);
             myGameArea.keys[e.keyCode] = true;
         })
         window.addEventListener('keyup', function (e) {
             myGameArea.keys[e.keyCode] = false;
         })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
        return false;
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
        } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        myGamePiece.x += this.speedX;
        myGamePiece.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
    
function updateGameArea() {
    let x, y;
    let dimensao = 30;
    let intervalo = 230;

    gameLevel(pont);

    for (i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myObstacles.splice(i, 1);
            pont--;
            scorePoints.innerText = pont.toString();
        }
        if (pont >= 100 && pont <= 199) {
            if (pont == 100 && chave1) {
                myObstacles.splice(i + 1);
                chave1 = false;
            }
            dimensao = 50;
            intervalo = 200;
            }
        if (pont >= 200) {
            if (pont == 200 && chave2) {
                myObstacles.splice(i + 1);
                chave2 = false;
            }
            dimensao = 80;
            intervalo = 150;
            }
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;

    if (myGameArea.frameNo == 1 || everyinterval(intervalo)) {
        x = myGameArea.canvas.width
        y = myGameArea.canvas.height - 200
        
        myObstacles.push(new component(dimensao, dimensao, "blue", x, Math.floor(Math.random() * 210)));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
        if (myObstacles[i].x == myGamePiece.x ||myObstacles[i].x == myGamePiece.x + 1 && myGamePiece.speedX != 0) {
            pont += 1;
            scorePoints.innerText = pont.toString();
        }
    }
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37] && myGamePiece.x >= 2) {myGamePiece.speedX = -1; }
    if (myGameArea.keys && myGameArea.keys[39] && myGamePiece.x + myGamePiece.width <= myGameArea.canvas.width) {myGamePiece.speedX = 1; }
    if (myGameArea.keys && myGameArea.keys[38] && myGamePiece.y >= 2) {myGamePiece.speedY = -1; }
    if (myGameArea.keys && myGameArea.keys[40] && myGamePiece.y + myGamePiece.width <= myGameArea.canvas.height) {myGamePiece.speedY = 1; }
    myGamePiece.newPos();
    myGamePiece.update();

    gameOver(pont);
}

function moveup() {
    myGamePiece.speedY -= 1;
}

function movedown() {
    myGamePiece.speedY += 1;
}

function moveleft() {
    myGamePiece.speedX -= 1;
}

function moveright() {
    myGamePiece.speedX += 1;
}
function stopMove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

function gameOver(pontos) {
    if (pontos < 0 || pontos >= 300) {
        myGameArea.stop();
        myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
        myGameArea.context.font = "30px Consolas";
        if (pontos < 0) {
            myGameArea.context.fillText("GAME OVER", (myGameArea.canvas.width/2 - 80), myGameArea.canvas.height/2);
        } else {
            myGameArea.context.fillText("FINALIZADO", (myGameArea.canvas.width/2 - 85), myGameArea.canvas.height/2);
        }      
        btnRestart.style.display = 'inline';

        btnRestart.addEventListener('click', function restartGame(){
            console.log('click');
            restart = true
            if(restart) {
                btnRestart.removeEventListener('click', restartGame);
                console.log('removido');
                myGamePiece;
                myObstacles = [];
                pont = 0;
                chave1 = true;
                chave2 = true;
                restart = false;
                btnRestart.style.display = 'none';
                scorePoints.innerText = "0";

                startGame();
            }
        });
    }
}

function gameLevel(pontos) {
    switch(pont) {
        case 0: 
            level.innerText = "1";
            break;
        case 100:
            level.innerText = "2";
            break;
        case 199:
            level.innerText = "2";
            break;
        case 200:
            level.innerText = "3";
            break;
    }
}

// RUN
startGame();
