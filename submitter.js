// initialization message
console.log("ButtonBinder v1.2.1 is active");
// Error handler
function onError(error) {
  info(`Error: ${error}`);
}

// async
function onGot() {
  const userSettings = getting;
  return userSettings;
}

function debug(lastMouseOverInnerText){
    console.log("~~~VERSION~~~")
    console.log("ButtonBinder v1.2.1")
    console.log("~~~BUTTONS ON THIS PAGE~~~")
    console.log($("button"))
    console.log("~~~KEYBINDINGS~~~")
    chrome.storage.sync.get(["keybindings"]).then((res) => {console.log(res)})
    console.log(`~~~INNERTEXT OF THE BUTTON ON MOUSEOVER~~~\n${$("button").mouseover(function(mouseover) {
      const mouseOverInnerText = mouseover.target.innerText
      if(mouseOverInnerText !== undefined || mouseOverInnerText !== lastMouseOverInnerText || mouseover !== undefined){
          console.log(mouseover.target.innerText)
    lastMouseOverInnerText = mouseover.target.innerText
      }
    })}`)
    console.log("~~~END OF DEBUG~~~")
}
// keypress handler
const click_button = (buttonName, lastMouseOverInnerText) => {
  if(buttonName === "#DEBUG"){
    debug(lastMouseOverInnerText)
  }

  // if buttonName is undefined, return
  if (buttonName === undefined) return;
  // get all buttons on the page (jquery)
  const buttons = $("button");
  // loop through all buttons on the page
  for (let q = 0; q < buttons.length; q++) {
    if (buttons[q].innerText.trim().toLowerCase() == buttonName.trim().toLowerCase()) {
      // if the button is matches, click it
      buttons[q].click();
    }
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


  click_button(keyMatcherObject[keypress], lastMouseOverInnerText);
}

// ASYNC
const lastMouseOverInnerText = ""
const getting = chrome.storage.sync.get(["keybindings"])
chrome.storage.sync.get(["keybindings"]).then(onGot, onError).then((userSettings) => {
  document.addEventListener("keypress", (e) => {
    const buttons = $("button");
    for (let q = 0; q < buttons.length; q++) {
      const innertext = buttons[q].innerText
      if(innertext === ""){
        // Give buttons without innertext a default value
        buttons[q].innerText = `button${q}`
      }
    }
    matchKeypress(e.key, userSettings, lastMouseOverInnerText);
  });
})