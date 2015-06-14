var seconds = 60;
var countD;
var foodBits = [];
var swarm = [];
window.onload = startClick;
var foodSpawnCount = 0;
var failedSpawn = 0;
var bugSpawner;

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

//spawns a single food object
function spawnFood(){
	var foodNode = document.createElement("food");
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "#FF0000";
	
	foodNode.x = (Math.random()*(gameStage.width - 40)) + 10;
	foodNode.y = (Math.random()*(gameStage.height - 40)) + 10;
	foodNode.left = foodNode.x - 20 ;
	foodNode.top = foodNode.y - 20;
	foodNode.right = foodNode.x + 20;
	foodNode.bottom = foodNode.y + 20;
    	
	ctx.beginPath();
	ctx.arc(foodNode.x, foodNode.y, 10, 0, 2 * Math.PI);
	ctx.fill();
	
	foodBits.push(foodNode);
	gameStage.appendChild(foodNode);
}

//spawns a single bug object
function spawnBug(){
	var bugNode = document.createElement("bug");
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









