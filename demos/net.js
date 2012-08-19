function onConnection(pErr) {
	debug_assert(pErr, pErr.message);

	trace('connected.');
}



var pPipe = a.NET.pipe('ws://localhost');

if (pPipe) {
	pPipe.on('open', function () {
		// pPipe.rpc();

		// var n = 0;

		// for (var i = 1000; i --;) {
		// 	(function (id) { 
		// 		pPipe.proc('echo', id, function (pRes) {
		// 			trace(id, '==', pRes, 'test: ', pRes === id? 'passed': 'failed');
		// 		});
		// 	})(Math.floor(Math.random() * 10000));
		// }
		 
		trace('works...');

	})
}

