generateCompany = function generateCompany(){
  var code = "";
  var name = "";

  var possibleNames = [
    "Hooli", "Magnetix", "Ubee", "Snoogle", "Globatek",
    "Pro", "Conglomo", "Bi-Tel", "Tri-Tel", "Edjy",
    "Egiee", "Loonr", "Espressr", "Bottlr", "Armr",
    "Clothr", "Bordr", "Fillr", "Huggr", "Entr",
    "Filltr", "Tickr", "Accessr", "Cookr", "Instoogle",
    "Instaface", "Instabook", "iSocial", "FriendFace", "FaceFriend",
    "InstaFriend", "FaceBookBook", "PaceBook", "Bittr", "Sour",
    "Trendr", "IfyIfy", "Trendify", "Bookify", "Friendify",
    "Butt.fm", "Cloudify", "Cloudio", "HashTagIfy", "Changify",
    "Seenit", "Promisly", "FriendFacely", "iMergr", "iBurgr"
  ];

  var taken = Games.find().fetch().map(function(game){
    return game.accessCode;
  });

  do{
    // get 3-4 upper case letters
    name = possibleNames[ Math.floor( Math.random()*possibleNames.length ) ];
    do{
      name += " "+possibleNames[ Math.floor( Math.random()*possibleNames.length ) ];
    } while(
      name.split('').filter(function(chars){
        return chars.charCodeAt(0) > 64 && chars.charCodeAt(0) < 91; // uppercase letters
      }).length < 3
    );
    code = name.split('').filter(function(chars){
      return chars.charCodeAt(0) > 64 && chars.charCodeAt(0) < 91; // uppercase letters
    }).join('').toLowerCase();
  } while(taken.indexOf(code) > -1); // make sure does not exist

  return {
    code : code,
    name : name
  };

};

generateNewGame = function generateNewGame(){
  var company = generateCompany();
  var game = {
    accessCode: company.code,
    companyName: company.name,
    state: "waitingForPlayers",
    lengthInMinutes: 10.12,
    endTime: null,
    startTime: null,
    goal: null,
    progress: 0,
    result: false,
    status: null
  };

  var gameID = Games.insert(game);
  game = Games.findOne(gameID);

  return game;
};

generateNewPlayer = function generateNewPlayer(game, name){
  var player = {
    gameID: game._id,
    name: name,
    actionTiles: [],
    assignedInstruction: null
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

/*
getCurrentGameAllTiles = function getCurrentGameAllTiles(){
  return Players.find({gameID : getCurrentGame()._id}).fetch().reduce(function(p,c){
    return p.concat(c.actionTiles);
  },[]);
};
*/

getCurrentGameAllTilesExcept = function getCurrentGameAllNotMyTiles( playerID ){
  return Players.find({gameID : getCurrentGame()._id, _id : { $ne : playerID }}).fetch().reduce(function(p,c){
    return p.concat(c.actionTiles);
  },[]);
};

getGameResult = function getGameResult() {
  var game = getCurrentGame();
  if(!game){
    return;
  }
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

getGameTimer = function getGameTimer(){
  var game = getCurrentGame();
  if(!game){
    return;
  }
  var timeCount = Session.get('time') - TimeSync.serverOffset() - game.startTime;

  if (timeCount < 0) {
    timeCount = 0;
  }

  return timeCount;
};

getTotalTime = function getTotalTime(){
  var game = getCurrentGame();
  if(!game){
    return;
  }
  var time = Session.get('time');
  var localEndTime = game.endTime - game.startTime - TimeSync.serverOffset();
  return localEndTime;
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

setGameGoal = function setGameGoal(){
  var game = getCurrentGame();
  var players = Players.find({gameID : game._id}).fetch();

  Games.update(game._id, { $set : { goal : players.reduce(function(p,c){
    return p + Math.round( (Math.random() * 10) + 10 );
  }, 0) }});
};

gameOver = function gameOver() {
  Session.set('currentView', 'gameOver');
};

performAction = function performAction( label, title ) {
  var game = getCurrentGame();

  // evaluate if progress was made
  // does some player have this as instruction?

  var playerHasInstruction = Players.find({gameID : getCurrentGame()._id}).fetch().reduce(function(foundPlayer, player){
    return foundPlayer || (player.assignedInstruction.title === title && player.assignedInstruction.correctOption === label ) ? player : false;
  }, false);

  if(playerHasInstruction){
    // tell the player with that instruction to get a new randomAssignment
    Players.update(playerHasInstruction._id, { $set : { assignedInstruction : getRandomAssignment( playerHasInstruction._id ) } });

    // increase progress
    game.progress++;
    Games.update( game._id, { $set : { progress : game.progress, gameResult : game.progress >= game.goal } } );

  }else{
    // decrease progress?
    Games.update( game._id, { $set : { progress : game.progress-1, status : getCurrentPlayer().name + " added to the scope!" } } );
  }

};

/*
 * Get a random assignment using all the available tiles that are on peoples screen
 */
getRandomAssignment = function getRandomAssignment(playerID){
  var gameTiles = getCurrentGameAllTilesExcept(playerID);
  var randomTile = gameTiles[ Math.floor( Math.random()*gameTiles.length ) ];
  var randomOption = randomTile.options[ Math.floor( Math.random()*randomTile.options.length ) ];
  return {
    title : randomTile.title,
    text : randomTile.instruction.replace("[label]", randomOption.label),
    correctOption : randomOption.label
  };
};
