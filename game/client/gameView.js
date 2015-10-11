var allActionTiles = null;

function getActionTiles(cb){
  if( allActionTiles === null ){
    Meteor.call("getActionTiles",function(err, result){
      if(err) throw new Error("Error getting actionTiles: "+ err);
      allActionTiles = result;
      cb(allActionTiles);
    });
  }else{
    cb(allActionTiles);
  }
}

function getRandomTiles(amount){
  amount = amount || 1;
  // make sure to not use tiles that are already used
  var tiles = [];
  var usedTiles = Players.find({gameID:getCurrentGame()._id}).fetch().reduce(function(usedTiles, player){
    return usedTiles.concat(player.actionTiles);
  }, []);

  while(tiles.length < amount){
    var randomTile = allActionTiles[ Math.floor(Math.random()*allActionTiles.length) ];
    if( !usedTiles.filter(function(tile){ return tile.title === randomTile.title; }).length ){
      usedTiles.push(randomTile);
      tiles.push(randomTile);
    }
  }

  return tiles;
}



Template.gameView.created = function( event ) {
  var player = getCurrentPlayer();
  var self = this;
  this.actionTiles = new ReactiveVar([]);

  getActionTiles(function(actionTiles){
    // get first set of action tiles
    self.actionTiles.set( getRandomTiles(4) );
    // report that to db
    Players.update(player._id, { $set : { actionTiles : self.actionTiles.get() } });

    // need to wait for every player to update db with their actionTiles
     Meteor.setTimeout(function(){

      // get first assignment
      Players.update(player._id, { $set : { assignedInstruction : getRandomAssignment( player._id ) } });

    }, 2000);

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
  actionTilesLeft: function() {
    var tiles = Template.instance().actionTiles.get();
    return tiles.slice(0, (tiles.length + 1) / 2);
  },
  actionTilesRight: function() {
    var tiles = Template.instance().actionTiles.get();
    return tiles.slice((tiles.length + 1) / 2);
  },
  getAssignment: function() {
    return getCurrentPlayer().assignedInstruction;
  },
  deadlineBar: function () {
    var deadlineBarValue = new ReactiveVar(0);
    var currentTime = getGameTimer();
    var totalTime = getTotalTime();
    var progress = Math.floor(( currentTime / totalTime ) * 100 );
    deadlineBarValue.set(progress);
    return deadlineBarValue.get();
  },
  getProgress: function() {
    var game = getCurrentGame();
    if(!game){
      return;
    }
    var progress = game.progress;
    var goal = game.goal;
    var totalProgress = Math.floor( progress / goal * 100 );
    return totalProgress;
  },
  progressBar: function() {
    var game = getCurrentGame();
    if(!game){
      return;
    }
    var progress = game.progress;
    var goal = game.goal;
    var progressUnit = (20 / game.goal);
    var totalProgress = Math.floor(progressUnit * game.progress);
    return totalProgress;
  },
  flashStatus: function() {
    return getCurrentGame().status;
  }
});
