var Mod2 = (function() {

  return {

    component: function() { return 'homepage'; },
    name: function () { return 'mod2'; },
    init: function () {
      console.debug('Call init method from ' + Mod2.name());
    }
  };
}());

CoreMod.registerModule(Mod2);