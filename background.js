chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "QUEUE_GALLERY") {

        // 1. Read config from storage
        chrome.storage.sync.get(
            { apiUrl: "http://localhost:8080/api/queue", apiSecret: "" },
            (items) => {

                if (!items.apiSecret) {
                    sendResponse({ success: false, error: "Token not configured in options" });
                    return;
                }

                // 2. Perform Request
                fetch(items.apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${items.apiSecret}`
                    },
                    body: JSON.stringify({ url: msg.url })
                })
                    .then(async (res) => {
                        // Handle non-JSON responses (e.g. 404/500 html pages)
                        const text = await res.text();
                        try {
                            const data = JSON.parse(text);
                            sendResponse({ success: res.ok, data: data });
                        } catch (e) {
                            sendResponse({ success: false, error: `Server Error: ${res.status}` });
                        }
                    })
                    .catch((err) => {
                        sendResponse({ success: false, error: "Connection Failed" });
                    });
            }
        );

        return true; // Keep channel open for async response
    }
});