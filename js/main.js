import Game from './classes/Game.js';

window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  const startScreen = document.getElementById('startScreen');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const startButton = document.getElementById('startButton');
  const restartButton = document.getElementById('restartButton');

  canvas.width = 1240;
  canvas.height = 700;

  const game = new Game(canvas.width, canvas.height);
  game.background.draw(ctx);
  game.background.layer4.draw(ctx);
  // draw a semi-transparent black rectangle over the background
  // to make the text more readable
  ctx.fillStyle = 'rgba(0, 0, 0, 0.69)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  let lastTime = 0;

  function startGame() {
    startScreen.style.display = 'none';
    //canvas.style.display = 'block';
    game.start();
    animate(0);
  }

  startButton.addEventListener('click', startGame);

  function restartGame() {
    gameOverScreen.style.display = 'none';
    lastTime = 0;
    game.reset();
    startGame();
  }

  restartButton.addEventListener('click', restartGame);
  
  function animate(timeStamp) {
    if (game.gameOver) {
      gameOverScreen.style.display = 'block';
      return; // Stop the animation loop when the game is over.
    }
    const deltaTime = timeStamp - lastTime;

    // lastTime = timeStamp;
    lastTime = performance.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }
});
