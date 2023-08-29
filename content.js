console.debug('osu!Skills helper');

function getSettings(elements, elementProperty) {
  var settings = [];
  for (let i = 0; i < elements.length; i++) {
    settings.push(elements[i][elementProperty]);
  }
  return settings;
}

function getSkillIntervals($) {
  var skillIntervals = {};
  ['.min', '.max'].forEach((el) => {
    var trainingIntervalInput = $(el);
    var skillInterval = getSettings(trainingIntervalInput, 'value');
    skillIntervals[el] = skillInterval;
  });
  return skillIntervals;
}

function setSkillIntervals($, localSkillIntervals) {
  var sliderRanges = $('.slider-range');
  for (let i = 0; i < sliderRanges.length; i++) {
    var sliderValues = [localSkillIntervals['.min'][i], localSkillIntervals['.max'][i]];
    $(sliderRanges[i]).slider('values', sliderValues);
  }
}

function getSelectedSkills($) {
  return getSettings($('[type=checkbox]'), 'checked');
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
  return getSettings($('.modLabel'), 'value');
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

function saveProfileToLocalStorage($) {
  var profileName = $("#profile-select").val();
  var skillIntervals = getSkillIntervals($);
  var selectedSkills = getSelectedSkills($);
  var modSettings = getModSettings($);

  browser.storage.local.set({[profileName]: {skillIntervals, selectedSkills, modSettings}});
}

function loadProfileFromLocalStorage($) {
  var selectedProfile = $("#profile-select").val();
  browser.storage.local.get(selectedProfile).then((value) => {
    var profile = value[selectedProfile];
    if (profile === undefined) {
      console.error(`Can't load profile '${selectedProfile}': it is undefined.`);
      alert(`Can't load profile '${selectedProfile}'. It might not exist.`);
      return;
    }
    if ('skillIntervals' in profile) {
      setSkillIntervals($, profile.skillIntervals);
    } else {
      alert('Skill intervals have not been saved to this profile.');
    }
    if ('selectedSkills' in profile) {
      setSelectedSkills($, profile.selectedSkills);
    } else {
      alert('Skill selection has not been saved to this profile.');
    }
    if ('modSettings' in profile) {
      setModSettings($, profile.modSettings);
    } else {
      alert('Mod settings have not been saved to this profile.');
    }
  }, (reason) => {
    console.error(reason);
  });
}

function removeProfileFromLocalStorage($) {
  var selectedProfile = $("#profile-select").val();
  browser.storage.local.remove(selectedProfile).then(() => {
    $('#profile-select').find(`option[value="${selectedProfile}"]`).remove();
    $('#profile-select').trigger('change');
    $('#profile-select').select2('close');
    console.debug(`osu!Skills helper: profile '${selectedProfile}' removed.`);
  }, (reason) => {
    console.error(reason);
  });
}

function repopulateProfileSelect($) {
  var selectElement = $("#profile-select");

  selectElement.empty();
  selectElement.append(new Option()); // https://select2.org/placeholders#single-select-placeholders

  browser.storage.local.get().then((value) => {
    var profileNames = Object.keys(value);
    for (const name of profileNames) {
      var option = new Option(name, name, false, false);
      selectElement.append(option);
    }
    selectElement.trigger("change");
  }, (reason) => {
    console.error(reason);
  });
}

function addLocalDiv($) {
  // get trainingWrap div from document body
  var trainingWrap = $('div#trainingWrap');

  // create new div to contain local profile UI
  var localDiv = $('<div id="local-profile-ui"></div>');
  localDiv.css({width: '100%', maxWidth: '700px', display: 'flex'});

  // create the save button element
  var saveToLocalButton = document.createElement('button');
  saveToLocalButton.innerHTML = 'Save to profile';
  saveToLocalButton.id = 'save-button';
  saveToLocalButton.style.backgroundColor = '#fffcc6';
  saveToLocalButton.addEventListener('click', () => {
    // TODO: probably add overwrite prompt on existing profile...
    saveProfileToLocalStorage($);
  });

  // create the create new profile button element
  var createNewButton = document.createElement('button');
  createNewButton.innerHTML = 'Create new profile';
  createNewButton.id = 'create-new-button';
  createNewButton.style.backgroundColor = '#c4ffc4';
  createNewButton.addEventListener('click', () => {
    var input = prompt("New profile name:");
    if (input != null) {
      if ($('#profile-select').find(`option[value="${input}"]`).length) {
        alert(`Profile "${input}" already exists!`);
      } else {
        var option = new Option(input, input, false, true);
        $('#profile-select').append(option).trigger('change');
        $('#profile-select').select2('close');
        saveProfileToLocalStorage($);
      }
    }
  });

  // create the remove profile button element
  var removeFromLocalButton = document.createElement('button');
  removeFromLocalButton.innerHTML = 'Delete profile';
  removeFromLocalButton.id = 'remove-button';
  removeFromLocalButton.style.backgroundColor = '#ffc1c1';
  removeFromLocalButton.addEventListener('click', () => {
    removeProfileFromLocalStorage($);
  });

  // add local buttons to new div
  localDiv.append(saveToLocalButton);
  localDiv.append(createNewButton);
  localDiv.append(removeFromLocalButton);

  var selectElement = $('<select id="profile-select"></select>');
  selectElement.css({flexGrow: '1'});
  localDiv.prepend(selectElement);

  // on select, load profile from local
  selectElement.on('select2:select', (e) => {
    // check if selected element is newly created tag
    if (e.params.data.element !== undefined) {
      loadProfileFromLocalStorage($);
    } else { // if it is newly created, then save it to local. why not?
      var profileName = $('#profile-select').val();
      var option = new Option(profileName, profileName, false, true);
      $('#profile-select').append(option).trigger('change');
      saveProfileToLocalStorage($);
    }
  });

  // insert new div as first object in trainingWrap div
  trainingWrap.prepend(localDiv);
}


// add local buttons
addLocalDiv($);


$(document).ready(function() {
  // initialize slider-range elements
  $( ".slider-range" ).slider({
    range: true,
    min: 0,
    max: 2000,
    values: [ 100, 1000 ],
    change: function( event, ui ) {
     if($(this).prev(".skillLabel").prop("checked"))
       $(this).prev(".skillLabel").click();
     $(this).parent().children(".min").val(ui.values[ 0 ]);
     $(this).parent().children(".max").val(ui.values[ 1 ]);
    },
    slide: function( event, ui ) {
     $(this).next(".min").val(ui.values[ 0 ]);
     $(this).next(".min").next(".max").val(ui.values[ 1 ]);
    }
  });
    
  // inject select2 css into page
  fetch(chrome.runtime.getURL('lib/select2.min.css'))
  .then(response => response.text())
  .then(css => {
    let style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
  });
  // initialize select2 element
  repopulateProfileSelect($);
  $('#profile-select').select2({
    placeholder: "Default profile",
    tags: true,
    width: 'resolve'
  });
});


function getDirectLinkElementFromCellText(cellText) {
  const regex = /http:\/\/osu.ppy.sh\/b\/(\d+)/;
  var match = cellText.match(regex);
  if (match) {
    var linkElement = document.createElement("a");
    linkElement.href = "osu://b/" + match[1];
    linkElement.innerHTML = "[DIRECT] ";
    var boldElement = document.createElement("b");
    boldElement.appendChild(linkElement);
    return boldElement;
  } else {
    console.debug(`No match found for cell text: ${cellText}`);
  }
}

function existsDirectLinkCellText(cellText) {
  const regex = /osu:\/\/b\/\d+/;
  var match = cellText.match(regex);
  return Boolean(match);
}

function addDirectLinkButtons() {
  // change values in 'Map' column
  var tableRows = document.querySelector('table').rows;

  // change only if there are maps in the table
  //  this is the case when there are more than 2 rows in the table
  if (tableRows.length > 2) {
    for (let i = 1; i < tableRows.length; i++) {
      var cellInMapColumn = tableRows[i].cells[0];
      var cellHTML = cellInMapColumn.innerHTML;
      if (!existsDirectLinkCellText(cellHTML)) {
        var directLinkElement = getDirectLinkElementFromCellText(cellHTML);
        cellInMapColumn.insertBefore(directLinkElement, cellInMapColumn.firstChild);
      }
    }
  }
}

// want to run addDirectLinkButtons after the table changes
var table = document.querySelector('table tbody');
var observer = new MutationObserver(() => {addDirectLinkButtons();});
observer.observe(table, {childList: true});
