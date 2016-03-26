var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var mixer = audioCtx.createGain();
mixer.gain.value = 0.75;
mixer.connect(audioCtx.destination);

// var notes = [98, 123.47, 146.83, 196, 246.94, 293.66, 392, 493.88, 587.33];

var oscs = ['sine', 'triangle', 'square', 'sawtooth'];

init();



function init(){
	var game = new Game();
	game.populate();
	game.loop();

}


function Game(){

	this.cells = [];
	var self = this;

	this.populate = function(){

		var number = Math.floor(Math.random() * 25 + 5);

		for (var x = 0; x < number; x++){
			this.cells.push(new Cell());
		}
	}


	this.update = function(){
		var canvas = document.getElementById('environment')
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		

	
		for (var x = 0; x < self.cells.length; x++){

			
			self.cells[x].wallCollision();
			self.cells[x].draw();
		}
		
		self.collisionDetection();
	}

	this.collisionDetection = function(){
		
		for (var x = 0; x < self.cells.length; x++){
			for(var y = 0 ; y < self.cells.length; y++){
				if(self.cells[x] != self.cells[y]){
					var dx = self.cells[x].LocationX - self.cells[y].LocationX;
					var dy = self.cells[x].LocationY - self.cells[y].LocationY;

					var distance = Math.sqrt(dx * dx + dy * dy);
					if (distance < self.cells[x].cellSize + self.cells[y].cellSize) {
						self.cells[x].directionX *= -1
						self.cells[x].directionY *= -1
						// self.cells[x].sound()
						console.log('collision');
    
					}

				}
					
					
				
			}
		}
	}

	this.loop = function(){
		setInterval(this.update, 1000/60);
	}

}



function Cell(){


	this.cellSize = Math.floor((Math.random() * 15) + 5); 
	this.speed = Math.floor((Math.random() * 2) + 1); 
	this.directionX = Math.floor((Math.random() * 3) -1);
	this.directionY = Math.floor((Math.random() * 3) -1);
	this.priordirectionX;
	this.priordirectionY;
	this.priorLocationX;
	this.priorLocationY;
	this.LocationX = Math.floor((Math.random() * 700) + this.cellSize);
	this.LocationY = Math.floor((Math.random() * 500) + this.cellSize);
	this.hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
	
	var self = this;

	this.updatePriorLocationX = function(){
		this.priorLocationX = this.LocationX;
		
	}

	this.updatePriorLocationY = function(){
		this.priorLocationY = this.LocationY;
	}

	







	this.updateDirectionX = function(x){
		if(x != 0){
			this.directionX = x * -1
		} else {
			this.directionX = this.directionX * -1;
		}

		
		
	}

	this.updateDirectionY = function(y){
		if(x != 0){
			this.directionY = y * -1;
		} else {
			this.directionY = this.directionY * -1;
		}
		t
	}

	this.sound = function(){
		var oscillator = audioCtx.createOscillator();
		var gainNode = audioCtx.createGain();
		
		gainNode.connect(audioCtx.destination);
		oscillator.connect(gainNode);

		oscillator.type = 'sine';
		// var note = notes[Math.floor(Math.random() * 9)];
		// console.log(note);

		var note = Math.random() * 1500 + 200;
		oscillator.frequency.value = note; 

		var currTime = audioCtx.currentTime;
		var playTime = 3;

		gainNode.gain.setValueAtTime(0, currTime);
   		gainNode.gain.linearRampToValueAtTime(1, currTime + 0.2); 				
   		gainNode.gain.linearRampToValueAtTime(0, currTime + playTime);
		
		oscillator.start(0);
		this.stopSound(oscillator, gainNode);
		// this.oscillator.stop(1);
		// oscillator = null;

	}

	this.stopSound = function(osc){
			setTimeout(function(){
				
				osc.stop(0);
				osc.disconnect();
		}, 3010);
	}


	this.wallCollision = function(){

		var canvas = document.getElementById('environment');

		if(this.directionX > 0){
			if(this.LocationX + this.speed + this.cellSize >= 800){
				this.LocationX -= this.speed;
				this.directionX = this.directionX * -1;
				this.sound();
			} else {
				this.LocationX += this.speed;
			}
			
		} else if (this.directionX < 0){
			if(this.LocationX - this.speed - this.cellSize <= 0){
				this.LocationX += this.speed;
				this.directionX = this.directionX * -1;
				this.sound();
			} else {
				this.LocationX -= this.speed;
			}
		} else {
			this.LocationX = this.LocationX;
		}

		if(this.directionY > 0){
			if(this.LocationY + this.speed + this.cellSize >= 600){
				this.LocationY -= this.speed;
				this.directionY = this.directionY * -1;
				this.sound();
			} else {
				this.LocationY += this.speed;
			}
			
		} else if (this.directionY < 0){
			if(this.LocationY - this.speed - this.cellSize <= 0){
				this.LocationY += this.speed;
				this.directionY = this.directionY * -1;
				this.sound();
			} else {
				this.LocationY -= this.speed;
			}

			
		} else {
			this.LocationY = this.LocationY;
		}

	}

	this.die = function(){
		var death = false;
		if(Math.random() < 0.1){
			death = true
			console.log('death');
		} 

		return death;
		
	}

	this.reproduce = function(){
		var birth = false;
		if(Math.random() < 0.1){
			birth = true;
			console.log('birth');
		}

		return birth;
	}

	

	this.draw = function(){
		var canvas = document.getElementById('environment');
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.arc(this.LocationX, this.LocationY, this.cellSize, 0, 2 * Math.PI);		
		ctx.fillStyle = this.hue;
		ctx.fill();
	}




}