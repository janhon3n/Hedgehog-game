//SOLID
var Solid = function(game, x, y, img, body){
	Phaser.Sprite.call(this, game, x, y, img);
	game.physics.arcade.enable(this);
	this.body.immovable = true;
	if(body){
		this.body.setSize(body.width, body.height, body.x, body.y);
	}
	game.add.existing(this);
}

Solid.prototype = Object.create(Phaser.Sprite.prototype);
Solid.prototype.constructor = Solid;


