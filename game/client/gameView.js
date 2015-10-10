Template.gameView.events({
  'click .btn-back': function () {
    Session.set("currentView", "startMenu");
    return false;
  }
});