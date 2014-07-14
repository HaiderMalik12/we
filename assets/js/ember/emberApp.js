/** Copyright 2014, Alberto Souza
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

// starts we.js lib
// TODO move this to amber logic

define('emberApp',[
  'we',
  'moment',
  'ember',
  'weEmberPlugin',
  'sails.io'
], function (we, moment) {
  var get = Ember.get;
  var set = Ember.set;

  we.hooks.on("emberjs-configure-app",function(data, next){

    // hide ember mandaory erros
    Ember.MANDATORY_SETTER_FUNCTION = function(){};


    // configure moment.js
    moment.lang(we.config.language);

    // set socket for ember-sails-adapter
    window.socket = we.io.socket;

    App.Router.reopen({
      location: 'history'
    });

    // save current user in App.currentUser
    App.currentUser = Ember.Object.create(we.authenticatedUser,{
      shareWithOptions: [],
      init: function(){
        this.loadShareWithOptions();
      },
      loadShareWithOptions: function(){
        var _this = this;
        var userId = this.get('id');
        if(!userId){
          return;
        }

        $.ajax({
          type: 'GET',
          url: '/user/'+userId+'/contacts-name',
          cache: false,
          dataType: 'json',
          contentType: 'application/json'
        })
        .done(function success(data){
          if(data.length){
            _this.set('shareWithOptions', data);
          }
        })
        .fail(function error(data){
          console.error('Error on get share with list', data);
        });
      }
    });

    next();
  });

  we.hooks.on("emberjs-map-routes",function(data, next){
    // Map app routers
    App.Router.map(function(match) {
      var thisPointer = this;
      this.resource('home',{path: '/'});
      // auth
      this.route('authForgotPassword',{path: '/auth/forgot-password'});
      this.route('authResetPassword',{path: '/auth/reset-password'});
      // 404 pages
      this.route("unknown", { path: "*path"});
    });
    next();
  });
});
