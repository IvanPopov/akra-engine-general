function MyGame() {
	A_CLASS;

	this.bGo = false;
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

MyGame.prototype.buildTestScene = function (pVerticesData, pNormalsData, pIndicesData)
{
	var pVideoBuffer = this.pVideoBuffer = this.displayManager().videoBufferPool().createResource('video_test');
	var pCommonData = new Float32Array(pNormalsData.concat(pVerticesData).concat(pIndicesData));
	pVideoBuffer.create(pCommonData.byteLength, 0, pCommonData);
	var pDecl = new a.VertexDeclaration([
		{nCount:3, eType:a.DTYPE.FLOAT, eUsage:a.DECLUSAGE.POSITION},
		{nCount:3, eType:a.DTYPE.FLOAT, eUsage:a.DECLUSAGE.NORMAL},
		{nCount:1, eType:a.DTYPE.FLOAT, eUsage:a.DECLUSAGE.INDEX3}]);

	var pVertexBuffer = this.displayManager().vertexBufferPool().createResource('vertex_buffer');
	pVertexBuffer.create(pSerialsData.byteLength, 0, pSerialsData);

	var pSerialDecl = new a.VertexDeclaration([
		                                          {nCount:1, eType:a.DTYPE.FLOAT, eUsage:a.DECLUSAGE.INDEX1},
		                                          {nCount:1, eType:a.DTYPE.FLOAT, eUsage:a.DECLUSAGE.INDEX2, iOffset: -4}
	                                          ]);

	var pSerials = pVertexBuffer.getVertexData(0, pSerialsData.length, pSerialDecl);

	var pMap = new a.BufferMap(this);

	pMap.flow(0, pIndices);

	pMap.mapping(0, pSerials, a.DECLUSAGE.INDEX1);
	pMap.mapping(0, pSerials, a.DECLUSAGE.INDEX2);

	this.pMap = pMap;
	var pProgram = this.pShaderProgram = this.displayManager().shaderProgramPool().createResource('prog_0');
	pProgram.create(generateVSSource(pMap), generateFSSource(), true);

	//this.pDevice.disableVertexAttribArray(1);
	this.pDevice.disableVertexAttribArray(2);

	this.bGo = true;

	return true;
};

MyGame.prototype.initDeviceObjects = function () {

	//var pModel = new Collada(this, '/media/models/kr360.dae');

	this.notifyInitDeviceObjects();
//	var pVerticesData = [
//		-0.5, 0.5, 0.5,
//		0.5, 0.5, 0.5,
//		-0.5, -0.5, 0.5,
//		0.5, -0.5, 0.5,
//		-0.5, 0.5, -0.5,
//		0.5, 0.5, -0.5,
//		-0.5, -0.5, -0.5,
//		0.5, -0.5, -0.5
//	];
//	var pNormalsData = [
//		1.0, 0.0, 0.0,
//		-1.0, 0.0, 0.0,
//		0.0, 1.0, 0.0,
//		0.0, -1.0, 0.0,
//		0.0, 0.0, 1.0,
//		0.0, 0.0, -1.0
//	];
//	var pIndicesData = [
//		0, 4, 2, 4, 3, 4, 0, 4, 3, 4, 1, 4,
//		0, 2, 1, 2, 5, 2, 0, 2, 5, 2, 4, 2,
//		6, 3, 7, 3, 3, 3, 6, 3, 3, 3, 2, 3,
//		0, 1, 4, 1, 6, 1, 0, 1, 6, 1, 2, 1,
//		3, 0, 7, 0, 5, 0, 3, 0, 5, 0, 1, 0,
//		5, 5, 7, 5, 6, 5, 5, 5, 6, 5, 4, 5
//	];

	var pModel = new ObjModel();
	var me = this;
	pModel.load('/media/models/dodecahedron.obj', function () {
		//console.log(pModel.getVertices(), pModel.getNormals(), pModel.getIndexes());
		me.buildTestScene(pModel.getVertices(), pModel.getNormals(), pModel.getIndexes());
		//me.buildTestScene(pVerticesData, pNormalsData, pIndicesData);
	});

	//this.buildTestScene(pVerticesData, pNormalsData, pIndicesData);
	return true;
};

function generateFSSource() {
	return '\
    #ifdef GL_ES                    \n\
        precision highp float;      \n\
    #endif                          \n\
        varying vec4 color;         \n\
        varying vec3 dist;          \n\
        void main(void) {           \n\
        // Undo perspective correction.\n\
            vec3 dist_vec = dist * color.w;   \n\
                                                                                    \n\
            // Compute the shortest distance to the edge                            \n\
            float d = min(dist_vec[0], min(dist_vec[1], dist_vec[2]));          \n\
                                                                                    \n\
            // Compute line intensity and then fragment color                       \n\
            float I = exp2(-0.1 * d * d * d);                                  \n\
            vec3 c = I * vec3(1., 1., 1.) + (1.0 - I) * color.xyz;\n\
            gl_FragColor = vec4(c, abs(I - 1.) < 0.1? 1. : 0.85);   \n\
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
	sCode += 'A_TextureHeader dataTextureHeader;\n';

	sCode += 'varying vec3 dist;\n';
	sCode += 'varying vec4 color;\n';
	sCode += 'const vec4 dirDif = vec4(0., 0., 1., 0.);\n';
	sCode += 'const vec4 dirHalf = vec4(-.4034, .259, .8776, 0.);\n';

	sCode += '\n\n void main(void)\n {\n';
	sCode += '\tA_extractTextureHeader(A_buffer_0, dataTextureHeader);\n';

//	for (var i = 0; i < pMap.size; ++i) {
//		for (var j = 0; j < pFlows[i].pData.getVertexDeclaration().length; j++) {
//			if (pFlows[i].eType !== a.BufferMap.FT_MAPPABLE) continue;
//			sCode += '\t';
//
//			var pVertexElement = pFlows[i].pData.getVertexDeclaration()[j]
//			var sType = '';
//			switch (pVertexElement.nCount) {
//				case 1:
//					sType = 'float';
//					break;
//				case 2:
//					sType = 'vec2';
//					break;
//				case 3:
//					sType = 'vec3';
//					break;
//				case 4:
//					sType = 'vec4';
//					break;
//			}
//			sCode +=
//			sType + ' ' + pVertexElement.eUsage + ' = ' + 'A_extractVec3(A_buffer_0, dataTextureHeader, ('
//				+ pVertexElement.eUsage + '_offset + ' + pFlows[i].pMapper.eSemantics + '.x * ' +
//			pVertexElement.size + '.) / 4.0)' + ';\n';
//
//		}
//	}


	sCode += '\tfloat NORMAL_index = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + INDEX2 * 4.) / 4.);\n';
	sCode += '\tfloat POSITION_index = A_extractFloat(A_buffer_0, dataTextureHeader, (INDEX3_offset + INDEX1 * 4.) / 4.);\n';

	sCode += '\tvec3 NORMAL = A_extractVec3(A_buffer_0, dataTextureHeader, (NORMALS_offset + NORMAL_index * 12.) / 4.);\n';
	sCode += '\tvec3 POSITION = A_extractVec3(A_buffer_0, dataTextureHeader, (POSITION_offset + POSITION_index * 12.) / 4.);\n\n';

	sCode += '\tvec4 vertex = prMatrix * mvMatrix * vec4(POSITION, 1.0);gl_Position = vertex;\n';
	sCode += '\n\tvec4 rotNorm = mvMatrix * vec4( normalize( NORMAL ), .0);\n';
	sCode += '\tfloat i = max( 0., abs(dot(rotNorm, dirDif)) );\n';
	sCode += '\tcolor = vec4(0, .3*i, .7*i, 1.);\n';
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
	                                                                                    \n\
	    dist *= vertex.w; ';

	sCode += '}\n';
	//trace(sCode);
	return sCode;
}

MyGame.prototype.deleteDeviceObjects = function () {
	this.notifyDeleteDeviceObjects();
	return true;
}

MyGame.prototype.littleRender = function () {
	if (!this.bGo) {
		return;
	}

	var pProgram = this.pShaderProgram;
	var pMap = this.pMap;
	var pCamera = this.getActiveCamera();

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
	var App = new MyGame("canvas");
	//Создаем приложение
	if (App.create()) {
		//Запускаем приложение
		App.run();
	}
}