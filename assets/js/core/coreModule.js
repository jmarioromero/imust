/**
 * This module define logic to register and load modules asociates with a
 * component.
 * @module coreModule
 * @author Jorge Mario Romero Arroyo <jmarioromero@gmail.com>
 * @date 2015 March 21
 */
var coreModule = (function () {

  /*****************************************************************************
   * PRIVATE VARS
   ****************************************************************************/

  var modulelist = {};

  /*****************************************************************************
   * PRIVATE FUNCTIONS
   ****************************************************************************/

  /**
   * This function load modules of a specified component, if the module
   * does not provide a component is set by default.
   * @method _load
   * @author Jorge Mario Romero Arroyo <jmarioromero@gmail.com>
   * @date 2015 March 21
   */
  _load = function () {
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
  },

  /**
   * This function allows register a module to specified component, if the module
   * does not provide a component is set by default.
   * @method _registerModule
   * @author Jorge Mario Romero Arroyo <jmarioromero@gmail.com>
   * @date 2015 March 21
   */
  _registerModule = function (module) {

    if(!module.hasOwnProperty('name')) {
      console.error('Should establish a name to the module.');
      return;
    }

    var cmp = module.hasOwnProperty('component') ? module.component() : 'default';
    var mods = modulelist[cmp] || {};
    mods[module.name()] = module;
    modulelist[cmp] = mods;
    UtilMod.jsonStringify(modulelist, true);
  }

  /*****************************************************************************
   * PUBLIC FUNCTIONS
   ****************************************************************************/

  return {

    registerModule: _registerModule,

    init: function () {
      window.onload = function () {
        _load();
      };
    }
  };
}());
// init module
coreModule.init();

var tmpl = (function () {/*
<div class="row">
  <section class="col three-two" id="reminderform">
    <h2>{{formtitle}}</h2>
    <label>{{tlabel}}</label>
    <input name="title" type="text" value="{{title}}">
    <label>{{clabel}}</label>
    <textarea name="content" >{{content}}</textarea>
    <div class="buttons">
      <a href="#" class="btn btn-default">{{clearbtn}}</a>
      <a href="#" class="btn btn-success">{{savebtn}}</a>
    </div>
  </section>
</div>
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

console.log(tmpl);