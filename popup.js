document.addEventListener("DOMContentLoaded", function () {
    let statusText = document.getElementById("status");
    let joinButton = document.getElementById("joinButton");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let url = new URL(tabs[0].url);
        if (url.hostname === "www.roblox.com" && url.pathname.startsWith("/games/")) {
            let gameId = url.pathname.split("/")[2];
            statusText.textContent = "Game terdeteksi!";
            joinButton.disabled = false;
            joinButton.addEventListener("click", function () {
                chrome.runtime.sendMessage({ action: "findSingaporeServer", gameId: gameId });
                statusText.textContent = "Mencari server...";
            });
        } else {
            statusText.textContent = "Buka halaman game Roblox!";
        }
    });
});
