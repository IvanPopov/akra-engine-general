var fs = require('fs');
var sys = require('util')
var exec = require('child_process').exec;
var files = fs.readdirSync('.');
var output_folder = './compiled/';



var commands = [];
var compiled = [];
var templates = [];

for (var i in files) {
	if (files[i].split('.').pop() !== 'tpl') {
		continue;
	}

	var input = files[i];
	var output = files[i].split('.').slice(0, -1).concat('js').join('.');

	var command = 'java -jar "../3thd-party/soyutils/SoyToJsSrcCompiler.jar" \
	--shouldProvideRequireSoyNamespaces \
	--outputPathFormat ' + 
		output_folder + output + ' ' + '"./' + input + '"';

	commands.push(command);
	templates.push(output);
}

function execSync(commands, i) {
	i = i || 0;
	if (i === commands.length) {
		var include_file = '';
		for (var i in compiled) {
			include_file += 'Include(\'' + compiled[i] + '\');\n';
		}

		fs.writeFileSync(output_folder + 'Include.js', include_file, 'utf-8');
		return;
	}
	
	exec(commands[i], function puts(error, stdout, stderr) { 
		console.log(commands[i]);
		console.log(error); 

		if (!error) {
			compiled.push(templates[i]);
		}

		sys.puts(stdout) 
		execSync(commands, ++ i);
	});
}

execSync(commands);
