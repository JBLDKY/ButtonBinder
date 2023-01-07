// initialization message
console.log("ButtonBinder v1.2 is active");

// Error handler
function onError(error) {
  info(`Error: ${error}`);
}

// async
function onGot() {
  const userSettings = getting;
  return userSettings;
}

// keypress handler
const click_button = (buttonName) => {
  // if buttonName is undefined, return
  if (buttonName === undefined) return;
  // get all buttons on the page (jquery)
  const buttons = $("button");
  // loop through all buttons on the page
  for (let q = 0; q < buttons.length; q++) {
    if (buttons[q].innerText.toLowerCase() == buttonName.toLowerCase()) {
      // if the button is matches, click it
      buttons[q].click();
    }
  }
};

// switch case for keypresses
function matchKeypress(keypress, userSettings) {
  const keybindings = userSettings["keybindings"];
  const lists = Object.values(keybindings);
  const keyMatcherObject = {};

  lists.forEach((x) => {
    keyMatcherObject[x[1]] = x[0];
  });
  click_button(keyMatcherObject[keypress]);
}

// ASYNC
const getting = browser.storage.sync.get("keybindings");
getting.then(onGot, onError).then((userSettings) => {
  document.addEventListener("keypress", (e) => {
    matchKeypress(e.key, userSettings);
  });
});
