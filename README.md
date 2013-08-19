node-fsapi
==========

FSAPI exposes a filesystem on a remote computer via a JSON REST API endpoint. Uses include web-based file management systems. I wrote this for my Xide remote editor, which is basically this API + Ace editor.

Usage:
------

To start the API server, and try the test client, you must specify the dir and port when running the server:

      node index.js path=/home/my_user/my_project/ port=9090

You can then access the test client by pointing your browser to http://localhost:9090/
