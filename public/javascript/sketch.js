var socket

function setup(){
	let mycanvas=createCanvas(600,600)
	mycanvas.parent("webcanvas") 
	background(51)
	socket = io.connect('http://127.0.0.1:3000')
	socket.on('mouse',newDrawing)
}

function newDrawing(data){
	noStroke()
	fill(255)
	ellipse(data.x,data.y,10,10)
}

function mouseDragged()
{
	var data= {
		x: mouseX,
		y: mouseY
	}
	socket.emit('mouse',data)
	noStroke()
	fill(255)
	ellipse(mouseX,mouseY,10,10)
}

function draw()
{
}