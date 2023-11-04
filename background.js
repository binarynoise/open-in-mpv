"use strict";

// noinspection ES6ConvertVarToLetConst; will set the variable undefined to undefined if already existing
var browser, chrome;
const isChrome = !browser;
browser = browser || chrome;

const menus = browser.menus || browser.contextMenus;

function openInMpv(url) {
    const mpvUrl = `mpv://${url}`;
    
    browser.tabs.update({ url: mpvUrl }).then(() => {
        console.debug("navigating to:", mpvUrl);
    }, (error) => {
        console.debug("failed " + mpvUrl, error);
    });
}

menus.create({
    id: "openInMpv", //
    title: browser.i18n.getMessage("extensionName"), //
    // chrome: action, all, audio, browser_action, editable, frame, image, launcher, link, page, page_action, selection, video
    // firefox: "all", "audio", "bookmark", "editable", "frame", "image", "launcher", "link", "page", "password", "selection", "tab", "tools_menu", "video"
    contexts: isChrome ?
        ["action", "audio", "browser_action", "frame", "image", "link", "page_action", "selection", "video",] :
        ["action", "audio", "frame", "image", "link", "selection", "tab", "tools_menu", "video",],
});

menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "openInMpv":
            const url = info.linkUrl || info.srcUrl || info.selectionText || info.frameUrl || info.pageUrl;
            if (url) openInMpv(url); else console.debug({ info: info, tab: tab });
            break;
    }
});

browser.action.onClicked.addListener((tab) => {
    openInMpv(tab.url);
});

const filter = {
    url: [{
        schemes: ["mpv", "mpvx"],
    }, // {
        //     urlPrefix: browser.runtime.getURL("/"),
        // },
    ],
};

if (!isChrome) {
    browser.webNavigation.onErrorOccurred.addListener((details) => {
        // Error code 2152398865 -> kNoContent (mpv)
        // Error code 2152398866 -> kUnknownProtocol
        
        if (details.error.endsWith("2152398865")) {
            console.debug("opened in mpv");
        } else {
            console.debug("onErrorOccurred");
            console.debug(details);
            
            browser.tabs.create({ url: "setup.sh" });
        }
    }, filter);
}
