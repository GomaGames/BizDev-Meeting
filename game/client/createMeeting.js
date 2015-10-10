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
