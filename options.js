// on save button click, save user settings to storage
function structureBindings(bindings) {
  const testSettings = {};
  // loop through all input fields
  for (let i = 1; i < bindings.length; i += 2) {
    // cache both key and value for clean code purposes
    const button = bindings[i - 1].value;
    const keypress = bindings[i].value;
    // skip to next pair if current fields were left empty
    if (button === "" || keypress === "") continue;
    // add key/value pair to object
    const obj = [button, keypress];
    // add object to test_settings object
    testSettings[bindings[i].name] = obj;
  }
  return testSettings;
}

function saveOptions(event) {
  // get all input fields
  const bindings = $("[name^=binding]");
  // json style object to hold user settings
  const test_settings = structureBindings(bindings);

  // save to storage
  chrome.storage.sync.set({
    keybindings: test_settings,
  });

  // prevent redirect
  event.preventDefault();
}

// on page load, get user settings from storage
function restoreOptions() {
  // get user settings from storage
  let gettingItem = chrome.storage.sync.get(["keybindings"]);
  gettingItem.then((res) => {
    // wait for promise to resolve
    const result = res.keybindings;
    // get all NON-EMPTY keybindings
    const names = Object.keys(result);
    names.forEach((name) => {
      // key is the button text
      const key = result[name][0];
      // value is the keypress
      const value = result[name][1];
      // index is related to the unique id of the input fields
      const index = name.slice(-1);

      // set the input fields to the user settings
      document.querySelector(`#button${index}`).value = key; // button
      document.querySelector(`#key${index}`).value = value; // keypress
    });
    // after user settings are loaded, hide the unused divs
    dynamicInputFields();
  });
}

function dynamicInputFields() {
  // This function is run onChange events & on user settings load
  // get all divs fields
  const divs = Array.from($("[id*=set]"));
  // get all NON-EMPTY keybindings
  const testSettings = structureBindings($("[name^=binding]"));
  const usedDivs = Object.keys(testSettings).length;
  for (let i = 0; i < divs.length; i++) {
    if (i < usedDivs + 1) {
      // show all used divs + 1
      divs[i].style.display = "block";
    } else if (
      // don't delete divs that have been filled out
      divs[i].children[0].value === "" &&
      divs[i].children[1].value === ""
    ) {
      // hide all unused divs
      divs[i].style.display = "none";
    }
  }
}

// on page load, GET & SET user settings to saved settings
document.addEventListener("DOMContentLoaded", restoreOptions);
// on submit button click, SAVE user settings to storage
document.querySelector("form").addEventListener("submit", saveOptions);
// on page load, add onchange listeners to all input fields
document.addEventListener("DOMContentLoaded", addOnChangeListener);

// add onchange listeners to all input fields
function addOnChangeListener() {
  document.querySelectorAll("input").forEach((element) => {
    element.addEventListener("change", dynamicInputFields);
  });
}
