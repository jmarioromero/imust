var CoreMod = (function () {
  var modulelist = {};
  return {

    registerModule: function (mod) {

      if(!mod.hasOwnProperty('name')) {
        console.error('Should establish a name to the module.');
        return;
      }

      var cmp = mod.hasOwnProperty('component') ? mod.component() : 'default';
      var mods = modulelist[cmp] || {};
      mods[mod.name()] = mod;
      modulelist[cmp] = mods;
      //UtilMod.jsonStringify(modulelist, true);
    },

    init: function () {
      window.onload = function () {
        CoreMod.load();
      };
    },

    load: function () {
      console.debug('excecute method load in CoreJS!');
      var cmp = UtilMod.getParamURL('cmp') || 'default';
      if(Object.keys(modulelist).length) {
        var mods = modulelist[cmp] || {};
        if(Object.keys(mods).length) {
          for (var key in mods) {
            var mod = mods[key];
            if (mod.hasOwnProperty('init'))
              mod.init();
            else
              console.error(mod.name()+' module haven\'t \'init()\' method.');
          }
        }
        else
          console.debug('There aren\'t modules registered in ' + cmp);
      }
      else
        console.debug('There aren\'t components registered!');
    }
  };
}());
CoreMod.init();