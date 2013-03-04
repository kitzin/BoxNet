/* Color bar stuff */
function initToolMenu() {
	var tools = document.getElementById("tools").getElementsByTagName("div")[0];
	for(var i = 0; i<tools.childNodes.length; i++) {
		if(tools.childNodes[i].nodeName === "P") {
			var color = tools.childNodes[i].className.split(" ")[0];
			tools.childNodes[i].style.backgroundColor = color;
			tools.childNodes[i].style.border = "2px solid " + color;
		}
	}
	
	var pes = document.getElementById("tools").getElementsByTagName("div")[0].getElementsByTagName("p");
	for(var i = 0; i<pes.length; i++) {
		pes[i].addEvent("click", function(e) {
			var p = document.getElementById("tools").getElementsByTagName("div")[0].getElementsByTagName("p");
			for(var j = 0; j<p.length; j++) {
				p[j].className = p[j].className.split(" ")[0];
			}
			this.className = this.className.split(" ")[0] + " active";
			BN.setColor(this.className.split(" ")[0]);
		});
	}
}

/* All the things */
var BN = BoxxNet;

window.addEvent("load", function() {
	var canvas = document.getElementsByTagName("canvas")[0];

	BN.init(canvas, 20);
	
	canvas.addEvent("mousedown", function(e) {
		if(e.which === 1)
			BN.addPoint(e.clientX, e.clientY);
		BN.update();
	});

	canvas.addEvent("contextmenu", function(e) {
		BN.removePoint(e.clientX, e.clientY);
		BN.update();
		e.preventDefault();
	});
	
	window.addEvent("keydown", function(e) {
		switch(e.keyCode) {
			case 107:
				BN.incSpan();
				BN.update();
				break;
				
			case 109:
				BN.decSpan();
				BN.update();
				break;
		}
	});
	
	/* Draggin Toolmenu and stuff */
	initToolMenu();
	
	var toolmenu = document.getElementById("toolmenu"), dragMenu = toolmenu.getElementsByTagName("div")[0];
	var dragging = false;
	var xpos, ypos;
	
	dragMenu.addEvent("mousedown", function(e) {
		dragging = true;
		xpos = e.clientX; ypos = e.clientY;
	});
	window.addEvent("mouseup", function(e) {
		dragging = false;
	});
	window.addEvent("mousemove", function(e) {
		if(dragging) {
			toolmenu.style.left = (toolmenu.offsetLeft+e.clientX-xpos) + "px";
			toolmenu.style.top = (toolmenu.offsetTop+e.clientY-ypos) + "px";	
			xpos = e.clientX; ypos = e.clientY;
		}
	});
	
	/* Color Stuff */
	var inputs = document.getElementById("tools").getElementsByTagName("div")[1].getElementsByTagName("input");
	inputs[1].addEvent("click", function(e) {
		var value = inputs[0].value;
		var element = document.createElement("p");
		element.className = value;
		document.getElementById("tools").getElementsByTagName("div")[0].appendChild(element);
		initToolMenu();
	});
	
	/* Zoom button (you know what im talking about) */
	var zooms = document.getElementById("tools").getElementsByTagName("div")[2].getElementsByTagName("input");
	zooms[0].addEvent("click", function(e) {
		BN.incSpan();
		BN.update();
	});
	zooms[1].addEvent("click", function(e) {
		BN.decSpan();
		BN.update();
	});
	
	/* Download Event */
	document.getElementById("download").addEvent("click", function(e) {
		download();
	});
	
	/* Get/Load || old/new || stuff/things || derp/lol */
	var getset = document.getElementById("tools").getElementsByTagName("div")[3].getElementsByTagName("input");
	getset[0].addEvent("click", function(e) {
		displayGetIt(BN.getIt());
	});
	
	getset[2].addEvent("click", function(e) {
		var value = getset[1].value;
		BN.setIt(value);
		BN.update();
	});
	
	/* Marking ALOT! */
	var mark = document.getElementById("mark");
	var isMarking = false;
	var beginX = 0, beginY = 0;
	
	canvas.addEvent("mousedown", function(e) {
		beginX = e.clientX; beginY = e.clientY;
		isMarking = true;
	});
	
	window.addEvent("mousemove", function(e) {
		if(isMarking) {
			mark.style.display = "block";
			mark.style.left = (beginX > e.clientX ? e.clientX : beginX) + "px";
			mark.style.top = (beginY > e.clientY ? e.clientY : beginY) + "px";
			mark.style.width = (beginX > e.clientX ? (beginX-e.clientX) : (e.clientX-beginX)) + "px";
			mark.style.height = (beginY > e.clientY ? (beginY-e.clientY) : (e.clientY-beginY)) + "px";
		}
	});
	
	window.addEvent("mouseup", function(e) {
		if(isMarking) {
			var begX = beginX > e.clientX ? e.clientX : beginX;
			var begY = beginY > e.clientY ? e.clientY : beginY;
			var endX = begX < e.clientX ? e.clientX : beginX;
			var endY = begY < e.clientY ? e.clientY : beginY;
			
			BN.addMarked(begX, begY, endX, endY);
			BN.update();
			mark.style.display = "none";
			mark.style.width = "0px";
			mark.style.height = "0px";
			isMarking = false;
		}
	});
});
























