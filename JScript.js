var seconds = 60;
var countD;
var foodBits = new Array();
var swarm = new Array();
window.onload = startClick;
var foodSpawnCount = 0;
var failedSpawn = 0;
var bugSpawner;
var updater;
var blackBug = new Image();
blackBug.src = 'images/black.png';

//called when page loads; sets up the handler
function startClick(){
	document.getElementById("startButton").onclick = changeScreens;
	document.getElementById("pauseButton").onclick = pause;
	document.getElementById("resumeButton").onclick = resume;
}

//function to change the screen from start to game screen
function changeScreens(){
	document.getElementById('startScreen').style.display='none';
	document.getElementById('infoBar').style.display='block';
	document.getElementById('gameScreen').style.display='block';
	do{
	spawnFood();
	foodSpawnCount++;
	}while(foodSpawnCount != 5)
	bugSpawner = setInterval(function(){spawnBug()}, 1000);
	timerCount();
	update();
	document.getElementById("gameScreen").onclick = attack;
}

//starts the timer and recursively counts down
function timerCount(){
	document.getElementById("countDown").innerHTML = "Time Left:" + seconds;
	if(seconds == 0){
		alert("Game Over!");
	}else{
		seconds--;
		countD = setTimeout("timerCount()", 1000);
	}
}

//pauses the game
function pause(){
	clearTimeout(countD);
	clearTimeout(bugSpawner);
	//gonna change the pause button to a play button
	document.getElementById('pauseButton').style.display='none';
	document.getElementById('resumeButton').style.display='block';
}

//resumes the game
function resume(){
	countD = setTimeout("timerCount()", 1000);
	bugSpawner = setInterval(function(){spawnBug()}, 1000);
	document.getElementById('pauseButton').style.display='block';
	document.getElementById('resumeButton').style.display='none';
}

//a food node
function foodNode(xPos, yPos) {
	//food node is pushed after creation, giving it the tail index
	this.index = foodBits.length;
	this.xPos = xPos;
	this.yPos = yPos;
}

//a bug node - needs a check for level 1 or 2, level 1 for now
function Bug(xPos, yPos, bugProbability) {
	this.xPos = xPos;
	this.yPos = yPos;
	if (bugProbability < 4) {
		this.type = 'black';
		this.img = blackBug.src;
		this.speed = 150;
	}
	else if (bugProbability >= 4 && bugProbability <= 6) {
		this.type = 'red';
		this.img = blackBug.src;
		this.speed = 75;
	}
	else {
		this.type = 'orange';
		this.img = blackBug.src;
		this.speed = 60;
	}
	this.target = shortestDistance(this.xPos, this.yPos);
}


