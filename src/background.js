var BackgroundFar = function(game, position, image, scale, speed){
	Phaser.Sprite.call(this, game, position.x, position.y, image);
    if(scale)	this.scale.setTo(scale.x, scale.y);
    if(speed == undefined || speed == 1) {
        this.fixedToCamera = true;
        this.moveSpeed = 1;
    } else {
        this.moveSpeed = speed;
    }
    this.originalX = this.position.x;
	game.add.existing(this);
}

BackgroundFar.prototype = Object.create(Phaser.Sprite.prototype);
BackgroundFar.prototype.constructor =BackgroundFar;

BackgroundFar.prototype.update = function(){
    console.log(this);
    if(this.moveSpeed != undefined)
        this.position.x = this.originalX + (game.camera.x * this.moveSpeed);
}