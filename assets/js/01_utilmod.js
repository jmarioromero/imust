var Constants = {
  baseURL: 'http://127.0.0.1:51792/imusttodo/',
  remsURL: 'https://incandescent-inferno-4098.firebaseio.com/rems.json'
};

String.prototype.toDOM = function() {
  var elm = document.createElement('div'),
      docfrag = document.createDocumentFragment();
  elm.innerHTML = this;
  while ((child = elm.firstChild))
    docfrag.appendChild(child);
  return docfrag;
};

Object.prototype.loop = function(callback) {
  var obj = this,
      key = false
      item = false;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if(callback) {
        item = obj[key];
        item['key'] = key;
        callback(item);
      }
    }
  }
};

HTMLElement.prototype.appendFirst = function(childnode){
  if(this.firstChild)
    this.insertBefore(childnode, this.firstChild);
  else
    this.appendChild(childnode);
};

var UtilMod = (function(d) {
  return {

    push: function(data, callback) {
      data['date_added'] = data['date_modified'] = UtilMod.getTime();
      data = UtilMod.jsonStringify(data);
      UtilMod.callAjax(Constants.remsURL, data, function(data) {
        data = JSON.parse(data);
        if(callback)
          callback(data.name);
      });
    },

    getTime: function() {
      return (new Date()).getTime();
    },

    cleanInputs: function(parent) {
      (parent.childNodes).loop(function(elm) {
        var type = (elm.type + '').toLowerCase();
        switch (type) {
          case 'text':
          case 'password':
          case 'textarea':
            elm.value = '';
            break;
          case 'radio':
          case 'checkbox':
            if (elm.checked)
              elm.checked = false;
            break;
          case 'select-one':
          case 'select-multi':
            elm.selectedIndex = -1;
            break;
          default:
            break;
        }
      });
    },

    getFormData: function(selector, asstring) {
      var data = {};
      var form = d.querySelector(selector);
      if(form) {
        (form.childNodes).loop(function(elm) {
          if(elm.name)
            data[elm.name] = elm.value;
        });
        data['date_added'] = data['date_modified'] = UtilMod.getTime();
      }
      return asstring ? UtilMod.jsonStringify(data) : data;
    },

    addEvent: function(elm, event, callback) {
      elm.addEventListener(event, function(evt) {
        if(callback)
          callback();
        var evt = evt ? evt : window.event;
        if(evt.preventDefault)
          evt.preventDefault();
        evt.returnValue = false;
        return false;
      });
    },

    jsonStringify: function(jsonobj, printlog, space) {
      var jsonstr = JSON.stringify(jsonobj, null, space || 2);
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

    callAjax: function(url, data, callback, method) {
      var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
          if(callback)
            callback(xmlhttp.responseText);
      };
      xmlhttp.open(method || 'POST', url, true);
      xmlhttp.send(data);
    },

    jsonp: function(url, callback) {
      var callbackname = 'jsonp_callback_' + Math.round(100000 * Math.random());
      window[callbackname] = function(data) {
          delete window[callbackname];
          d.body.removeChild(script);
          callback(data);
      };
      var script = d.createElement('script');
      script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackname;
      d.body.appendChild(script);
    }
  };
}(document));