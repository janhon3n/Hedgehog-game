var Flower = function(game, position, img){
	Phaser.Sprite.call(this, game, position.x, position.y, img);
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5);
    this.body.originalPosition = {};
    this.body.originalPosition.y = position.y;
    this.body.originalPosition.x = position.x;
    if(game.rnd.frac() < 0.5)
        this.body.position.y += -200 + game.rnd.frac() * 50;
    else
        this.body.position.y += 200 - game.rnd.frac() * 50;

    this.collectSound = game.add.audio('flower');
	game.add.existing(this);
}

Flower.prototype = Object.create(Phaser.Sprite.prototype);
Flower.prototype.constructor = Flower;

Flower.prototype.collect = function(){
    this.collectSound.play();
        this.collectSound.play();
        game.world.flowerCount += 1;
        game.world.flowerText.setText("Flowers: "+game.world.flowerCount);
        this.destroy();
}

Flower.prototype.update = function(){
    if(game.physics.arcade.overlap(player, this)){
        this.collect();
        return;
    }
    this.body.acceleration.y = 5*(this.body.originalPosition.y - this.body.position.y);
    if(this.body.velocity.x != 0) this.body.velocity.x = 0;
    if(this.body.velocity.y > 20) this.body.velocity.y  = 20;
    if(this.body.velocity.y < -20) this.body.velocity.y  = -20;
    if(game.physics.arcade.distanceBetween(this, player) < 100){
        var distance = Phaser.Point.subtract(player.body.position, this.body.position);
        var normalized = Phaser.Point.normalize(distance);
        this.body.velocity = normalized.multiply(300,300);
        this.body.originalPosition.y = this.body.position.y;
        this.body.originalPosition.x = this.body.position.x;
    } 
}