//spawns a single food object
function spawnFood(){
	var gameStage = document.getElementById("gameScreen");
	var xRandom = (Math.random()*(gameStage.width - 40)) + 10;
	var yRandom = (Math.random()*(gameStage.height - 40)) + 10;
	var foodBit = new foodNode(xRandom, yRandom);
	
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "#FF0000";
	
	foodNode.left = foodNode.xPos - 20 ;
	foodNode.top = foodNode.yPos - 20;
	foodNode.right = foodNode.xPos + 20;
	foodNode.bottom = foodNode.yPos + 20;
    	
	ctx.beginPath();
	ctx.arc(foodBit.xPos, foodBit.yPos, 10, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	
	foodBits.push(foodBit);
}

//spawns a single bug object
function spawnBug(){

	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "Blue";
	
	//this portion of code will take care of random spawn
	//failed spawns are kept in count and will always spawn a bug
	//between 1 and 3 seconds.
	if(failedSpawn == 2){ //3 seconds have passed without spawn so force a spawn.
		xRandom = (Math.random()*(gameStage.width - 40)) + 15;
		bugProbability = Math.floor((Math.random()* 10 + 1))
		var bugNode = new Bug(xRandom, 0, bugProbability)
		//stand in for bug graphic
		ctx.save();
		ctx.translate(bugNode.xPos, bugNode.yPos);
		ctx.rotate(Math.atan2(bugNode.target.yPos, bugNode.target.xPos));
		//ctx.drawImage(bugNode.img, bugNode.xPos, bugNode.yPos);
		ctx.fillRect(0, 0, 10, 40);
		ctx.restore();
		swarm.push(bugNode);

		failedSpawn = 0;
		//updateBug call?
	}else if(Math.floor(Math.random()*1.9) == 1){ //randomly choose whether to spawn or not
		xRandom = (Math.random()*(gameStage.width - 40)) + 15;
		bugProbability = Math.floor((Math.random()* 10 + 1))
		var bugNode = new Bug(xRandom, 0, bugProbability)
		//stand in for bug graphic
		ctx.save();
		ctx.translate(bugNode.xPos, bugNode.yPos);
		ctx.rotate(Math.atan2(bugNode.target.yPos, bugNode.target.xPos));
		//ctx.drawImage(bugNode.img, bugNode.xPos, bugNode.yPos, 239, 239);
		ctx.fillRect(0, 0, 10, 40);
		ctx.restore();	
		swarm.push(bugNode);

		failedSpawn = 0;
	}else{ //failed spawn, increase the count by 1
		failedSpawn += 1; 
	}
}

function attack(event){
	var gameStage = document.getElementById("gameScreen");
	var rect = gameStage.getBoundingClientRect();
	var clickx = event.clientX - rect.left;
    var clicky = event.clientY - rect.top;
		
	for(i = 0; i < foodBits.length; i++){
		if(clickx < foodBits[i].right && clickx > foodBits[i].left && clicky > foodBits[i].top && clicky < foodBits[i].bottom){
			alert("clicked" + (i+1));
		}

	}
	
}

function update(){
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.clearRect(0,0,400,500);
	ctx.fillStyle = "RED";
	
	for(var a = 0; a < foodBits.length; a++){

		ctx.beginPath();
		ctx.arc(foodBits[a].xPos, foodBits[a].yPos,10,0,2*Math.PI); 
		ctx.closePath();
		ctx.fill();
	}
	
	for(var b = 0; b < swarm.length; b++){
		//if (currentBug.xPos == currentBug.target.xPos && currentBug.yPos == currentBug.target.yPos) {
			//remove bug and food from respective arrays
			//swarm = swarm.splice(b,1);
			//foodBits = foodBits.splice(currentBug.target.index, 1);
			//} else { 
				ctx.fillStyle = "Blue";
				ctx.save();
				
				ctx.translate(swarm[b].xPos, swarm[b].yPos);
				if(swarm[b].xPos > swarm[b].target.xPos){
					ctx.rotate(Math.atan2(swarm[b].target.yPos, swarm[b].target.xPos));
				}else{
					ctx.rotate(-Math.atan2(swarm[b].target.yPos, swarm[b].target.xPos));
				}
				//ctx.drawImage(bugNode.img, bugNode.xPos, bugNode.yPos);
				ctx.fillRect(0, 0, 10, 40);
				ctx.restore();
			//}
	}	
	
	requestAnimationFrame(update);
}

//This function will get the nearest food node to the bug
/*
function getClosestFood(xBugPos, yBugPos) {
	var currentClosest;
	var newDistance = 0;
	//calculate first disance using distance forumla
	var currentDistance = 0;
	currentDistance = Math.sqrt(Math.pow((foodBits[0].xPos - xBugPos),2) + Math.pow((foodBits[0].yPos - yBugPos),2));
	for (var i = 1; i < foodBits.length; i++) {
		//calculate next disance using distance forumla
		newDistance = Math.sqrt(Math.pow((currentClosest.xPos - xBugPos),2) + Math.pow((currentClosest.yPos - yBugPos),2));
		if (newDistance < currentDistance) {
			currentClosest = foodBits[i];
			currentDistance = newDistance;
		}
	}
	return currentClosest;
}
*/
function shortestDistance(xPos, yPos){
	var targ = 0;
	var findShort = 0;
	var hypo = 0;
	var bugx = xPos;
	var bugy = yPos;
	for(i = 0; i < foodBits.length; i++){
		hypo = Math.sqrt(Math.pow(bugx - foodBits[i].xPos,2) + Math.pow(bugy - foodBits[i].yPos,2));
		if(findShort == 0 || findShort > hypo){
			findShort = hypo;
			targ = foodBits[i];
		}
	}
	return targ;
}








