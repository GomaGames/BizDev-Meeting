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
  },
  timeBonus: function () {
    var game = getCurrentGame();
    if(!game){
      return;
    }
    var timeBonus;
    if( game.result === true ){
      timeBonus = Math.floor(Number(game.endTime - TimeSync.serverTime(moment()) - TimeSync.serverOffset())/5);
      Session.set('timeBonus', timeBonus);
    }
    return timeBonus;
  },
  actionBonus: function () {
    var game = getCurrentGame();
    if(!game){
      return;
    }
    var actionBonus;

    if( game.result === true ){
      actionBonus = Math.round(100000 * ( ( game.goal - game.actionCounter ) / game.goal ));
      Session.set('actionBonus', actionBonus);
    }
    return actionBonus;
  },
  profit: function () {
    var game = getCurrentGame();
    if(!game){
      return;
    }

    return Session.get('actionBonus') + Session.get('timeBonus');
  }
});
