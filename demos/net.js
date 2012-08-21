var useWorker = false;

if (useWorker) {
	var pipe = new a.NET.Pipe('/akra-engine-core/src/network/RPCthread.js');

	pipe.on('message', function (pMessage) {
		trace('message from pipe: ', pMessage);
	});

	pipe.on('error', function () {
		trace('oops, something going wrong...');
	});

	pipe.send(true);

}
else {

	var rpc = new a.NET.RPC('ws://localhost', {}, function () {
	var i = 0;
	setInterval(function () {
		rpc.echo(i ++, function (n) {
			trace(n);
		});
		rpc.bufferTest(function (pBuffer) {
			trace(new Float32Array(pBuffer));
		});
		}, 1000);
	});

}