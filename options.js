// on save button click, save user settings to storage
function structureBindings(bindings) {
  const testSettings = {};
  // loop through all input fields
  for (let i = 1; i < bindings.length; i++) {
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
  });
}

function hideDivs(){
let divOne = document.querySelector("#set-one")
let divTwo = document.querySelector("#set-two")
let divThree = document.querySelector("#set-three")
let divFour = document.querySelector("#set-four")
let divFive = document.querySelector("#set-five")
let divSix = document.querySelector("#set-six")
let divSeven = document.querySelector("#set-seven")
let divEight = document.querySelector("#set-eight")
let buttonOne = document.querySelector("#button1")
let keyOne = document.querySelector("#key1")
let divs = [divTwo, divThree, divFour, divFive, divSix, divSeven, divEight]
divs.forEach((div) => {
  div.style.display = "none";
})
}
function renderDivs(){
let divOne = document.querySelector("#set-one")
let divTwo = document.querySelector("#set-two")
let divThree = document.querySelector("#set-three")
let divFour = document.querySelector("#set-four")
let divFive = document.querySelector("#set-five")
let divSix = document.querySelector("#set-six")
let divSeven = document.querySelector("#set-seven")
let divEight = document.querySelector("#set-eight")
let buttonOne = document.querySelector("#button1")
let keyOne = document.querySelector("#key1")
let divs = [divTwo, divThree, divFour, divFive, divSix, divSeven, divEight]
divs.forEach((div) => {
  console.log(div.style.display)
  div.style.display = "none";
})

if(buttonOne.value !== "" || keyOne.value !== null){
  divTwo.style.display = "block"
}
}


document.addEventListener("keypress", renderDivs);
document.addEventListener("DOMContentLoaded", hideDivs);
// on page load, GET & SET user settings to saved settings
document.addEventListener("DOMContentLoaded", restoreOptions);
// on submit button click, SAVE user settings to storage
document.querySelector("form").addEventListener("submit", saveOptions);
