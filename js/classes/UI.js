export default class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 25;
    this.fontFamily = 'Audiowide';
    this.color = 'white';
  }
  draw(context) {
    context.save();

    context.fillStyle = this.color;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = 'black';
    context.font = this.fontSize + 'px ' + this.fontFamily;

    // score
    context.fillText('Score: ' + this.game.score, 20, 40);

    // timer
    const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
    context.fillText('Timer: ' + formattedTime, 20, 100);

    // game over message
    if (this.game.gameOver) {
      context.textAlign = 'center';
      let message1;
      let message2;
      if (this.game.score > this.game.winningScore) {
        message1 = 'You win!';
        message2 = 'Well done!';
      } else {
        message1 = 'Oh no!';
        message2 = 'Repair your seahorse and try again!';
      }
      context.font = '64px ' + this.fontFamily;
      context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 18);
      context.font = '25px ' + this.fontFamily;
      context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 18);
    }

    // ammo
    if (this.game.player.powerUp) context.fillStyle = '#ffffbd';
    for (let i = 0; i < this.game.ammo; i++) {
      context.fillRect(20 + 5 * i, 50, 3, 20);
    }

    context.restore();
  }
}