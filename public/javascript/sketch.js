let socket

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function _(selector){
	return document.querySelector(selector);
  }
const jamid = getParameterByName('_id')
const userid = getParameterByName('_uid')
const perm = getParameterByName('p')
let arr=[];
let dragged = false
let eraserenable = false

const clearbtn = document.querySelector("#btnerase")
const eraser = document.querySelector("#eraser")
console.log('permission is '+perm+' and its type is '+typeof(perm))
console.log(eraser)

function setup(){
	let mycanvas=createCanvas(innerWidth,900)
	mycanvas.parent("webcanvas") 
	background(51)
	console.log(jamid)
	console.log(userid)
	socket = io.connect('https://jamboard-lite.herokuapp.com',{
		query: {
			_id: jamid,
			_uid: userid 
		}
	})
	socket.emit('join',{jam : jamid})
	socket.on('mouse',newDrawing)
	socket.on('erasing',newerasedDrawing)
	if(perm!='false')
	{
		clearbtn.addEventListener('click',async(e)=>{
			socket.emit('erase')
		})
		eraser.addEventListener('click',async(e)=>{
			if(!eraserenable){
				eraser.textContent = 'Draw'
			}else {
				eraser.textContent = 'Eraser'
			}
			eraserenable=(!eraserenable)
		})
	}
	socket.on('eraseall',erasemsg)
}

console.log(clearbtn)

function newDrawing(data){
	let type =data.typepen
	let size = data.sizepen
	let color = data.colorpen
	fill(color);
	stroke(color);
		
	if(type == "pencil"){
		line(data.px, data.py, data.x, data.y);
	} else {
		ellipse(data.x, data.y, size, size);
	}
}

function newerasedDrawing(data){
	// erase(2,0)
	let type =data.typepen
	let size = data.sizepen
	let color = data.colorpen
	fill(color);
	stroke(color);
		
	if(type == "pencil"){
		line(data.px, data.py, data.x, data.y);
	} else {
		ellipse(data.x, data.y, size, size);
	}
	// noErase()
}

function mouseReleased(){
	if(perm!="false")
	{
		if(dragged)
		{
			console.log('inside released if')
			// if(eraserenable){
			// 	console.log(arr)
			// 	socket.emit('eraser',arr);
			// }else {
			// 	socket.emit('mouse',arr);
			// }
			socket.emit('mouse',arr);
			arr=[]
			dragged=false	
		}
	}
}


function mouseDragged()
{
	let type = _("#pen-pencil").checked?"pencil":"brush";
	let size = parseInt(_("#pen-size").value);
	let color = _("#pen-color").value;
	if(perm!="false")
	{
		dragged = true
		// if(eraserenable){
		// 	erase(2,0)
		// }else {
		// 	noErase()
		// }
		var data= {
			x: mouseX,
			y: mouseY,
			typepen:type,
			sizepen:size,
			colorpen:color,
			px:pmouseX,
			py:pmouseY
		}
		if(eraserenable){
			data.colorpen = '#333333'
			socket.emit('erasing',data)
		}
		arr.push(data);
		if(eraserenable){
			fill('#333333');
		    stroke('#333333');
		}else{
			fill(color);
		    stroke(color);
		}

		if(type == "pencil"){
			line(pmouseX, pmouseY, mouseX, mouseY);
		  } else {
			ellipse(mouseX, mouseY, size, size);
		  }

	}
}

function erasemsg(data)
{
	location.assign('/jamboard?_id='+data.jamid+'&_uid='+data.userid+'&p='+perm)
}

function draw()
{
}