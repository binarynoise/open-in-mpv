#!/bin/sh
# one last thing to do: to use the extension, run the following commands in your terminal:

set -e

if [ -f mpv-scheme-handler.desktop ]; then
    cp mpv-scheme-handler.desktop ~/.local/share/applications/mpv-scheme-handler.desktop
else
    curl -sSf "https://raw.githubusercontent.com/binarynoise/open-in-mpv/main/mpv-scheme-handler.desktop" >~/.local/share/applications/mpv-scheme-handler.desktop
fi

xdg-mime default mpv-scheme-handler.desktop x-scheme-handler/mpv
