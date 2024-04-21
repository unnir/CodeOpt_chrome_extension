document.addEventListener('DOMContentLoaded', function () {
    // Load the settings from storage when the popup loads
    chrome.storage.local.get(['codePrefix', 'errorSuffix'], function (data) {
        if (data.hasOwnProperty('codePrefix')) {
            document.getElementById('codePrefix').value = data.codePrefix;
        }
        if (data.hasOwnProperty('errorSuffix')) {
            document.getElementById('errorSuffix').value = data.errorSuffix;
        }
    });

    // Save the settings when the save button is clicked
    document.getElementById('saveSettings').addEventListener('click', () => {
        const codePrefix = document.getElementById('codePrefix').value;
        const errorSuffix = document.getElementById('errorSuffix').value;

        // Save as is, including empty strings
        chrome.storage.local.set({ codePrefix, errorSuffix }, () => {
            console.log('Settings saved');
            // Optional 
            // alert('Settings saved successfully!');
        });
    });
});
