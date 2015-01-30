var Constants = {
  baseURL: 'http://127.0.0.1:51792/imusttodo/',
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

    getHTML: function(template, obj) {
      var templateTmp = template;
      Object.getOwnPropertyNames(obj).forEach(function (key) {
        var regex = new RegExp('{{' + key + '}}', 'ig');
        templateTmp = templateTmp.replace(regex, obj[key]);
      });
      return templateTmp;
    },

    callAjax: function(url, data, callback) {
      var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
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