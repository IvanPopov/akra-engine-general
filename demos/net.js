function onConnection(pErr) {
	debug_assert(pErr, pErr.message);

	trace('connected.');
}



var rpc = new a.NET.RPC('ws://localhost', {}, function () {
	var i = 0;
	setInterval(function () {
		rpc.echo(i ++, function (n) {
			trace('echo:', n);
		});
		rpc.bufferTest(function (pBuffer) {
			trace('Float32Array >> ', new Float32Array(pBuffer));
		});
	}, 1000);
});

//var pipe = new a.NET.Pipe('ws://localhost');

//var i = 0;




//rpc.trace(1,2,3);