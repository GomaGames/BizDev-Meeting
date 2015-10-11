Template.slider.created = function() {
  this.sliderValue = new ReactiveVar(1);
};

Template.slider.events({
  'click .action': function() {
    performAction( this.label, Template.parentData(2).data.title );
  },
  'change .range-slider': function(event) {
     var sliderValue = event.currentTarget.value;
     Template.instance().sliderValue.set(sliderValue);
  }
});

Template.slider.helpers({
  current: function() {
    var currentValue = Template.instance().sliderValue.get();
    return currentValue;
  }
});
