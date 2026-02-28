const defaultUrl = "http://localhost:8080/api/queue";

// Restores select box and checkbox state using the preferences
const restoreOptions = () => {
    chrome.storage.sync.get(
        { apiUrl: defaultUrl, apiSecret: "" },
        (items) => {
            document.getElementById('apiUrl').value = items.apiUrl;
            document.getElementById('apiSecret').value = items.apiSecret;
        }
    );
};

// Saves options to chrome.storage
const saveOptions = () => {
    const apiUrl = document.getElementById('apiUrl').value;
    const apiSecret = document.getElementById('apiSecret').value;

    chrome.storage.sync.set(
        { apiUrl: apiUrl, apiSecret: apiSecret },
        () => {
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 1500);
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);