var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req,res){
	res.sendFile(__dirname + '/Client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(2002);
console.log("----------server started----------");

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var MINION_LIST1 = {};
var MINION_LIST2 = {};
var TURRET_LIST1 = {};
var TURRET_LIST2 = {};
var BULLET_LIST = {};
var numberOfPlayers = 0;
var gameOver = 0;		// 0 = false, 1 = true, 2 = game over message has been sent
var winner = 0;
var gold = 0;
var frameRate = 25;

var Player = function(id){
	var self = {
		id : id, 
		number : "" + Math.floor(10 * Math.random()),
		health : 10,
		gold: 1000
		
	}
	
	self.updates = function(){
	}
	
	self.createMinion1 = function(){
		minionID = Math.random();
		var minion = Minion1(minionID);
		MINION_LIST1[minionID] = minion;
	}
	
	self.createMinion2 = function(){
		minionID = Math.random();
		var minion = Minion2(minionID);
		MINION_LIST2[minionID] = minion;
	}
	
	self.createTurret1 = function(){
		turretID = Math.random();
		var turret = Turret1(turretID);
		TURRET_LIST1[turretID] = turret;
	}
	
	self.createTurret2 = function(){
		turretID = Math.random();
		var turret = Turret2(turretID);
		TURRET_LIST2[turretID] = turret;
	}
	
	self.getGold = function(){
		return self.gold;
	}

	self.getHealth = function(){
		return self.health;
	}
	
	self.updateHealth = function(){
		self.health--;
	}
	
	self.deleteTurret1 = function(){
		for (i in TURRET_LIST1){
			delete TURRET_LIST1[i];
		}
	}
	
	self.deleteTurret2 = function(){
		for (i in TURRET_LIST2){
			delete TURRET_LIST2[i];
		}
	}
		
	return self;
}

var Minion1 = function(id){
	var self = {
		x : 0,
		y : 400,
		id : id,
		maxSpeed : 10,
		determineMove: 0,
		width : 5,
		height : 5,
		health : 5
	}
	
	self.updatePosition = function(){
		if (self.y == 400 && self.x < 150)
		{
			self.x += self.maxSpeed;
		}
		else if (self.x == 150 && self.y > 170)
		{
			self.y -= self.maxSpeed;			
		}
		
		else if (self.y == 170 && self.x < 350)
		{
			self.x += self.maxSpeed;
		}
		else if (self.x == 350 && self.y < 470)
		{
			self.y += self.maxSpeed;
		}
		else if (self.y == 470 && self.x < 620)
		{
			self.x += self.maxSpeed;
		}
		else if (self.x == 620 && self.y > 320)
		{
			self.y -= self.maxSpeed;
		}
		else if (self.y == 320 && self.x < 1010)
		{
			self.x += self.maxSpeed;
		}
	}
	return self;
}

var Minion2 = function(id){
	var self = {
		x : 980,
		y : 320,
		id : id,
		maxSpeed : 10,
		determineMove: 0,
		width : 5,
		height : 5,
		health : 5
	}
	
	self.updatePosition = function(){
		if (self.y == 320 && self.x > 620)
		{
			self.x -= self.maxSpeed;
		}
		else if (self.x == 620 && self.y < 470)
		{
			self.y += self.maxSpeed;
		}
		else if (self.y == 470 && self.x > 350)
		{
			self.x -= self.maxSpeed;
		}
		else if (self.x == 350 && self.y > 170)
		{
			self.y -= self.maxSpeed;
		}
		else if (self.y == 170 && self.x > 150)
		{
			self.x -= self.maxSpeed;
		}
		else if (self.x == 150 && self.y < 400)
		{
			self.y += self.maxSpeed;
		}
		else if (self.y == 400 && self.x > -10)
		{
			self.x -= self.maxSpeed;
		}
	}
	return self;
}

var Turret1 = function(id) {
	var self = {
		x : 0,
		y : 400,
		id : id,
		image : "T"
	}
	
	self.checkMinionDistance = function() {
		var distanceFromX = 0;
		var distanceFromY = 0;
		var pathag = 0;
		var numberOfBullets = 0;
		for (i in MINION_LIST2){
			distanceFromX = Math.abs(MINION_LIST2[i].x - self.x);
			distanceFromY = Math.abs(MINION_LIST2[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 200){
				for (j in BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 1){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(MINION_LIST2[i]);
				}
			}
		}
	}
	
	self.ShootBullet = function(enemy){
			bulletID = Math.random();
			var bullet = Bullet(id, self.x, self.y, enemy);
			BULLET_LIST[bulletID] = bullet;
	}
	return self;
}

var Turret2 = function(id) {
	var self = {
		x : 980,
		y : 320,
		id : id,
		image : "T"
	}
	
	self.checkMinionDistance = function() {
		var distanceFromX = 0;
		var distanceFromY = 0;
		var pathag = 0;
		var numberOfBullets = 0;
		for (i in MINION_LIST1){
			distanceFromX = Math.abs(MINION_LIST1[i].x - self.x);
			distanceFromY = Math.abs(MINION_LIST1[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 200){
				for (j in BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 5){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(MINION_LIST1[i]);
				}
			}
		}
	}
	
	self.ShootBullet = function(enemy){
			bulletID = Math.random();
			var bullet = Bullet(id, self.x, self.y, enemy);
			BULLET_LIST[bulletID] = bullet;
	}
	return self;
}

var Bullet = function(id, fromX, fromY, enemy) {
	var self = {
		startingX : fromX,
		currentX : fromX,
		startingY : fromY,
		currentY : fromY,
		enemy : enemy,
		id : id,
		maxSpeed : 20,
		image : "B",
		width : 5,
		height : 5,
		collision : false
	}
	
	 self.updatePosition = function() {
		 if (((self.currentX - self.enemy.x) > 0) && ((self.currentY - self.enemy.y) > 0)){
			 self.currentX -= self.maxSpeed;
			 self.currentY -= self.maxSpeed;
		 }
		 else if (((self.currentX - self.enemy.x) > 0) && ((self.currentY + self.enemy.y) > 0)){
			 self.currentX -= self.maxSpeed;
			 self.currentY += self.maxSpeed;
		 }
		 else if (((self.currentX + self.enemy.x) > 0) && ((self.currentY - self.enemy.y) > 0)){
			 self.currentX += self.maxSpeed;
			 self.currentY -= self.maxSpeed;
		 }
		 else if (((self.currentX + self.enemy.x) > 0) && ((self.currentY + self.enemy.y) > 0)){
			 self.currentX += self.maxSpeed;
			 self.currentY += self.maxSpeed;
		 }
	 }
	 
	 self.checkCollision = function(){
		 if (((Math.abs((self.currentX + self.width) - (self.enemy.x))) < 10)  || (Math.abs((self.currentX - self.width) - (self.enemy.x)) < 10)){
			 self.collision = true;
			 self.enemy.health--;
			 return self.collision;
		 }
		 else if (((Math.abs((self.currentY + self.height) - (self.enemy.Y))) < 10)  || (Math.abs((self.currentY - self.height) - (self.enemy.Y)) < 10)){
			 self.collision = true;
			 self.enemy.health--;
			 return self.collision;
		 }
		 /*
		 if (((self.currentX + self.width) - (self.enemy.x - self.enemy.width) < 0) || ((self.currentX - self.width) - (self.enemy.x + self.enemy.width) < 0)){
			 self.collision = true;
			 self.enemy.health--;
			 return self.collision;
		 }
		 else if (((self.currentY + self.height) - (self.enemy.y - self.enemy.height) < 0) || ((self.currentY - self.height) - (self.enemy.y + self.enemy.height) < 0)){
			 self.collision = true;
			 self.enemy.health--;
			 return self.collision;
		 }*/
		 else {
			 self.collision = false;
		 }
		 return self.collision;
	 }
	
	return self;
}

var io = require('socket.io')(server,{});

io.sockets.on('connection', function(socket){
	numberOfPlayers++;
	socket.id = numberOfPlayers;
	SOCKET_LIST[socket.id] = socket;
	var player = Player(socket.id);
	PLAYER_LIST[socket.id] = player;
	
	console.log('socket connection from ' + socket.id);
	
	socket.on('disconnect', function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
		numberOfPlayers--;
		console.log('socket disconnected from ' + socket.id);
	});
	
	socket.on('createMinion', function(){
		if (player.id == 1&&player.gold>100){
			player.createMinion1();
		}
		else if (player.id == 2&&player.gold>100){
			player.createMinion2();
		}
	});
	
	socket.on('createTurret', function(){
		if (player.id == 1){
			player.createTurret1();
		}
		else if (player.id == 2){
			player.createTurret2();
		}
	});
	
	socket.on('deleteTurret', function(){
		if (player.id == 1){
			player.deleteTurret1();
		}
		else if (player.id == 2){
			player.deleteTurret2();
		}	
	});
});

setInterval(function() {
	var packMinions = [];
	var packTurrets = [];
	var packBullets = [];
	var packHealth = [];
	
	if (gameOver == 0){
		for (var i in PLAYER_LIST) {
			var player = PLAYER_LIST[i];
			player.updates();
			//console.log(player.getHealth());
			if (player.getHealth() <= 0){
				console.log("Player " + i + " is out of lives");
				gameOver = 1;
				if (i == 1){
					winner = 2;
				}
				else if (i == 2){
					winner = 1;
				}
			}
		}
		
		for (var i in MINION_LIST1) {
			var minion = MINION_LIST1[i];
			if (minion.x >= 1000 || minion.y >= 750){
				PLAYER_LIST[1].updateHealth();
				//console.log("Player 1's health is: " + PLAYER_LIST[1]["self"]["health"]);
				delete MINION_LIST1[i];
				continue;
			}
			if (minion.health == 0){
				delete MINION_LIST1[i];
				console.log("minion destroyed");
			}
			minion.updatePosition();
			packMinions.push({x : minion.x, y: minion.y, id : minion.id, image : minion.image});
		}
		
		for (var i in MINION_LIST2) {
			var minion = MINION_LIST2[i];
			if (minion.x <= 0 || minion.y >= 740){
				PLAYER_LIST[2].updateHealth();
				delete MINION_LIST2[i];
				continue;
			}
			if (minion.health == 0){
				delete MINION_LIST2[i];
				console.log("minion destroyed");
			}
			minion.updatePosition();
			packMinions.push({x : minion.x, y: minion.y, id : minion.id, image : minion.image});
		}
		
		for (var i in TURRET_LIST1) {
			var turret = TURRET_LIST1[i];
			turret.checkMinionDistance();
			packTurrets.push({x : turret.x, y: turret.y, id : turret.id, image : turret.image});
		}
		
		for (var i in TURRET_LIST2) {
			var turret = TURRET_LIST2[i];
			turret.checkMinionDistance();
			packTurrets.push({x : turret.x, y: turret.y, id : turret.id, image : turret.image});
		}
		
		for (var i in BULLET_LIST) {
			var bullet = BULLET_LIST[i];
			if (bullet.x >= 990 || bullet.y >= 740){
				delete BULLET_LIST[i];
				
				continue;
			}
			bullet.updatePosition();
			if (bullet.checkCollision() == true){
				console.log("collision detected");
				delete BULLET_LIST[i];
			}
			packBullets.push({x : bullet.currentX, y : bullet.currentY, id : bullet.id, image : bullet.image});
		}
		
		for (var i in SOCKET_LIST) {
			var socket = SOCKET_LIST[i];
			var health = 0;
			for (var j in PLAYER_LIST){
				if (PLAYER_LIST[j].id == socket.id){
					health = PLAYER_LIST[j].health;
					//packHealth.push(health);
				}
			}
			socket.emit('newPosition', packMinions, packTurrets, packBullets, socket.id, health);
		}
	}
	else if (gameOver == 1) {
		gameOver = 2;
		for (var i in SOCKET_LIST) {
			var socket = SOCKET_LIST[i];
			socket.emit('game over', winner);
		}		
	}
	else if (gameOver == 2){
		delete MINION_LIST1;
		delete MINION_LIST2;
		delete TURRET_LIST1;
		delete TURRET_LIST2;
		delete BULLET_LIST;
		delete PLAYER_LIST;
		//numberOfPlayers = 0;
	}
	
}, 1000/25);
