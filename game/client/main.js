Template.main.helpers({
  whichView: function() {
    return Session.get('currentView');
  }
});

Template.startMenu.events({
  'click #btn-new-meeting': function () {
    Session.set("currentView", "createMeeting");
  },
  'click #btn-join-meeting': function () {
    Session.set("currentView", "joinMeeting");
  }
});

Template.startMenu.helpers({

});

Template.startMenu.rendered = function () {

};


Template.createMeeting.events({
  'submit #create-meeting': function (event) {

    var playerName = event.target.playerName.value;

    if (!playerName) {
      return false;
    }

    var game = generateNewGame();
    var player = generateNewPlayer(game, playerName);

    Meteor.subscribe('games', game.accessCode);

    Session.set("loading", true);

    Meteor.subscribe('players', game._id, function onReady(){
      Session.set("loading", false);

      Session.set("gameID", game._id);
      Session.set("playerID", player._id);
      Session.set("currentView", "lobby");
    });

    return false;
  },
  'click .btn-back': function () {
    Session.set("currentView", "startMenu");
    return false;
  }
});

Template.createMeeting.helpers({
  isLoading: function() {
    return Session.get('loading');
  }
});

Template.createMeeting.rendered = function (event) {
  $("#player-name").focus();
};

function generateAccessCode(){
  var code = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";

    for(var i=0; i < 6; i++){
      code += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return code;
}

function generateNewGame(){
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

function generateNewPlayer(game, name){
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
