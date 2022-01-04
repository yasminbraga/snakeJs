const selector = document.querySelector("canvas");

const ctx = selector.getContext("2d");

const MAX_WIDTH = selector.width;
const MAX_HEIGHT = selector.height;

class Game {
  alerts = "Pressione espaço para iniciar o jogo";
  fps = 8;
  #GAME_STATUS = {
    onStart: "on_start",
    over: "over",
    onPause: "on_pause",
    started: "started",
  };
  status = this.#GAME_STATUS.onStart;

  over() {
    this.status = this.#GAME_STATUS.over;
    this.alerts = "Fim de jogo! Pressione espaço para jogar novamente.";
  }

  get isStarted() {
    return this.status === this.#GAME_STATUS.started;
  }
  get isOver() {
    return this.status === this.#GAME_STATUS.over;
  }

  get isOnStart() {
    return this.status === this.#GAME_STATUS.onStart;
  }

  get isOnPause() {
    return this.status === this.#GAME_STATUS.onPause;
  }

  pause() {
    this.status = this.#GAME_STATUS.onPause;
    this.alerts = "Pressione espaço para voltar ao jogo";
  }

  start() {
    game.status = this.#GAME_STATUS.started;
    game.alerts = "";
  }
}

const game = new Game();

function randomApplePos(grid) {
  const x = Math.floor((Math.random() * MAX_WIDTH) / grid) * grid;
  const y = Math.floor((Math.random() * MAX_HEIGHT) / grid) * grid;

  return {
    x,
    y,
  };
}

class Apple {
  constructor() {
    this.reset();
  }

  reset() {
    this.l = 20;
    const { x, y } = randomApplePos(this.l);
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    ctx.fillStyle = "tomato";
    ctx.fillRect(this.x, this.y, this.l, this.l);
  }
}

const apple = new Apple();

class Snake {
  constructor() {
    this.alive();
  }

  alive() {
    this.l = 20;
    (this.pos = [
      { x: 20, y: 20 },
      { x: 40, y: 20 },
      { x: 60, y: 20 },
    ]),
      (this.direction = "right");
    this.score = 0;
    this.dir = {
      x: 1,
      y: 0,
    };
  }

  get head() {
    return this.pos[this.pos.length - 1];
  }

  get tail() {
    return this.pos.slice(0, this.pos.length - 1);
  }

  collidesWith(obj) {
    return this.head.x === obj.x && this.head.y === obj.y;
  }

  outOfBoundaries() {
    return (
      this.head.x >= MAX_WIDTH ||
      this.head.x < 0 ||
      this.head.y >= MAX_HEIGHT ||
      this.head.y < 0
    );
  }

  scoreUp() {
    this.pos.unshift({
      x: 0,
      y: 0,
    });
    this.score += 1;
  }

  selfCollide() {
    return this.tail.some(
      (tail) => this.head.x === this.pos.x && this.head.y === this.pos.y
    );
  }

  draw(ctx) {
    ctx.fillStyle = "lawngreen";
    this.pos.forEach((pos) => {
      ctx.fillRect(pos.x, pos.y, this.l, this.l);
    });
  }

  update() {
    for (let i = 0; i <= this.pos.length - 2; i++) {
      this.pos[i].x = this.pos[i + 1].x;
      this.pos[i].y = this.pos[i + 1].y;
    }

    this.head.y += this.dir.y * this.l;
    this.head.x += this.dir.x * this.l;
  }

  get keyDownActions() {
    return {
      ArrowLeft: () => {
        if (this.dir.x > 0) return;
        this.dir = {
          x: -1,
          y: 0,
        };
      },
      ArrowRight: () => {
        if (this.dir.x < 0) return;
        this.dir = {
          x: 1,
          y: 0,
        };
      },
      ArrowUp: () => {
        if (this.dir.y > 0) return;
        this.dir = {
          x: 0,
          y: -1,
        };
      },
      ArrowDown: () => {
        if (this.dir.y < 0) return;
        this.dir = {
          x: 0,
          y: 1,
        };
      },
    };
  }
  handleEvents({ code }) {
    if (this.keyDownActions[code]) this.keyDownActions[code]();
  }
}

let snake = new Snake();

function render() {
  // draw
  ctx.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);

  apple.draw(ctx);

  snake.draw(ctx);

  document.querySelector("#score").innerHTML = snake.score;
  document.querySelector(".game__alerts").innerHTML = game.alerts;

  if (game.isOver) {
    ctx.font = "bold 80px courier";
    ctx.fillStyle = "tomato";
    ctx.fillText("GAME OVER", 80, 250);
  }

  if (snake.collidesWith(apple)) {
    snake.scoreUp();
    apple.reset();
  }

  if (snake.selfCollide() || snake.outOfBoundaries()) {
    game.over();
  }

  if (game.isStarted) {
  }

  if (game.isStarted) {
    snake.update();
  }

  window.onkeydown = (ev) => {
    if (game.isStarted) {
      snake.handleEvents(ev);
    }

    if (ev.code === "Space") {
      if (game.isStarted) {
        game.pause();
        return;
      }
      if (game.isOver) {
        snake.alive();
        apple.reset();
        game.alerts = "";
      }
      game.start();
    }
  };

  setTimeout(() => {
    requestAnimationFrame(render);
  }, 1000 / game.fps);
}

render();
