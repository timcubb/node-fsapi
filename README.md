node-fsapi
==========

FSAPI exposes a filesystem on a remote computer via a JSON REST API endpoint. Uses include web-based file management systems. I wrote this for my Xide remote editor, which is basically this API + Ace editor.

Usage
---------

To start the API server, and try the test client, you must specify the dir and port when running the server:

      node index.js path=/home/my_user/my_project/ port=9090

You can then access the test client by pointing your browser to http://localhost:9090/



License
---------

MIT License. Please refer to the LICENSE file for the specifics if you are not familiar.


Author
---------

This code was written by Timothy Cubbedge (github.com/timcubb). Let me know if you make something cool that uses FSAPI!
