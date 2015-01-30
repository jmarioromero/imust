var RemsMod = (function() {

  var HTMLTpl = {
    show:
      '\
        <section class="mod-item">\
          <article>\
            <h2>{{title}}</h2>\
            <p>{{content}}</p>\
            <em>< {{date_added}} ></em>\
          </article>\
        </section>\
      '
  };

  return {
    //component: function() { return 'homepage'; },
    name: function() { return 'remsmod'; },

    init: function() {
      console.debug('Call init method from ' + RemsMod.name());

      RemsMod.show(HTMLTpl.show);
      /*
      UtilMod.callAjax(Constants.remsURL, '', function(data) {
        console.log(data);
      });
      */
    },

    show: function(tpl) {

      UtilMod.jsonp(Constants.remsURL, function(snapshot) {

        var parent = document.querySelector('#container section');
        var textHTML = '', item = false;

        for (var key in snapshot) {
          item = snapshot[key];
          item.date_added = UtilMod.formatDate(item.date_added);
          textHTML += UtilMod.getHTML(tpl, item);
        }

        parent.appendChild(textHTML.toDOM());
      });
    }
  };
}());
CoreMod.registerModule(RemsMod);