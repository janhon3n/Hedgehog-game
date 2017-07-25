//SOLID
var Solid = function(game, position, img, body){
	Phaser.Sprite.call(this, game, position.x, position.y, img);
	game.physics.arcade.enable(this);
	this.body.immovable = true;
	if(body){
		this.body.setSize(body.width, body.height, body.x, body.y);
	}
	game.add.existing(this);
}

Solid.prototype = Object.create(Phaser.Sprite.prototype);
Solid.prototype.constructor = Solid;


//BOX
var Box = function(game, position, img, body) {
	Phaser.Sprite.call(this, game, position.x, position.y, img);
	game.add.existing(this);
}
Box.prototype = Object.create(Solid.prototype);
Box.prototype.constructor = Box;
