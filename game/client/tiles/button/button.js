Template.button.created = function() {
  this.options = this.data.options;
};

Template.button.events({
  'click .action' : function(){
    performAction( this.label, Template.parentData(2).data.title );
  }
});

Template.button.helpers({
  buttonLayout: function() {
    var options = Template.instance().options;
    if (options.length > 3) {
      return 'wrap';
    }
    return 'column';
  }
});
