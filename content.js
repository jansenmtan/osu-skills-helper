console.debug('osu!Skills helper');

function addLocalButtons($) {
  // get trainingWrap div from document body
  var trainingWrap = $('div#trainingWrap');

  // create new div to contain local buttons
  var localButtonDiv = $('<div id="localButtons"></div>');

  // create local buttons
  var saveToLocalButton = $('<button id="saveToLocal">Save skills to local</button>');
  var loadFromLocalButton = $('<button id="loadFromLocal">Load skills from local</button>');

  // add local buttons to new div
  localButtonDiv.append(saveToLocalButton);
  localButtonDiv.append(loadFromLocalButton);

  // insert new div as first object in trainingWrap div
  trainingWrap.prepend(localButtonDiv);
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    var $ = window.wrappedJSObject.jQuery;

    // add local buttons
    addLocalButtons($);
  }
};
