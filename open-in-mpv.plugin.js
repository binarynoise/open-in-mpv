/**
 * @name open in mpv
 * @author binarynoise
 * @description Use the context menu to open a video in mpv.
 * @version 2.0.0
 */

'use strict';
const electron = require('electron');

// change this when mpv-scheme-handler.desktop changes
const desktopFileVersion = 2;

const settings = {
    locallyInstalledVersion: null
};

const MPVSchemePrefix = "mpv://watch#";

function contextMenuPatch(tree, context) {
    const href = context.target.href || context.target.parentNode.href

    if (href !== undefined) {
        tree.props.children.push(BdApi.ContextMenu.buildItem({
            type: "separator",
        }))
        tree.props.children.push(BdApi.ContextMenu.buildItem({
            type: "text", label: "open in mpv", action: () => {
                console.log("link is " + href);

                if (settings.locallyInstalledVersion && settings.locallyInstalledVersion >= desktopFileVersion) {

                    electron.shell.openExternal(MPVSchemePrefix + href).then(() => {
                        BdApi.UI.showToast("" + href + " opened in mpv.", { type: "success" });
                        console.log("success");
                    }, (error) => {
                        console.log(`failed to open ${MPVSchemePrefix}href`);
                        console.log(error);
                    }).catch((error) => {
                        console.log(`failed to open ${MPVSchemePrefix}href`);
                        console.log(error);
                    })
                } else {
                    BdApi.UI.showConfirmationModal("Open in mpv",
                        "Open in mpv was updated or freshly installed. Please download and run setup.sh (again).",
                        {
                            confirmText: "Download setup.sh", onConfirm: () => {
                                electron.shell.openExternal("https://raw.githubusercontent.com/binarynoise/open-in-mpv/main/setup.sh");
                                settings.locallyInstalledVersion = desktopFileVersion;
                                BdApi.Data.save("open-in-mpv", "settings", settings);
                            },
                        })
                }
            },
        }))
    }
}

const { React, React: { useState }, Webpack: { Filters, getModule } } = BdApi;

const TheBigBoyBundle = getModule(Filters.byProps("openModal", "FormSwitch", "Anchor"));

function Switch({ value, note, hideBorder, label }) {
    const [enabled, setEnabled] = useState(value);
    return (React.createElement(TheBigBoyBundle.FormSwitch, {
        value: enabled, note: note, hideBorder: hideBorder, onChange: e => {
            setEnabled(e);

            switch (label) {
                case "Show Dialog":
                    settings.showAgain = e;
                    break;
                default:
                    break;
            }

            BdApi.Data.save("open-in-mpv", "settings", settings);
        },
    }, label));
}

const SettingComponent = () => {
    return React.createElement(Switch, {
        value: settings.showAgain, /*note: "this is a note",*/ hideBorder: true, onChange: console.log, label: "Show Dialog"
    });
}

module.exports = () => ({
    start() {
        const saved = BdApi.Data.load("open-in-mpv", "settings");
        if (saved && !isEmpty(saved)) Object.assign(settings, saved);
        BdApi.ContextMenu.patch("message", contextMenuPatch);
    }, stop() {
        BdApi.ContextMenu.unpatch("message", contextMenuPatch);
    }, //getSettingsPanel: () => React.createElement(SettingComponent),
});

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return true
}
