var seconds = 60;
var countD = null;
var foodBits = new Array();
var gameStage = document.getElementById("gameScreen");
var ctx = gameStage.getContext("2d");

//function to change the screen from start to game screen
function changeScreens(){
	document.getElementById('startScreen').style.display='none';
	document.getElementById('infoBar').style.display='block';
	document.getElementById('gameScreen').style.display='block';
	timerCount();
	spawnFood();
}

//starts the timer and recursively countsdown
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
//tried making an object as food, doesnt allow the game to start when it is uncommented for some reason

function spawnFood(){
	var foodNode = createElement("newFood");
	foodNode.x = Math.random() * gameStage.width;
	foodNode.y = Math.random() * gameStage.height;
	
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(100, 100, 20, 20);
	
	foodBits.push(foodNode);
	gameStage.appendChild(foodNode);
}

