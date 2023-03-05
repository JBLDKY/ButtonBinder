// Error handler
function onError(error) {
  info(`Error: ${error}`);
}

function onGot() {
  const userSettings = getting;
  return userSettings;
}

function debug(lastMouseOverInnerText) {
  const buttons = $("button");
  for (let q = 0; q < buttons.length; q++) {
    buttons[q].innerText = buttons[q].bbid;
  }
  const contextMenu = document.querySelector(".context");
  chrome.storage.sync.get(["keybindings"]).then((res) => {});
}

// keypress handler
const clickButton = (buttonName, lastMouseOverInnerText) => {
  if (buttonName === undefined) return;
  const buttons = $("button");
  for (let q = 0; q < buttons.length; q++) {
    if (
      buttons[q].bbid.trim().toLowerCase() == buttonName.trim().toLowerCase()
    ) {
      buttons[q].click();
    }
  }
  if (buttonName === "#DEBUG") {
    debug(lastMouseOverInnerText);
  }
};

// switch case for keypresses
function matchKeypress(keypress, userSettings, lastMouseOverInnerText) {
  const keybindings = userSettings["keybindings"];
  const lists = Object.values(keybindings);
  const keyMatcherObject = {};

  lists.forEach((x) => {
    keyMatcherObject[x[1]] = x[0];
  });

  clickButton(keyMatcherObject[keypress], lastMouseOverInnerText);
}

const lastMouseOverInnerText = "";
const getting = chrome.storage.sync.get(["keybindings"]);
chrome.storage.sync
  .get(["keybindings"])
  .then(onGot, onError)
  .then((userSettings) => {
    document.addEventListener("keypress", (e) => {
      const buttons = $("button");
      for (let q = 0; q < buttons.length; q++) {
        if (buttons[q].innerText !== "" && buttons[q].innerText !== undefined) {
          buttons[q].bbid = buttons[q].innerText;
        } else {
          buttons[q].bbid = `button${q}`;
        }
      }
      matchKeypress(e.key, userSettings, lastMouseOverInnerText);
    });
  });
