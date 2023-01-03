// initialization message
console.log("Submitter.js loaded");

const click_submit = (buttons) => {
  // loop through all buttons on the page
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].innerHTML.toLowerCase() === "submit") {
      // if the button is a submit button, click it
      buttons[i].click();
      break;
    }
  }
};

const click_ok = (buttons) => {
  // loop through all buttons on the page
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].innerHTML.toLowerCase() === "ok") {
      // if the button is a submit button, click it
      buttons[i].click();
      break;
    }
  }
};

//script runs on keypress
document.addEventListener("keypress", (e) => {
  // debuggin
  // console.log($("button"));

  // jquery to get all buttons
  const buttons = $("button");
  console.log(buttons)

  // switch case for keypresses
  switch (e.key) {
    case "`":
      click_submit(buttons);
      break;
    case "1":
      click_ok(buttons);
    case "Enter":
      break;
  }
});
