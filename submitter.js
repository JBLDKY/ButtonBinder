/**
 * ButtonBinder Extension for browsers.
 *
 * This browser extension lets users "click" on "clickable" items on a website.
 *
 * What does that really mean?
 * On webpages certain elements may have an onclick function associated with them.
 * That means that when they are clicked on, something happens. This is usually
 * written in Javascript to provide interactivity on webpages. Now sometimes
 * you find yourself frequenting the same website over and over and moving your
 * cursor all over to click this button, that menu item, the submit thingy and so forth.
 * ButtonBinder lets you detect the ID of these clickable things and lets you bind it to
 * your handy keyboard keys.
 *
 * How does it work?
 * As of the time of writing, ButtonBinder faces several challenges (see section beneath for more info).
 * Currently, ButtonBinder finds all elements on a webpage that Jquery finds when it searches for "button".
 * From this list that is returned by Jquery, the innerText attribute is compared to the buttonname
 * that the user entered in the options menu. If the innerText attribute matches what the user entered, the
 * button's onclick event will be triggered by pressing the corresponding binding
 *
 * The challenges we face.
 * The biggest problem is finding and distinguishing buttons. Often buttons don't have an innerText attribute.
 * Therefore, ButtonBinder assigns all buttons with an ID as Button1, Button2, Button3... and so forth.
 * So whenever a button has an empty innerText, users can use the #DEBUG settings to find it's ID. Again: the
 * ID we're talking about here is a custom attribute assigned by ButtonBinder (hereafter: bbid). This way,
 * every single button can be accessed by ButtonBinder without running into duplicate ID issues.
 *
 * Note: Jquery returns the buttons in the same order everytime, therefore Button1, Button2... and so forth is consistent.
 *
 * Using mouseover to get a buttonID has proven difficult because webpage elements are often layered so much that
 * it isn't very straight forward to "mouseover" a button.
 *
 * In the future I would like to add some sort of feature that highlights buttons and displays their IDs
 * in a nicer way.
 */

// Error handler
function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot() {
  const userSettings = getting;
  return userSettings;
}

function debug() {
  /**
   * This function is the debug functionality that is triggered when
   * a button with the name #DEBUG is pressed. Simply enter #DEBUG
   * for buttonname in the options of the extension and press
   * whatever binding you assign it to.
   **/
  const buttons = $("button");
  for (let q = 0; q < buttons.length; q++) {
    buttons[q].innerText = buttons[q].bbid;
  }
  const contextMenu = document.querySelector(".context");
  chrome.storage.sync.get(["keybindings"]).then((res) => {});
}

// keypress handler
function clickButton(buttonName) {
  /**
   * @param buttonName: The name of the button corresponding with the binding pressed by the user.
   * Triggers the onclick event of the provided button
   **/
  if (buttonName === undefined) return;
  const buttons = $("button");

  // Iterate over all the buttons found by Jquery until the bbid
  // matches the names we entered
  for (let i = 0; i < buttons.length; i++) {
    if (
      buttons[i].bbid.trim().toLowerCase() == buttonName.trim().toLowerCase()
    ) {
      buttons[i].click();
    }
  }

  // Trigger debug mode if the buttonName is #DEBUG
  if (buttonName === "#DEBUG") {
    debug();
  }
}

// switch case for keypresses
function matchKeypress(keypress, userSettings) {
  /**
   * @param keypress: the key that was actively pressed by the user.
   * @param userSettings: the user's settings containing binding no., button and its corresponding binding.
   * Triggers the onclick event of the provided button
   **/
  const keybindings = userSettings["keybindings"];
  const bindsets = Object.values(keybindings);
  const keyMatcherObject = {};
  console.log(bindsets);

  // Would be much cleaner to just use a real switch case
  // rather than loop through a list. This piece of code essentially
  // Transforms the userSettings from
  // {button: binding} to {binding: button}.
  // Although stupid, this does allow for multiple bindings to the same key.
  bindsets.forEach((x) => {
    keyMatcherObject[x[1]] = x[0];
  });

  clickButton(keyMatcherObject[keypress]);
}

const getting = chrome.storage.sync.get(["keybindings"]);
chrome.storage.sync
  .get(["keybindings"])
  .then(onGot, onError)
  .then((userSettings) => {
    document.addEventListener("keypress", (e) => {
      const buttons = $("button");
      for (let i = 0; i < buttons.length; i++) {
        // Here ButtonBinder sets the innerText of buttons with no innerText to
        // a custom bbid. The bbid is button# with # being the index of the button
        // in the jquery list. Buttons that DO have an innerText attribute keep theirs instead.
        if (buttons[i].innerText !== "" && buttons[i].innerText !== undefined) {
          buttons[i].bbid = buttons[i].innerText;
        } else {
          buttons[i].bbid = `button${i}`;
        }
      }
      matchKeypress(e.key, userSettings);
    });
  });
