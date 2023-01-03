// initialization message
console.log("Submitter.js loaded");

//script runs on keypress
document.addEventListener("keypress", (e) => {
  // debuggin
  // console.log($("button"));

  // jquery to get all buttons
  const buttons = $("button");

  // loop through all buttons on the page
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].innerHTML === "Submit") {
      // if the button is a submit button, click it
      buttons[i].click();
      break;
    }
  }
});
