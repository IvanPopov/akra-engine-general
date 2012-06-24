Include('ide.ini');
Include(A_IDE['core']['path']);
Define(A_CORE_HOME, A_IDE['core']['path']);

A_DEFINE_NAMESPACE(IDE);

Include('Templates.js');
Include('PluginBase.js');
Include('MainFrame.js');
alert(A_CORE_HOME);