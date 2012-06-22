function MyGame() {
	A_CLASS;

	this.iTargetForRender = 0;
	this.pMap = null;
}
a.extend(MyGame, a.Engine);

MyGame.prototype.oneTimeSceneInit = function () {
	this.notifyOneTimeSceneInit();
	this.setupWorldOcTree(new a.Rect3d(-500.0, 500.0, -500.0, 500.0, 0.0, 500.0));
	this.showStats(true);

	return true;
}

MyGame.prototype.restoreDeviceObjects = function () {
	this.notifyRestoreDeviceObjects();
	return true;
}

var iNormalsOffset, iVerticesOffset;

MyGame.prototype.buildTestScene = function (pVerticesData, pNormalsData, pIndicesDataArray) {
	var pVideoBuffer = this.pVideoBuffer = this.displayManager().videoBufferPool().createResource('video_test');
	var nTotalBytes = pVerticesData.byteLength + pNormalsData.byteLength;

	for (var i = 0; i < pIndicesDataArray.length; i++) {
		nTotalBytes += pIndicesDataArray[i].byteLength;
	};

	pVideoBuffer.create(nTotalBytes, FLAG(a.VBufferBase.RamBackupBit));

    var pVertices 	= pVideoBuffer.allocateData(VE_VEC3('POSITION'), pVerticesData);
	var pNormals 	= pVideoBuffer.allocateData(VE_VEC3('NORMAL'), pNormalsData);
    var pIndices 	= [];

    for (var i = 0; i < pIndicesDataArray.length; i++) {
    	pIndices[i] = pVideoBuffer.allocateData(VE_FLOAT('INDEX3'), pIndicesDataArray[i]);	
    };

	iNormalsOffset = pNormals.getOffset();
	iVerticesOffset = pVertices.getOffset();

	var pSerialsData = [], nTotalBytes = 0;
	for (var j = 0; j < pIndicesDataArray.length; j++) {
		pSerialsData[j] = new Float32Array(pIndicesDataArray[j].length);
		for (var i = 0; i < pSerialsData[j].length; ++i) {
			pSerialsData[j][i] = i;
		}
		nTotalBytes += pSerialsData[j].byteLength;
	};

	var pVertexBuffer = this.displayManager().vertexBufferPool().createResource('vertex_buffer');
	pVertexBuffer.create(nTotalBytes, FLAG(a.VBufferBase.RamBackupBit));

	//INDEX1 --> index for vertices
	//INDEX2 --> index for normals
	var pSerials = [];
	for (var i = 0; i < pSerialsData.length; i++) {
		pSerials[i] = pVertexBuffer.allocateData(
			[VE_FLOAT('INDEX1'), VE_FLOAT('INDEX2', -4)], 
			pSerialsData[i]);
	};


	var pMap = this.pMap = [];
	for (var i = 0; i < pSerials.length; i++) {
		pMap[i] = new a.BufferMap(this);

		pMap[i].flow(0, pIndices[i]);
		pMap[i].mapping(0, pSerials[i], 'INDEX1');
		pMap[i].mapping(0, pSerials[i], 'INDEX2');
	};

	var pProgram = this.pShaderProgram = this.displayManager().shaderProgramPool().createResource('prog_0');
	pProgram.create(generateVSSource(pMap[0]), generateFSSource(), true);
	pProgram.activate();
	pProgram.applyVector4('ambient', new a.Color4f(.3, .3, .3, 1.));
	//this.pDevice.disableVertexAttribArray(1);
	this.pDevice.disableVertexAttribArray(2);
	this.iTargetForRender = 0;

	return true;
};

MyGame.prototype.initDeviceObjects = function () {
	this.notifyInitDeviceObjects();

	var pModel = new ObjModel();
	var me = this;
	pModel.load('/media/models/teapot.obj', function () {
		//console.log(pModel.getVertices(), pModel.getNormals(), pModel.getIndexes());
		me.buildTestScene(
			new Float32Array(pModel.getVertices()), 
			new Float32Array(pModel.getNormals()), 
			[new Float32Array(pModel.getIndexes()), new Float32Array(pModel.getIndexes())]);
		//me.buildTestScene(pVerticesData, pNormalsData, pIndicesData);
	});
	return true;
};

