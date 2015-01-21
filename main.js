//var element = document.querySelector("#greeting");
//element.innerText = "Hello, world!";
var fb = new Firebase("https://incandescent-inferno-4098.firebaseio.com/rems");
/*
fb.push({
  content: '',
  date_added: Firebase.ServerValue.TIMESTAMP,
  date_modified: Firebase.ServerValue.TIMESTAMP,
  title: ''
});
fb.push({
  content: '',
  title: '',
  date_added: Firebase.ServerValue.TIMESTAMP,
  date_modified: Firebase.ServerValue.TIMESTAMP
});
*/
fb.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


/*
var ref = new Firebase("https://dinosaur-facts.firebaseio.com/");
ref.child("stegosaurus").child("height").on("value", function(stegosaurusHeightSnapshot) {
  var favoriteDinoHeight = stegosaurusHeightSnapshot.val();
  var queryRef = ref.orderByChild("height").endAt(favoriteDinoHeight).limitToLast(2)
  queryRef.on("value", function(querySnapshot) {
      if (querySnapshot.numChildren() == 2) {
        // Data is ordered by increasing height, so we want the first entry
        querySnapshot.forEach(function(dinoSnapshot) {
          console.log("The dinosaur just shorter than the stegasaurus is " + dinoSnapshot.key());
          // Returning true means that we will only loop through the forEach() one time
          return true;
        });
      } else {
        console.log("The stegosaurus is the shortest dino");
      }
  });
});
*/

/***********
 * UTILJS
 **********/
var UtilJS = (function() {
  return {
    jsonStringify: function(_jsonObj, _log) {
      var _s = JSON.stringify(_jsonObj, null, 2)
      if(_log) console.log('---------------\n' + _s)
      return _s
    },
    getParamURL: function(_param){
      var _v = location.search.match(new RegExp('[\?\&]' + _param + '=([^\&]*)(\&?)', 'i'))
      return _v ? _v[1] : false
    }
  }
}());
/***********
 * COREJS
 **********/
var CoreJS = (function(UtilJS) {
  var _modList = {}
  return {
    registerMod: function(_mod) {
      if(!_mod.hasOwnProperty('name')) {
        console.error('Should establish a name to the module')
        return;
      }
      var _cmp = _mod.hasOwnProperty('component') ? _mod.component() : 'default'
      _mods = _modList[_cmp] || {}
      _mods[_mod.name()] = _mod
      _modList[_cmp] = _mods
      UtilJS.jsonStringify(_modList, true)
    },
    init: function() {
      window.onload = function() { CoreJS.load() }
    },
    load: function() {
      console.debug('excecute method load in CoreJS!')
      var _cmp = UtilJS.getParamURL('cmp') || 'default'
      if(Object.keys(_modList).length) {
        _mods = _modList[_cmp] || {}
        if(Object.keys(_mods).length) {
          for (_j in _mods) {
            _mod = _mods[_j]
            if (_mod.init) _mod.init()
            else console.error(_mod.name() + ' module haven\'t \'init()\' method.')
          }
        } else console.debug('There aren\'t modules registered in ' + _cmp)
      } else console.debug('There aren\'t components registered!')
    }
  }
}(UtilJS));
CoreJS.init();
/***********
 * MODULES
 **********/

var Mod = (function() {
  return {
    //component: function() { return 'homepage'; },
    name: function() { return 'Mod'; },
    init: function() {
      console.debug('Call init method from ' + this.name())
    }
  }
}());

CoreJS.registerMod(Mod);

var Mod2 = (function() {
  return {
    component: function() { return 'homepage' },
    name: function() { return 'Mod2' },
    init: function() {
      console.debug('Call init method from ' + this.name())
    }
  }
}());

CoreJS.registerMod(Mod2);
