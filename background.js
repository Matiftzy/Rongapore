chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === "findSingaporeServer") {
        let gameId = request.gameId;
        let servers = await getServerList(gameId);
        let singaporeServer = servers.find(server => server.pingRegion === "Singapore");

        if (singaporeServer) {
            let joinUrl = `roblox://join-game/${singaporeServer.id}`;
            chrome.tabs.create({ url: joinUrl });
        } else {
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icon.png",
                title: "Server Tidak Ditemukan",
                message: "Tidak ada server Singapura yang tersedia!"
            });
        }
    }
});

async function getServerList(gameId) {
    let cursor = "";
    let servers = [];

    try {
        while (true) {
            let url = `https://games.roblox.com/v1/games/${gameId}/servers/Public?limit=100&cursor=${cursor}`;
            let response = await fetch(url);
            let data = await response.json();

            if (data.data.length === 0) break;
            servers = servers.concat(data.data);

            if (!data.nextPageCursor) break;
            cursor = data.nextPageCursor;
        }
    } catch (error) {
        console.error("Gagal mengambil data server:", error);
    }

    return servers;
}
