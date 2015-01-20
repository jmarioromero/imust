//var element = document.querySelector("#greeting");
//element.innerText = "Hello, world!";
/***********
 * UTILJS
 **********/
var utilJS = (function() {
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
      console.log(_mod.info.id);
      //_moduleList[_mod.info.id] = _mod;

    },
    init: function() {
      window.onload = function() { coreJS.load(); };
    },
    load: function() {
      console.debug('excecute method load in coreJS!');
      if (Object.keys(_moduleList).length)
        for (_index in _moduleList) {
          _mod = _moduleList[_index];
          if (utilJS.valide(_mod.init))
            console.debug(_mod.info.id + ' module haven\'t \'init()\' method.');
          else _mod.show();
        }
      else console.debug('There aren\'t modules registered!');
    }
  }
}(utilJS));
coreJS.init();
/***********
 * MODULES
 **********/
var _mod = (function() {
  return {
    info: function() {
      return { id: 'amod', control: 'homepage' }
    },
    init: function() {
    }
  }
}());

coreJS.registerMod(_mod);
