var boxes;
var player;
var solids;
var flowers;
var background;
var controls = {};
var backgroundMiddle;

var game = new Phaser.Game(1200,800, Phaser.Auto, '', {preload: preload, create: create, update: update, render: render}, true, true);

function preload(){
	game.load.image('background', 'assets/sprites/background.png');
	game.load.image('background_forest', 'assets/sprites/background_forest.png');
	game.load.image('box', 'assets/sprites/box.png');
	game.load.image('box_suprise', 'assets/sprites/box_suprise.png');
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
	game.world.flowerCount = 0;
	
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
	var textStyle = { font: "24px Arial", fill: "#000000", align: "left" };
	game.world.flowerText = game.add.text(15, 15, "Flowers: " +game.world.flowerCount, textStyle);
	game.world.flowerText.fixedToCamera = true;
	
	/* COSMETIC BACKGROUND */
	
	stageData.objects.cosmetic.backgroundFar.forEach((c) => {
		var s = game.add.sprite(c.position.x, c.position.y, c.image);
		if(c.scale){
			s.scale.setTo(c.scale.x, c.scale.y);
		}
		s.fixedToCamera = true;
	})
	
	backgroundMiddle = game.add.group();
	stageData.objects.cosmetic.backgroundMiddle.forEach((c) => {
		var s = backgroundMiddle.create(c.position.x, c.position.y, c.image);
		if(c.scale){
			s.scale.setTo(c.scale.x, c.scale.y);
		}
	})
	
	
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
	flowers.createOne = function(x, y){
		var f = flowers.create(x, y, 'flower');
		f.anchor.setTo(0.5);
		f.body.originalPosition = {};
		f.body.originalPosition.y = y;
		f.body.originalPosition.x = x;
		if(game.rnd.frac() < 0.5)
			f.body.position.y += -200 + game.rnd.frac() * 100;
		else
			f.body.position.y += 200 - game.rnd.frac() * 100;
	}
	
	boxes = game.add.group();
	
	basicBoxes = game.add.group();
	basicBoxes.enableBody = true;
	stageData.objects.boxes.basic.items.forEach((b) => {
		var box = basicBoxes.create(b.position.x, b.position.y, stageData.objects.boxes.basic.image);
		box.body.immovable = true;
		box.createContent = function(x, y){
				flowers.createOne(x + (-15 + game.rnd.frac() * 30), y)
		};
	});
	boxes.add(basicBoxes);
	
	supriseBoxes = game.add.group();
	supriseBoxes.enableBody = true;
	stageData.objects.boxes.suprise.items.forEach((b) => {
		var box = supriseBoxes.create(b.position.x, b.position.y, stageData.objects.boxes.suprise.image);
		box.body.immovable = true;
		box.createContent = function(x, y) {
			for(var i = 0; i < 6; i++){
				flowers.createOne(x + (-15 + game.rnd.frac() * 30), y);
			}
		}
	})
	boxes.add(supriseBoxes);
	
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
				b.createContent(b.centerX, b.centerY);
			}
		});
	});
	
	/* PLAYER */
	player = new Player(game, stageData.objects.player.position.x, stageData.objects.player.position.y);
	console.log(player)
	
	/* COSMETIC FOREGROUND */
	stageData.objects.cosmetic.foreground.forEach((c) => {
		var s = game.add.sprite(c.position.x, c.position.y, c.image);
		if(c.scale){
			s.scale.setTo(c.scale.x, c.scale.y); 
		}
	})
}

function update(){
	boxes.forEach((g) => {
		game.physics.arcade.collide(player, g, (p, b) => {
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

	game.physics.arcade.collide(player, solids, (p, s) => {
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
			game.world.flowerCount += 1;
			game.world.flowerText.setText("Flowers: "+game.world.flowerCount);
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
	//flip right way
	if(player.facingRight && player.body.velocity.x < 0){
		player.scale.x *= -1;	
		player.facingRight = false;
	} else if(!player.facingRight && player.body.velocity.x > 0){
		player.scale.x *= -1;
		player.facingRight = true;
	}

	if(player.body.touching.down){
		if(controls.cursors.left.isDown && !controls.cursors.right.isDown){
			player.animations.play('walk');
		} else if(controls.cursors.right.isDown && !controls.cursors.left.isDown){
			player.animations.play('walk');
		} else {
			player.animations.stop();
		}
	} else {
		player.animations.stop();
	}
	
	// UPDATE BACKGROUND
	backgroundMiddle.forEach((s) => {
		s.position.x = game.camera.x * 3 / 4;
	});
}

function render(){
	// game.debug.body(player);
	// game.debug.bodyInfo(player, 32,32);	
	// solids.forEach((s) => {
		// game.debug.body(s);
	// })
	game.debug.geom(game.world.flowerText.textBounds);
	console.log(game.world.flowerText);
}

function isOnTopOf(o1, o2){
	return (o2.body.hitTest(o1.body.left + 1, o1.body.bottom) || o2.body.hitTest(o1.body.right - 1, o1.body.bottom));
}
function isUnder(o1, o2){
	return (o2.body.hitTest(o1.body.left + 1, o1.body.top - 1) || o2.body.hitTest(o1.body.right - 1, o1.body.top - 1));
}
