import Game from './classes/Game.js';

window.addEventListener('load', function () {
  
  // put canvas reference in const
  const canvas = document.getElementById('canvas1');

  // context type, '2d' or 'webgl' (3d)
  const ctx = canvas.getContext('2d');

  canvas.width = 840;
  canvas.height = 500;

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;

  // animation loop
  function animate(timeStamp) {

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