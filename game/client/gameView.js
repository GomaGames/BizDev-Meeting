Template.gameView.rendered = function( event ) {
  var timeRemaining = getTimeRemaining();

  Meteor.setTimeout(function () {
    Session.set('currentView', 'gameOver');
  }, timeRemaining + 100 );
};

Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 1000);


Template.gameView.events({
  'click .btn-back': function () {
    resetUserState();
    Session.set("currentView", "startMenu");
    return false;
  }
});

Template.gameView.helpers({
  timeRemaining: function () {
    var timeRemaining = getTimeRemaining();

    return moment(timeRemaining).format('mm:ss');
  },
  gameFinished: function () {
    var timeRemaining = getTimeRemaining();

    return timeRemaining === 0;
  }
});
