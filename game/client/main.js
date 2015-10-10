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
