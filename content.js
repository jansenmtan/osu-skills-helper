console.debug('osu!Skills helper');
document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    var $ = window.wrappedJSObject.jQuery;
  
    // select the input elements using jQuery
    var inputMin = $('.trainingIntervalInput.min');
    var inputMax = $('.trainingIntervalInput.max');
  
    // modify the value of the input elements and trigger their change event
    inputMin.val('500');
    inputMin.trigger('change');
    inputMax.val('1500');
    inputMax.trigger('change');
  }
};
