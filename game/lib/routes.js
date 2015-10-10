Router.route('/', function () {
  this.render('main');
  Session.set("currentView", "startMenu");
});
