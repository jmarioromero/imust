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

var Constants={baseURL:"http://127.0.0.1:51792/imusttodo/",remsURL:"https://incandescent-inferno-4098.firebaseio.com/rems.json"};String.prototype.toDOM=function(){var e=document.createElement("div"),t=document.createDocumentFragment();e.innerHTML=this;while(child=e.firstChild)t.appendChild(child);return t};var UtilMod=function(){return{jsonStringify:function(e,t){var n=JSON.stringify(e,null,2);if(t)console.log(n);return n},getParamURL:function(e){var t=new RegExp("[?&]"+e+"=([^&]*)(&?)","i");var n=location.search.match(t);return n?n[1]||false:false},formatDate:function(e){var t={month:"short",day:"2-digit",year:"numeric"};var n=new Date(e);var r=new Intl.DateTimeFormat(undefined,t);return r.format(n)},getHTML:function(e,t){var n=e;Object.getOwnPropertyNames(t).forEach(function(e){var r=new RegExp("{{"+e+"}}","ig");n=n.replace(r,t[e])});return n},callAjax:function(e,t,n){var r=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");r.onreadystatechange=function(){if(r.readyState==4&&r.status==200)if(n)n(r.responseText)};r.open("POST",e,true);r.send(t)},jsonp:function(e,t){var n="jsonp_callback_"+Math.round(1e5*Math.random());window[n]=function(e){delete window[n];document.body.removeChild(r);t(e)};var r=document.createElement("script");r.src=e+(e.indexOf("?")>=0?"&":"?")+"callback="+n;document.body.appendChild(r)}}}();var CoreMod=function(){var e={};return{registerModule:function(t){if(!t.hasOwnProperty("name")){console.error("Should establish a name to the module.");return}var n=t.hasOwnProperty("component")?t.component():"default";var r=e[n]||{};r[t.name()]=t;e[n]=r},init:function(){window.onload=function(){CoreMod.load()}},load:function(){console.debug("excecute method load in CoreJS!");var t=UtilMod.getParamURL("cmp")||"default";if(Object.keys(e).length){var n=e[t]||{};if(Object.keys(n).length){for(var r in n){var i=n[r];if(i.hasOwnProperty("init"))i.init();else console.error(i.name()+" module haven't 'init()' method.")}}else console.debug("There aren't modules registered in "+t)}else console.debug("There aren't components registered!")}}}();CoreMod.init();var RemsMod=function(){var e={show:'        <section class="mod-item">          <article>            <h2>{{title}}</h2>            <p>{{content}}</p>            <em>< {{date_added}} ></em>          </article>        </section>      '};return{name:function(){return"remsmod"},init:function(){console.debug("Call init method from "+RemsMod.name());RemsMod.show(e.show)},show:function(e){UtilMod.jsonp(Constants.remsURL,function(t){var n=document.querySelector("#container section");var r="",i=false;for(var s in t){i=t[s];i.date_added=UtilMod.formatDate(i.date_added);r+=UtilMod.getHTML(e,i)}n.appendChild(r.toDOM())})}}}();CoreMod.registerModule(RemsMod);var Mod2=function(){return{component:function(){return"homepage"},name:function(){return"mod2"},init:function(){console.debug("Call init method from "+Mod2.name())}}}();CoreMod.registerModule(Mod2)