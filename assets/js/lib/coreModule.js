/**
 * This module defines the logic to register and loads modules asociates with a
 * component.
 * @module coreModule
 * @author Jorge Mario Romero Arroyo <jmarioromero@gmail.com>
 * @date 2015 March 21
 */
var coreModule = (function () {

  /*****************************************************************************
   * VARS
   ****************************************************************************/

  var modulelist = {};

  /*****************************************************************************
   * PRIVATE FUNCCTIONS
   ****************************************************************************/

  /**
   * This function loads the modules of a specified component, if the module
   * does not provide a component is set by default.
   * @method load
   * @author Jorge Mario Romero Arroyo <jmarioromero@gmail.com>
   * @date 2015 March 21
   */
  load = function () {
    console.debug('excecute method load in CoreJS!');
    var cmp = UtilMod.getParamURL('cmp') || 'default';
    if(Object.keys(modulelist).length) {
      var mods = modulelist[cmp] || {};
      if(Object.keys(mods).length) {
        mods.loop(function(mod) {
          if (mod.hasOwnProperty('init'))
            mod.init();
          else
            console.error(mod.name()+' module haven\'t \'init()\' method.');
        });
      }
      else
        console.debug('There aren\'t modules registered in ' + cmp);
    }
    else
      console.debug('There aren\'t components registered!');
  }

  /*****************************************************************************
   * PUBLIC FUNCCTIONS
   ****************************************************************************/

  return {

    registerModule: function (module) {

      if(!module.hasOwnProperty('name')) {
        console.error('Should establish a name to the module.');
        return;
      }

      var cmp = module.hasOwnProperty('component') ? module.component() : 'default';
      var mods = modulelist[cmp] || {};
      mods[module.name()] = module;
      modulelist[cmp] = mods;
      UtilMod.jsonStringify(modulelist, true);
    },

    init: function () {
      window.onload = function () {
        load();
      };
    }
  };
}());
// init module
coreModule.init();