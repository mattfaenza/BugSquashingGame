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
var updater;
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
	//check if highscore is undefined, make it 0 if so;
	if(hscore == undefined){
		localStorage.hscore = score;
	}
	//used to get the value of the radio buttons
	var radios = document.getElementsByName('levels');
	if (radios[0].checked) {
		level = radios[0].value + 1;
	}else{
		level = radios[1].value + 1;
	}
	//initialize the fruit and their drawings
	do{
	spawnFood();
	foodSpawnCount++;
	}while(foodSpawnCount != 5)
	//starts the bug spawn
	bugSpawner = setInterval(function(){spawnBug()}, 1000);
	//starts the count down
	timerCount();
	//starts the frame updates
	update();
	//when clicks happen, call the attack function
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
	clearTimeout(updater);
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
	updater = setTimeout(function(){
		MyReq = requestAnimationFrame(update);
	},1000/60);
	document.getElementById('pauseButton').style.display='block';
	document.getElementById('resumeButton').style.display='none';
}

//a food node, needs randomized x and y paramters
function foodNode(xPos, yPos) {
	//food node is pushed after creation, giving it the tail index
	this.index = foodBits.length;
	this.xPos = Math.floor(xPos);
	this.yPos = Math.floor(yPos);
	this.left = this.xPos - 25 ;
	this.top = this.yPos - 25;
	this.right = this.xPos + 25;
	this.bottom = this.yPos + 25;
	var img = document.createElement('img');
	img.src = 'images/donut.png';
	this.img = img;
}

//a bug node - needs randomized x and probability parameters
function Bug(xPos, yPos, bugProbability) {
	this.xPos = Math.floor(xPos);
	this.yPos = Math.floor(yPos);
	this.alive = 1;
	this.alpha = 1.0;
	if (bugProbability < 4) {
		var img = document.createElement('img');
		img.src = 'images/black.png';
		this.type = 'black';
		this.img = img;
		if(level == 1){
			this.speed = 2.5;
		}else{
			this.speed = 3.333;
		}
		this.score = 5;
	}
	else if (bugProbability >= 4 && bugProbability <= 6) {
		var img = document.createElement('img');
		img.src = 'images/red.png';
		this.type = 'red';
		this.img = img;
		if(level == 1){
			this.speed = 1.25;
		}else{
			this.speed = 1.667;
		}
		this.score = 3;
	}
	else {
		var img = document.createElement('img');
		img.src = 'images/orange.png';
		this.type = 'orange';
		this.img = img;
		if(level == 1){
			this.speed = 1;
		}else{
			this.speed = 1.3;
		}
		this.score = 1;
	}
	this.target = shortestDistance(this.xPos, this.yPos);
	this.angle = Math.atan2(this.target.yPos - this.yPos, this.target.xPos - this.xPos) + (Math.PI / 2);
}

//spawns a single food object
function spawnFood(){
	var gameStage = document.getElementById("gameScreen");
	var xRandom = (Math.random()*(gameStage.width - 40)) + 10;
	var yRandom = (Math.random()*(gameStage.height - 40)) + 10;
	var foodBit = new foodNode(xRandom, yRandom);
	
	var ctx = gameStage.getContext("2d");
	ctx.save();
	ctx.translate(foodBit.xPos, foodBit.yPos);
	ctx.drawImage(foodBit.img,-10,-10,20,20);
	ctx.restore();
	/*ctx.beginPath();
	ctx.arc(foodBit.xPos, foodBit.yPos, 10, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();*/
	
	
	foodBits.push(foodBit);
}

//spawns a single bug object
function spawnBug(){
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	//this portion of code will take care of random spawn
	//failed spawns are kept in count and will always spawn a bug
	//between 1 and 3 seconds.
	if(failedSpawn == 2){ //3 seconds have passed without spawn so force a spawn.
		xRandom = (Math.random()*(gameStage.width - 40)) + 15;
		bugProbability = Math.floor((Math.random()* 10 + 1));
		var bugNode = new Bug(xRandom, 0, bugProbability)
		ctx.save();
		ctx.translate(bugNode.xPos, bugNode.yPos);
		ctx.rotate(bugNode.angle);
		ctx.drawImage(bugNode.img,-5,-20,10,40);
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
		ctx.rotate(bugNode.angle);
		ctx.drawImage(bugNode.img,-5,-20,10,40);
		//ctx.fillRect(-5, -20, 10, 40);
		ctx.restore();	
		swarm.push(bugNode);
		failedSpawn = 0;
	}else{ //failed spawn, increase the count by 1
		failedSpawn += 1; 
	}
}

