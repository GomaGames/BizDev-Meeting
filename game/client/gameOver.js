Template.gameOver.rendered = function( event ) {

};

Template.gameOver.events({
  'click .btn-back': function () {
    resetUserState();
    Session.set("currentView", "startMenu");
    return false;
  }
});

Template.gameOver.helpers({
  gameResult: function () {
    var gameResult = getGameResult();
    
    return gameResult;
  }
});
