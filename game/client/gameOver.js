Template.gameOver.rendered = function( event ) {

};

Template.gameOver.events({
  'click .btn-back': function () {
    resetUserState();
    Session.set("currentView", "startMenu");
    Session.set("gameID", null);
    Session.set("time", null);
    return false;
  }
});

Template.gameOver.helpers({
  gameResult: function () {
    var gameResult = getGameResult();

    return gameResult;
  }
});
