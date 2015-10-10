Template.joinMeeting.events({
  'submit #join-meeting': function (event) {
    var accessCode = event.target.accessCode.value;
    var playerName = event.target.playerName.value;

    if (!playerName) {
      return false;
    }

    accessCode = accessCode.trim();
    accessCode = accessCode.toLowerCase();

    Session.set("loading", true);

    Meteor.subscribe('games', accessCode, function onReady(){
      Session.set("loading", false);

      var game = Games.findOne({
        accessCode: accessCode
      });

      if (game) {
        Meteor.subscribe('players', game._id);
        player = generateNewPlayer(game, playerName);

        Session.set("gameID", game._id);
        Session.set("playerID", player._id);
        Session.set("currentView", "lobby");
      } else {
        FlashMessages.sendError("Invalid Room Number");
      }
    });

    return false;
  },
  'click .btn-back': function () {
    Session.set("currentView", "startMenu");
    return false;
  }
});

Template.joinMeeting.helpers({
  isLoading: function() {
    return Session.get('loading');
  }
});


Template.joinMeeting.rendered = function (event) {
  resetUserState();
  $("#access-code").focus();
};
