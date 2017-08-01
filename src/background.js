var BackgroundFar = function(game, position, image, scale, speed){
    Phaser.Sprite.call(this, game, position.x, position.y, image);
    if(scale) this.scale.setTo(scale.x, scale.y);
    if(speed == undefined || speed == 1) {
        this.moveSpeed = 1;
    } else {
        this.moveSpeed = speed;
    }
    this.originalX = this.position.x;
	game.add.existing(this);
}

BackgroundFar.prototype = Object.create(Phaser.Sprite.prototype);
BackgroundFar.prototype.constructor = BackgroundFar;

BackgroundFar.prototype.updatePosition = function(){
    if(this.moveSpeed != undefined)
        this.position.x = this.originalX + (game.camera.position.x * this.moveSpeed);
}