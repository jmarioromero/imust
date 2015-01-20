//var element = document.querySelector("#greeting");
//element.innerText = "Hello, world!";
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
      console.debug('este es un ' + _mod.getControl());
      _moduleList[_mod.getControl()] = _mod;

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
function Module = {
  id: 'module',
  control: 'homepage',
  init: function() {
    console.debug('call init() method');
    console.debug('{ id:' + this.id + ', control:' + this.control +  '}');
  }
};

var _mod = (function() {
  var id = 'module'
  return {
    control: function() { return 'homepage'; },
    id: function() { return id; },
    init: function() {
    }
  }
}());

coreJS.registerMod(Module);
