function changeStyle (element, value, filter) {
  if (filter === undefined) filter = /.+/;
  var current = element.style.cssText;
  element.style = current.replace(filter, "") + value;
}

function resize () {

//----<<< Left container >>>----\\

var height = document.getElementsByTagName("body")[0].clientHeight;
height -= document.getElementsByClassName("bottom-container")[0].clientHeight;

changeStyle(document.getElementById("left-container"), "height:"+height+"px;", /height:\s\d+px;/);
changeStyle(document.getElementsByClassName("cook-container")[0], "height:"+height+"px;", /height:\s\d+px;/)

height    -= document.getElementById("menu").offsetHeight;
height    -= document.getElementsByClassName("th")[0].offsetHeight;
height    -= document.getElementsByClassName("add-data")[0].offsetHeight + 29;

if (height < 75) height = 75;

changeStyle(document.getElementsByClassName("recipe-container")[0], "height: "+height+"px;", /height:\s\d+px;/);
}

window.addEventListener("resize", resize);

window.onload = function() {
  resize();
}
