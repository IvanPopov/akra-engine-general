Include("../../akra-engine-core/EffectParser/parser.js");
Include("../../akra-engine-core/EffectParser/Effect.js");

var pParser = new Parser();
var sGrammar, sSource;
a.fopen("/akra-engine-general/media/grammars/HLSL_grammar.gr", "r").read(function (pData) {
	sGrammar = pData;
	a.fopen("/akra-engine-general/media/effects/Demo_simple.fx", "r").read(function (pData1) {
		sSource = pData1;
		pParser.init(sGrammar);
		pParser.parse(sSource);
        var pTree= pParser.pSyntaxTree;
        trace(pTree);
        var pEffect = new Effect();
        pEffect.analyze(pTree);
        trace(pEffect);
	});
});