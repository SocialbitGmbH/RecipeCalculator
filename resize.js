function resize () {

//----<<< Left container >>>----\\

var height = document.getElementsByTagName("body")[0].clientHeight;
height -= 60;

document.getElementById("left-container").style = "height:"+height+"px;";

height    -= document.getElementById("menu").offsetHeight + 29;
height    -= document.getElementsByClassName("th")[0].offsetHeight;
height    -= document.getElementsByClassName("add-data")[0].offsetHeight;

if (height < 75) height = 75;

document.getElementsByClassName("recipe-container")[0].style = "height:"+height+"px;";
}

window.addEventListener("resize", resize);

window.onload = function() {
  resize();
}
