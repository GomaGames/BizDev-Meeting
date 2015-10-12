Template.slider.created = function() {
  this.options = this.data.options;
  this.sliderValue = new ReactiveVar(this.options[0].label);
};

Template.slider.events({
  'click .range-slider': function(event) {
     var sliderValue = event.currentTarget.value;
     performAction( Template.instance().options[sliderValue - 1].label, Template.parentData(2).data.title );
  }
});

Template.slider.helpers({
  current: function() {
    var currentValue = Template.instance().sliderValue.get();
    return currentValue;
  }
});
