var seconds = 60;
var countD;
var foodBits = [];
var swarm = [];
window.onload = startClick;
var foodSpawnCount = 0;
var failedSpawn = 0;
var bugSpawner;
var bugNum = 0;

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

//spawns a single food object
function spawnFood(){
	var foodNode = document.createElement("food");
	xRandom = (Math.random()*(gameStage.width - 40)) + 10;
	yRandom = (Math.random()*(gameStage.height - 40)) + 10;
	//var foodNode(xRandom, yRandom);
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "#FF0000";
	ctx.beginPath();
	ctx.arc(foodNode.x, foodNode.y, 10, 0, 2 * Math.PI);
	ctx.fill();
	
	foodBits.push(foodNode);
	gameStage.appendChild(foodNode);
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
		this.speed = 150;
	}
	else if bugProbability >= 4 && <= 6) {
		this.type = 'red';
		this.speed = 75;
	}
	else {
		this.type = 'orange';
		this.speed = 60;
	}
	this.target = getClosestFood(xPos, yPos);
}

//spawns a single bug object
function spawnBug(){
	//var bugNode = document.createElement("bug" + bugNum);
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "Blue";
	
	//this portion of code will take care of random spawn
	//failed spawns are kept in count and will always spawn a bug
	//between 1 and 3 seconds.
	if(failedSpawn == 2){ //3 seconds have passed without spawn so force a spawn.
		xRandom = (Math.random()*(gameStage.width - 40)) + 15;
		bugProbabilitiy = Math.floor((Math.random()* 10 + 1))
		var bugNode = new Bug(xRandom, 0, bugProbability)
		//stand in for bug graphic
		//ctx.fillRect(bugNode.xPos, 0, 10, 40);	
		swarm.push(bugNode);
		//gameStage.appendChild(bugNode);
		failedSpawn = 0;
		updateGame();
		//window.requestAnimationFrame(update_bug(aBug));
	}else if(Math.floor(Math.random()*1.9) == 1){ //randomly choose whether to spawn or not
		xRandom = (Math.random()*(gameStage.width - 40)) + 15;
		bugProbabilitiy = Math.floor((Math.random()* 10 + 1))
		var bugNode = new Bug(xRandom, 0, bugProbability)
		//stand in for bug graphic
		//ctx.fillRect(bugNode.xPos, 0, 10, 40);
		swarm.push(bugNode);
		gameStage.appendChild(bugNode);
		failedSpawn = 0;
		updateGame();
	}else{ //failed spawn, increase the count by 1
		failedSpawn += 1;
		updateGame();
	}
}

Bug.prototype.update = function () {
//this function needs to redraw the bug at its new location each frame
	ctx.fillRect(bugNode.xPos, 0, 10, 40);
}

//This function will animate the bug after it spawns
//It assumes bugs are objects with a target attribute
function updateGame(){
	//clear the previous canvas for a new frame drawing
	ctx.clearRect(0, 0, 400, 500);
	//begin an update for each bug (and food bit if needed)
	for (var i = 0; i < swarm.length; i++) {
		var currentBug = swawm[i];
		if (currentBug.xPos = currentBug.target.xPos && currentBug.yPos = 	currentBug.target.yPos) {
			//remove bug and food from respective arrays
			swarm = swarm.splice(i,1);
			foodBits = foodBits.splice(currentBug.target.index, 1);
			//need to remove from the screen
			}
		else {
			currentBug.update();
			}
		}
	window.requestAnimationFrame(updateGame);
	
}

//This function will get the nearest food node to the bug
function getClosestFood(xBugPos, yBugPos) {
	var currentClosest = foodBits[0];
	var newDistance = 0;
	//calculate first disance using distance forumla
	currentDistance = Math.sqrt(Math.pow(currentClosest.xPos - xBugPos) + Math.pow(currentClosest.yPos - yBugPos));
	for (var i = 1; i < foodBits.length; i++) {
		//calculate next disance using distance forumla
		newDistance = Math.sqrt(Math.pow(currentClosest.xPos - xBugPos) + Math.pow(currentClosest.yPos - yBugPos));
		if (newDistance < currentClosest.distance) {
			currentClosest = foodBits[i];
			currentDistance = newDistance;
		}
	}
	return currentClosest;
	
}








