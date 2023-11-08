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

    // ammo
    if (this.game.player.powerUp) context.fillStyle = '#ffffbd';
    context.fillText('Ammo:', 20, 40);
    for (let i = 0; i < this.game.ammo; i++) {
      context.fillRect(114 + 5 * i, 23, 3, 20);
    }

    // score
    context.fillText('Score: ' + this.game.score, 600, 40);

    // timer
    const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
    context.fillText('Timer: ' + formattedTime, 1064, 40);

    context.restore();
  }
}