//create a hitbox to check if any bugs should be deleted
function attack(event){
	var gameStage = document.getElementById("gameScreen");
	var rect = gameStage.getBoundingClientRect();
	var clickx = Math.floor(event.clientX - rect.left);
    var clicky = Math.floor(event.clientY - rect.top);
	var cleft = clickx - 30;
	var ctop = clicky - 30;
	var cright = clickx + 30;
	var cbottom = clicky + 30;
	
	for(i = 0; i < swarm.length; i++){
		if(cleft < swarm[i].xPos
			&& cright > swarm[i].xPos 
			&& ctop < swarm[i].yPos 
			&& cbottom > swarm[i].yPos){
			//will later increase score depending on the bug;
			score += swarm[i].score;
			document.getElementById("Score").innerHTML = "Score: " + score;
			swarm[i].alive = 0;
		}
	}
}

function update(){
	var gameStage = document.getElementById("gameScreen");
	var ctx = gameStage.getContext("2d");
	ctx.clearRect(0,0,400,600);
	//loop to update bug nodes positions and react if they have been killed
	for(var b = 0; b < swarm.length; b++){
		if (swarm[b].alive == 1) {
			//Check if bug is within a food bit's hitbox
			if (swarm[b].xPos < swarm[b].target.right 
				&& swarm[b].xPos > swarm[b].target.left
				&& swarm[b].yPos < swarm[b].target.bottom
				&& swarm[b].yPos > swarm[b].target.top){
				var i = swarm[b].target.index;
				foodBits.splice(i, 1);
				for(var a = 0; a < foodBits.length; a++) {
					foodBits[a].index = a;
				}	
			}
			ctx.save();
			swarm[b].target = shortestDistance(swarm[b].xPos, swarm[b].yPos);
			swarm[b].angle = Math.atan2(swarm[b].target.yPos - swarm[b].yPos, swarm[b].target.xPos - swarm[b].xPos) * 180/Math.PI;
			ctx.translate(swarm[b].xPos, swarm[b].yPos);
			ctx.rotate((swarm[b].angle * Math.PI/180) + (Math.PI/2));
			var newX = swarm[b].speed * (90 - Math.abs(swarm[b].angle)) / 90;
			var newY;
			if (swarm[b].angle < 0){
				newY = -swarm[b].speed + Math.abs(newX);
			}else{
				newY = swarm[b].speed - Math.abs(newX);
			}
			swarm[b].xPos += newX;
			swarm[b].yPos += newY;
			ctx.drawImage(swarm[b].img,-5,-20,10,40);
			ctx.restore();
		} else {
			//fade out a little bit per frame
			swarm[b].alpha -= 0.0084;
			ctx.save();
			ctx.translate(swarm[b].xPos, swarm[b].yPos);
			ctx.rotate((swarm[b].angle * Math.PI/180) + (Math.PI/2));
			ctx.globalAlpha = swarm[b].alpha;
			ctx.drawImage(swarm[b].img,-5,-20,10,40);
			ctx.restore();
			//remove from swarm array
			if (swarm[b].alpha <= 0.01) {
				swarm.splice(b,1);
			}
		}
	}
	//loop for updating food bits in case they were eaten
	for(var a = 0; a < foodBits.length; a++){
		ctx.save();
		ctx.translate(foodBits[a].xPos, foodBits[a].yPos);
		ctx.drawImage(foodBits[a].img,-10,-10,20,20);
		ctx.restore();
	}		
	updater = setTimeout(function(){
		MyReq = requestAnimationFrame(update);
	},1000/60);
}

//This function will get the nearest food node to the bug
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

//This function will check if the endscreen restart button was clicked
function checkRestart() {
  if(sessionStorage.restart == 1){
	document.getElementById("startButton").click();
  }
}