function generateFSSource() {
	return '\
    #ifdef GL_ES                    \n\
        precision highp float;      \n\
    #endif                          \n\
        varying vec4 color;         \n\
        varying vec3 dist;          \n\
        uniform sampler2D A_buffer_0;\n\
        void main(void) {           \n\
        \
        // Undo perspective correction.\n\
            vec3 dist_vec = dist * color.w;   \n\
                                                                             			\n\
            // Compute the shortest distance to the edge                     			\n\
            float d = min(dist_vec[0], min(dist_vec[1], dist_vec[2]));       			\n\
                                                                             			\n\
            // Compute line intensity and then fragment color                			\n\
            float I = exp2(-10.01 * d * d * d);                              			\n\
            vec3 c = I * vec3(1., 1., 1.) + (1.0 - I) * color.xyz;						\n\
            gl_FragColor = vec4(c, abs(I /*+ 0.00001 * t*/ - 1.) < 0.1? 1. : 0.85);   	\n\
        }                           \n\
        ';
}
function generateVSSource(pMap) {
	var sCode = '#define A_VB_COMPONENT4\n\n';

	sCode += a.ajax({
		                url:  '../effects/decode_texture.glsl',
		                async:false
	                }).data;

	sCode += '\n\n';

	var pMappers = pMap.mappers;
	var pFlows = pMap.flows;


	for (var i = 0; i < pMappers.length; i++) {
		sCode += ('attribute ' + 'float ' + pMappers[i].eSemantics + ';\n');
	}
	//sCode += '\nattribute float INDEX3;\n';

	sCode += '\n\n';
	for (var i = 0; i < pMap.size; ++i) {
		for (var j = 0; j < pFlows[i].pData.getVertexDeclaration().length; j++) {
			var pVertexElement = pFlows[i].pData.getVertexDeclaration()[j];
			sCode += 'const float ' + pVertexElement.eUsage + '_offset = ' +
			         (pFlows[i].pData.getOffset() + VIDEOBUFFER_HEADER_SIZE * 4) + '.;\n';
		}

	}

	sCode += 'const float NORMALS_offset = ' + (iNormalsOffset + VIDEOBUFFER_HEADER_SIZE * 4) + '.;\n';
	sCode += 'const float POSITION_offset = ' + (iVerticesOffset + VIDEOBUFFER_HEADER_SIZE * 4) + '.;\n';

	sCode += '\nuniform mat4 mvMatrix;\n';
	sCode += 'uniform mat4 prMatrix;\n';
	sCode += 'uniform sampler2D A_buffer_0;\n';
	sCode += 'uniform vec4 ambient;\n';
	sCode += 'A_TextureHeader dataTextureHeader;\n';

	sCode += 'varying vec3 dist;\n';
	sCode += 'varying vec4 color;\n';
	sCode += 'const vec4 dirDif = vec4(0., 0., 1., 0.);\n';
	sCode += 'const vec4 dirHalf = vec4(-.4034, .259, .8776, 0.);\n';

	sCode += '\n\n void main(void)\n {\n';
	sCode += '\tA_extractTextureHeader(A_buffer_0, dataTextureHeader);\n';
	sCode += '\tfloat NORMAL_index = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + INDEX2 * 4.) / 4.);\n';
	sCode += '\tfloat POSITION_index = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + INDEX1 * 4.) / 4.);\n';

	sCode += '\tvec3 NORMAL = A_extractVec3(A_buffer_0, dataTextureHeader, (NORMALS_offset + NORMAL_index * 12.) / 4.);\n';
	sCode += '\tvec3 POSITION = A_extractVec3(A_buffer_0, dataTextureHeader, (POSITION_offset + POSITION_index * 12.) / 4.);\n\n';

	sCode += '\tvec4 vertex = prMatrix * mvMatrix * vec4(POSITION, 1.0);gl_Position = vertex;\n';
	sCode += '\n\tvec4 rotNorm = mvMatrix * vec4( normalize( NORMAL ), .0);\n';
	sCode += '\tfloat i = max( 0., abs(dot(rotNorm, dirDif)) );\n';
	sCode += '\tcolor = vec4(ambient.rgb * i, ambient.a);\n';
	sCode += '\ti = pow( max( 0., abs(dot(rotNorm, dirHalf)) ), 40.);\n';
	sCode += '\tcolor += vec4(i, i, i, 0.);\n';

	sCode += '' +
	         'float swizz = mod(INDEX1, 3.);                                            \n\
	          mat4 ModelViewProjectionMatrix = prMatrix * mvMatrix;                    \n\
	          vec2 p0 = vertex.xy / vertex.w;                                          \n\
	    float vertex_index0, vertex_index1, vertex_index2;\n\
	    if (swizz < 0.1) {\
	        vertex_index0 = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + (INDEX2 + 0.) * 4.) / 4.);\n\
	        vertex_index1 = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + (INDEX2 + 1.) * 4.) / 4.);\n\
	        vertex_index2 = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + (INDEX2 + 2.) * 4.) / 4.);\n\
	    }\
	    else if (swizz < 1.1) {\
	        vertex_index0 = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + (INDEX2 - 1.) * 4.) / 4.);\n\
	        vertex_index1 = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + (INDEX2 + 0.) * 4.) / 4.);\n\
	        vertex_index2 = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + (INDEX2 + 1.) * 4.) / 4.);\n\
	    }\n\
	    else {\n\
	         vertex_index0 = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + (INDEX2 - 2.) * 4.) / 4.);\n\
	         vertex_index1 = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + (INDEX2 - 1.) * 4.) / 4.);\n\
	         vertex_index2 = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + (INDEX2 - 0.) * 4.) / 4.);\n\
		}\n\
	    vec4 p0_3d, p1_3d, p2_3d;                                                  \n\
	    p0_3d = ModelViewProjectionMatrix * vec4(A_extractVec3(A_buffer_0, dataTextureHeader, (POSITION_offset + vertex_index0 * 12.) / 4.), 1.);\n\
	    p1_3d = ModelViewProjectionMatrix * vec4(A_extractVec3(A_buffer_0, dataTextureHeader, (POSITION_offset + vertex_index1 * 12.) / 4.), 1.);\n\
	    p2_3d = ModelViewProjectionMatrix * vec4(A_extractVec3(A_buffer_0, dataTextureHeader, (POSITION_offset + vertex_index2 * 12.) / 4.), 1.);\n\
	    \
	    vec2 WinScale = vec2(800. / 2., 600. / 2.);\n\
	    vec2 v1 = WinScale * (p1_3d.xy / p1_3d.w - p0_3d.xy / p0_3d.w);                          \n\
	    vec2 v2 = WinScale * (p2_3d.xy / p2_3d.w - p0_3d.xy / p0_3d.w);                          \n\
                                                                                        \n\
	    // Compute 2D area of triangle.                                                 \n\
	    float area2 = abs(v1.x * v2.y - v1.y * v2.x);                              \n\
                                                                                        \n\
	    // Compute distance from vertex to line in 2D coords                            \n\
	    float h = area2 / length(v1 - v2);                                          \n\
                                                                                        \n\
	    // ---                                                                          \n\
	    // The swizz variable tells us which of the three vertices                      \n\
	    // we are dealing with. The ugly comparisons would not be needed if             \n\
	    // swizz was an int.                                                            \n\
	    	  	                                                                            \n\
	    if(swizz < 0.1)                                                                \n\
	       dist = vec3(h, 0., 0.);                                                    \n\
	    else if(swizz < 1.1)                                                           \n\
	       dist = vec3(0., h, 0.);                                                    \n\
	    else                                                                            \n\
	       dist = vec3(0., 0., h);                                                    \n\
                                                                                        \n\
	    // ----                                                                         \n\
	    // Quick fix to defy perspective correction                                     \n\
	        //        float t = 0.;\n\
            //for (int i = 0; i < 512; ++ i) {\n\
            \n\
            //A_EXTRACT_FLOAT(A_buffer_0, dataTextureHeader, (INDEX3_offset + (float(i) - 2.) * 4.) / 4.);\n\
            //    t += A_TEMP;\n\
            //t += A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + (float(i) - 2.) * 4.) / 4.);\n\
            \
            //}\n\
	    dist *= vertex.w;// + 0.00000001 * t; \n';

	sCode += '}\n';
	//trace(sCode);
	return sCode;
}

