var rezeptrechner = angular.module("rezeptrechner", []);

rezeptrechner.controller("mainController", ['$scope', '$http', function($scope, $http) {
  console.log("Loading..");

//----<<< Variables >>>----\\

const Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(a){var c,d,e,f,g,h,i,b="",j=0;for(a=Base64._utf8_encode(a);j<a.length;)c=a.charCodeAt(j++),d=a.charCodeAt(j++),e=a.charCodeAt(j++),f=c>>2,g=(3&c)<<4|d>>4,h=(15&d)<<2|e>>6,i=63&e,isNaN(d)?h=i=64:isNaN(e)&&(i=64),b=b+this._keyStr.charAt(f)+this._keyStr.charAt(g)+this._keyStr.charAt(h)+this._keyStr.charAt(i);return b},decode:function(a){var c,d,e,f,g,h,i,b="",j=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");j<a.length;)f=this._keyStr.indexOf(a.charAt(j++)),g=this._keyStr.indexOf(a.charAt(j++)),h=this._keyStr.indexOf(a.charAt(j++)),i=this._keyStr.indexOf(a.charAt(j++)),c=f<<2|g>>4,d=(15&g)<<4|h>>2,e=(3&h)<<6|i,b+=String.fromCharCode(c),64!=h&&(b+=String.fromCharCode(d)),64!=i&&(b+=String.fromCharCode(e));return b=Base64._utf8_decode(b)},_utf8_encode:function(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);d<128?b+=String.fromCharCode(d):d>127&&d<2048?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b},_utf8_decode:function(a){for(var b="",c=0,d=0,f=0;c<a.length;)d=a.charCodeAt(c),d<128?(b+=String.fromCharCode(d),c++):d>191&&d<224?(f=a.charCodeAt(c+1),b+=String.fromCharCode((31&d)<<6|63&f),c+=2):(f=a.charCodeAt(c+1),c3=a.charCodeAt(c+2),b+=String.fromCharCode((15&d)<<12|(63&f)<<6|63&c3),c+=3);return b}};

  $scope.new = {
    name : "",
    value: 1,
    unit : "Gramm"
  };

  $scope.form = {
    foo: []
  };

  $scope.recipe = {
    name : "",
    text : ""
  };

  $scope.factor = 1;

//----<<< Functions >>>----\\

  function encodeURL(str){
      return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
  }

  function decodeUrl(str){
      str = (str + '===').slice(0, str.length + (str.length % 4));
      return str.replace(/-/g, '+').replace(/_/g, '/');
  }


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
      alert(unescape("Die eingestellt Menge ist zu klein. Bitte erh%F6hen Sie ihn."));
    } else {                            // Not all fields filled
      alert(unescape("Alle Felder m%FCssen ausgef%FCllt sein."));
    }
  };

  $scope.updateValues = function() {    // Update all values with current factor

    for (var x of $scope.form.foo) {    // Loop through all values
      x.value = Math.round(x.startValue * $scope.factor * 2)/2;
    }
  };

  $scope.changeValue = function (input) {   // Value X changed

    if (input.name !== undefined && input.name !== "") {
      console.log("Changed");
      $scope.factor = input.value / input.startValue;
      $scope.updateValues();               // Update values
    }
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
        'name' : $scope.recipe.name,
        'text' : $scope.recipe.text,
        'data' : $scope.form.foo
      };
      var data = encodeURL(Base64.encode(JSON.stringify(dataArray)));
      window.open("http://"+window.location.hostname+"/#"+data);
    } else {
      alert("Nichts zum Teilen :/");
    }
  }

  if (window.location.hash !== "") {
    console.log("Shared Data");
    var data = Base64.decode(decodeUrl(window.location.hash));
    dataAll = JSON.parse(data.substring(0, data.length - 1));
    $scope.recipe.name = dataAll["name"];
    $scope.recipe.text = dataAll["text"];
    for (var x of dataAll["data"]) {
      $scope.form.foo.push(x);
    }
  }

  document.getElementById("mainView").style = "";   // Fixing flickering on pageload

  console.log("Loaded!");

}]);
