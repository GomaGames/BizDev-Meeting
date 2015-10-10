generateAccessCode = function generateAccessCode(){
  var code = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";

    for(var i=0; i < 6; i++){
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return code;
}

generateNewGame = function generateNewGame(){
  var game = {
    accessCode: generateAccessCode(),
    state: "waitingForPlayers",
    location: null,
    lengthInMinutes: 8,
    endTime: null,
    paused: false,
    pausedTime: null
  };

  var gameID = Games.insert(game);
  game = Games.findOne(gameID);

  return game;
}

generateNewPlayer = function generateNewPlayer(game, name){
  var player = {
    gameID: game._id,
    name: name,
    role: null,
    isSpy: false,
    isFirstPlayer: false
  };

  var playerID = Players.insert(player);

  return Players.findOne(playerID);
}

leaveGame = function leaveGame () {
  var player = getCurrentPlayer();

  Session.set("currentView", "startMenu");
  Players.remove(player._id);

  Session.set("playerID", null);
}

getCurrentGame = function getCurrentGame(){
  var gameID = Session.get("gameID");

  if (gameID) {
    return Games.findOne(gameID);
  }
}

getAccessLink = function getAccessLink(){
  var game = getCurrentGame();

  if (!game){
    return;
  }

  return Meteor.settings.public.url + game.accessCode + "/";
}

getCurrentPlayer = function getCurrentPlayer(){
  var playerID = Session.get("playerID");

  if (playerID) {
    return Players.findOne(playerID);
  }
}

resetUserState = function resetUserState(){
  var player = getCurrentPlayer();

  if (player){
    Players.remove(player._id);
  }

  Session.set("gameID", null);
  Session.set("playerID", null);
}
