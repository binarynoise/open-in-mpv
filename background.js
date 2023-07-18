"use strict";

function ff2mpv(url) {
    const mpvUrl = `mpv://${url}`;
    console.log("navigating to:", mpvUrl);

    browser.tabs.update({ url: mpvUrl }).then(
        (tab) => {
            if (tab.url == mpvUrl) {
                console.log("updated " + mpvUrl);
            } else {
                console.log("not updated " + mpvUrl);

                browser.downloads.download({ url: browser.runtime.getURL("mpv-scheme-handler.desktop.txt") }).then(
                    (id) => {
                        console.log(`Started downloading: ${id}`);
                        const listener = (delta) => {
                            if (delta.id !== id) return;
                            switch (delta.state.current) {
                                case "downloading":
                                    break;
                                case "complete":
                                    browser.tabs.create({ url: "download-success.txt" });
                                    browser.downloads.onChanged.removeListener(listener);
                                    break;
                                case "error":
                                    browser.tabs.create({ url: "download-error.txt" });
                                    browser.downloads.onChanged.removeListener(listener);
                                    break;
                            }
                        };
                        browser.downloads.onChanged.addListener(listener);
                    },
                    (error) => {
                        console.log(`Download failed: ${error}`);
                    }
                );
            }
        },
        (error) => {
            console.log("failed " + mpvUrl, error);
        }
    );
}

browser.menus.create({
    id: "ff2mpv",
    title: "open in mpv", // TODO: translation
    contexts: ["link", "image", "video", "audio", "selection", "frame"],
});

browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "ff2mpv":
            /* These should be mutually exclusive, but,
               if they aren't, this is a reasonable priority.
            */
            const url = info.linkUrl || info.srcUrl || info.selectionText || info.frameUrl;
            if (url) ff2mpv(url);
            break;
    }
});

// browser.browserAction.onClicked.addListener((tab) => {
//     ff2mpv(tab.url);
// });
