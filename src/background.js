var BackgroundFar = function(game, x, y, width, height, image, scale, speed){
    Phaser.TileSprite.call(this, game, x, y, width, height, image);
    if(scale) this.scale.setTo(scale.x, scale.y);
    if(speed == undefined || speed == 1) {
        this.moveSpeed = 1;
    } else {
        this.moveSpeed = speed;
    }
    this.originalX = this.position.x;
    console.log(this);
	game.add.existing(this);
}

BackgroundFar.prototype = Object.create(Phaser.TileSprite.prototype);
BackgroundFar.prototype.constructor = BackgroundFar;

BackgroundFar.prototype.updatePosition = function(){
    if(this.moveSpeed != undefined)
        this.position.x = this.originalX + (game.camera.position.x * this.moveSpeed);
}