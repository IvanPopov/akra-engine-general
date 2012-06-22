importScripts('/media/data/jsXMLParser/compressed/tinyxmlsax.js', '/media/data/jsXMLParser/compressed/tinyxmlw3cdom.js')

function readXML(url){

	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send(null);
	
	

	if(xhr.status == 200 && xhr.readyState == 4){
	    var parser = new DOMImplementation();
		var domDoc = parser.loadXML(xhr.response);
		var docRoot = domDoc.getDocumentElement();
		var firstTag1 = docRoot.getElementsByTagName("value").item(0);
		postMessage(firstTag1.getXML());
	}	
		
}

onmessage = function(e) { 
	
	readXML('/media/data/test.xml'); 
}

