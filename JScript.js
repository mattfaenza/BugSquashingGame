var seconds = 60;
var countD = null;

//function to change the screen from start to game screen
function changeScreens(){
	document.getElementById('startScreen').style.display='none';
	document.getElementById('infoBar').style.display='block';
	document.getElementById('gameScreen').style.display='block';
	timerCount();
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