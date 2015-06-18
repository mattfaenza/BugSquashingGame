var seconds = 60;
var countD;
var foodBits = new Array();
var swarm = new Array();
window.onload = startClick;
var foodSpawnCount = 0;
var failedSpawn = 0;
var bugSpawner;
var MyReq;
var blackBug = new Image(10,40);
blackBug.src = 'images/black.png';
var score = 0;
var hscore = localStorage.hscore;
window.onload = startClick;

//called when page loads; sets up the handler
function startClick(){
	document.getElementById("startButton").onclick = changeScreens;
	document.getElementById("pauseButton").onclick = pause;
	document.getElementById("resumeButton").onclick = resume;
	document.getElementById("highScore").innerHTML ="Highscore: " + localStorage.hscore;
}

//function to change the screen from start to game screen
function changeScreens(){
	document.getElementById('startScreen').style.display='none';
	document.getElementById('infoBar').style.display='block';
	document.getElementById('gameScreen').style.display='block';
	
	if(hscore == null){
		localStorage.hscore = score;
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
		if(confirm("\t\tGame Over! \n OK = Restart, Cancel = Quit") == true){
			location.reload();	
		}else{
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
	
	foodNode.left = foodNode.x - 10 ;
	foodNode.top = foodNode.y - 10;
	foodNode.right = foodNode.x + 10;
	foodNode.bottom = foodNode.y + 10;
    	
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
		bugNode.type = 'black';
		bugNode.img = blackBug.src;
		bugNode.speed = 1.5;
	}
	else if (bugProbability >= 4 && bugProbability <= 6) {
		bugNode.type = 'red';
		bugNode.img = blackBug.src;
		bugNode.speed = 0.75;
	}
	else {
		bugNode.type = 'orange';
		bugNode.img = blackBug.src;
		bugNode.speed = 0.6;
	}
	bugNode.target = shortestDistance(bugNode.x, bugNode.y);
	bugNode.angle = Math.atan2(bugNode.target.y - bugNode.y, bugNode.target.x - bugNode.x) + (Math.PI / 2);	
	
	if(bugNode.type == 'black'){
		ctx.fillStyle = "Black";
	}else if(bugNode.type == 'red'){
		ctx.fillStyle = "Red";
	}else{
		ctx.fillStyle = "Orange";
	}
	
	if(failedSpawn == 2){ //3 seconds have passed without spawn so force a spawn.
		ctx.save();
		ctx.translate(bugNode.x, bugNode.y);
		ctx.rotate(bugNode.angle);
		/*blackBug.onload = function () {
			ctx.drawImage(bugNode.img, 0,0,60,60);
		}*/
		ctx.fillRect(-5, -20, 10, 40);
		ctx.restore();
		swarm.push(bugNode);
		gameStage.appendChild(bugNode);
		failedSpawn = 0;
	}else if(Math.floor(Math.random()*1.9) == 1){ //randomly choose whether to spawn or not
		ctx.save();
		ctx.translate(bugNode.x, bugNode.y);
		ctx.rotate(bugNode.angle);
		/*blackBug.onload = function () {
			ctx.drawImage(bugNode.img, 0,0,60,60);
		}*/
		ctx.fillRect(-5, -20, 10, 40);
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
	var rect = gameStage.getBoundingClientRect();
	var clickx = Math.floor(event.clientX - rect.left);
    var clicky = Math.floor(event.clientY - rect.top);
	var cleft = clickx - 30;
	var ctop = clicky - 30;
	var cright = clickx + 30;
	var cbottom = clicky + 30;
		
	for(i = 0; i <  swarm.length; i++){
		if(cleft < swarm[i].x
			&& cright > swarm[i].x 
			&& ctop < swarm[i].y 
			&& cbottom > swarm[i].y){
			//will later increase score depending on the bug;
			if(swarm[i].type == 'black'){
				score += 3;
			}else if(swarm[i].type == 'red'){
				score += 2;
			}else{
				score += 1;
			}
			document.getElementById("Score").innerHTML = "Score: " + score;
			//remove from swarm array
			swarm.splice(i,1);
			
		}
	}
}


function update(){
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.clearRect(0,0,400,500);
	for(var b = 0; b < swarm.length; b++){
		if(swarm[b].type == 'black'){
			ctx.fillStyle = "Black";
		}else if(swarm[b].type == 'red'){
			ctx.fillStyle = "Red";
		}else{
			ctx.fillStyle = "Orange";
		}
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
		/*blackBug.onload = function () {
			ctx.drawImage(swarm[b].img, 0,0,60,60);
		}*/
		ctx.fillRect(-5, -20, 10, 40);
		ctx.restore();
			
	}
	ctx.fillStyle = "RED";
	for(var a = 0; a < foodBits.length; a++){
		ctx.beginPath();
		ctx.arc(foodBits[a].x, foodBits[a].y,10,0,2*Math.PI); 
		ctx.closePath();
		ctx.fill();
	}		
	MyReq = requestAnimationFrame(update);
}







