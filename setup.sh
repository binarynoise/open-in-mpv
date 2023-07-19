#!/bin/sh
# one last thing to do: to use the extension, run the following commands in your terminal:

curl -sSf "https://raw.githubusercontent.com/binarynoise/open-in-mpv/main/mpv-scheme-handler.desktop" >~/.local/share/applications/mpv-scheme-handler.desktop &&
    xdg-mime default mpv-scheme-handler.desktop x-scheme-handler/mpv
