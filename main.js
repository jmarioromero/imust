//var element = document.querySelector("#greeting");
//element.innerText = "Hello, world!";
var FirebaseJS = new Firebase("https://incandescent-inferno-4098.firebaseio.com");
/*
for(var _i=1;_i<11;_i++)
  FirebaseJS.push({
    content: 'Content ' + _i,
    title: 'Title' + _i,
    date_added: Firebase.ServerValue.TIMESTAMP,
    date_modified: Firebase.ServerValue.TIMESTAMP
  });
*/
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
String.prototype.toDOM = function() {
  var d=document
     ,i
     ,a=d.createElement('div')
     ,b=d.createDocumentFragment();
  a.innerHTML=this;
  while(i=a.firstChild)b.appendChild(i);
  return b;
};
var UtilJS = (function() {
  return {
    jsonStringify: function(_jsonObj, _log) {
      var _s = JSON.stringify(_jsonObj, null, 2)
      if(_log) console.log('---------------\n'+_s)
      return _s
    },
    getParamURL: function(_p){
      var _v = location.search.match(new RegExp('[\?\&]'+_p +'=([^\&]*)(\&?)', 'i'))
      return _v ? _v[1] : false
    },
    getListData: function(_doc, _fn) {
      FirebaseJS.child(_doc).on('value', function(_snapshot) {
          if(_fn) _fn(_snapshot)
      });
    },
    formatDate: function(_ts) {
      var options = {
        month: 'short',
        day: '2-digit',
        year: 'numeric'//,
        //hour: '2-digit',
        //minute: '2-digit',
        //second: '2-digit'
      }
      return (new Intl.DateTimeFormat(undefined, options)).format(new Date(_ts))
    },
    getHTML: function(_tmpl, _item) {
      var _tmplTmp = _tmpl
      Object.getOwnPropertyNames(_item).forEach(function(_key) {
        _tmplTmp = _tmplTmp.replace(new RegExp('{{'+_key+'}}', 'ig'), _item[_key]);
      });
      return _tmplTmp
    }
  }
}());
/***********
 * COREJS
 **********/
var CoreJS = (function() {
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
      //UtilJS.jsonStringify(_modList, true)
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
            else console.error(_mod.name()+' module haven\'t \'init()\' method.')
          }
        } else console.debug('There aren\'t modules registered in '+_cmp)
      } else console.debug('There aren\'t components registered!')
    }
  }
}());
CoreJS.init();
/***********
 * MODULES
 **********/
var Mod = (function() {
  return {
    //component: function() { return 'homepage'; },
    name: function() { return 'mod' },
    init: function() {
      console.debug('Call init method from '+Mod.name())
      UtilJS.getListData('rems', function(_snapshot) {

        var _tmpl = document.querySelector('#'+Mod.name()+'-tmpl .show-section').innerHTML
        var _parent = document.querySelector('#container > section')
        var _textHTML = '';

        _snapshot.forEach(function(_item) {
          _item = _item.val()
          _item.date_added = UtilJS.formatDate(_item.date_added)
          _textHTML += UtilJS.getHTML(_tmpl, _item)
        });

        _parent.appendChild(_textHTML.toDOM());
      })
    },
  }
}());

CoreJS.registerMod(Mod);

var Mod2 = (function() {
  return {
    component: function() { return 'homepage' },
    name: function() { return 'mod2' },
    init: function() {
      console.debug('Call init method from '+Mod2.name())
    }
  }
}());

CoreJS.registerMod(Mod2);