MyGame.prototype.deleteDeviceObjects = function () {
	this.notifyDeleteDeviceObjects();
	return true;
}

MyGame.prototype.littleRender = function () {
	if (!this.pMap || !this.pMap.length) {
		return;
	}

	var iCurrent;
	var pProgram = this.pShaderProgram;
	var pMap;
	var pCamera = this.getActiveCamera();

	if (this.pKeymap.isKeyPress(a.KEY.N1)) {
		this.iTargetForRender = 0;
		pProgram.applyVector4('ambient', new a.Color4f(.0, .3, .7, 1.));
	}
	else if (this.pKeymap.isKeyPress(a.KEY.N2)) {
		this.iTargetForRender = 1;
		pProgram.applyVector4('ambient', new a.Color4f(.7, .3, .0, 1.));
	}

	if (this.iTargetForRender >= this.pMap.length) {
		this.iTargetForRender = 0;
	}

	iCurrent = this.iTargetForRender;
	pMap = this.pMap[iCurrent];


	pProgram.activate();
	pProgram.applyBufferMap(pMap);
	pProgram.applyMatrix4('prMatrix', pCamera.projectionMatrix());
	pProgram.applyMatrix4('mvMatrix', pCamera.viewMatrix());

	if (this.pKeymap.isKeyPress(a.KEY.B)) {
		this.pDevice.enable(this.pDevice.BLEND);
		this.pDevice.disable(this.pDevice.DEPTH_TEST);
		this.pDevice.blendFunc(this.pDevice.SRC_ALPHA, this.pDevice.ONE);
	}
	else {
		this.pDevice.enable(this.pDevice.DEPTH_TEST);
		this.pDevice.disable(this.pDevice.BLEND);
	}


	pMap.draw();
};

MyGame.prototype.updateScene = function () {
	this.updateCamera(1.0, 0.1, null, 30.0, false);

	if (this.pKeymap.isMousePress() && this.pKeymap.isMouseMoved()) {
		var pCamera = this.getActiveCamera(),
			fdX = this.pKeymap.mouseShitfX(),
			fdY = this.pKeymap.mouseShitfY(),
			pScreen = a.info.screen;

		fdX /= pScreen.width / 10.0;
		fdY /= pScreen.height / 10.0;

		pCamera.addRelRotation(-fdX, -fdY, 0);
	}


	return this.notifyUpdateScene();
}

if (!a.info.support.webgl) {
	alert('Error:: Your browser does not support WebGL.');
}
else {
	//Обявляем приложение
	var App = new MyGame();
	//Создаем приложение
	if (App.create('canvas')) {
		//Запускаем приложение
		App.run();
	}
}