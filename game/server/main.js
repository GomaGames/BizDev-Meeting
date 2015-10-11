var actionTiles = JSON.parse(Assets.getText("actionTiles.json"));

Meteor.methods({
  getActionTiles : function(){
    return actionTiles;
  }
});

Meteor.startup(function () {
  // Delete all games and players at startup
  Games.remove({});
  Players.remove({});
});

Meteor.publish('games', function(accessCode) {
  return Games.find({"accessCode": accessCode});
});

Meteor.publish('players', function(gameID) {
  return Players.find({"gameID": gameID});
});
