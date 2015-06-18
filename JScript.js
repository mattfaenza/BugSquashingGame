var seconds = 60;
var countD;
var foodBits = new Array();
var swarm = new Array();
var foodSpawnCount = 0;
var failedSpawn = 0;
var bugSpawner;
var MyReq;
var score = 0;
var hscore = localStorage.hscore;
var restart = sessionStorage.restart;
var level = 0;
window.onload = startClick;


//called when page loads; sets up the handler
function startClick(){
	document.getElementById("startButton").onclick = changeScreens;
	document.getElementById("pauseButton").onclick = pause;
	document.getElementById("resumeButton").onclick = resume;
	document.getElementById("highScore").innerHTML ="Highscore: " + localStorage.hscore;
	checkRestart();
}

//function to change the screen from start to game screen
function changeScreens(){
	document.getElementById('startScreen').style.display='none';
	document.getElementById('infoBar').style.display='block';
	document.getElementById('gameScreen').style.display='block';
	
	if(hscore == null){
		localStorage.hscore = score;
	}
	
	//used to get the value of the radio buttons
	var radios = document.getElementsByName('levels');
	if (radios[0].checked) {
		level = radios[0].value + 1;
	}else{
		level = radios[1].value + 1;
	}
	
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
	if(seconds == 0 || foodBits.length == 0){
		clearTimeout(countD);
		clearTimeout(bugSpawner);
		cancelAnimationFrame(MyReq);
		if (score > localStorage.hscore) {
                localStorage.hscore = score;
				document.getElementById("highScore").innerHTML ="Highscore:" + localStorage.hscore;
		}
		if(confirm("\t\tGame Over! \n \t Your Score was: "+score+"\nOK = Restart, Cancel = Quit") == true){
			sessionStorage.restart = 1;
			location.reload();		
		}else{
			sessionStorage.restart = 0;
			location.reload();
		}
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
	cancelAnimationFrame(MyReq);
}

//resumes the game
function resume(){
	countD = setTimeout("timerCount()", 1000);
	bugSpawner = setInterval(function(){spawnBug()}, 1000);
	document.getElementById('pauseButton').style.display='block';
	document.getElementById('resumeButton').style.display='none';
	MyReq = requestAnimationFrame(update);
}

//spawns a single food object
function spawnFood(){
	var foodNode = document.createElement("food");
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = "#FF0000";
	
	foodNode.index = foodBits.length;
	foodNode.x = Math.floor((Math.random()*(gameStage.width - 40)) + 10);
	foodNode.y = Math.floor((Math.random()*(gameStage.height - 40)) + 10);
	
	foodNode.left = foodNode.x - 25 ;
	foodNode.top = foodNode.y - 25;
	foodNode.right = foodNode.x + 25;
	foodNode.bottom = foodNode.y + 25;
    	
	ctx.beginPath();
	ctx.arc(foodNode.x, foodNode.y, 10, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	
	foodBits.push(foodNode);
	gameStage.appendChild(foodNode);
}

//spawns a single bug object
function spawnBug(){
	var bugNode = document.createElement("bug");
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	var bugProbability = Math.floor((Math.random()* 10 + 1));
	bugNode.x = Math.floor((Math.random()*(gameStage.width - 40)) + 15);
	bugNode.y = 0;
	if (bugProbability < 4) {
		var img = document.createElement('img');
		img.src = 'images/black.png';
		bugNode.type = 'black';
		bugNode.img = img;
		if(level == 1){
			bugNode.speed = 2.5;
		}else{
			bugNode.speed = 3.333;
		}
		bugNode.score = 5;
	}
	else if (bugProbability >= 4 && bugProbability <= 6) {
		var img = document.createElement('img');
		img.src = 'images/red.png';
		bugNode.type = 'red';
		bugNode.img = img;
		if(level == 1){
			bugNode.speed = 1.25;
		}else{
			bugNode.speed = 1.667;
		}
		bugNode.score = 3;
	}
	else {
		var img = document.createElement('img');
		img.src = 'images/orange.png';
		bugNode.type = 'orange';
		bugNode.img = img;
		if(level == 1){
			bugNode.speed = 1;
		}else{
			bugNode.speed = 1.333;
		}
		bugNode.score = 1;
	}
	bugNode.target = shortestDistance(bugNode.x, bugNode.y);
	bugNode.angle = Math.atan2(bugNode.target.y - bugNode.y, bugNode.target.x - bugNode.x) + (Math.PI / 2);	
	
	if(failedSpawn == 2){ //3 seconds have passed without spawn so force a spawn.
		ctx.save();
		ctx.translate(bugNode.x, bugNode.y);
		ctx.rotate(bugNode.angle);
		ctx.drawImage(img,-5,-20,10,40);
		//ctx.fillRect(-5, -20, 10, 40);
		ctx.restore();
		swarm.push(bugNode);
		gameStage.appendChild(bugNode);
		failedSpawn = 0;
	}else if(Math.floor(Math.random()*1.9) == 1){ //randomly choose whether to spawn or not
		ctx.save();
		ctx.translate(bugNode.x, bugNode.y);
		ctx.rotate(bugNode.angle);
		ctx.drawImage(img,-5,-20,10,40);
		//ctx.fillRect(-5, -20, 10, 40);
		ctx.restore();
		swarm.push(bugNode);
		gameStage.appendChild(bugNode);
		failedSpawn = 0;
	}else{ //failed spawn, increase the count by 1
		failedSpawn += 1; 
	}
}

function shortestDistance(x, y){
	var targ = 0;
	var findShort = 0;
	var hypo = 0;
	var bugx = x;
	var bugy = y;
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
	var ctx = gameStage.getContext("2d");
	var rect = gameStage.getBoundingClientRect();
	var clickx = Math.floor(event.clientX - rect.left);
    var clicky = Math.floor(event.clientY - rect.top);
	var cleft = clickx - 30;
	var ctop = clicky - 30;
	var cright = clickx + 30;
	var cbottom = clicky + 30;
	var angle;
	var deletedXPos;
	var deletedYPos;
	var color;
	
	for(i = 0; i <  swarm.length; i++){
		if(cleft < swarm[i].x
			&& cright > swarm[i].x 
			&& ctop < swarm[i].y 
			&& cbottom > swarm[i].y){
			//will later increase score depending on the bug;
			score += swarm[i].score;
			document.getElementById("Score").innerHTML = "Score: " + score;
			//angle = swarm[i].angle;
			//deletedXPos = swarm[i].x;
			//deletedYPos = swarm[i].y;
			//color = swarm[i].type;
			//remove from swarm array
			swarm.splice(i,1);
			//fade(deletedXPos, deletedYPos, angle, color, 1);
			
			
		}
	}
}

/*
//Out attempt at fading out a bug
function fade(x,y,angle, color, op) {
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.fillStyle = color;
	ctx.translate(x, y);
	ctx.rotate(angle);
	if (op <= 0.1){
            clearInterval(timer);
    }else{
		ctx.globalAlpha = op;
		ctx.fillRect(-5,-20,10,40);
		op -= 0.5;
	}
    
    var timer = setInterval(function () {fade(x,y,angle,color,op)}, 2000);
}
*/

function update(){
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.clearRect(0,0,400,500);
	for(var b = 0; b < swarm.length; b++){
		if (swarm[b].x < swarm[b].target.right 
			&& swarm[b].x > swarm[b].target.left
			&& swarm[b].y < swarm[b].target.bottom
			&& swarm[b].y > swarm[b].target.top){
			var i = swarm[b].target.index;
			foodBits.splice(i, 1);
			for(var a = 0; a < foodBits.length; a++) {
				foodBits[a].index = a;
			}	
		}
		ctx.save();
		//swarm[b].y += 1;
		swarm[b].target = shortestDistance(swarm[b].x, swarm[b].y);
		swarm[b].angle = Math.atan2(swarm[b].target.y - swarm[b].y, swarm[b].target.x - swarm[b].x) + (Math.PI / 2);
		ctx.translate(swarm[b].x, swarm[b].y);
		ctx.rotate(swarm[b].angle);
		var newX; 
		var newY;
		if(swarm[b].x < swarm[b].target.x){
			newX = swarm[b].speed;
		}else if(swarm[b].x == swarm[b].target.x){
			newX = 0;
		}else{
			newX = -swarm[b].speed;
		}
		if(swarm[b].y < swarm[b].target.y){
			newY = swarm[b].speed;
		}else if(swarm[b].y == swarm[b].target.y){
			newY = 0;
		}else{
			newY = -swarm[b].speed;
		}
		swarm[b].x += newX;
		swarm[b].y += newY;
		ctx.drawImage(swarm[b].img,-5,-20,10,40);
		//ctx.fillRect(-5, -20, 10, 40);
		ctx.restore();
			
	}
	ctx.fillStyle = "RED";
	for(var a = 0; a < foodBits.length; a++){
		ctx.beginPath();
		ctx.arc(foodBits[a].x, foodBits[a].y,10,0,2*Math.PI); 
		ctx.closePath();
		ctx.fill();
	}		
	setTimeout(function(){
		MyReq = requestAnimationFrame(update);
	},1000/60);
}

function checkRestart() {
  if(sessionStorage.restart == 1){
	document.getElementById("startButton").click();
  }
}
