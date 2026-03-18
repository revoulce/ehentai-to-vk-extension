function createButton(url, className) {
    const btn = document.createElement("button");
    btn.innerText = "VK";
    btn.className = `eh-vk-btn ${className}`;

    btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        btn.disabled = true;
        btn.innerText = "...";

        const toggle = document.getElementById("eh-vk-cosplayer-toggle");
        const includeCosplayer = toggle ? toggle.checked : false;

        const response = await chrome.runtime.sendMessage({
            type: "QUEUE_GALLERY",
            url: url,
            includeCosplayer: includeCosplayer
        });

        if (response && response.success) {
            btn.innerText = "✓";
            btn.classList.add("success");
        } else {
            btn.innerText = "X";
            btn.title = response ? response.error : "Unknown Error";
            btn.classList.add("error");
            console.error("VK Bot Error:", response.error);

            setTimeout(() => {
                btn.disabled = false;
                btn.innerText = "VK";
                btn.classList.remove("error");
            }, 2000);
        }
    };
    return btn;
}

function createCosplayerToggle() {
    const wrapper = document.createElement("label");
    wrapper.className = "eh-vk-cosplayer-label";
    wrapper.title = "Include cosplayer tag in VK post";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "eh-vk-cosplayer-toggle";
    checkbox.className = "eh-vk-cosplayer-checkbox";

    const span = document.createElement("span");
    span.innerText = "cosplayer";

    wrapper.appendChild(checkbox);
    wrapper.appendChild(span);
    return wrapper;
}

function init() {
    const header = document.querySelector("h1#gn");
    if (header) {
        const btn = createButton(window.location.href, "btn-large");
        const toggle = createCosplayerToggle();

        const container = document.createElement("div");
        container.className = "eh-vk-controls";
        container.appendChild(btn);
        container.appendChild(toggle);

        header.parentNode.insertBefore(container, header.nextSibling);
    }

    document.querySelectorAll(".gl1t").forEach(item => {
        const link = item.querySelector("a");
        const wrapper = item.querySelector(".gl3t");
        if (link && wrapper) {
            wrapper.appendChild(createButton(link.href, "btn-small"));
        }
    });
}

init();