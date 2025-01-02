# open in mpv

A minimalist extension to open the current website or a link in mpv.
You only need to put a .desktop file to `~/.local/share/applications/mpv-scheme-handler.desktop`.

And if you don't have that file installed, you get a shell-script to put it into place.
No more "nothing happens" and no-one knows why! You still need to have mpv installed though.

> [!CAUTION]  
> Currently supported platforms: Linux only  
> Windows support is planned: [#11](https://github.com/binarynoise/open-in-mpv/issues/11)

Inspired by _Open In mpv_ by Leonardo and _ff2mpv_ by yossarian, which require additional binaries installed but don't tell you when they are missing.

## Installation

### Firefox

[![badge](.github/firefox.png)][moz]

Go to the add-on store and install the extension ["minimalist open in mpv"][moz]

[gh]: https://github.com/binarynoise/open-in-mpv

[moz]: https://addons.mozilla.org/en-US/firefox/addon/minimalist-open-in-mpv

[//]: # (https://extensionworkshop.com/documentation/publish/promoting-your-extension/)

### Discord

[![badge](.github/bd.png)][bd]

Go to the BetterDiscord plugin repository and download the extension ["open in mpv"][bd] and put it into your plugins folder.

[bd]: https://betterdiscord.app/plugin/open%20in%20mpv

### Local (development) installation

#### Firefox

1. go to <about:debugging#/runtime/this-firefox>
2. click "load temporary add-on"
3. select the `manifest.json`.

#### Chromium:

1. replace `manifest.json` with `manifest-chrome.json`
2. go to <chrome://extensions/>
3. enable developer mode
4. click "load unpacked"
5. select the folder containing this extension.

#### Discord

1. have BetterDiscord installed
2. copy/link `open-in-mpv.plugin.js` into your plugins folder

## Support and Contributing

Got an idea? Having a bug? Want to help? [Open an issue!](https://github.com/binarynoise/open-in-mpv/issues)

Know how to code and are ready to contribute? Fork the repo and create a pull request!


## License

Licensed under the EUPL-1.2-or-later
