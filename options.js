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
  console.log(userKeybindings);

  chrome.storage.sync.set({
    keybindings: userKeybindings,
    jumpKey: jumpKey,
    enabled: enabled,
  });

  // prevents an ugly graphical abberration, probably caused by some redirect
  event.preventDefault();
}

function createInputFields() {
  const index = document.querySelectorAll("[id^=set-]").length + 1;
  const previousDiv = document.querySelector(`#set-${index - 1}`);

  // Check if the input fields with the given index exists
  if (!document.querySelector(`#button${index}`)) {
    // If not, add the input fields
    if (!previousDiv || (previousDiv && previousDiv.children[0].value !== "")) {
      const newDiv = document.createElement("div");
      newDiv.className = "py-1";
      newDiv.id = `set-${index}`;

      const buttonInput = document.createElement("input");
      buttonInput.className =
        "placeholder-gray-300 px-5 py-2 font-semibold text-black border border-b-4 border-r-4 border-black rounded-lg shadow-lg focus:underline decoration-solid";
      buttonInput.type = "text";
      buttonInput.id = `button${index}`;
      buttonInput.name = `bindset${index}`;
      buttonInput.placeholder = "Button text";

      const bindingInput = document.createElement("input");
      bindingInput.className =
        "placeholder-gray-300 px-5 py-2 font-semibold text-black border border-b-4 border-r-4 border-black rounded-lg shadow-lg focus:underline decoration-solid";
      bindingInput.type = "text";
      bindingInput.id = `binding${index}`;
      bindingInput.name = `bindset${index}`;
      bindingInput.placeholder = "Your binding";


      document.querySelector(".input-container.collapsed").appendChild(newDiv);
    }
  }

  // Check if the input fields with the given index are empty
  const buttonInput = document.querySelector(`#button${index}`);
  const bindingInput = document.querySelector(`#binding${index}`);
  if (
    buttonInput &&
    bindingInput &&
    buttonInput.value === "" &&
    bindingInput.value === ""
  ) {
    const currentDiv = document.querySelector(`#set-${index}`);
    currentDiv.remove();
  }
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

    const bindSetsNames = Object.keys(userKeybindings);
    console.log(bindSetsNames);

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

      createInputFields();
    });

    document.querySelector("#jumpKeySelect").value = jumpKey;
    document.querySelector("#EnableButtonBinder").checked =
      enabled.buttonbinder;
    document.querySelector("#EnableJumpKey").checked = enabled.jumpkey;

    // after user settings are loaded, hide the unused divs
    // dynamicInputFields();
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

const inputContainer = document.querySelector(".input-container.collapsed");
inputContainer.addEventListener("change", (event) => {
  if (event.target.matches("input[id^='button']")) {
    console.log("Button change detected");
    const buttonValue = event.target.value;
    const index = parseInt(event.target.id.slice(-1));
    createInputFields(index, buttonValue);
  } else if (event.target.matches("input[id^='binding']")) {
    console.log("Binding change detected");
    const bindingValue = event.target.value;
    const index = parseInt(event.target.id.slice(-1));
    createInputFields(index, null, bindingValue);
  }
});

// on page load, add onchange listeners to all input fields
// document.addEventListener("DOMContentLoaded", addOnChangeListener);

// add onchange listeners to all input fields
// function addOnChangeListener() {
//   document.querySelectorAll("input").forEach((element) => {
//     element.addEventListener("change", dynamicInputFields);
//   });
// }

// chrome.runtime.onMessage.addListener(function (request) {
//   if (request.action === "openOptionsPage") {
//     createNewDiv();
//   }
// });
//
// function createNewDiv() {
//   console.log("creating new div");
//   let counter = 8;
//   let buttonId = "button" + counter;
//   let bindingId = "binding" + counter;
//
//   while (document.getElementById(buttonId)) {
//     counter++;
//     buttonId = "button" + counter;
//     bindingId = "binding" + counter;
//   }
//
//   let div = document.createElement("div");
//   div.id = "set-" + counter;
//   div.className = "py-1";
//
//   let buttonInput = document.createElement("input");
//   buttonInput.type = "text";
//   buttonInput.id = buttonId;
//   buttonInput.name = "bindset" + counter;
//   buttonInput.className =
//     "placeholder-gray-300 px-5 py-2 font-semibold text-black border border-b-4 border-r-4 border-black rounded-lg shadow-lg focus:underline decoration-solid";
//   buttonInput.placeholder = "Button text";
//   buttonInput.value = localStorage.getItem("jumpKeyMatch");
//
//   let bindingInput = document.createElement("input");
//   bindingInput.type = "text";
//   bindingInput.id = bindingId;
//   bindingInput.name = "bindset" + counter;
//   bindingInput.className =
//     "placeholder-gray-300 px-5 py-2 font-semibold text-black border border-b-4 border-r-4 border-black rounded-lg shadow-lg focus:underline decoration-solid";
//   bindingInput.placeholder = "Your binding";
//
//   div.appendChild(buttonInput);
//   div.appendChild(bindingInput);
//
//   document.body.appendChild(div);
// }
