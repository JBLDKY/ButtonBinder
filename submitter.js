// initialization message
console.log("ButtonBinder v1.1 is active");

// default settings
const userSettings = {
  binding1: ["submit", "`"],
  binding2: ["ok", "1"],
  binding3: ["", ""],
  binding4: ["", ""],
  binding5: ["", ""],
  binding6: ["", ""],
  binding7: ["", ""],
  binding8: ["", ""],
};

const click_button = (buttons, button_name) => {
  // loop through all buttons on the page
  for (let q = 0; q < buttons.length; q++) {
    if (buttons[q].innerText.toLowerCase() == button_name.toLowerCase()) {
      // if the button is matches, click it
      buttons[q].click();
    }
  }
};

//script runs on keypress
document.addEventListener("keypress", (e) => {
  // jquery to get all buttons
  const buttons = $("button");

  // switch case for keypresses
  switch (e.key) {
    case userSettings["binding1"][1]:
      click_button(buttons, userSettings["binding1"][0]);
      break;
    case userSettings["binding2"][1]:
      click_button(buttons, userSettings["binding2"][0]);
      break;
    case userSettings["binding3"][1]:
      click_button(buttons, userSettings["binding3"][0]);
      break;
    case userSettings["binding4"][1]:
      click_button(buttons, userSettings["binding4"][0]);
      break;
    case userSettings["binding5"][1]:
      click_button(buttons, userSettings["binding5"][0]);
      break;
    case userSettings["binding6"][1]:
      click_button(buttons, userSettings["binding6"][0]);
      break;
    case userSettings["binding7"][1]:
      click_button(buttons, userSettings["binding7"][0]);
      break;
    case userSettings["binding8"][1]:
      click_button(buttons, userSettings["binding8"][0]);
  }
});
