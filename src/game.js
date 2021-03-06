
var game = new Phaser.Game(1200,768, Phaser.Auto, '', {preload: preload, create: create, update: update, render: render}, true, true);

function preload(){
	game.load.image('background', 'assets/sprites/background.png');
	game.load.image('background_forest', 'assets/sprites/background_forest.png');
	game.load.image('background_grass', 'assets/sprites/background_grass.png');
	game.load.image('box', 'assets/sprites/box.png');
	game.load.image('box_suprise', 'assets/sprites/box_suprise.png');
	game.load.image('hedgehog_tie', 'assets/images/hedgehog/hedgehog_tie.png');
	game.load.image('platform_mossy', 'assets/sprites/platform_mossy.png');
	game.load.image('boxshread', 'assets/sprites/boxshread.png');
	game.load.image('flower', 'assets/sprites/flower.png');
	game.load.image('grass_floor_1', 'assets/sprites/grass_floor_1.png');
	game.load.image('birch_tree_trunk', 'assets/sprites/birch_tree_trunk.png');
	game.load.image('mushroom_tatti_1', 'assets/sprites/mushroom_tatti_1.png');
	game.load.image('mushroom_tatti_2', 'assets/sprites/mushroom_tatti_2.png');
	game.load.image('flower_1', 'assets/sprites/flower_1.png');

	game.load.audio('flower', 'assets/audio/flower.mp3');
	
	game.load.spritesheet('hedgehog_standart_walking', 'assets/sprites/hedgehog_standart_walking.png', 64, 128, 8);
	game.load.json('world_1', 'worlds/world_1.json');
}

function create(){
	controls.cursors = game.input.keyboard.createCursorKeys();
	controls.spin = game.input.keyboard.addKey(Phaser.Keyboard.Z);
	controls.mute = game.input.keyboard.addKey(Phaser.Keyboard.M);
	
	var stageData = game.cache.getJSON('world_1');
	game.world.setBounds(0,0,stageData.size.width * stageData.tilesize, stageData.size.height * stageData.tilesize);
	game.world.flowerCount = 0;
	game.world.tilesize = stageData.tilesize;

	if(debug)
		debug.tileHighlighter = new Phaser.Rectangle(0, 0, stageData.tilesize, stageData.tilesize);
	console.log(debug);
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	var bmd = game.add.bitmapData(game.world.width, game.world.height);
	bmd.addToWorld();
	for(var i = 0; i < 30; i++){
		var c = Phaser.Color.interpolateColor(0x8cbdff, 0xffee82, 30, i);
		bmd.rect(0,game.world.height*3/4 /30 * i,game.world.width, game.world.height*3/4/30 +1, Phaser.Color.getWebRGB(c));
	}
	for(var i = 0; i < 30; i++){
		var c = Phaser.Color.interpolateColor(0xffee82, 0xffbb47, 30, i);
		bmd.rect(0,3*game.world.height / 4 + game.world.height/2 /30 * i,game.world.width,
			game.world.height/2 /30, Phaser.Color.getWebRGB(c));
	}
	var textStyle = { font: "24px Arial", fill: "#000000", align: "left" };
	game.world.flowerText = game.add.text(15, 15, "Flowers: " +game.world.flowerCount, textStyle);
	game.world.flowerText.fixedToCamera = true;
	
	backgroundFar = game.add.group();
	stageData.objects.cosmetic.backgroundFar.forEach((c) => {
		var lastRight = c.position.x * stageData.tilesize;
		do {
			var b = new BackgroundFar(game, lastRight, c.position.y * stageData.tilesize, c.size.width, c.size.height, c.image, c.scale, c.speed);
			backgroundFar.add(b);
			lastRight = b.right - 1;
		} while(b.right < game.world.width && c.repeat);
	})
	
	
	stageData.objects.cosmetic.background.forEach((g) => {
		console.log(g);
		g.items.forEach((i) => {
			var img = game.add.image(i.x * stageData.tilesize, i.y * stageData.tilesize, g.image);
			if(g.scale){
				img.scale.setTo(g.scale.x, g.scale.y);
			}
		})
	})
	

	/* SOLIDS / POLOYGONS */
	solids = game.add.group();
	stageData.objects.solids.forEach((group) => {
		group.items.forEach((s) => {
			var img = group.image;
			if(!img)
				img = s.image;
			var body = group.body;
			if(!body)
				body = s.body;
			solids.add(new Solid(game, s.x * stageData.tilesize, s.y * stageData.tilesize, img, body));
		});
	});
		
	
	/* FLOWERS & BOXES */
	flowers = game.add.group();
	flowers.enableBody = true;
	flowers.createOne = function(x, y){
		var f = flowers.add(new Flower(game, {x: x, y: y}, 'flower'));
	}
	
	boxes = game.add.group();
	basicBoxes = game.add.group();
	stageData.objects.boxes.basic.items.forEach((b) => {
		basicBoxes.add(new Box(game, {x: b.x * stageData.tilesize, y: b.y * stageData.tilesize}));
	});
	boxes.add(basicBoxes);
	
	supriseBoxes = game.add.group();
	supriseBoxes.enableBody = true;
	stageData.objects.boxes.suprise.items.forEach((b) => {
		var box = supriseBoxes.add(new SupriseBox(game, {x: b.x * stageData.tilesize, y: b.position.y * stageData.tilesize}));
	})
	boxes.add(supriseBoxes);
	

	/* PLAYER */
	player = new Player(game, stageData.objects.player.x, stageData.objects.player.y);
	
	/* COSMETIC FOREGROUND */
	stageData.objects.cosmetic.foreground.forEach((g) => {
		console.log(g);
		g.items.forEach((i) => {
			var img = game.add.image(i.x * stageData.tilesize, i.y * stageData.tilesize, g.image);
			if(g.scale){
				img.scale.setTo(g.scale.x, g.scale.y);
			}
		})
	})
}

function update(){
	backgroundFar.forEach((b) => {
		b.updatePosition();
	})

	game.physics.arcade.collide(player, solids, (p, s) => {
		p.hitSolid(s);
	});
	
	boxes.forEach((g) => {
		game.physics.arcade.collide(player, g, (p, b) => {
			if(isOnTopOf(p, b)){
				p.hitBox(b, true);
				b.explode();
			} else if(isUnder(p, b)){
				b.explode();
				p.hitBox(b, false);
			}
		});
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

}

function render(){
	// game.debug.body(player);
	// game.debug.bodyInfo(player, 32,32);	
	// solids.forEach((s) => {
		// game.debug.body(s);
	// })
	if(debug){
		var col = Math.floor((game.input.mousePointer.x + game.camera.position.x) / game.world.tilesize);
		var row = Math.floor((game.input.mousePointer.y + game.camera.position.y) / game.world.tilesize);
		debug.tileHighlighter.x = col * game.world.tilesize;
		debug.tileHighlighter.y = row * game.world.tilesize;
		game.debug.geom(debug.tileHighlighter, "#ff0000");
		game.debug.text("row: "+ row + " col: "+col, 500, 16);
	}
}
