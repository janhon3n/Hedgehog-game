var Player = function(game, position){
	Phaser.Sprite.call(this, game, position.x, position.y, 'hedgehog_standart_walking');
	this.facingRight = true;
	this.onSolid = false;
	this.spinInProgress = false;
	
	this.anchor.setTo(0.5);
	this.animations.add('walk', null, 15);
	this.game.physics.arcade.enable(this);
	console.log(this);
		
	this.body.bounce.y = 0.1;
	this.body.gravity.y = 1700;
	this.offsetX = 100;
	this.body.setSize(48,80,8,32);
	
	game.camera.follow(this, Phaser.Camera.FOLLOW_PLATFORMER);
	game.add.existing(this);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	this.body.acceleration.x = 0;
	
	if(controls.cursors.left.isDown && !controls.cursors.right.isDown){
		this.body.acceleration.x = -6000;
	} else if(controls.cursors.right.isDown && !controls.cursors.left.isDown){
		this.body.acceleration.x = 6000;
	}
		
	// vertical movement
	if(this.onSolid && controls.cursors.up.isDown){
		this.body.velocity.y = -800;
	}
	this.body.velocity.x = this.body.velocity.x / 1.4;
	
	this.onSolid = false;
}

Player.prototype.hitSolid = function(obj){
	if(obj instanceof Solid) {
		this.onSolid = true;
	}
}

Player.prototype.hitBox = function(obj, playerOnTop){
	if(playerOnTop){
		if(controls.cursors.up.isDown)
			this.body.velocity.y = -950;
		else
			this.body.velocity.y = -700;
	} else {
		this.body.velocity.y = 100;
	}
}