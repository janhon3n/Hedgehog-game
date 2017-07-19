var player;
var boxes;
var solids;
var flowers;
var background;
var controls = {};

var game = new Phaser.Game(1200,800, Phaser.Auto, '', {preload: preload, create: create, update: update, render: render}, true, true);


function preload(){
	game.load.image('box', 'assets/sprites/box.png');
	game.load.image('hedgehog_tie', 'assets/images/hedgehog/hedgehog_tie.png');
	game.load.image('platform_mossy', 'assets/sprites/platform_mossy.png');
	game.load.image('boxshread', 'assets/sprites/boxshread.png');
	game.load.image('flower', 'assets/sprites/flower.png');
	game.load.image('grass_ground_1', 'assets/sprites/grass_ground_1.png');
	game.load.image('birch_tree_trunk', 'assets/sprites/birch_tree_trunk.png');
	game.load.image('mushroom_tatti_1', 'assets/sprites/mushroom_tatti_1.png');
	game.load.image('mushroom_tatti_2', 'assets/sprites/mushroom_tatti_2.png');
	
	game.load.spritesheet('hedgehog_standart_walking', 'assets/sprites/hedgehog_standart_walking.png', 64, 128, 8);
	game.load.json('world_1', 'worlds/world_1.json');

}

function create(){
	controls.cursors = game.input.keyboard.createCursorKeys();
	controls.spin = game.input.keyboard.addKey(Phaser.Keyboard.Z);
	
	var stageData = game.cache.getJSON('world_1');
	game.world.setBounds(0,0,stageData.size.width,stageData.size.height);
	
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	var bmd = game.add.bitmapData(game.world.width, game.world.height);
	bmd.addToWorld();
	for(var i = 0; i < 30; i++){
		var c = Phaser.Color.interpolateColor(0x8cbdff, 0xffee82, 30, i);
		bmd.rect(0,game.world.height*3/4 /30 * i,game.world.width, game.world.height*3/4/30, Phaser.Color.getWebRGB(c));
	}
	for(var i = 0; i < 30; i++){
		var c = Phaser.Color.interpolateColor(0xffee82, 0xffbb47, 30, i);
		bmd.rect(0,3*game.world.height / 4 + game.world.height/2 /30 * i,game.world.width, game.world.height/2 /30, Phaser.Color.getWebRGB(c));
	}
	
	/* COSMETIC BACKGROUND */
	stageData.objects.cosmetic.background.forEach((c) => {
		var s = game.add.sprite(c.position.x, c.position.y, c.image);
		if(c.scale){
			s.scale.setTo(c.scale.x, c.scale.y); 
		}
	})
	

	/* SOLIDS / POLOYGONS */
	solids = game.add.group();
	solids.enableBody = true;
	stageData.objects.solids.forEach((group) => {
		group.items.forEach((s) => {
			var img = group.image;
			if(!img)
				img = s.image;
			var solid = solids.create(s.position.x, s.position.y, img);
			var body = group.body;
			if(!body)
				body = s.body;
			if(body){
				solid.body.setSize(body.width, body.height, body.x, body.y);
			}
			solid.body.immovable = true;
		});
	});
		
	
	/* FLOWERS & BOXES */
	flowers = game.add.group();
	flowers.enableBody = true;
	
	boxes = game.add.group();
	
	basicBoxes = game.add.group();
	basicBoxes.enableBody = true;
	stageData.objects.boxes.basic.items.forEach((b) => {
		console.log(b);
		var box = basicBoxes.create(b.position.x, b.position.y, stageData.objects.boxes.basic.image)
		box.body.immovable = true;
	});
	
	boxes.add(basicBoxes);
	
	
	boxes.children.forEach((group) => {
		group.children.forEach((b) => {
			b.body.immovable = true;
			b.body.setSize(64,56,0,8);
			b.explode = function(){
				this.body.destroy();
				this.visible = false;
				b.emitter = game.add.emitter(b.centerX, b.centerY, 20);
				b.emitter.makeParticles('boxshread');
				b.emitter.gravity = 200;
				b.emitter.start(true, 500, 100, 10)
				var f = flowers.create(b.centerX, b.centerY, 'flower');
				f.anchor.setTo(0.5);
				f.body.originalPosition = {};
				f.body.originalPosition.y = f.body.position.y;
				f.body.originalPosition.x = f.body.position.x;
				f.body.position.y -= 200;
			}
		});
	});
	
	
	
	
		/* PLAYER */
	player = game.add.sprite(stageData.objects.player.position.x,stageData.objects.player.position.y,'hedgehog_standart_walking', 0);
	player.anchor.setTo(0.5);
	player.animations.add('walk', null, 15);
	player.facingRight = true;
	game.physics.arcade.enable(player);
		
	player.body.bounce.y = 0.1;
	player.body.gravity.y = 1700;
	player.offsetX = 100;
	player.body.setSize(48,80,8,32);
	
	//own properties
	player.canJump = false;
	player.spinInProgress = false;
	game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
	
	
	/* COSMETIC FOREGROUND */
	stageData.objects.cosmetic.foreground.forEach((c) => {
		var s = game.add.sprite(c.position.x, c.position.y, c.image);
		if(c.scale){
			s.scale.setTo(c.scale.x, c.scale.y); 
		}
	})
}

