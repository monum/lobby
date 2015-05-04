var swig  = require('swig');
var path = require('path');
var fs = require('fs');

console.log("+ Started.");

var config = JSON.parse(fs.readFileSync("config.json"));

for (var i = 0 ; i < config.views.length; i++) {
	var view = config.views[i];

	var template = swig.compileFile(path.resolve(__dirname+"/views", view.file));
	var htmlPath = "../public/"+path.basename(view.file,".swig")+".html";
	fs.writeFileSync(htmlPath, template(view));
	console.log("+ Wrote "+htmlPath);
}

console.log("+ Finished.");