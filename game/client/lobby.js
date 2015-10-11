Template.lobby.helpers({
  game: function () {
    return getCurrentGame();
  },
  accessLink: function () {
    return getAccessLink();
  },
  player: function () {
    return getCurrentPlayer();
  },
  players: function () {
    var game = getCurrentGame();
    var currentPlayer = getCurrentPlayer();

    if (!game) {
      return null;
    }

    var players = Players.find({'gameID': game._id}, {'sort': {'createdAt': 1}}).fetch();

    players.forEach(function(player){
      if (player._id === currentPlayer._id){
        player.isCurrent = true;
      }
    });

    return players;
  }
});

Template.lobby.events({
  'click .btn-leave': leaveGame,
  'click .btn-start': function () {
    var game = getCurrentGame();
    var playersCount = Players.find({gameID: game._id}).count();

    if( playersCount >= SETTINGS.MIN_PLAYERS && playersCount <= SETTINGS.MAX_PLAYERS){
      var gameLength = (Math.random()*playersCount/2) + playersCount;
      var localEndTime = moment().add(gameLength, 'minutes');
      var localStartTime = TimeSync.serverTime(moment());
      var gameEndTime = TimeSync.serverTime(localEndTime);

      Games.update(game._id, {$set: {state: 'inProgress', lengthInMinutes: gameLength, endTime: gameEndTime, startTime: localStartTime }});

      setGameGoal();
      Session.set('currentView', 'gameView');
    }
  },
  'click .btn-remove-player': function (event) {
    var playerID = $(event.currentTarget).data('player-id');
    Players.remove(playerID);
  }
});

Template.lobby.rendered = function (event) {

};

