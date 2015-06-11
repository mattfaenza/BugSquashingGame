var seconds = 60;
var countD;
var foodBits = [];
window.onload = startClick;
var foodSpawnCount = 0;


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
	timerCount();
}

//starts the timer and recursively counts down
function timerCount(){
	document.getElementById("countDown").innerHTML = "Time Left:" + seconds;
	if(seconds == 0){
		alert("Game Over!");
	}else{
		seconds--;
		countD = setTimeout("timerCount()", 100);
	}
}

//pauses the game
function pause(){
	clearTimeout(countD);
	//gonna change the pause button to a play button
	document.getElementById('pauseButton').style.display='none';
	document.getElementById('resumeButton').style.display='block';
}

//resumes the game
function resume(){
	countD = setTimeout("timerCount()", 100);
	document.getElementById('pauseButton').style.display='block';
	document.getElementById('resumeButton').style.display='none';
}

//spawns a single food object
function spawnFood(){
	var foodNode = document.createElement("p");
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

