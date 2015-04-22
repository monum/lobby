var swig  = require('swig');
var path = require('path');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync("config.json"));

for (var i = 0 ; i < config.views.length; i++) {
	var view = config.views[i];

	var template = swig.compileFile(path.resolve(__dirname+"/views", view.file));
	fs.writeFileSync("../public/"+path.basename(view.file,".swig")+".html", template(view));
}