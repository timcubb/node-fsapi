node-fsapi
==========

FSAPI exposes a filesystem on a remote computer via a JSON REST API endpoint. Uses include web-based file management systems. I wrote this for my Xide remote editor, which is basically this API + Ace editor.

## Usage:

  $> node index.js path=/home/my_user/my_project/ port=9090
