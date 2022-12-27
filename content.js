console.debug('osu!Skills helper');

function getSkillIntervals($) {
  var skillIntervals = {};
  ['.min', '.max'].forEach((el) => {
    var trainingIntervalInput = $(el);
    var skillInterval = [];
    for (let i = 0; i < trainingIntervalInput.length; i++) {
      skillInterval.push(trainingIntervalInput[i].value);
    }
    skillIntervals[el] = skillInterval;
  });
  return skillIntervals;
}

function setSkillIntervals($, localSkillIntervals) {
  ['.min', '.max'].forEach((el) => {
    var trainingIntervalInput = $(el);
    var skillInterval = localSkillIntervals[el];
    for (let i = 0; i < trainingIntervalInput.length; i++) {
      trainingIntervalInput[i].value = skillInterval[i];
    }
    trainingIntervalInput.trigger('change');
  });
}

function saveSkillIntervalsToLocalStorage($) {
  var skillIntervals = getSkillIntervals($);

  browser.storage.local.set({skillIntervals});
}

function loadSkillIntervalsFromLocalStorage($) {
  browser.storage.local.get('skillIntervals').then((value) => {
    if ('skillIntervals' in value) {
      setSkillIntervals($, value.skillIntervals);
    } else {
      alert('No skills have been saved to local.')
    }
  }, (reason) => {
    console.error(reason);
  });
}

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
