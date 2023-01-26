function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let score = 0;

let audio = new Audio("game.mp3");
audio.play();

function draw() {
  game.draw();
}
function preload() {
  game.preload();
}

let songIsPlaying = false;

function mouseClicked() {
  game.shoot.push(new Shoot());
  if (songIsPlaying !== true) {
    for (let i = 0; i < song.play().length; i++) songIsPlaying = true;
  }
}

//////////////////////////////////////
//////////GAME ///////////////////////
//////////////////////////////////////
let song;
let clickSong;
class Game {
  constructor() {
    this.virus = [];
    this.shoot = [];

    this.shootImage;
    this.player = new Player();
    this.playerImage;
    this.background = new Background();
    this.backgroundImage;
  }
  preload() {
    this.playerImage = loadImage("img/injector.png");
    this.backgroundImage = loadImage("img/background.jpg");
    this.shootImage = loadImage("img/drop.png");
    // this.winSong = loadSound("win.mp3");
    // this.endSong = loadSound("game-over.mp3");

    this.virusImage = [
      loadImage("img/virus_4.png"),
      loadImage("img/virus_3.png"),
      loadImage("img/virus_2.png"),
      loadImage("img/virus1.png"),
    ];
  }

  draw() {
    clear();
    this.background.draw();
    this.player.draw();
    // new Virus
    if (frameCount % 30 == 0) {
      this.virus.push(new Virus());
    }
    // Virus
    this.virus.forEach(function (virus) {
      virus.draw();
    });
    // shoot
    this.shoot.forEach(function (shoot) {
      shoot.draw();
    });

    let shootIndexToRemove = [];
    // Collision
    // Removing Virus and Shoot
    for (let i = 0; i < this.shoot.length; i++) {
      for (let j = 0; j < this.virus.length; j++) {
        if (this.virus[j].collision(this.shoot[i])) {
          this.shoot.splice(i, 1);
          this.virus.splice(j, 1);
          break;
        }
      }
    }

    if (score > 300) {
      text("Win", 30, 30);
      setTimeout(loop, 10000);
      noLoop();
      window.location.href = "win.html";
    }
  }
}
//////////////////////////////////////
//////////PLAYER ///////////////////////
//////////////////////////////////////
class Player {
  constructor() {
    this.width = 150;
    this.height = 150;
    this.x;
    this.y = window.innerHeight - this.height - 10;
    this.score;
  }

  draw() {
    this.x = mouseX - 80;
    image(game.playerImage, this.x, this.y, this.width, this.height);

    if (mouseX > windowWidth) {
      this.x = windowWidth - 200;
    }
    if (mouseX < 0) {
      this.x = 400;
    }
  }
}

//////////////////////////////////////
//////////SHOOTING ///////////////////////
//////////////////////////////////////

class Shoot {
  constructor() {
    this.height = 15;
    this.width = 15;
    this.posY = game.player.y;
    this.posX = mouseX;
  }

  draw() {
    image(game.shootImage, mouseX - 10, this.posY, this.height, this.width);
    this.posX = mouseX - 10;
    this.posY = this.posY - 10;
  }
  collision(playerInfo) {
    // Get the middle of the obstacle
    let virusX = this.x + this.width / 2;
    let virusY = this.y + this.height / 2;

    // Get the middle of the player
    let shootX = playerInfo.x + playerInfo.width / 2;
    let shootY = playerInfo.y + playerInfo.height / 2;

    if (dist(this.virusX, this.virusY, this.playerX, this.playerY) > 25) {
      return false;
    } else {
      return true;
    }
  }
}

/////////////////////////////////
//////////VIRUS ///////////////////////
//////////////////////////////////////
class Virus {
  constructor() {
    this.height = 80;
    this.width = 80;
    this.posX = Math.floor(Math.random() * 1000);
    this.posY = 0;
    this.image = Math.floor(Math.random() * 4);
  }

  draw() {
    if (
      dist(
        this.posX + this.width / 2,
        this.posY + this.height / 2,
        game.player.x + game.player.width / 2,
        game.player.y + game.player.height / 2
      ) < 40
    ) {
      fill(0, 102, 153, 51);
      text("Game Over", 100, 200);
      noLoop();
      window.location.href = "gameover.html";
    }
    image(
      game.virusImage[this.image],
      this.posX,
      this.posY,
      this.height,
      this.width
    );
    this.posX = this.posX + random(-10, 10);
    this.posY = this.posY + 2;
  }

  collision(shoot) {
    if (dist(this.posX, this.posY, shoot.posX, shoot.posY) > 100) {
      return false;
    } else {
      // Increment the score
      score += 10;
      console.log(score);

      // Update score in dem DOM
      document.querySelector("#score span").innerText = score;
      return true;
    }
  }
}

///////////BACKGROUND/////

class Background {
  draw() {
    image(game.backgroundImage, 0, 0, windowWidth, windowHeight);
  }
}
const game = new Game();
const player = new Player();
