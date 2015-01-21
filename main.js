//var element = document.querySelector("#greeting");
//element.innerText = "Hello, world!";
var fb = new Firebase("https://incandescent-inferno-4098.firebaseio.com");

fb.set({ name: "Alex Wolfe" });
/***********
 * UTILJS
 **********/
var UtilJS = (function() {
  return {
    valide: function(_o) {
      return (typeof(_o) !== 'undefined')
    }
  }
}());
/***********
 * COREJS
 **********/
var coreJS = (function(util) {
  var _moduleList = {};
  return {
    registerMod: function(_mod) {

      var _controller = _mod.getController()
      var _modName = _mod.getName()

      _mods = _moduleList[_controller]
      _mods = _mods ? _mods : {}
      _mods[_modName] = _mod
      _moduleList[_controller] = _mods
      console.log(_moduleList);
    },
    init: function() {
      window.onload = function() { coreJS.load(); };
    },
    load: function() {
      console.debug('excecute method load in coreJS!');
      if (Object.keys(_moduleList).length)
        for (_index in _moduleList) {
          _mod = _moduleList[_index];
          if (UtilJS.valide(_mod.init))
            console.debug(_mod.info.id + ' module haven\'t \'init()\' method.');
          else _mod.init();
        }
      else console.debug('There aren\'t modules registered!');
    }
  }
}(UtilJS));
coreJS.init();
/***********
 * MODULES
 **********/

var Mod = (function() {
  return {
    getController: function() { return 'homepage'; },
    getName: function() { return 'mod1'; },
    init: function() {
    }
  }
}());

coreJS.registerMod(Mod);

var Mod2 = (function() {
  return {
    getController: function() { return 'homepage'; },
    getName: function() { return 'mod2'; },
    init: function() {
    }
  }
}());

coreJS.registerMod(Mod2);
