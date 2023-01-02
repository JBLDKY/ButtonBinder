
document.addEventListener('keypress', (e) => {
var button = document.getElementsByClassName("a-btn-primary a-btn-sm sc-jTYCaT bkQLTO a-keyboard-hover-only-div");
button = button.item(0);
    if(e.key === "Enter"){
    console.log("The {Enter} was pressed. Submitter will submit the form.");
    button.click();
    }
});
