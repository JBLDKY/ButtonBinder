function saveOptions(e) {
  e.preventDefault();
  formData = document.getElementById("my-form").elements;
  setUserSettings(formData);
}

function setUserSettings(formData) {
  const userSettings = {
    binding1: [formData[0].value, formData[1].value],
    binding2: [formData[2].value, formData[3].value],
    binding3: [formData[4].value, formData[5].value],
    binding4: [formData[6].value, formData[7].value],
    binding5: [formData[8].value, formData[9].value],
    binding6: [formData[10].value, formData[11].value],
    binding7: [formData[12].value, formData[13].value],
    binding8: [formData[14].value, formData[15].value],
  };
}

document.querySelector("form").addEventListener("submit", saveOptions);
