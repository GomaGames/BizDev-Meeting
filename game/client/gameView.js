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
  },
  actionTiles: function() {
    return Template.instance().actionTiles.get();
  }
});
