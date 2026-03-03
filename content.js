function createButton(url, className) {
    const btn = document.createElement("button");
    btn.innerText = "VK";
    btn.className = `eh-vk-btn ${className}`;

    btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        btn.disabled = true;
        btn.innerText = "...";

        // No config needed here, background script handles it
        const response = await chrome.runtime.sendMessage({
            type: "QUEUE_GALLERY",
            url: url
        });

        if (response && response.success) {
            btn.innerText = "✓";
            btn.classList.add("success");
        } else {
            btn.innerText = "X";
            btn.title = response ? response.error : "Unknown Error";
            btn.classList.add("error");
            console.error("VK Bot Error:", response.error);

            // Allow retry after 2 seconds
            setTimeout(() => {
                btn.disabled = false;
                btn.innerText = "VK";
                btn.classList.remove("error");
            }, 2000);
        }
    };
    return btn;
}

function init() {
    // Gallery Header
    const header = document.querySelector("h1#gn");
    if (header) {
        const btn = createButton(window.location.href, "btn-large");
        header.parentNode.insertBefore(btn, header.nextSibling);
    }

    // List View
    document.querySelectorAll(".gl1t").forEach(item => {
        const link = item.querySelector("a");
        const wrapper = item.querySelector(".gl3t");
        if (link && wrapper) {
            wrapper.appendChild(createButton(link.href, "btn-small"));
        }
    });
}

init();