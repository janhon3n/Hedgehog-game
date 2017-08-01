//BOX
var Box = function(game, position) {
    Phaser.Sprite.call(this, game, position.x, position.y, 'box');
	this.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(64,56,0,8);

	game.add.existing(this);
}
Box.prototype = Object.create(Solid.prototype);
Box.prototype.constructor = Box;

Box.prototype.explode = function(){
    this.body.destroy();
    this.visible = false;
    this.emitter = game.add.emitter(this.centerX, this.centerY, 20);
    this.emitter.makeParticles('boxshread');
    this.emitter.gravity = 200;
    this.emitter.start(true, 500, 100, 10)
    this.createContent(this.centerX, this.centerY);
}

Box.prototype.createContent = function(x, y){
    flowers.createOne(x + (-15 + game.rnd.frac() * 30), y)
}



var SupriseBox = function(game, position) {
    Box.call(this, game, position, 'box_suprise');
}

SupriseBox.prototype = Object.create(Box);
SupriseBox.prototype.constructor = SupriseBox;

SupriseBox.prototype.createContent = function(x, y){
    for(var i = 0; i < 6; i++){
        flowers.createOne(x + (-15 + game.rnd.frac() * 30), y);
    }
};