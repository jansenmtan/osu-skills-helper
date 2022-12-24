document.addEventListener("DOMContentLoaded", function() {
  var $ = window.jQuery;

  // select the input elements using jQuery
  var inputMin = $('.trainingIntervalInput.min');
  var inputMax = $('.trainingIntervalInput.max');

  // modify the value of the input elements
  inputMin.val('500');
  inputMax.val('1500');

  // trigger the change event on the input elements
  inputMin.trigger('change');
  inputMax.trigger('change');
});
