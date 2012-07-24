var sSource = a.ajax({url:'http://akra/akra-engine-general/media/effects/Demo_simple.fx', async: false}).data;
a.util.parser.parse(sSource);
var pTree= a.util.parser.pSyntaxTree;
var pEffect = new a.fx.Effect();
pEffect.analyze(pTree);
trace(pEffect);