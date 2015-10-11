Template.button.events({
  'click .action' : function(){
    performAction( this.label, Template.parentData(2).data.title );
  }
});
