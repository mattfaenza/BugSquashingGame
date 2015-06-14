var seconds = 60;
var countD;
var foodBits = [];
var swarm = [];
window.onload = startClick;
var foodSpawnCount = 0;
var failedSpawn = 0;
var bugSpawner;
var moveEvent;
var swarmIndex = 0;

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
	moveEvent = setInterval(function(){updateMovement()}, 1000);
	timerCount();
}

//starts the timer and recursively counts down
function timerCount(){
	document.getElementById("countDown").innerHTML = "Time Left:" + seconds;
	if(seconds == 0 || foodSpawnCount == 0){
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
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "#FF0000";
	
	foodNode.x = (Math.random()*(gameStage.width - 40)) + 10;
	foodNode.y = (Math.random()*(gameStage.height - 40)) + 10;
	ctx.beginPath();
	ctx.arc(foodNode.x, foodNode.y, 10, 0, 2 * Math.PI);
	ctx.fill();
	
	foodBits.push(foodNode);
	gameStage.appendChild(foodNode);
}

//spawns a single bug object
function spawnBug(){
	var bugNode = document.createElement("bug"+foodSpawnCount);
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "Blue";
	
	//this portion of code will take care of random spawn
	//failed spawns are kept in count and will always spawn a bug
	//between 1 and 3 seconds.
	if(failedSpawn == 2){ //3 seconds have passed without spawn so force a spawn.
		bugNode.x = (Math.random()*(gameStage.width - 40)) + 15;
		ctx.fillRect(bugNode.x, 0, 10, 40);	
		swarm.push(bugNode);
		gameStage.appendChild(bugNode);
		failedSpawn = 0;
	}else if(Math.floor(Math.random()*1.9) == 1){ //randomly choose whether to spawn or not
		bugNode.x = (Math.random()*(gameStage.width - 40)) + 15;
		ctx.fillRect(bugNode.x, 0, 10, 40);	
		swarm.push(bugNode);
		gameStage.appendChild(bugNode);
		failedSpawn = 0;
	}else{ //failed spawn, increase the count by 1
		failedSpawn += 1; 
	}
}

function updateMovement(){
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "Blue";
	var distx;
	var disty;
	var shortestDistance = 0;
	var shortestx = 0;
	var shortesty = 0;
	var testDistance = 0;
	
	ctx.clearRect(0,0,400,500);
	ctx.fillStyle = "#FF0000";
	do{
		for(i = 0; i < foodSpawnCount; i++){
			ctx.beginPath();
			ctx.arc(foodBits[i].x, foodBits[i].y, 10, 0, 2 * Math.PI);
			ctx.fill();
			distx = swarm[swarmIndex].x - foodBits[i].x
			disty = swarm[swarmIndex].y - foodBits[i].y
			testDistance = Math.sqrt(Math.pow(distx,2) + Math.pow(disty,2));
			if(shortestDistance > testDistance){ //pythagoreas to find shortest distance
				shortestDistance = testDistance;
				shortestx = distx;
				shortesty = disty;
			}
		}
		
		if(swarm[swarmIndex].y > swarm[swarmIndex].x){
			ctx.rotate((swarm[swarmIndex].x/shortestDistance) * Math.PI/180); 
		}else{
			ctx.rotate((swarm[swarmIndex].y/shortestDistance) * Math.PI/180);
		}
		
		swarm[swarmIndex].x += 1.8;
		swarm[swarmIndex].y += 1.8;
		
		ctx.fillRect(swarm[swarmIndex].x, swarm[swarmIndex].y, 10, 40);
		
		swarmIndex += 1; 
	}while(swarmIndex != swarm.length)
	swarmIndex = 0;
}










