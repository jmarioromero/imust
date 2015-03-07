var RemindersMod = (function(d) {

  var HTMLTpl = {
    form:
      '\
        <div class="row">\
          <section class="col three-two" id="reminderform">\
            <h2>{{formtitle}}</h2>\
            <label>{{tlabel}}</label>\
            <input name="title" type="text" value="{{title}}">\
            <label>{{clabel}}</label>\
            <textarea name="content" >{{content}}</textarea>\
            <div class="buttons">\
              <a href="#" class="btn btn-default">{{clearbtn}}</a>\
              <a href="#" class="btn btn-success">{{savebtn}}</a>\
            </div>\
          </section>\
        </div>\
      ',
    reminderlist:
      '\
        <div class="row" id="reminderlist">\
          {{reminderlist}}\
        </div>\
      ',
    article:
      '\
        <article class="col col three-one">\
          <div class="actions">\
            <span class="edit icon-pencil" key="{{key}}"></span>\
            <span class="delete icon-cancel-circle" key="{{key}}"></span>\
          </div>\
          <div class="content">\
            <h2>{{title}}</h2>\
            <em>{{date_added}}</em>\
            <p>{{content}}</p>\
          </div>\
        </article>\
      '
  };

  return {
    //component: function() { return 'homepage'; },
    name: function() { return 'remindersmod'; },

    init: function() {
      console.debug('Call init method from ' + RemindersMod.name());
      RemindersMod.list();
    },

    bindActions: function() {
      var form = d.querySelector('#reminderform');
      var clearbtn = form.querySelector('.buttons .btn-default');
      var successbtn = form.querySelector('.buttons .btn-success');
      var list = d.querySelector('#reminderlist');
      var deletebtns = list.querySelectorAll('.delete');
      var editbtns = list.querySelectorAll('.edit');
      // Clean action
      UtilMod.addEvent(clearbtn, 'click', function() {
        UtilMod.cleanInputs(form);
      });
      // Create reminder action
      UtilMod.addEvent(successbtn, 'click', RemindersMod.create);
      // Delete reminder action
      UtilMod.addEvent(deletebtns, 'click', function(elm) {
        RemindersMod.delete(elm.getAttribute('key'));
      });
      // Edit reminder action
      UtilMod.addEvent(editbtns, 'click', function(elm) {
        RemindersMod.edit(elm.getAttribute('key'));
      });
    },

    list: function() {

      var formdata = {
        formtitle: 'Nuevo recordatorio',
        tlabel: 'Titulo',
        title: '',
        clabel: 'Contenido',
        content: '',
        clearbtn: 'Limpiar',
        savebtn: 'Guardar'
      };

      var parent = d.querySelector('div.container'),
        formHTML = UtilMod.getHTML(HTMLTpl.form, formdata),
        textHTML = '';

      parent.appendChild(formHTML.toDOM());

      UtilMod.callREST('GET', {}, function(snapshot) {

        //console.log(snapshot)

        if(snapshot) {
          snapshot.loop(function(item) {
            item.date_added = UtilMod.formatDate(item.date_added);
            textHTML += UtilMod.getHTML(HTMLTpl.article, item);
          });
        }

        listHTML = {
          reminderlist: textHTML
        };

        textHTML = UtilMod.getHTML(HTMLTpl.reminderlist, listHTML);

        parent.appendChild(textHTML.toDOM());

        RemindersMod.bindActions();
      });
    },

    create: function() {
      var data = UtilMod.getFormData('#reminderform');
      UtilMod.callREST('POST', data, function(key) {
        if(key) {
          var articles = d.querySelector('#reminderlist');
          data.date_added = UtilMod.formatDate(data.date_added);
          data['key'] = key;
          var item = UtilMod.getHTML(HTMLTpl.article, data);
          articles.appendFirst(item.toDOM());
          UtilMod.cleanInputs(d.querySelector('#reminderform'));
        }
      }, true);
    },

    delete: function(key) {
      console.log(key)
    },

    edit: function(key) {
      console.log(key)
    }
  };
}(document));
CoreMod.registerModule(RemindersMod);