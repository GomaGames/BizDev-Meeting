Template.slider.created = function() {
  this.options = this.data.options;
  this.sliderValue = new ReactiveVar(this.options[0].label);
};

Template.slider.events({
  'click .action': function() {
    performAction( this.label, Template.parentData(2).data.title );
  },
  'change .range-slider': function(event) {
     var sliderValue = event.currentTarget.value;
     Template.instance().sliderValue.set(Template.instance().options[sliderValue - 1].label);
  }
});

Template.slider.helpers({
  current: function() {
    var currentValue = Template.instance().sliderValue.get();
    return currentValue;
  }
});
