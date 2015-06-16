var seconds = 60;
var countD;
var foodBits = [];
var swarm = [];
window.onload = startClick;
var foodSpawnCount = 0;
var failedSpawn = 0;
var bugSpawner;
var updater;
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

//spawns a single food object
function spawnFood(){
	var foodNode = document.createElement("canvas");
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "#FF0000";
	
	foodNode.id = "food"+foodBits.length;
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
	var bugNode = document.createElement("canvas");
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "Blue";
	bugNode.id = "bug"+swarm.length;
	bugNode.x = (Math.random()*(gameStage.width - 40)) + 15;
	bugNode.y = 0;
	bugNode.angle = 0;
	bugNode.target = shortestDistance(bugNode.x, bugNode.y);
	if(failedSpawn == 2){ //3 seconds have passed without spawn so force a spawn.
		ctx.fillRect(bugNode.x, 0, 10, 40);	
		swarm.push(bugNode);
		gameStage.appendChild(bugNode);
		failedSpawn = 0;
	}else if(Math.floor(Math.random()*1.9) == 1){ //randomly choose whether to spawn or not
		ctx.fillRect(bugNode.x, 0, 10, 40);	
		swarm.push(bugNode);
		gameStage.appendChild(bugNode);
		failedSpawn = 0;
	}else{ //failed spawn, increase the count by 1
		failedSpawn += 1; 
	}
}

function shortestDistance(xPos, yPos){
	var targ = 0;
	var findShort = 0;
	var hypo = 0;
	var bugx = xPos;
	var bugy = yPos;
	for(i = 0; i < foodBits.length; i++){
		hypo = Math.sqrt(Math.pow(bugx - foodBits[i].x,2) + Math.pow(bugy - foodBits[i].y,2));
		if(findShort == 0 || findShort > hypo){
			findShort = hypo;
			targ = foodBits[i];
		}
	}
	return targ;
}

function attack(event){
	var gameStage = document.getElementById("gameScreen");
	var rect = gameStage.getBoundingClientRect();
	var clickx = event.clientX - rect.left;
    var clicky = event.clientY - rect.top;
		
	for(i = 0; i < foodBits.length; i++){
		if(clickx < foodBits[i].right && clickx > foodBits[i].left && clicky > foodBits[i].top && clicky < foodBits[i].bottom){
			alert("clicked" + (i));
		}
	}
}

function update(){
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	var angle = 0;
	ctx.clearRect(0,0,400,500);
	ctx.fillStyle = "RED";
	
	for(var a = 0; a < foodBits.length; a++){
		ctx.beginPath();
		ctx.arc(foodBits[a].x, foodBits[a].y,10,0,2*Math.PI); 
		ctx.fill();
	}

	/*setTimeout(function() {
        requestAnimationFrame(update);
        for(var b = 0; b < swarm.length; b++){
			ctx.fillStyle = "Blue";
			swarm[b].x += 1;
			swarm[b].y += 1;
			ctx.fillRect(swarm[b].x, swarm[b].y, 10, 40);
		}
    }, 1000 / 60);*/

	for(var b = 0; b < swarm.length; b++){	
		//var bugCanvas = document.getElementById("bug"+b);
		//var bctx = bugContext.getContext("2d");
		swarm[b].angle = Math.atan2(swarm[b].target.y, swarm[b].target.x);	
		//bctx.rotate(swarm[b].angle + (Math.PI/2));
		ctx.fillStyle = "Blue";
		swarm[b].x += 1;
		swarm[b].y += 1;
		ctx.fillRect(swarm[b].x, swarm[b].y, 10, 40);
	}
	requestAnimationFrame(update);
}







