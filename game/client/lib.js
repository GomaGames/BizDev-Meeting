generateAccessCode = function generateAccessCode(){
  var code = "";
  var possible = "abc";

    for(var i=0; i < 3; i++){
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return code;
};

generateNewGame = function generateNewGame(){
  var game = {
    accessCode: generateAccessCode(),
    state: "waitingForPlayers",
    lengthInMinutes: 0.1,
    endTime: null,
    result: false
  };

  var gameID = Games.insert(game);
  game = Games.findOne(gameID);

  return game;
};

generateNewPlayer = function generateNewPlayer(game, name){
  var player = {
    gameID: game._id,
    name: name
  };

  var playerID = Players.insert(player);

  return Players.findOne(playerID);
};

leaveGame = function leaveGame () {
  var player = getCurrentPlayer();

  Session.set("currentView", "startMenu");
  Players.remove(player._id);

  Session.set("playerID", null);
  Session.set("gameID", null);
};

getCurrentGame = function getCurrentGame(){
  var gameID = Session.get("gameID");

  if (gameID) {
    return Games.findOne(gameID);
  }
};

getCurrentPlayer = function getCurrentPlayer(){
  var playerID = Session.get("playerID");

  if (playerID) {
    return Players.findOne(playerID);
  }
};

getGameResult = function getGameResult() {
  var game = getCurrentGame();

  return game.result;
};

resetUserState = function resetUserState(){
  var player = getCurrentPlayer();

  if (player){
    Players.remove(player._id);
  }

  Session.set("gameID", null);
  Session.set("playerID", null);
  Session.set("time", null);
};

getTimeRemaining = function getTimeRemaining(){
  var game = getCurrentGame();
  if(!game){
    return;
  }
  var localEndTime = game.endTime - TimeSync.serverOffset();
  var timeRemaining = localEndTime - Session.get('time');

  if (timeRemaining < 0) {
    timeRemaining = 0;
  }

  return timeRemaining;
};