function update(){
	player.canJump = false;
	var hitbox = false;
	boxes.forEach((g) => {
		game.physics.arcade.collide(player, g, (p, b) => {
			hitbox = true;
			if(isOnTopOf(p, b)){
				b.explode();
				player.body.velocity.y = -750;
				if(controls.cursors.up.isDown)
					player.body.velocity.y = -900;
			} else if(isUnder(p, b)){
				b.explode();
				player.body.velocity.y = 100;
			}
		});
	});

	var hitSolid = game.physics.arcade.collide(player, solids, (p, s) => {
		if(isOnTopOf(p, s)){
			p.canJump = true;
		}
	});
	player.body.acceleration.x = 0;
	
	if(controls.cursors.left.isDown && !controls.cursors.right.isDown){
		player.body.acceleration.x = -6000;
	} else if(controls.cursors.right.isDown && !controls.cursors.left.isDown){
		player.body.acceleration.x = 6000;
	}
	
	// vertical movement
	if(player.canJump && controls.cursors.up.isDown){
		player.body.velocity.y = -800;
	}
	
	if(controls.spin.isDown){
		if(!player.spinInProgress){
			player.spinInProgress = true;
			player.loadTexture('hedgehog');
			setTimeout(() => {
				player.spinInProgress = false;
				player.loadTexture('player');
			}, 500)
		}
	}
	
	
	player.body.velocity.x = player.body.velocity.x / 1.4;
	
	flowers.forEach((f) => {
		if(game.physics.arcade.overlap(player, f)){
			f.destroy();
			return;
		}
		f.body.acceleration.y = 5*(f.body.originalPosition.y - f.body.position.y);
		if(f.body.velocity.x != 0) f.body.velocity.x = 0;
		if(f.body.velocity.y > 20) f.body.velocity.y  = 20;
		if(f.body.velocity.y < -20) f.body.velocity.y  = -20;
		if(game.physics.arcade.distanceBetween(f, player) < 100){
			var distance = Phaser.Point.subtract(player.body.position, f.body.position);
			var normalized = Phaser.Point.normalize(distance);
			f.body.velocity = normalized.multiply(300,300);
			f.body.originalPosition.y = f.body.position.y;
			f.body.originalPosition.x = f.body.position.x;
		} 
	});
	
	
	//figure out animations
	if(player.body.touching.down){
		if(controls.cursors.left.isDown && !controls.cursors.right.isDown){
			player.animations.play('walk');
			if(player.facingRight){
				player.scale.x *= -1;
				player.facingRight = false;
			}
		} else if(controls.cursors.right.isDown && !controls.cursors.left.isDown){
			player.animations.play('walk');
			if(!player.facingRight){
				player.scale.x *= -1;
				player.facingRight = true;
			}
		} else {
			player.animations.stop();
		}
	} else {
		player.animations.stop();
	}
}

function render(){
	// game.debug.body(player);
	// game.debug.bodyInfo(player, 32,32);	
	// solids.forEach((s) => {
		// game.debug.body(s);
	// })
}

function isOnTopOf(o1, o2){
	return (o2.body.hitTest(o1.body.left + 1, o1.body.bottom) || o2.body.hitTest(o1.body.right - 1, o1.body.bottom));
}
function isUnder(o1, o2){
	return (o2.body.hitTest(o1.body.left + 1, o1.body.top - 1) || o2.body.hitTest(o1.body.right - 1, o1.body.top - 1));
}

