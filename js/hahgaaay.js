Object.prototype.addEvent = function(event, fn) {
	if(typeof(fn) === "function") {
		if(this.addEventListener) {
			this.addEventListener(event, fn, false);
		} else {
			this.attachEvent("on" + event, fn);
		}
	}
}

function download() {
	var image = document.getElementsByTagName("canvas")[0].toDataURL("image/png");
	var overlay = document.getElementById("overlay");
	overlay.innerHTML = '<img src="' + image + '" />';
	overlay.innerHTML += '<h1 style="position: absolute; right: 30px; bottom: 30px;">Right Click to save image!</h1>';
	overlay.style.display = "block";
	overlay.addEvent("click", function(e) {
		e.preventDefault();
		this.style.display = e.which === 1 ? "none" : "block";
		return false;
	});
}

function displayGetIt(value) {
	var ta = document.getElementsByTagName("textarea")[0];
	ta.style.display = "block";
	ta.value = value;
	ta.select();
	ta.addEvent("click", function(e) {
		if(e.which === 1) this.style.display = "none";
	});
}

var BoxxNet = {
	common: {
		canvas: null,
		ctx: null,
		span: null,
		BoxNet: null,
		color: "black"
	},
	init: function(canvas, span) {
		this.common.span = span;
		this.common.canvas = canvas;
		this.common.canvas.width = window.innerWidth;
		this.common.canvas.height = window.innerHeight;
		this.common.ctx = canvas.getContext("2d");
		this.common.BoxNet = new BoxNet(this.common.canvas);
		this.update();
	},
	
	setSpan: function(span) {
		this.common.span = span;
	},
	
	update: function() {
		this.common.BoxNet.render(this.common.span);
	},
	
	addPoint: function(x, y) {
		this.common.BoxNet.addBox(x, y, this.common.color, this.common.span);
	},
	
	removePoint: function(x, y) { 
		this.common.BoxNet.removeBox(x, y, this.common.span);
	},
	
	getSpan: function() {
		return this.common.span;
	},
	
	incSpan: function() {
		this.common.span += 2;
	},
	
	decSpan: function() {
		if(this.common.span >= 5)
			this.common.span -= 2;
	},
	
	setColor: function(color) {
		this.common.color = color;
	},
	
	getIt: function() {
		return this.common.BoxNet.getBoxes();
	},
	
	setIt: function(points) {
		this.common.BoxNet.setBoxes(points);
	},
	
	addMarked: function(x,y,endX,endY) {
		this.common.BoxNet.addBoxes(x, y, endX, endY, this.common.color, this.common.span);
	}
	
};

function BoxNet(canvas) {
	this.canvas = canvas
	this.ctx = canvas.getContext("2d");
	this.points = [];
}

BoxNet.prototype.render = function(span) {
	this.canvas.width = this.canvas.width; this.canvas.height = this.canvas.height;
	var width = this.canvas.width, height = this.canvas.height, lastX = 0;
	
	this.ctx.strokeStyle = "rgba(0,0,0,0.5)";	
	var lastX = 0;
	for(var x = 0; x<width; x += span) {
		this.ctx.beginPath();
		this.ctx.moveTo(x, 0);
		this.ctx.lineTo(x, height);
		this.ctx.stroke();
		lastX = x;
	}
	for(var y = 0; y<height; y += span) {
		this.ctx.beginPath();
		this.ctx.moveTo(0, y);
		this.ctx.lineTo(width, y);
		this.ctx.stroke();
	}
	
	for(var i = 0; i<this.points.length; i++) {
		this.ctx.beginPath();
		var x = Math.floor(this.points[i][0]/span), y = Math.floor(this.points[i][1]/span);
		this.ctx.fillStyle = this.points[i][2];
		this.ctx.fillRect(x*span, y*span, span, span);
		this.ctx.stroke();
	}
}

BoxNet.prototype.addBox = function(x ,y, color, span) {
	if(this.boxExist(x, y, span) == false)
		this.points.push(new Array(x,y,color));
}

BoxNet.prototype.boxExist = function(x, y, span) {
	x = Math.floor(x/span)*span; y = Math.floor(y/span)*span;
	
	for(var i = 0; i<this.points.length; i++) {
		if((Math.floor(this.points[i][0]/span)*span) === x && (Math.floor(this.points[i][1]/span)*span) === y) {
			return true;
		}
	}
	
	return false;
}

BoxNet.prototype.removeBox = function(x, y, span) {
	x = Math.floor(x/span)*span; y = Math.floor(y/span)*span;
	
	for(var i = 0; i<this.points.length; i++) {
		if((Math.floor(this.points[i][0]/span)*span) === x && (Math.floor(this.points[i][1]/span)*span) === y) {
			this.points.splice(i, 1);
			return;
		}
	}
	
	this.points.pop();
}

BoxNet.prototype.getBoxes = function() {
	var retStr = "";
	for(var i = 0; i<this.points.length; i++) {
		retStr += this.points[i][0] + "," + this.points[i][1] + "," + this.points[i][2] + "|";
	}
	
	retStr = retStr.substring(0, retStr.length-1);
	return retStr;
}

BoxNet.prototype.setBoxes = function(points) {
	var pointes = new Array();
	var one = points.split("|");
	for(var i = 0; i<one.length; i++) {
		var two =  one[i].split(",");
		pointes.push(two);
	}
	
	this.points = pointes;
}

BoxNet.prototype.addBoxes = function(x, y, endX, endY, color, span) {
	for(var xx = x; xx<endX; xx += span) {
		for(var yy = y; yy<endY; yy += span) {
			if(this.boxExist(xx, yy, span) == false)
				this.points.push(new Array(xx, yy, color));
		}
	}
}























