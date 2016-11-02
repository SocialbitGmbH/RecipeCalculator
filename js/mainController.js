var rezeptrechner = angular.module("rezeptrechner", []);

rezeptrechner.controller("mainController", ['$scope', '$http', function($scope, $http) {
  console.log("Loading..");

//----<<< Variables >>>----\\

const Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(a){var c,d,e,f,g,h,i,b="",j=0;for(a=Base64._utf8_encode(a);j<a.length;)c=a.charCodeAt(j++),d=a.charCodeAt(j++),e=a.charCodeAt(j++),f=c>>2,g=(3&c)<<4|d>>4,h=(15&d)<<2|e>>6,i=63&e,isNaN(d)?h=i=64:isNaN(e)&&(i=64),b=b+this._keyStr.charAt(f)+this._keyStr.charAt(g)+this._keyStr.charAt(h)+this._keyStr.charAt(i);return b},decode:function(a){var c,d,e,f,g,h,i,b="",j=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");j<a.length;)f=this._keyStr.indexOf(a.charAt(j++)),g=this._keyStr.indexOf(a.charAt(j++)),h=this._keyStr.indexOf(a.charAt(j++)),i=this._keyStr.indexOf(a.charAt(j++)),c=f<<2|g>>4,d=(15&g)<<4|h>>2,e=(3&h)<<6|i,b+=String.fromCharCode(c),64!=h&&(b+=String.fromCharCode(d)),64!=i&&(b+=String.fromCharCode(e));return b=Base64._utf8_decode(b)},_utf8_encode:function(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);d<128?b+=String.fromCharCode(d):d>127&&d<2048?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b},_utf8_decode:function(a){for(var b="",c=0,d=0,f=0;c<a.length;)d=a.charCodeAt(c),d<128?(b+=String.fromCharCode(d),c++):d>191&&d<224?(f=a.charCodeAt(c+1),b+=String.fromCharCode((31&d)<<6|63&f),c+=2):(f=a.charCodeAt(c+1),c3=a.charCodeAt(c+2),b+=String.fromCharCode((15&d)<<12|(63&f)<<6|63&c3),c+=3);return b}};

  $scope.domain = "localhost";
  $scope.msgbox = "";
  $scope.view = "list";

  $scope.new = {
    name : "",
    value: 1,
    unit : "Gramm"
  };

  $scope.form = {
    foo: []
  };

  $scope.recipe = {
    name   : "",
    text   : "",
    source : "",
    realSource : "http://"+$scope.domain+"/#"
  };

  $scope.factor = 1;

//----<<< Functions >>>----\\

  function encodeURL (str) {
      return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  }

  function decodeUrl (str) {
      str = (str + '===').slice(0, str.length + (str.length % 4));
      return str.replace(/-/g, '+').replace(/_/g, '/');
  }

  function showInfo (text, timeout) {

    var time = text.length / 15;
    if (time < 1.5) time = 1.5;
    if (timeout === false || timeout === undefined) time = 30;
    time *= 10;
    $scope.msgbox = text;

    document.getElementById("message-container").className = "visible";
    setTimeout(function() {

      var counter = 0;
      document.getElementById("msg").focus();
      var intervalID = setInterval(function() {
        counter++;
        if ((document.getElementById("msg") != document.activeElement) || (counter > time)) {
          document.getElementById("message-container").className = "";
          clearInterval(intervalID);
        }
      }, 100);
    }, 100);
  }

  function secondLayer (show) {
    var layer = document.getElementById("secondary-layer");

    if (show === true) {
      layer.className = "visible";
    } else {
      layer.className = "";
    }
  }

  function encodeData (data) {
    try {
      return encodeURL(Base64.encode(JSON.stringify(data)));
    } catch (e) {
      showInfo("Fehler beim Codieren..", true);
      return false;
    }
  }

  function decodeData (data) {
    try {
      return JSON.parse(Base64.decode(decodeUrl(data)));
    } catch (e) {
      showInfo("Fehler beim Decodieren..", true);
      return false;
    }
  }

  function showCook (show) {
    var container = document.getElementById("left-container");
    var height    = container.clientHeight;
    var counter = 0;
    var num = 0;
    var now = 0;
    if (show) {
      var intervalID = setInterval(function() {
        if (num*2 <= height) {
          num = Math.pow(1.2, counter/3) + counter/2;
        } else {
          if (now === 0) now = num / (counter/3) + counter/2;
          num = num + now;
        }

        if (num >= (height-2)) {
          changeStyle(container, "margin-top: -"+(height+2)+"px;", /margin-top: -\d+px;/);
          document.getElementById("cookbtn").innerHTML = '<i class="material-icons md-18 icon">&#xE5CD;</i>Zurück';
          document.getElementById("recipe-text").readOnly = true;
          clearInterval(intervalID);
        } else {
          changeStyle(container, "margin-top: -"+num+"px;", /margin-top: -\d+px;/);
        }
        counter++;
      }, 6);
    } else {
      num = height;
      var intervalID = setInterval(function() {
        if (num >= height/4) {
          num = height - (Math.pow(1.2, counter/3) + counter/2);
        } else {
          if (now === 0) now = num / (counter/3) + counter/2;
          num = num - now;
        }

        if (num <= 0) {
          changeStyle(container, "margin-top: 0px;", /margin-top: -\d+px;/);
          document.getElementById("cookbtn").innerHTML = '<i class="material-icons md-18 icon">&#xE5CA;</i>Jetzt kochen';
          document.getElementById("recipe-text").readOnly = false;
          clearInterval(intervalID);
        } else {
          changeStyle(container, "margin-top: -"+num+"px;", /margin-top: -\d+px;/);
        }
        counter++;
      }, 6);
    }
  }


//----<<< Eventhandlers >>>----\\

  $scope.addIngredient = function () {    // Adds a new Ingredient to the table

    var name  = $scope.new.name;
    var value = $scope.new.value;
    var unit  = $scope.new.unit;

    if (name !== "" && value > 0 && unit !== "") {  // Check for valid input
      console.log("Add");

      $scope.form.foo.push({'name': name, 'value': value, 'startValue': value, 'unit': unit});

      $scope.new.name   = "";
      $scope.new.value  = 1;
      $scope.new.unit   = "Gramm";

      $scope.updateValues();            // Update values to match current factor

    } else if (value <= 0) {            // Value is too small
      showInfo("Die eingestellte Menge ist zu klein. Bitte erhöhen Sie diese.", true);
    } else {                            // Not all fields filled
      showInfo("Alle Felder müssen ausgefüllt sein.", true);
    }
  };

  $scope.updateValues = function() {    // Update all values with current factor

    for (var x of $scope.form.foo) {    // Loop through all values
      x.value = Math.round(x.startValue * $scope.factor * 2)/2;
    }
  };

  $scope.changeValue = function (input) {   // Value X changed

    if (input.value <= 0 || input.value == undefined) input.value = 1;

    console.log("Changed");
    $scope.factor = input.value / input.startValue;
    $scope.updateValues();               // Update values

  };

  $scope.remove = function (delFoo) {     // Remove one ingredient
    console.log("Remove");
    $scope.form.foo.splice($scope.form.foo.indexOf(delFoo), 1);
    if ($scope.form.foo.length == 0) {    // Last item? Reset factor
      console.log("Reset factor");
      $scope.factor = 1;
    }
  };

  $scope.removeAll = function () {        // Remove all items + reset factor
    console.log("Removed all");
    console.log("Reset factor");
    $scope.form.foo = [];
    $scope.factor   = 1;
  }

  $scope.share = function () {            // Share the recipe with the world
    console.log("Share");
    if ($scope.form.foo.length > 0) {
      var dataArray = {
        'name'   : $scope.recipe.name,
        'text'   : $scope.recipe.text,
        'source' : $scope.recipe.source,
        'data'   : $scope.form.foo
      };
      var data = encodeData(dataArray);

      if (data !== false) {
        window.open("http://"+$scope.domain+"/#"+data);
      }
    } else {
      showInfo("Nichts zum Teilen :/", true);
    }
  }

  $scope.cook = function () {
    if ($scope.view !== "cook") {
      $scope.view = "cook";
      showCook(true);
    } else {
      $scope.view = "list";
      showCook(false);
    }
  }

//----<<< Hash'n'stuff >>>----\\

  if (window.location.hash !== "") {
    console.log("Hash found");

    var hash = window.location.hash;
    hash     = hash.replace("#", "").split("=");
    var type = hash[0];
    var data = hash[1];

    if (type === "share") {     // Shared

      var dataAll = decodeData(data);

      if (dataAll !== false) {
        $scope.recipe.name = dataAll["name"];
        $scope.recipe.text = dataAll["text"];

        if (dataAll["source"] !== "") {
          document.getElementById("source").readOnly = true;
          document.getElementById("source-a").setAttribute("target", "_blank");
          $scope.recipe.source     = dataAll["source"];
          $scope.recipe.realSource = dataAll["source"];
        }
        for (var x of dataAll["data"]) {
          $scope.form.foo.push(x);
        }
      }
    } else if (type === "cook") {     // Cooking

    } else if (type === "about") {
      secondLayer(true);
    } else if (type === "impressum") {  // Impressum
      secondLayer(true);
    }
  }

  document.getElementById("mainView").style = "";   // Fixing flickering on pageload

  console.log("Loaded!");

}]);
