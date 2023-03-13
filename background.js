chrome.runtime.onMessage.addListener(function (message) {
    switch (message.action) {
    case "openOptionsPage":
        openOptionsPage();
        break;
    default:
        break;
    }
});

function openOptionsPage() {
  console.log("opening options page");
    chrome.runtime.openOptionsPage();
}
