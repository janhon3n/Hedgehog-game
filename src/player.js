var Player = function(game, x, y){
	Phaser.Sprite.call(this, game, x, y, 'hedgehog_standart_walking');
	this.facingRight = true;
	this.onSolid = false;
	this.spinInProgress = false;
	
	this.anchor.setTo(0.5);
	this.animations.add('walk', null, 15);
	this.game.physics.arcade.enable(this);
		
	this.body.bounce.y = 0.1;
	this.body.gravity.y = 1700;
	this.offsetX = 100;
	this.body.setSize(48,80,8,32);

	this._jumpSpeed = 800;
	this._boxBounceSpeed = 700;
	this._boxJumpSpeed = 900;
	this._boxBounceDownSpeed = 100;

	
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
	
	if(debug.fast){
		if(controls.cursors.left.isDown && !controls.cursors.right.isDown){
			this.body.acceleration.x = -30000;
		} else if(controls.cursors.right.isDown && !controls.cursors.left.isDown){
			this.body.acceleration.x = 30000;
		}
	}
		
	// vertical movement
	if(this.onSolid && controls.cursors.up.isDown){
		this.body.velocity.y = -this._jumpSpeed;
	}
	this.body.velocity.x = this.body.velocity.x / 1.4;
	
	this.onSolid = false;
}

Player.prototype.hitSolid = function(obj){
	if(obj instanceof Solid) {
		if(isOnTopOf(this, obj))
			this.onSolid = true;
	}
}

Player.prototype.hitBox = function(obj, playerOnTop){
	if(playerOnTop){
		if(controls.cursors.up.isDown)
			this.body.velocity.y = -this._boxJumpSpeed;
		else
			this.body.velocity.y = -this._boxBounceSpeed;
	} else {
		this.body.velocity.y = this._boxBounceDownSpeed;
	}
}