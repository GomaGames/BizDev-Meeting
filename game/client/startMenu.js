Template.startMenu.events({
  'click #btn-new-meeting': function () {
    Session.set("currentView", "createMeeting");
  },
  'click #btn-join-meeting': function () {
    Session.set("currentView", "joinMeeting");
  },
  'click .btn-to-home': function () {
    Session.set("currentView", "startMenu");
  }
});

Template.startMenu.helpers({

});

Template.startMenu.rendered = function () {
  resetUserState();
};
