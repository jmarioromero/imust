//var element = document.querySelector("#greeting");
//element.innerText = "Hello, world!";
//var firebaseURL = 'https://incandescent-inferno-4098.firebaseio.com';
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
var Constants = {
  remsURL: 'https://incandescent-inferno-4098.firebaseio.com/rems.json'
}

String.prototype.toDOM = function() {
  var elm = document.createElement('div'),
      docfrag = document.createDocumentFragment();
  elm.innerHTML = this;
  while (child = elm.firstChild)
    docfrag.appendChild(child);
  return docfrag;
};

var UtilMod = (function() {
  return {

    jsonStringify: function(jsonobj, printlog) {
      var jsonstr = JSON.stringify(jsonobj, null, 2);
      if(printlog)
        console.log(jsonstr);
      return jsonstr;
    },

    getParamURL: function(param) {
      var regex = new RegExp('[\?\&]' + param + '=([^\&]*)(\&?)', 'i');
      var matches = location.search.match(regex);
      return matches ? matches[1] || false : false;
    },
    /*
    getListData: function(docname, callback) {
      var firebase = new Firebase(firebaseURL);
      firebase.child(docname).on('value', function(snapshot) {
        if(callback)
          callback(snapshot);
      });
    },
    */
    formatDate: function(timestamp) {
      var options = {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      };
      var date = new Date(timestamp);
      var datetimeformat = new Intl.DateTimeFormat(undefined, options);
      return datetimeformat.format(date);
    },

    getContentTemplate: function(modname) {
      var getimport = document.querySelector('#' + modname + '-tpl');
      return getimport.import.querySelector('body').innerHTML;
    },

    getHTML: function(template, obj) {
      var templateTmp = template;
      Object.getOwnPropertyNames(obj).forEach(function (key) {
        var regex = new RegExp('{{' + key + '}}', 'ig');
        templateTmp = templateTmp.replace(regex, obj[key]);
      });
      return templateTmp;
    },

    callAjax: function(url, data, callback) {
      var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
          if(callback)
            callback(xmlhttp.responseText);
      };
      xmlhttp.open('POST', url, true);
      xmlhttp.send(data);
    },

    jsonp: function(url, callback) {
      var callbackname = 'jsonp_callback_' + Math.round(100000 * Math.random());
      window[callbackname] = function(data) {
          delete window[callbackname];
          document.body.removeChild(script);
          callback(data);
      };
      var script = document.createElement('script');
      script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackname;
      document.body.appendChild(script);
    }
  };
}());
/***********
 * COREJS
 **********/
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
/***********
 * MODULES
 **********/
var Mod = (function () {

  return {
    //component: function() { return 'homepage'; },
    name: function () { return 'mod'; },

    init: function () {
      console.debug('Call init method from ' + Mod.name());
      UtilMod.jsonp(Constants.remsURL, Mod.show);
      /*
      UtilMod.callAjax(Constants.remsURL, '', function(data) {
        console.log(data);
      });
      */
      //UtilMod.getListData('rems', Mod.show);
    },

    show: function (snapshot) {

      var tpl = UtilMod.getContentTemplate(Mod.name());
      var parent = document.querySelector('#container section');

      var textHTML = '';

      //snapshot.forEach(function (item) {
      //  var item = item.val();
      for (var key in snapshot) {
        var item = snapshot[key];
        item.date_added = UtilMod.formatDate(item.date_added);
        textHTML += UtilMod.getHTML(tpl, item);
      }
      console.log(textHTML.toDOM());

      parent.appendChild(textHTML.toDOM());
    }
  };
}());

CoreMod.registerModule(Mod);

var Mod2 = (function () {

  return {

    component: function() { return 'homepage'; },
    name: function () { return 'mod2'; },
    init: function () {
      console.debug('Call init method from ' + Mod2.name());
    }
  };
}());

CoreMod.registerModule(Mod2);
