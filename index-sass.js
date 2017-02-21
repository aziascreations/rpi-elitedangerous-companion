var fs = require('fs');
var sass = require('node-sass');

var filesToProcess = [
	"main"
];

for(var i = 0; i < filesToProcess.length; i++) {
	var outputPath = "./app/css/"+filesToProcess[i]+".css";
	
	sass.render(
		{
			file: "./app/sass/"+filesToProcess[i]+".scss",
			outFile: outputPath
		},
		function(err1, result) {
			if(!err1) {
				fs.writeFile(outputPath, result.css, function(err2) {
					console.log(outputPath);
					if(!err2) {
						
					}
				});
			} else {
				console.error(err1);
			}
		}
	);
}
