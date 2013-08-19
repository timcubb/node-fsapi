//
// Xide-fsapi 
// @author: Timothy Cubbedge (http://github.com/timcubb)] 
// @description: REST API exposing a servers filesystem to a remote client (browser) 
// The API allows listing files/dirs in a directory, changing directories, 
// opening, deleting, renaming of files/directories, and saving changes 
// to a file, as well as creating new files/directories. 
//


var restify = require('restify'),
    nstatic = require('node-static'),
    path = require('path'),
    fs = require('fs'),
    rmdir2 = require('rimraf');

// Constants
// (Set by CLI options)

var THE_PATH = process.argv[2].split('=')[1] || "/home/";
var THE_PORT = process.argv[3].split('=')[1] || 9090;

// REST server setup
var server = restify.createServer({
  name: 'xide',
  version: '1.0.0'
});

// Restify plugins
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// REST routes - POST's for exposing filesystem to API endpoint

// Get Directory Contents
server.post('/get_dir', function (req, res, next) {
	var directory_path = req.params.path;
	if(directory_path == '/') {
		var up_one_level = '';
	} else {
		var up_one_level = path.dirname(directory_path)+'/';
	}

	fs.readdir(THE_PATH+directory_path, function (err, data) {
		if (err) throw err;
        	var i, x, 
            	    folders = [],
            	    files = [],
            	    others = [];
              
		for(i=0,x=data.length;i<x;i++) {
			var my_name = THE_PATH+directory_path+data[i];
			var my_type = type_of_file(my_name);

			if(my_type == "folder") {
                		folders.push(data[i]);
            		} else if(my_type == "file") {
                		files.push(data[i]);
            		} else {
                		others.push(data[i]);
            		}
		}
          
        	folders = folders.sort();
        	files = files.sort();
        	others = others.sort();

		var my_base = THE_PATH+directory_path;	
		res.send({folders: folders, files: files, path: directory_path, base: my_base, up: up_one_level});
		return next();
	});
});

// Get File
server.post('/get_file', function (req, res, next) {
	var directory_path = req.params.path;

	fs.readFile(THE_PATH+directory_path, 'utf-8', function (err, data) {
        	if (err) throw err;
        	res.send(data);
        	return next();
	});
});

// Save File
server.post('/save_file', function (req, res, next) {
	var filename = req.params.path;
	var contents = req.params.contents;

	fs.writeFile(THE_PATH+filename, contents, 'utf-8', function (err) {
		if (err) throw err;
		res.send({file: filename});
		return next();
	});
});

// Delete File
server.post('/delete_file', function (req, res, next) {
	var filename = req.params.path;
	var base_dir = path.dirname(filename)+'/';

	fs.unlink(THE_PATH+filename, function (err) {
		if (err) throw err;
		res.send({file: filename, base_dir: base_dir});
		return next();
	});
});

// Delete Directory
server.post('/delete_dir', function (req, res, next) {
	var directory_path = req.params.path;
	var base_dir = path.dirname(directory_path)+'/'; 
	console.log({dir: directory_path, base_dir: base_dir});

	var deldir = directory_path.substring(0, directory_path.length - 1);
	console.log('the_path', THE_PATH+deldir);

// TODO: make deleting folders work!
//	rmdir2(THE_PATH+deldir, function (err) {
//		if (err) throw err;
		
		res.send({dir: directory_path, base_dir: base_dir});
		return next();
//	});
});

// New File
server.post('/new_file', function (req, res, next) {
        var directory_path = req.params.path;

        fs.mkdir(THE_PATH+directory_path, function (err) {
                if (err) throw err;
                res.send(true);
                return next();
        });
});

// New Dir
server.post('/new_dir', function (req, res, next) {
	var directory_path = req.params.path;

	fs.mkdir(THE_PATH+directory_path, function (err) {
		if (err) throw err;
		res.send(true);
		return next();
	});
});

// Rename File
server.post('/rename_file', function (req, res, next) {
	var old_path = req.params.old_path;
	var new_path = req.params.new_path;
	var base_dir = path.dirname(old_path)+'/';

	fs.rename(THE_PATH+old_path, THE_PATH+new_path, function (err) {
		if (err) throw err;
		res.send({old_file:old_path, new_file:new_path, base_dir: base_dir});
		return next();
	});
});

// Rename Directory
server.post('/rename_dir', function (req, res, next) {
	var old_path = req.params.old_path;
	var new_path = req.params.new_path;
        var base_dir = path.dirname(old_path)+'/';

	fs.rename(THE_PATH+old_path, THE_PATH+new_path, function (err) {
		if (err) throw err;
		res.send({old_file:old_path, new_file:new_path, base_dir: base_dir});
		return next();
	});
});

// Serve static files
file = new nstatic.Server('./public');
server.get('/', function(req, res, next) {
  	console.log('serving static file');
	file.serve(req, res, next);
});

// Start the rest API server
server.listen(THE_PORT, function () {
	console.log('%s listening at %s', server.name, THE_PORT);
});


// Helper functions

function type_of_file(file) {

	stats = fs.statSync(file);

	if(stats.isFile()){
		return "file";
	} else if(stats.isDirectory()) {
		return "folder";
	} else {
		return "other";
	}
}

