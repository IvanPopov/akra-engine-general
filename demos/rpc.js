var rpc = new a.NET.RPC('ws://localhost');
/*
rpc.proc('getMegaTexture', "1234",32001,32001,0,0,32,32,0,function (pBuffer) {
		trace(new Uint8Array(pBuffer));
	});*/
var i = 0;

for(var k=0;k<20;k++)
{
	var p=new Date();	
	rpc.proc('getMegaTexture', "1234",1000,1000,0,0,1024,1024,0,function (pBuffer) 
	{
			trace(i ++, pBuffer.byteLength, 'bytes');//new Uint8Array(pBuffer)
			trace((new Date()) -p);
			
	});	
}



	
