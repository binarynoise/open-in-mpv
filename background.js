"use strict";

function ff2mpv(url) {
    const mpvUrl = `mpv://${url}`;

    browser.tabs.update({ url: mpvUrl }).then(
        (tab) => {
            console.log("navigating to:", mpvUrl);
        },
        (error) => {
            console.log("failed " + mpvUrl, error);
        }
    );
}

browser.menus.create({
    id: "ff2mpv",
    title: browser.i18n.getMessage("extensionName"),
    contexts: [
        "action",
        "audio",
        "frame",
        // "image",
        "link",
        // "page_action",
        // "page",
        "selection",
        "tab",
        "tools_menu",
        "video",
    ],
});

browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "ff2mpv":
            /* These should be mutually exclusive, but,
               if they aren't, this is a reasonable priority.
            */
            const url = info.linkUrl || info.srcUrl || info.selectionText || info.frameUrl || info.pageUrl;
            if (url) ff2mpv(url);
            else console.log({ info: info, tab: tab });
            break;
    }
});

browser.action.onClicked.addListener((tab) => {
    ff2mpv(tab.url);
});

const filter = {
    url: [
        {
            schemes: ["mpv", "mpvx"],
        },
        {
            urlPrefix: browser.runtime.getURL("/"),
        },
    ],
};

/*
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    console.log("onBeforeNavigate");
    console.log(details);
}, filter);
chrome.webNavigation.onCommitted.addListener((details) => {
    console.log("onCommitted");
    console.log(details);
}, filter);
chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
    console.log("onDOMContentLoaded");
    console.log(details);
}, filter);
chrome.webNavigation.onCompleted.addListener((details) => {
    console.log("onCompleted");
    console.log(details);
}, filter);
chrome.webNavigation.onCreatedNavigationTarget.addListener((details) => {
    console.log("onCreatedNavigationTarget");
    console.log(details);
}, filter);
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    console.log("onHistoryStateUpdated");
    console.log(details);
}, filter);
chrome.webNavigation.onReferenceFragmentUpdated.addListener((details) => {
    console.log("onReferenceFragmentUpdated");
    console.log(details);
}, filter);
*/

chrome.webNavigation.onErrorOccurred.addListener((details) => {
    // Error code 2152398865 -> mpv
    // Error code 2152398866 -> error

    if (details.error.endsWith("2152398865")) {
        console.log("opened in mpv");
    } else {
        console.log("onErrorOccurred");
        console.log(details);

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
}, filter);
