"use strict";

// change this when mpv-scheme-handler.desktop changes
const desktopFileVersion = 3;
let locallyInstalledVersion = null;

// noinspection ES6ConvertVarToLetConst; will set the variable undefined to undefined if not already existing
var browser, chrome;
const isChrome = !browser;
browser = browser || chrome;

const menus = browser.menus || browser.contextMenus;

function createMpvSchemeURI(url) {
    const decodedURL = decodeURI(url);
    const encodedURL = encodeURI(decodedURL).replace(/'/g, "%27");
    console.debug({url, encodedURL, same: decodedURL === decodeURI(encodedURL)});
    return `mpv://watch#${encodedURL}`;
}

async function openInMpv(url) {
    const mpvUrl = createMpvSchemeURI(url);

    const alreadySavedDesktop = await localDesktopFileVersionIsCurrent();
    if (alreadySavedDesktop) {
        await browser.tabs.update({ url: mpvUrl }).then(() => {
            console.debug("navigating to:", mpvUrl);
        }, (error) => {
            console.debug("failed " + mpvUrl, error);
        });
    } else {
        await askToInstall();
        await saveCurrentDesktopFileVersion();
    }
}

async function localDesktopFileVersionIsCurrent() {
    const key = Object.keys({ desktopFileVersion })[0];
    const savedVersion = locallyInstalledVersion === null ? (await browser.storage.local.get(key))[key] : locallyInstalledVersion;
    console.debug({ savedVersion, deskCache: locallyInstalledVersion, key });
    locallyInstalledVersion = savedVersion;
    return savedVersion === desktopFileVersion;
}

async function saveCurrentDesktopFileVersion() {
    locallyInstalledVersion = desktopFileVersion;
    return await browser.storage.local.set({ desktopFileVersion });
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
            if (url) return openInMpv(url); else console.debug({ info: info, tab: tab });
            break;
    }
});

browser.action.onClicked.addListener((tab) => {
    return openInMpv(tab.url);
});

function askToInstall() {
    return browser.tabs.create({ url: "setup.sh" });
}

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

            askToInstall();
        }
    }, filter);
}
