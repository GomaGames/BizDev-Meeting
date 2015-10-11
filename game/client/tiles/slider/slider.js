Template.slider.events({
  'click .action': function() {
    performAction( this.label, Template.parentData(2).data.title );
  },
  'change .range-slider': function(event) {
     var sliderValue = event.currentTarget.value
     Session.set('sliderValue', sliderValue)
  }
});

Template.slider.helpers({
  current: function() {
    var currentValue = Session.get('sliderValue') || 1;
    return currentValue;
  }
});
