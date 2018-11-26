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
var DISCONNECT_LIST = [];

var MINION_LIST1 = {};
var MINION_LIST2 = {};

var SUPER_MINION_LIST1 = {};
var SUPER_MINION_LIST2 = {};

var TURRET_LIST1 = {};
var TURRET_LIST2 = {};

var SUPER_TURRET_LIST1 = {};
var SUPER_TURRET_LIST2 = {};

var SOLDIER_LIST1 = {};
var SOLDIER_LIST2 = {};

var BULLET_LIST = {};
var SUPER_BULLET_LIST = {};

var numberOfPlayers = 0;
var gameOver = 0;		// 0 = false, 1 = true, 2 = game over message has been sent
var winner = 0;
var frameRate = 25;
var turretButtonPressed = false;

var Player = function(id){
	var self = {
		id : id, 
		number : "" + Math.floor(10 * Math.random()),
		health : 100,
		gold : 100
	}
	
	self.updates = function(){
	}
	
	self.createMinion1 = function(){
		minionID = Math.random();
		var minion = Minion1(minionID);
		MINION_LIST1[minionID] = minion;
		self.gold -= 5;
	}
	
	self.createMinion2 = function(){
		minionID = Math.random();
		var minion = Minion2(minionID);
		MINION_LIST2[minionID] = minion;
		self.gold -= 5;
	}

	self.createSuperMinion1 = function(){
		minionID = Math.random();
		var superMinion = SuperMinion1(minionID);
		SUPER_MINION_LIST1[minionID] = superMinion;
		self.gold -= 30;
	}
	
	self.createSuperMinion2 = function(){
		minionID = Math.random();
		var superMinion = SuperMinion2(minionID);
		SUPER_MINION_LIST2[minionID] = superMinion;
		self.gold -= 30;
	}
	
	self.createSoldier1 = function(){
		soldierID = Math.random();
		var soldier = Soldier1(soldierID);
		SOLDIER_LIST1[soldierID] = soldier;
		self.gold -= 50;
	}
	
	self.createSoldier2 = function(){
		soldierID = Math.random();
		var soldier = Soldier2(soldierID);
		SOLDIER_LIST2[soldierID] = soldier;
		self.gold -= 50;
	}
	
	self.createTurret1 = function(x,y){
		turretID = Math.random();
		var turret = Turret1(turretID);
		TURRET_LIST1[turretID] = turret;
		turret.setX(x);
		turret.setY(y);
		self.gold -= 20;
	}
	
	self.createTurret2 = function(x,y){
		turretID = Math.random();
		var turret = Turret2(turretID);
		TURRET_LIST2[turretID] = turret;
		turret.setX(x);
		turret.setY(y);
		self.gold -= 20;
	}
	
	self.createSuperTurret1 = function(x,y){
		turretID = Math.random();
		var turret = SuperTurret1(turretID);
		SUPER_TURRET_LIST1[turretID] = turret;
		turret.setX(x);
		turret.setY(y);
		self.gold -= 40;
	}
	
	self.createSuperTurret2 = function(x,y){
		turretID = Math.random();
		var turret = SuperTurret2(turretID);
		SUPER_TURRET_LIST2[turretID] = turret;
		turret.setX(x);
		turret.setY(y);
		self.gold -= 40;
	}
	
	self.getHealth = function(){
		return self.health;
	}
	
	self.updateHealthMinion = function(){
		self.health--;
	}
	
	self.updateHealthSoldier = function(){
		self.health = (self.health - 20);
	}

	self.updateHealthSuperMinion = function(){
		self.health -= 25;
	}
	
	self.deleteTurret1 = function(){
		for (i in TURRET_LIST1){
			delete TURRET_LIST1[i];
			self.gold += 10;
		}
		for (i in SUPER_TURRET_LIST1){
			delete SUPER_TURRET_LIST1[i];
			self.gold += 20;
		}
	}
	
	self.deleteTurret2 = function(){
		for (i in TURRET_LIST2){
			delete TURRET_LIST2[i];
			self.gold += 10;
		}
		for (i in SUPER_TURRET_LIST2){
			delete SUPER_TURRET_LIST2[i];
			self.gold += 40;
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

var SuperMinion1 = function(id){
	var self = {
		x : 0,
		y : 400,
		id : id,
		maxSpeed : 5,
		determineMove: 0,
		width : 5,
		height : 5,
		health : 50
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

var SuperMinion2 = function(id){
	var self = {
		x : 980,
		y : 320,
		id : id,
		maxSpeed : 5,
		determineMove: 0,
		width : 5,
		height : 5,
		health : 50
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

var Soldier1 = function(id){
	var self = {
		x : 0,
		y : 400,
		id : id,
		maxSpeed : 5,
		determineMove: 0,
		width : 5,
		height : 5,
		health : 35,
		name : "soldier1"
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
	
	self.checkTurretDistance = function() {
		var distanceFromX = 0;
		var distanceFromY = 0;
		var pathag = 0;
		var numberOfBullets = 0;
		for (i in TURRET_LIST2){
			distanceFromX = Math.abs(TURRET_LIST2[i].x - self.x);
			distanceFromY = Math.abs(TURRET_LIST2[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 200){
				for (j in BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 10){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(TURRET_LIST2[i]);
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

var Soldier2 = function(id){
	var self = {
		x : 980,
		y : 320,
		id : id,
		maxSpeed : 5,
		determineMove: 0,
		width : 5,
		height : 5,
		health : 35,
		name : "soldier2"
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
	
	self.checkTurretDistance = function() {
		var distanceFromX = 0;
		var distanceFromY = 0;
		var pathag = 0;
		var numberOfBullets = 0;
		for (i in TURRET_LIST1){
			distanceFromX = Math.abs(TURRET_LIST1.x - self.x);
			distanceFromY = Math.abs(TURRET_LIST1.y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 200){
				for (j in BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 10){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(TURRET_LIST1[i]);
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

var Turret1 = function(id) {
	var self = {
		x : Math.random() * (500 - 0) + 0,
		//x : self.getX();
		y : Math.random() * (750 - 0) + 0,
		id : id,
		image : "T",
		health : 5,
		locationConfirmed : false
	}

	self.setX = function(xCoord){
		self.x = xCoord;
	}
	
	self.setY = function(yCoord){
		self.y = yCoord;
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
				if (numberOfBullets < 10){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(MINION_LIST2[i]);
				}
			}
		}
		for (i in SOLDIER_LIST2){
			distanceFromX = Math.abs(SOLDIER_LIST2[i].x - self.x);
			distanceFromY = Math.abs(SOLDIER_LIST2[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 200){
				for (j in BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 10){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(SOLDIER_LIST2[i]);
				}
			}
		}
		for (i in SUPER_MINION_LIST2){
			distanceFromX = Math.abs(SUPER_MINION_LIST2[i].x - self.x);
			distanceFromY = Math.abs(SUPER_MINION_LIST2[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 200){
				for (j in BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 10){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(SUPER_MINION_LIST2[i]);
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
		x : Math.random() * (1000 - 500) + 500,
		y : Math.random() * (750 - 0) + 0, 
		id : id,
		health : 5,
		image : "T"
	}
	
	self.setX = function(xCoord){
		self.x = xCoord;
	}
	
	self.setY = function(yCoord){
		self.y = yCoord;
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
				if (numberOfBullets < 10){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(MINION_LIST1[i]);
				}
			}
		}
		for (i in SOLDIER_LIST1){
			distanceFromX = Math.abs(SOLDIER_LIST1[i].x - self.x);
			distanceFromY = Math.abs(SOLDIER_LIST1[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 200){
				for (j in BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 10){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(SOLDIER_LIST1[i]);
				}
			}
		}
		for (i in SUPER_MINION_LIST1){
			distanceFromX = Math.abs(SUPER_MINION_LIST1[i].x - self.x);
			distanceFromY = Math.abs(SUPER_MINION_LIST1[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 200){
				for (j in BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 10){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(SUPER_MINION_LIST1[i]);
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

var SuperTurret1 = function(id) {
	var self = {
		x : Math.random() * (500 - 0) + 0,
		//x : self.getX();
		y : Math.random() * (750 - 0) + 0,
		id : id,
		image : "T",
		health : 10,
		locationConfirmed : false
	}

	self.setX = function(xCoord){
		self.x = xCoord;
	}
	
	self.setY = function(yCoord){
		self.y = yCoord;
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
			if (pathag <= 100){
				for (j in SUPER_BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 5){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(MINION_LIST2[i]);
				}
			}
		}
		for (i in SOLDIER_LIST2){
			distanceFromX = Math.abs(SOLDIER_LIST2[i].x - self.x);
			distanceFromY = Math.abs(SOLDIER_LIST2[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 100){
				for (j in SUPER_BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 5){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(SOLDIER_LIST2[i]);
				}
			}
		}
		for (i in SUPER_MINION_LIST2){
			distanceFromX = Math.abs(SUPER_MINION_LIST2[i].x - self.x);
			distanceFromY = Math.abs(SUPER_MINION_LIST2[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 100){
				for (j in SUPER_BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 5){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(SUPER_MINION_LIST2[i]);
				}
			}
		}
	}
	
	self.ShootBullet = function(enemy){
			bulletID = Math.random();
			var bullet = SuperBullet(id, self.x, self.y, enemy);
			SUPER_BULLET_LIST[bulletID] = bullet;
	}
	return self;
}

var SuperTurret2 = function(id) {
	var self = {
		x : Math.random() * (1000 - 500) + 500,
		y : Math.random() * (750 - 0) + 0, 
		id : id,
		health : 10,
		image : "T"
	}
	
	self.setX = function(xCoord){
		self.x = xCoord;
	}
	
	self.setY = function(yCoord){
		self.y = yCoord;
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
			if (pathag <= 100){
				for (j in SUPER_BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 5){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(MINION_LIST1[i]);
				}
			}
		}
		for (i in SOLDIER_LIST1){
			distanceFromX = Math.abs(SOLDIER_LIST1[i].x - self.x);
			distanceFromY = Math.abs(SOLDIER_LIST1[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 100){
				for (j in SUPER_BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 5){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(SOLDIER_LIST1[i]);
				}
			}
		}
		for (i in SUPER_MINION_LIST1){
			distanceFromX = Math.abs(SUPER_MINION_LIST1[i].x - self.x);
			distanceFromY = Math.abs(SUPER_MINION_LIST1[i].y - self.y);
			pathag = Math.pow((Math.pow(distanceFromX, 2) + Math.pow(distanceFromY,2)), .5);
			if (pathag <= 100){
				for (j in SUPER_BULLET_LIST){
					numberOfBullets++;
				}
				if (numberOfBullets < 5){
					//console.log(pathag);
					//console.log("shoot bullet");
					self.ShootBullet(SUPER_MINION_LIST1[i]);
				}
			}
		}
	}
	
	self.ShootBullet = function(enemy){
			bulletID = Math.random();
			var bullet = SuperBullet(id, self.x, self.y, enemy);
			SUPER_BULLET_LIST[bulletID] = bullet;
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
			 console.log("collision detected");
			 return self.collision;
		 }
		 else if (((Math.abs((self.currentY + self.height) - (self.enemy.Y))) < 10)  || (Math.abs((self.currentY - self.height) - (self.enemy.Y)) < 10)){
			 self.collision = true;
			 self.enemy.health--;
			 console.log("collision detected");
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

var SuperBullet = function(id, fromX, fromY, enemy) {
	var self = {
		startingX : fromX,
		currentX : fromX,
		startingY : fromY,
		currentY : fromY,
		enemy : enemy,
		id : id,
		maxSpeed : 10,
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
			 self.enemy.health -= 3;
			 console.log("collision detected");
			 return self.collision;
		 }
		 else if (((Math.abs((self.currentY + self.height) - (self.enemy.Y))) < 10)  || (Math.abs((self.currentY - self.height) - (self.enemy.Y)) < 10)){
			 self.collision = true;
			 self.enemy.health -= 3;
			 console.log("collision detected");
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
var allowPlay = false;

io.sockets.on('connection', function(socket){
	if (DISCONNECT_LIST === undefined || DISCONNECT_LIST.length == 0){
		numberOfPlayers++;
		socket.id = numberOfPlayers;
		SOCKET_LIST[socket.id] = socket;
		var player = Player(socket.id);
		PLAYER_LIST[socket.id] = player;
	}
	else if (DISCONNECT_LIST.length > 0){
		socket.id = DISCONNECT_LIST[DISCONNECT_LIST.length-1];
		SOCKET_LIST[socket.id] = socket;
		//var player = Player(socket.id);
		//PLAYER_LIST[socket.id] = player;
		var player = PLAYER_LIST[socket.id];
	}
	console.log('socket connection from ' + socket.id);
	//console.log(JSON.stringify(PLAYER_LIST.id));
		socket.on('chargeBar',function(){
			if(player.id == 1 && player.gold >= 50){
				player.createSoldier1();
			}
			else if (player.id == 2 && player.gold >= 50){
				player.createSoldier2();
			}
		});
	
		socket.on('disconnect', function(){
			//delete SOCKET_LIST[socket.id];
			//delete PLAYER_LIST[socket.id];
			//numberOfPlayers--;
			DISCONNECT_LIST.push(socket.id);
			console.log('socket disconnected from ' + socket.id);
		});
	
		socket.on('createMinion', function(){
			if(allowPlay) {
				if (player.id == 1 && player.gold >= 5){
					player.createMinion1();
				}
				else if (player.id == 2 && player.gold >= 5){
					player.createMinion2();
				}
			}
		});
		
		socket.on('createSoldier', function(){
			if(allowPlay) {
				if (player.id == 1 && player.gold >= 35){
					player.createSoldier1();
				}
				else if (player.id == 2 && player.gold >= 35){
					player.createSoldier2();
				}
			}
		});
		
		socket.on('createSuperMinion', function(){
			if(allowPlay) {
				if (player.id == 1 && player.gold >= 30){
					player.createSuperMinion1();
				}
				else if (player.id == 2 && player.gold >= 30){
					player.createSuperMinion2();
				}
			}
		});
	
		socket.on('createTurret', function(x,y){
			if (allowPlay) {
				if (player.id == 1){
					var numberOfTurret1 = 0;
					for (var i in TURRET_LIST1){
						numberOfTurret1++;
					}
					if (player.gold >= 20){
						if (x >= 500){
							x = 500;
						}
						else if (x <= 10){
							x = 10;
						}
						if (y >= 740){
							y = 740;
						}
						else if (y <= 10){
							y = 10;
						}
						player.createTurret1(x,y);
					}
				}
				else if (player.id == 2){
					var numberOfTurret2 = 0;
					for (var i in TURRET_LIST2){
						numberOfTurret2++;
					}
					if (player.gold >= 20){
						if (x <= 500){
							x = 500;
						}
						else if (x >= 990){
							x = 990;
						}
						if (y >= 740){
							y = 740;
						}
						else if (y <= 10){
							y = 10;
						}
						player.createTurret2(x,y);
					}
				}
			}
		});
		
		socket.on('createSuperTurret', function(x,y){
			if (allowPlay) {
				if (player.id == 1){
					var numberOfTurret1 = 0;
					for (var i in SUPER_TURRET_LIST1){
						numberOfTurret1++;
					}
					if (player.gold >= 40){
						if (x >= 500){
							x = 500;
						}
						else if (x <= 10){
							x = 10;
						}
						if (y >= 740){
							y = 740;
						}
						else if (y <= 10){
							y = 10;
						}
						player.createSuperTurret1(x,y);
					}
				}
				else if (player.id == 2){
					var numberOfTurret2 = 0;
					for (var i in SUPER_TURRET_LIST2){
						numberOfTurret2++;
					}
					if (player.gold >= 40){
						if (x <= 500){
							x = 500;
						}
						else if (x >= 990){
							x = 990;
						}
						if (y >= 740){
							y = 740;
						}
						else if (y <= 10){
							y = 10;
						}
						player.createSuperTurret2(x,y);
					}
				}
			}
		});
	
		socket.on('deleteTurret', function(){
			if(allowPlay) {
				if (player.id == 1){
					player.deleteTurret1();
				}
				else if (player.id == 2){
					player.deleteTurret2();
				}
			}
							
		});
});

var countDown = 25*10;	//FPS * 10 seconds

setInterval(function() {
	var packMinions = [];
	var packSuperMinions = [];
	var packSoldiers = [];
	var packTurrets = [];
	var packSuperTurrets = [];
	var packBullets = [];
	var packSuperBullets = [];
	var packHealth = [];
	var packGold = [];

	if (numberOfPlayers < 2){
		for (var i in SOCKET_LIST){
			var socket = SOCKET_LIST[i];
			socket.emit('waiting on player');
			allowPlay = false;
		}
	}

	else {
		//Does countdown
		if(countDown >= 0) {
			for(var i in SOCKET_LIST){
				var socket = SOCKET_LIST[i];
				socket.emit('countdown', Math.ceil(countDown/25));
			}
			
			countDown--;
		}
		else {
			allowPlay = true;
		}
		
		if (gameOver == 0){
		for (var i in PLAYER_LIST) {
			var player = PLAYER_LIST[i];
			player.updates();
			//console.log(player.getHealth());
			if (player.getHealth() <= 0){
				//console.log("Player " + i + " is out of lives");
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
				PLAYER_LIST[2].updateHealthMinion();
				//console.log("Player 1's health is: " + PLAYER_LIST[1]["self"]["health"]);
				delete MINION_LIST1[i];
				continue;
			}
			if (minion.health <= 0){
				delete MINION_LIST1[i];
				PLAYER_LIST[2].gold += 7;
				//console.log("minion destroyed");
			}
			minion.updatePosition();
			packMinions.push({x : minion.x, y: minion.y, id : minion.id, image : minion.image});
		}
		
		for (var i in MINION_LIST2) {
			var minion = MINION_LIST2[i];
			if (minion.x <= 0 || minion.y >= 740){
				PLAYER_LIST[1].updateHealthMinion();
				delete MINION_LIST2[i];
				continue;
			}
			if (minion.health <= 0){
				delete MINION_LIST2[i];
				PLAYER_LIST[1].gold += 7;
				//console.log("minion destroyed");
			}
			minion.updatePosition();
			packMinions.push({x : minion.x, y: minion.y, id : minion.id, image : minion.image});
		}
		
		for (var i in SOLDIER_LIST1) {
			var soldier = SOLDIER_LIST1[i];
			
			if (soldier.x >= 1000 || soldier.y >= 750){
				PLAYER_LIST[2].updateHealthSoldier();
				//console.log("Player 1's health is: " + PLAYER_LIST[1]["self"]["health"]);
				delete SOLDIER_LIST1[i];
				continue;
			}
			else {
				soldier.checkTurretDistance();
			}
			if (soldier.health <= 0){
				delete SOLDIER_LIST1[i];
				PLAYER_LIST[2].gold += 50;
				//console.log("minion destroyed");
			}
			soldier.updatePosition();
			packSoldiers.push({x : soldier.x, y: soldier.y, id : soldier.id, name : soldier.name});
		}
		
		for (var i in SOLDIER_LIST2) {
			var soldier = SOLDIER_LIST2[i];
			if (soldier.x <= 0 || soldier.y >= 740){
				PLAYER_LIST[1].updateHealthSoldier();
				delete SOLDIER_LIST2[i];
				continue;
			}
			else {
				soldier.checkTurretDistance();
			}
			if (soldier.health <= 0){
				delete SOLDIER_LIST2[i];
				PLAYER_LIST[1].gold += 50;
				//console.log("minion destroyed");
			}
			soldier.updatePosition();
			packSoldiers.push({x : soldier.x, y: soldier.y, id : soldier.id, name : soldier.name});
		}
	
		for (var i in SUPER_MINION_LIST1) {
			var minion = SUPER_MINION_LIST1[i];
			if (minion.x >= 1000 || minion.y >= 750){
				PLAYER_LIST[2].updateHealthSuperMinion();
				//console.log("Player 1's health is: " + PLAYER_LIST[1]["self"]["health"]);
				delete SUPER_MINION_LIST1[i];
				continue;
			}
			if (minion.health <= 0){
				delete SUPER_MINION_LIST1[i];
				PLAYER_LIST[2].gold += 75;
				//console.log("super minion destroyed");
			}
			minion.updatePosition();
			packSuperMinions.push({x : minion.x, y: minion.y, id : minion.id, image : minion.image});
		}
		
		for (var i in SUPER_MINION_LIST2) {
			var minion = SUPER_MINION_LIST2[i];
			if (minion.x <= 0 || minion.y >= 740){
				PLAYER_LIST[1].updateHealthSuperMinion();
				delete SUPER_MINION_LIST2[i];
				continue;
			}
			if (minion.health <= 0){
				delete SUPER_MINION_LIST2[i];
				PLAYER_LIST[2].gold += 75;
				console.log("super minion destroyed");
			}
			minion.updatePosition();
			packSuperMinions.push({x : minion.x, y: minion.y, id : minion.id, image : minion.image});
		}
		
		for (var i in TURRET_LIST1) {
			var turret = TURRET_LIST1[i];
			if (turret.health <= 0){
				delete TURRET_LIST1[i];
				PLAYER_LIST[2].gold += 50;
			}
			turret.checkMinionDistance();
			packTurrets.push({x : turret.x, y: turret.y, id : turret.id, image : turret.image});
		}
		
		for (var i in TURRET_LIST2) {
			var turret = TURRET_LIST2[i];
			if (turret.health <= 0){
				delete TURRET_LIST2[i];
				PLAYER_LIST[2].gold += 50;
			}
			turret.checkMinionDistance();
			packTurrets.push({x : turret.x, y: turret.y, id : turret.id, image : turret.image});
		}
		
		for (var i in SUPER_TURRET_LIST1) {
			var turret = SUPER_TURRET_LIST1[i];
			if (turret.health <= 0){
				delete SUPER_TURRET_LIST1[i];
				PLAYER_LIST[2].gold += 50;
			}
			turret.checkMinionDistance();
			packSuperTurrets.push({x : turret.x, y: turret.y, id : turret.id, image : turret.image});
		}
		
		for (var i in SUPER_TURRET_LIST2) {
			var turret = SUPER_TURRET_LIST2[i];
			if (turret.health <= 0){
				delete SUPER_TURRET_LIST2[i];
				PLAYER_LIST[2].gold += 50;
			}
			turret.checkMinionDistance();
			packSuperTurrets.push({x : turret.x, y: turret.y, id : turret.id, image : turret.image});
		}
		
		for (var i in BULLET_LIST) {
			var bullet = BULLET_LIST[i];
			if (bullet.x >= 990 || bullet.y >= 740){
				delete BULLET_LIST[i];
				
				continue;
			}
			bullet.updatePosition();
			if (bullet.checkCollision() == true){
				//console.log("collision detected");
				delete BULLET_LIST[i];
				
			}
			packBullets.push({x : bullet.currentX, y : bullet.currentY, id : bullet.id, image : bullet.image});
		}
		
		for (var i in SUPER_BULLET_LIST) {
			var bullet = SUPER_BULLET_LIST[i];
			if (bullet.x >= 990 || bullet.y >= 740){
				delete SUPER_BULLET_LIST[i];
				continue;
			}
			bullet.updatePosition();
			if (bullet.checkCollision() == true){
				//console.log("collision detected");
				delete SUPER_BULLET_LIST[i];
			}
			packSuperBullets.push({x : bullet.currentX, y : bullet.currentY, id : bullet.id, image : bullet.image});
		}
		
		for (var i in SOCKET_LIST) {
			var socket = SOCKET_LIST[i];
			var gold = PLAYER_LIST[i].gold;
			if (typeof PLAYER_LIST[1] == "undefined" && typeof PLAYER_LIST[2] == "undefined"){
				socket.emit('newPosition', packMinions, packSuperMinions, packSoldiers, packTurrets, packSuperTurrets, packBullets, packSuperBullets, socket.id, 100, 100);
			}
			else if (typeof PLAYER_LIST[2] == "undefined" && typeof PLAYER_LIST[1] != "undefined"){
				socket.emit('newPosition', packMinions, packSuperMinions, packSoldiers, packTurrets, packSuperTurrets, packBullets, packSuperBullets, socket.id, PLAYER_LIST[1].health, 100, gold);
			}
			else if (typeof PLAYER_LIST[1] == "undefined" && typeof PLAYER_LIST[2] != "undefined"){
				socket.emit('newPosition', packMinions, packSuperMinions, packSoldiers, packTurrets, packSuperTurrets, packBullets, packSuperBullets, socket.id, 100, PLAYER_LIST[2].health, gold);
			}
			else {
				socket.emit('newPosition', packMinions, packSuperMinions, packSoldiers, packTurrets, packSuperTurrets, packBullets, packSuperBullets, socket.id, PLAYER_LIST[1].health, PLAYER_LIST[2].health, gold);
			}
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

	}
	
		
}, 1000/25);
