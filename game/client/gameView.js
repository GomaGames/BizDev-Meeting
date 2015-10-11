function getRandomTiles(amount, cb){
  amount = amount || 1;

  Meteor.call("getActionTiles",function(err, actionTiles){
    cb(
      new Array(amount).fill().map(function(c,i,a){
        return actionTiles[i]; // not random yet!
      })
    );
  });
}


Template.gameView.created = function( event ) {
  var self = this;

  this.actionTiles = new ReactiveVar([]);
  // get first set of action tiles
  getRandomTiles(4, function(actionTiles){
    self.actionTiles.set(actionTiles);
  });
};

Template.gameView.rendered = function( event ) {
  var timeRemaining = getTimeRemaining();
};

Meteor.setInterval(function () {
  Session.set('time', new Date());
  var game = getCurrentGame();
  if( game != null ){
    var timeRemaining = getTimeRemaining();

    if( timeRemaining <= 0 && game.startTime != null ){
      gameOver();
    };
    if( game.progress >= game.goal && game.goal != null ){
      Games.update(game._id, { $set: { result: true }});
      Session.set('time', null);
      gameOver();
    };
  }

}, 1000);


Template.gameView.events({
  'click .btn-back': function () {
    resetUserState();
    Session.set("currentView", "startMenu");
    return false;
  },
  'click #btn-progression': function () {
    var game = getCurrentGame();
    console.log('goal',game.goal);
    Games.update(game._id, { $set: { progress: game.progress+1 }});

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
  },
  actionTiles: function() {
    return Template.instance().actionTiles.get();
  },
  deadlineBar: function () {
    var deadlineBarValue = new ReactiveVar(0);
    var currentTime = getGameTimer();
    var totalTime = getTotalTime();
    var progress = Math.floor((currentTime / totalTime) * 100);
    deadlineBarValue.set(progress);
    return deadlineBarValue.get();
  },
  getProgress: function() {
    return getProgress();
  }
});