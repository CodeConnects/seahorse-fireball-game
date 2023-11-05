import Game from './classes/Game.js';

window.addEventListener('load', function () {
  
  // put canvas reference in const
  const canvas = document.getElementById('canvas1');

  // context type, '2d' or 'webgl' (3d)
  const ctx = canvas.getContext('2d');
  const w = 1240;
  const h = 700;

  canvas.width = w;
  canvas.height = h;

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;

  // animation loop
  function animate(timeStamp) {

    if (game.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '50px Arial';
      ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);
      return;
    }

    if (game.score >= game.winningScore) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '50px Arial';
      ctx.fillText('LEVEL COMPLETE', canvas.width / 2 - 200, canvas.height / 2);
      return;
    }

    const deltaTime = timeStamp - lastTime;
    // console.log(deltaTime);

    lastTime = timeStamp;

    // clear what has already been drawn while looping
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.draw(ctx);
    game.update(deltaTime);

    // using parent as argument to make endless loop
    requestAnimationFrame(animate);
  }

  animate(0);
});