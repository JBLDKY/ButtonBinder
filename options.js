// on save button click, save user settings to storage
function toObject(bindings) {
  /**
   * Restructure the settings as imported from browser storage
   * to a JSON-like Object. Buttons and bindings in the array are stored 1 dimensionally
   * so that every button is followed by its binding.
   * @param {Array} Array containing the result from a Jquery. \
   * Contains all user input settings from top left (index 0) to bottom right (index -1).
   *
   * Todo: Implement the following structure:
   * {"website url1":
   *  [
   *    {
   *      "binding1":
   *        ["button1": "binding1"],
   *    },
   *    {
   *      "binding2":
   *        ["button2": "binding2"],
   *    }
   *  ]
   * }
   * @param return: Object containing the bindings: {"binding1": ["button1", "binding1"]}
   *
   **/
  const userKeybindings = {};

  for (let i = 1; i < bindings.length; i += 2) {
    if (bindings[i - 1].value === "" || bindings[i] === "") continue;

    const button = bindings[i - 1].value;
    const binding = bindings[i].value;

    const bindSet = [button, binding]; // a bindset is a combination of button with binding
    // add object to test_settings object
    userKeybindings[bindings[i].name] = bindSet;
  }
  return userKeybindings;
}
// Add the jump key option to the userKeybindings object

function saveHandler(event) {
  /**
   * Handler for saving a user's settings.
   * Listens for an event (specifically a click on the save button),
   * jqueries the settings page to get all bindings in a list and uses
   * toObject to process them.
   *
   * then uses the browser's storage sync to store the userKeybindings Object.
   * To retrieve the keybindings, use the object key "keybindings".
   *
   */
  const bindings = $("[name^=bindset]");
  const userKeybindings = toObject(bindings);
  const jumpKey = document.querySelector("#jumpKeySelect").value;

  const enabled = {
    buttonbinder: document.querySelector("#EnableButtonBinder").checked,
    jumpkey: document.querySelector("#EnableJumpKey").checked,
  };
  console.log(enabled);

  chrome.storage.sync.set({
    keybindings: userKeybindings,
    jumpKey: jumpKey,
    enabled: enabled,
  });

  // prevents an ugly graphical abberration, probably caused by some redirect
  event.preventDefault();
}

function restoreOptions() {
  /**
   * Whenever the DOMContentLoaded event is triggered,
   * we load everything required by buttonBinder to function.
   *
   **/

  let gettingItem = chrome.storage.sync.get([
    "keybindings",
    "jumpKey",
    "enabled",
  ]);

  gettingItem.then((res) => {
    const userKeybindings = res.keybindings;
    const jumpKey = res.jumpKey;
    const enabled = res.enabled;
    console.log(enabled);

    const bindSetsNames = Object.keys(userKeybindings);

    // Iterate over all the keys of our userKeybindings
    // so that we can put them back in the form the way
    // the user left them. To preserve the order,
    // the bindings/bindsets/buttons have a number attached to them
    // at index -1.
    bindSetsNames.forEach((x) => {
      const button = userKeybindings[x][0];
      const binding = userKeybindings[x][1];
      const index = x.slice(-1);

      // set the input fields to contain the values the user left
      document.querySelector(`#button${index}`).value = button;
      document.querySelector(`#binding${index}`).value = binding;
    });

    document.querySelector("#jumpKeySelect").value = jumpKey;
    console.log(enabled);
    document.querySelector("#EnableButtonBinder").checked =
      enabled.buttonbinder;
    document.querySelector("#EnableJumpKey").checked = enabled.jumpkey;

    // after user settings are loaded, hide the unused divs
    dynamicInputFields();
  });
}

function dynamicInputFields() {
  // This function is run onChange events & on user settings load
  // get all divs fields
  const divs = Array.from($("[id*=set]"));
  // get all NON-EMPTY keybindings
  const testSettings = toObject($("[name^=bindset]"));
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
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", saveHandler);
});
// on page load, add onchange listeners to all input fields
document.addEventListener("DOMContentLoaded", addOnChangeListener);

// add onchange listeners to all input fields
function addOnChangeListener() {
  document.querySelectorAll("input").forEach((element) => {
    element.addEventListener("change", dynamicInputFields);
  });
}

//
//
// document.addEventListener("DOMContentLoaded", () => {
//   const toggleBtns = document.querySelectorAll(".toggle-btn");
//
//   toggleBtns.forEach((btn) => {
//     btn.addEventListener("click", (event) => {
//       const target = event.target.dataset.target;
//       const content = document.querySelector(".input-container");
//       if (content.style.display === "block") {
//         content.style.display = "none";
//       } else {
//         content.style.display = "block";
//       }
//     });
//   });
// });
//

// const collapseElement = document.querySelector("[data-te-target='#flush-collapseOne']");
// const collapseInstance = new Collapse(collapseElement);
//
// collapseElement.addEventListener("click", function() {
//   collapseInstance.toggle();
// });
