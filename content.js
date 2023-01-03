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

function getSelectedSkills($) {
  var selectedSkills = [];
  var skillCheckboxes = $('[type=checkbox]');
  for (let i = 0; i < skillCheckboxes.length; i++) {
    selectedSkills.push(skillCheckboxes[i].checked);
  }
  return selectedSkills;
}

function setSelectedSkills($, selectedSkills) {
  var skillCheckboxes = $('[type=checkbox]');
  for (let i = 0; i < skillCheckboxes.length; i++) {
    if (skillCheckboxes[i].checked !== selectedSkills[i]) {
      skillCheckboxes[i].click();
    }
  }
}

function getModSettings($) {
  var modSettings = [];
  var modLabels = $('.modLabel');
  for (let i = 0; i < modLabels.length; i++) {
    modSettings.push(modLabels[i].value);
  }
  return modSettings;
}

function setModSettings($, modSettings) {
  var modSettingDict = {
    "0": "modIgnored",
    "1": "modEnabled",
    "2": "modDisabled"
  };

  var modButtons = $('.modBtn');
  var modLabels = $('.modLabel');
  for (let i = 0; i < modButtons.length; i++) {
    // for the buttons:
    var modButton = $(modButtons[i]);
    // clear current setting
    modButton.removeClass('modIgnored modEnabled modDisabled');
    // set saved setting
    modButton.addClass(modSettingDict[modSettings[i]]);

    // for the labels:
    var modLabel = modLabels[i];
    modLabel.value = modSettings[i];
  }
}

function saveSettingsToLocalStorage($) {
  var skillIntervals = getSkillIntervals($);
  var selectedSkills = getSelectedSkills($);
  var modSettings = getModSettings($);

  browser.storage.local.set({skillIntervals, selectedSkills, modSettings});
}

function loadSettingsFromLocalStorage($) {
  browser.storage.local.get().then((value) => {
    if ('skillIntervals' in value) {
      setSkillIntervals($, value.skillIntervals);
    } else {
      alert('Skill intervals have not been saved to local.');
    }
    if ('selectedSkills' in value) {
      setSelectedSkills($, value.selectedSkills);
    } else {
      alert('Skill selection has not been saved to local.');
    }
    if ('modSettings' in value) {
      setModSettings($, value.modSettings);
    } else {
      alert('Mod settings have not been saved to local.');
    }
  }, (reason) => {
    console.error(reason);
  });
}

function addLocalButtons($) {
  // get trainingWrap div from document body
  var trainingWrap = $('div#trainingWrap');

  // create new div to contain local buttons
  var localButtonDiv = $('<div id="local-buttons"></div>');

  // create the save button element
  var saveToLocalButton = document.createElement('button');
  saveToLocalButton.innerHTML = 'Save settings to local';
  saveToLocalButton.id = 'save-button';
  saveToLocalButton.addEventListener('click', () => {saveSettingsToLocalStorage($)});

  // create the load button element
  var loadFromLocalButton = document.createElement('button');
  loadFromLocalButton.innerHTML = 'Load settings from local';
  loadFromLocalButton.id = 'load-button';
  loadFromLocalButton.addEventListener('click', () => {loadSettingsFromLocalStorage($)});

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

function getDirectLinkCellTextFromCellText(cellText) {
  const regex = /http:\/\/osu.ppy.sh\/b\/(\d+)/;
  var match = cellText.match(regex);
  if (match) {
    return `<b><a href="osu://${match[1]}">[DIRECT]</a></b> ${cellText}`;
  } else {
    console.debug(`No match found for cell text: ${cellText}`);
  }
}

function addDirectLinkButtons() {
  // change values in 'Map' column
  var tableRows = document.querySelector('table').rows;

  // change only if there are maps in the table
  //  this is the case when there are more than 2 rows in the table
  if (tableRows.length > 2) {
    for (let i = 1; i < tableRows.length; i++) {
      var cellInMapColumn = tableRows[i].cells[0];
      cellInMapColumn.innerHTML = getDirectLinkCellTextFromCellText(cellInMapColumn.innerHTML);
    }
  }
}

// want to run addDirectLinkButtons after the table changes
var table = document.querySelector('table tbody');
var observer = new MutationObserver(() => {addDirectLinkButtons();});
observer.observe(table, {childList: true});