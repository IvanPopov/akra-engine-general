/**
 * @file
 * @author reinor
 */
(function(){
function readFile(url) {
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
        
    xmlhttp.open('GET', url, false);
    xmlhttp.send(null);
        
    return xmlhttp.responseText;
};

Syntax = {
    AssignmentExpression: 'AssignmentExpression',
    ArrayExpression: 'ArrayExpression',
    BlockStatement: 'BlockStatement',
    BinaryExpression: 'BinaryExpression',
    BreakStatement: 'BreakStatement',
    CallExpression: 'CallExpression',
    CatchClause: 'CatchClause',
    ConditionalExpression: 'ConditionalExpression',
    ContinueStatement: 'ContinueStatement',
    DoWhileStatement: 'DoWhileStatement',
    DebuggerStatement: 'DebuggerStatement',
    EmptyStatement: 'EmptyStatement',
    ExpressionStatement: 'ExpressionStatement',
    ForStatement: 'ForStatement',
    ForInStatement: 'ForInStatement',
    FunctionDeclaration: 'FunctionDeclaration',
    FunctionExpression: 'FunctionExpression',
    Identifier: 'Identifier',
    IfStatement: 'IfStatement',
    Literal: 'Literal',
    LabeledStatement: 'LabeledStatement',
    LogicalExpression: 'LogicalExpression',
    MemberExpression: 'MemberExpression',
    NewExpression: 'NewExpression',
    ObjectExpression: 'ObjectExpression',
    Program: 'Program',
    Property: 'Property',
    ReturnStatement: 'ReturnStatement',
    SequenceExpression: 'SequenceExpression',
    SwitchStatement: 'SwitchStatement',
    SwitchCase: 'SwitchCase',
    ThisExpression: 'ThisExpression',
    ThrowStatement: 'ThrowStatement',
    TryStatement: 'TryStatement',
    UnaryExpression: 'UnaryExpression',
    UpdateExpression: 'UpdateExpression',
    VariableDeclaration: 'VariableDeclaration',
    VariableDeclarator: 'VariableDeclarator',
    WhileStatement: 'WhileStatement',
    WithStatement: 'WithStatement'
};

VariableType = {
    Function : {
        prefix : "fn",
        prefixAlternatives : [],
        type : "Function",
        typeAlternatives : ["Func"]
    },
    Integer : {
        prefix : "i",
        prefixAlternatives : [],
        type : "Integer",
        typeAlternatives : ["Int","uInt","Short"]
    },
    Float : {
        prefix : "f",
        prefixAlternatives : [],
        type : "Float",
        typeAlternatives : ["Double"]
    },
    Enum : {
        prefix : "e",
        prefixAlternatives : [],
        type : "Enum",
        typeAlternatives : ["Enumeration"]
    },
    Pointer : {
        prefix : "p",
        prefixAlternatives : [],
        type : "Pointer",
        typeAlternatives : []
    },
    PointerToPointer : {
        prefix : "pp",
        prefixAlternatives : [],
        type : "PointerToPointer",
        typeAlternatives : []
    },
    String : {
        prefix : "s",
        prefixAlternatives : [],
        type : "String",
        typeAlternatives : []
    },
    Number : {
        prefix : "n",
        prefixAlternatives : [],
        type : "Number",
        typeAlternatives : []
    },
    Boolean : {
        prefix : "is",
        prefixAlternatives : ["are","has","have","can","b"],
        type : "Boolean",
        typeAlternatives : ["bool"]
    },
    Float32Array : {
        prefix : "",
        prefixAlternatives : ["v2f","v3f","v4f","m2f","m3f","m4f"],
        type : "Float32Array",
        typeAlternatives : ["Vec2","Vec3","Vec4","Mat2","Mat3","Mat4"]
    },
    Int32Array : {
        prefix : "",
        prefixAlternatives : ["v2i","v3i","v4i","m2i","m3i","m4i"],
        type : "Int32Array",
        typeAlternatives : ["Vec2","Vec3","Vec4","Mat2","Mat3","Mat4"]
    }
};

function simplifyPath (path) {

    var realPath = [];
    path = path.replace('\\', '/').split('/');
    for (var i in path) {
        if (path[i] == '..') {
            realPath.pop();
        }
        else {
            realPath.push(path[i]);
        }
    }
    return realPath.join('/');
};

function watch() {
    var inlineSources = document.getElementsByTagName('script');
    var sStr = '';
    for (var i in inlineSources) {
        var src = inlineSources[i];
        if (src.type == 'text/raw-js') {
            if (src.src) {
                sStr += readFile(src.src);
            }

            sStr += src.innerHTML;
        }
    }
    if(sStr != ''){
      var pDoc = new Docreator;
      pDoc.generateDocumentationFromString(sStr);
    }
};

String.prototype.escapeForRegExp = function(){
    return this.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

String.prototype.replaceExactMatch = function(pPattern,sReplace){
    var iIndex = 0;
    var sTmp,sTmp2;
    var sResult = this;
    if(pPattern instanceof String){
        while((iIndex = sResult.indexOf(pPattern,iIndex)) != -1){
            sTmp = sResult.slice(0,iIndex);
            sTmp2 = sResult.slice(iIndex + pPattern.length + 1);
            sResult = sTmp.concat(sReplace,sTmp2);
            iIndex += sReplace.length + 1; 
        }
    }
    else if(pPattern instanceof RegExp){
        var pMatches = sResult.match(pPattern);
        if(pMatches){
            for(var i=0;i<pMatches.length;i++){
                iIndex = sResult.indexOf(pMatches[i],iIndex);
                sTmp = sResult.slice(0,iIndex);
                sTmp2 = sResult.slice(iIndex + pMatches[i].length + 1);
                sResult = sTmp.concat(sReplace,sTmp2);
                iIndex += sReplace.length + 1; 
            }
        }
    }
    else{
        console.error("wrong argument type");
    }
    return sResult;
};

function Docreator(){
    this._allIncluded = false;
    this._parseResult = null;
    this._rawText = null;
    this.pFunctions = {};
    this.pGlobalFunctions = {};
    this.pStructures = {};
    this.pClasses = {};
    this.pGlobalEnums = {};
    this.pObjects = {};
    this.pDefines = {
                        functions : {},
                        constants : {}
                    };
                        
    this.pIncludedFiles = {};
};

Docreator.prototype.generateDocumentationFromFile = function(sFileName){
    return this.generateDocumentationFromString("Include(\"" + sFileName + "\");");
};

Docreator.prototype.generateDocumentationFromString = function(sStr){
    this._rawText = this._recursiveLoad(sStr);
//    //console.error(this._rawText);
//    console.error(this._rawText);
    this._parseResult = esprima.parse(this._rawText,{comment : true, range : true});
//    if(!this._allIncluded){
//        return this.generateDocumentationFromString(this._rawText);
//    }
//    else{
    console.log(this._parseResult);
    this._processParseResult();
    console.log(this.pIncludedFiles);
        var result =    {
                            functions : this.pFunctions,
                            globalFunctions : this.pGlobalFunctions,
                            structures : this.pStructures,
                            classes : this.pClasses,
                            enums : this.pGlobalEnums,
                            defines : this.pDefines,
                            objects : this.pObjects
                        }
        
        console.log(result);
        return result;
//    }
};

Docreator.prototype._recursiveLoad = function(sStr,sPath){
//    var options = {
//        comment: true,
//        raw: document.getElementById('raw').checked,
//        range: true
//        loc: document.getElementById('loc').checked
//    };
    var pResult = esprima.parse(sStr,{comment : true, range : true});
    
    //console.log(pResult);
    
    var sResult = sStr.slice(0);
    var sName;
    var sFullPath = sPath || "";
    var sReplace;
    var bUseFileMarks = true;
    var sFilePath;
    var bAllFileMarks = true;
    //var iInd;
    //console.log(sStr,sFullPath);
    for(var i=0;i<pResult.body.length;i++){
        var node = pResult.body[i];
        if(node.type == Syntax.ExpressionStatement){ 
            var pExpression = node.expression;
            if(pExpression.callee && pExpression.callee.name == "Include"){
                if(pExpression.arguments.length != 1){
                    console.error("unknown include type",node);
                    continue;
                }
                var sArgument = node.expression.arguments[0].value;
                var pTmp = /[\w\W]*[\S]/.exec(sArgument);
                if(!pTmp){
                    console.error("wrong include argument",sArgument);
                    continue;
                }
                sArgument = pTmp[0];
                
                var iInd = sArgument.lastIndexOf('/');
                if(iInd == -1){
                    sName = sArgument.slice(0);
                    if(sName == "Include.js"){
                        bUseFileMarks = false;
                    }
                    sFilePath = simplifyPath(sFullPath + sName);
                    if(!this.pIncludedFiles[sFilePath]){
                        sReplace = readFile(sFilePath);
                        sReplace = this._recursiveLoad(sReplace, sFullPath);
                        this.pIncludedFiles[sFilePath] = {};
                    }
                    else{
                        continue;
                    }
                }
                else if(iInd == sArgument.length - 1){
                    sFilePath = simplifyPath(sFullPath + sArgument + "Include.js");
                    bUseFileMarks = false;
                    if(!this.pIncludedFiles[sFilePath]){
                        sReplace = readFile(sFilePath);
                        sReplace = this._recursiveLoad(sReplace, sFullPath + sArgument);
                        this.pIncludedFiles[sFilePath] = {};
                    }
                    else{
                        continue;
                    }
                }
                else{
                    sName = sArgument.slice(iInd + 1);
                    if(sName == "Include.js"){
                        bUseFileMarks = false;
                    }
                    sFilePath = simplifyPath(sFullPath + sArgument);
                    bUseFileMarks = true;
                    if(!this.pIncludedFiles[sFilePath]){
                        sReplace = readFile(sFilePath);
                        sReplace = this._recursiveLoad(sReplace, sFullPath + sArgument.slice(0,iInd));
                        this.pIncludedFiles[sFilePath] = {};
                    }
                    else{
                        continue;
                    }
                }
                
                //var sArgument = this._loadInclude(node.expression.arguments[0].value);
                var sTmp = sStr.slice(node.range[0],node.range[1] + 1);
                var sTmp2 = "";
                if(bUseFileMarks || bAllFileMarks){
                    sTmp2 += "__StartIncludedFile__(\"" + sFilePath + "\");\n";
                }
                sTmp2 += sReplace;
                if(bUseFileMarks || bAllFileMarks){
                    sTmp2 += "\n__EndIncludedFile__(\"" + sFilePath + "\");\n";
                }
                sResult = sResult.replaceExactMatch(new RegExp(sTmp.escapeForRegExp(),"g"), sTmp2);
            }
        }
    }
    return sResult;
};

Docreator.prototype._loadInclude = function(sFileName){
    return readFile(sFileName);   
};

Docreator.prototype._processParseResult = function(){
    this._buildIncludedFileList();
    
    for(var i=0;i<this._parseResult.body.length;i++){
        var pNode = this._parseResult.body[i];
        if(pNode.type == Syntax.FunctionDeclaration){
            this._processFunctionDefenition(pNode,i);
        }
        else if(pNode.type == Syntax.ExpressionStatement){
            var pExpression = pNode.expression;
            if(pExpression.type == Syntax.AssignmentExpression){
                if(pExpression.right.type == Syntax.FunctionExpression){
                    if(pExpression.left.type == Syntax.MemberExpression){
                        this._processFunctionMethod(pNode,i);
                    }
                }
            }
        }
    }
    
    this._findExtends();
    this._findLocations();
    this._findDefines();
    this._findEnums();
    this._findGettersAnsSetters();
    
    this._parseComments();
};

Docreator.prototype._processFunctionDefenition = function(pNode,iInd){
    
    var pClasses = this.pClasses;
    var pFunctions = this.pFunctions;
    var pStructures = this.pStructures;
    var pObjects = this.pObjects;
    
    var sFunctionText = this._rawText.slice(pNode.range[0],pNode.range[1] + 1);
    var pMembers = this._findMembersInFunction(pNode.body.body);

    var pComments = this._findCommentsForNode(iInd);  
    var sFuncName = pNode.id.name;
    
    if(pComments.length == 0){
        console.warn("no comments",sFuncName);
    }

    var pFile = this._findSourceFile(pNode.range);
    var pArguments = this.buildFunctionArgumentList(pNode.params,sFuncName,sFuncName,pFile.path);
    
    if(!pObjects[sFuncName]){
        if(pMembers.count != 0){
            pStructures[sFuncName] =    {
                                            name : sFuncName,
                                            members : pMembers.members,
                                            text : sFunctionText,
                                            arguments : pArguments,
                                            comments : pComments,
                                            requirement : pFile,
                                            authors : pFile.authors
                                        };
        }
        else{
            pFunctions[sFuncName] =     {
                                            name : pNode.id.name,
                                            text : sFunctionText,
                                            arguments : pArguments,
                                            comments : pComments,
                                            requirement : pFile,
                                            authors : pFile.authors
                                        };
        }
    }
    else{
        var pFunc = pObjects[sFuncName];
        pFunc.name = sFuncName;
        pFunc.members = pMembers.members;
        pFunc.text = sFunctionText;
        pFunc.arguments = pArguments;
        pFunc.comments = pComments;
        pFunc.requirement = pFile;
        pFunc.authors = pFile.authors;
        pClasses[sFuncName] = pFunc;
        delete pObjects[sFuncName];
    }
};

Docreator.prototype._processFunctionMethod = function(pNode,iInd){
    var pClasses = this.pClasses;
    var pFunctions = this.pFunctions;
    var pStructures = this.pStructures;
    var pObjects = this.pObjects;
    var pGlobalFunctions = this.pGlobalFunctions;
    
    var pExpression = pNode.expression;
    
    var sName = pExpression.left.property.name 
        || pExpression.left.property.value;
    var isStatic = false;
    var sFuncName = null;
    if(pExpression.left.object.type == Syntax.MemberExpression
            && pExpression.left.object.property.name == "prototype"){

        if(pExpression.left.object.object.name){
            sFuncName = pExpression.left.object.object.name;
        }
        else{
            sFuncName = pExpression.left.object.object.property.name;
        }    
    }
    else if(pExpression.left.object.type == Syntax.Identifier){
        isStatic = true;
        sFuncName = pExpression.left.object.name;
    }
    else{
        return;
    }

    var pFunc = undefined;
    var pRange = pExpression.right.range;

    var sFunctionText = this._rawText.slice(pRange[0],pRange[1]+1);
    

    var pComments = this._findCommentsForNode(iInd);         

    var pFile = this._findSourceFile(pNode.range);
    var pArguments = this.buildFunctionArgumentList(pExpression.right.params,sName,sFuncName,pFile.path);
    
    if(sFuncName == "window"){
        pGlobalFunctions[sName] =   {
                                        name : sName,
                                        text : sFunctionText,
                                        arguments : pArguments,
                                        comments : pComments,
                                        requirement : pFile,
                                        authors : pFile.authors
                                    };
        return;
    }
    if(pClasses[sFuncName]){
        pFunc = pClasses[sFuncName];
    }
    else if(pObjects[sFuncName]){
        pFunc = pObjects[sFuncName];
    }
    else{
        if(pFunctions[sFuncName]){
            pFunc = pFunctions[sFuncName];
            pClasses[sFuncName] = pFunc;
            delete pFunctions[sFuncName];
        }
        else if(pStructures[sFuncName]){
            pFunc = pStructures[sFuncName];
            pClasses[sFuncName] = pFunc;
            delete pStructures[sFuncName];
        }
        else{
            pFunc = {
                        name: sFuncName,
                        comments : []
                    };
            pObjects[sFuncName] = pFunc;
        }
    }

    if(!pFunc.methods){
        pFunc.methods = {
                            Private : {},
                            //Protected : [],
                            Public : {},
                            Static : {}
                        };
    }

    var pMethod =   {
                        name : sName,
                        text : sFunctionText,
                        arguments : pArguments,
                        comments : pComments,
                        requirement : pFile,
                        authors : pFile.authors
                    };

    if(isStatic){
        pFunc.methods.Static[sName] = pMethod;
    }
    else{
        if(sName[0] == "_"){
            pFunc.methods.Private[sName] = pMethod;
        }
//                            else if(sName[0].toUpperCase() == sName[0])
//                                pFunc.methods.Protected.push(pMethod);
        else{
            pFunc.methods.Public[sName] = pMethod;
        }
    }
};

Docreator.prototype._findEnums = function(pParentNode){
    pParentNode = pParentNode || this._parseResult.body;
    var node;
    for(var i=0;i<pParentNode.length;i++){
        node = pParentNode[i];
        if(node.type == Syntax.FunctionDeclaration){
            this._findEnums(node.body.body);
        }
        else if(node.type == Syntax.ExpressionStatement){
            if(node.expression.type == "CallExpression" &&
                    node.expression.callee.name == "Enum"){
                    
                this._addEnum(node.expression);
            }
        }
    }
};

Docreator.prototype._addEnum = function(node){
    var pEnum = {};
    var pArguments = node.arguments;
    var pEnumArguments;
    var pArgument;
    var pElements = [];
    var pLeft,pRight;
    var pFile;
    
    var iValue;

    pEnum.name = this._rawText.slice(pArguments[1].range[0],pArguments[1].range[1]+1);
    pEnum.location = this._rawText.slice(pArguments[2].range[0],pArguments[2].range[1]+1); 
    
    pFile = this._findSourceFile(node.range);
    
    pEnum.requirement = pFile;
    pEnum.authors = pFile.authors;
    
    if(pArguments[0].type != Syntax.ArrayExpression){
        console.error("unsupproted enum type, first argument not array; enum name : " 
            + pEnum.name);
        return;
    }
    pEnumArguments = pArguments[0].elements;
    
    for(var i=0;i<pEnumArguments.length;i++){
        pArgument = pEnumArguments[i];
        if(pArgument.type == "Identifier"){
            if(i > 0){
                iValue = pElements[i-1].value + 1;
            }
            else{
                iValue = 0;
            }
            pElements[i] = {name : pArgument.name,
                            value : iValue}
        }
        else if(pArgument.type == Syntax.AssignmentExpression
                    && pArgument.operator == "="){
                
            pLeft = pArgument.left;
            pRight = pArgument.right;

            if(pLeft.type != Syntax.Identifier){
                console.error("wrong type of enum argument enum (left) : " 
                    + pEnum.name + " argument number " + i);
                break;
            }
            if(pRight.type != Syntax.Literal){
                console.error("wrong type of enum argument enum (right) : " 
                    + pEnum.name + " argument number " + i);
                break;
            }
            if(typeof pRight.value != "number"){
                console.error("wrong type of enum argument enum (right is not number): " 
                    + pEnum.name + " argument number " + i);
                break;
            }
            pElements[i] = {name : pLeft.name,
                            value : pRight.value};
        }
        else{
            console.error("unsupported enum argument type; enum : " 
                + pEnum.name + " argument number " + i + " type : " + pArgument.type);
            break;
        }
    }
    
    pEnum.elements = pElements;
    
    var pClass = undefined;
    var innerNode = pArguments[2];       
    var sName;
    while(1){        
        if(innerNode.type == Syntax.MemberExpression){
            sName = innerNode.property.name;
            pClass = this.pClasses[sName];
            if(!pClass){
                innerNode = innerNode.object;
            }
            else{
                break;
            }
        }
        else if(innerNode.type == Syntax.Identifier){
            sName = innerNode.name;
            pClass = this.pClasses[sName];
            break;                         
        }
        else{
            break;
        }
    }
                
    if(!pClass)
        if(this.pGlobalEnums[pEnum.name]){
            console.error("Enum with name : " + pEnum.name + " already exist; enums : ",
                this.pGlobalEnums[pEnum.name],pEnum);
        }
        else{
            this.pGlobalEnums[pEnum.name] = pEnum;
        }
    else{
        if(!pClass.enums){
            pClass.enums = {};
        }
        
        if(pClass.enums[pEnum.name]){
            console.error("Enum with name : " + pEnum.name + " already exist; enums : ",
                pClass.enums[pEnum.name],pEnum);
            }
        else{
            pClass.enums[pEnum.name] = pEnum;
        }
    }
};

Docreator.prototype._findMembersInFunction = function(pParentNode){
    var members =   {
                        Private : {},
                        //Protected : [],
                        Public : {}
                    };
                   
    var pNode;
    var pExpression;
    var sName;
    var nMembersCount = 0;
    var isMemberFound = false;
    for(var i=0;i<pParentNode.length;i++){
        pNode = pParentNode[i];
        isMemberFound = false;
        
        if(pNode.type == Syntax.ExpressionStatement){
            pExpression = pNode.expression;
            if(pExpression.type == Syntax.MemberExpression 
                && pExpression.object.type == Syntax.ThisExpression){
                
                sName = pExpression.property.name;
                isMemberFound = true;
            }
            else if(pExpression.type == Syntax.AssignmentExpression 
                && pExpression.operator == "="){
                
                var left = pExpression.left;
                if(left.type == Syntax.MemberExpression 
                    && left.object.type == Syntax.ThisExpression){
                    
                    sName = left.property.name;
                    isMemberFound = true;
                }
            }
        }
        
        if(isMemberFound){
            nMembersCount++;
            if(sName[0] == "_"){
                
                if(!members.Private[sName]){
                    members.Private[sName] = {name : sName};
                }
            }
//            else if(sName[0].toUpperCase() == sName[0]){
//                iInd = this.indexOfFunction(members.Protected, sName);
//                if(iInd == -1)
//                    members.Protected.push({name : sName});
//            }
            else{
                if(!members.Public[sName]){
                    members.Public[sName] = {name : sName};
                }
            }
        }
    }
    return {members : members, count : nMembersCount};
};

Docreator.prototype.buildFunctionArgumentList = function(pParentNode,sMethod,sClass,sPath){
    var pArguments = {};
    var sName;
    var sType;
    for(var i=0;i<pParentNode.length;i++){
        
        sType = null;
        
        if(pParentNode[i].type == Syntax.Identifier){
            sName = pParentNode[i].name;
        }
        else{
            sName = this._rawText.slice(pParentNode[i].range[0],pParentNode[i].range[1] + 1);
        }
        if(!pArguments[sName]){
            sType = this.getTypeByName(sName);
            if(sType == "unknown"){
                console.error("argument with name",sName,"in method",sMethod,"in class",sClass,sPath);
            }
            pArguments[sName] = {name : sName,type : sType, sequence : i};
        }
        else{
            console.error("argument with name " + sName + "already exist");
        }
    }
    return pArguments;
};

Docreator.prototype.getTypeByName = function(sName){
    var sType = null;
    var pPrefixRegExp = /[a-z0-9]+[A-Z]/;
    
    var pTmp = pPrefixRegExp.exec(sName);
    if(!pTmp){
        //console.error("variable " + sName + " have unknown prefix");
        sType =  "unknown";
    }
    else{
        var sPrefix = pTmp[0].slice(0,-1);

        var sKey;
        for(sKey in VariableType){
            var pType = VariableType[sKey];
            //test on main prefix
            if(pType.prefix == sPrefix){
                sType = pType.type;
            }
            //test on other prefix
            else{
                for(var j=0;j<pType.prefixAlternatives.length;j++){
                    if(pType.prefixAlternatives[j] == sPrefix){
                        sType = pType.type;
                        break;
                    }
                }
            }
            
            if(sType){
                break;
            }
        }
        if(!sType){
            console.error("argument " + sName + " has unknown type");
            sType = "unknown";
        }
    }
    return sType;
}

Docreator.prototype._findExtends = function(){
    var pParentNode = this._parseResult.body;
    var pExpression;
    var pCallee;
    var sChildName,sParentName;
    for(var i=0;i<pParentNode.length;i++){
        var node = pParentNode[i];
        if(node.type == Syntax.ExpressionStatement && node.expression.type == Syntax.CallExpression){
            pExpression = node.expression;
            pCallee = pExpression.callee;
            
            if(pCallee.type == Syntax.Identifier && pCallee.name != "extend"){
                continue;
            }
            else if(pCallee.type == Syntax.MemberExpression 
                && pCallee.property.name == "extend"){
                    if(pCallee.object.name != "a"){
                        continue;
                    }
            }
            else{
                continue;
            }
            
            if(pExpression.arguments[0].type == Syntax.Identifier){
                sChildName = pExpression.arguments[0].name;
            }
            else if(pExpression.arguments[0].type == Syntax.MemberExpression){
                sChildName = pExpression.arguments[0].property.name;
            }
            else{
                continue;
            }
            
            if(pExpression.arguments[1].type == Syntax.Identifier){
                sParentName = pExpression.arguments[1].name;
            }
            else if(pExpression.arguments[1].type == Syntax.MemberExpression){
                sParentName = pExpression.arguments[1].property.name;
            }
            else{
                continue;
            }
            
            if(this.pStructures[sChildName]){
                this.pStructures[sChildName].extend = sParentName;
            }
            else if(this.pClasses[sChildName]){
                this.pClasses[sChildName].extend = sParentName;
            }
        }
    }
};

Docreator.prototype._findCommentsForNode = function(iInd){
    var nEndCommentRange,nStartCommentRange;
    var pNode = this._parseResult.body[iInd];
    nEndCommentRange = pNode.range[0];
    nStartCommentRange = 0;
    for(var i=1;i<iInd;i++){
        if(this._parseResult.body[iInd-i].type != Syntax.EmptyStatement){
            nStartCommentRange = this._findEndOfNode(this._parseResult.body[iInd-i]);
            break;
        }
    }

    return this._findComments(nStartCommentRange, nEndCommentRange);
};

Docreator.prototype._findEndOfNode = function(pParentNode){
    var nEnd = pParentNode.range[1];
    if(pParentNode.type == Syntax.ExpressionStatement){
        nEnd = pParentNode.expression.range[1];
    }
    return nEnd;
};

Docreator.prototype._findComments = function(nStart,nEnd){
    nStart = nStart || 0;
    nEnd = nEnd || this._rawText.length;
    
    var pComments = [];
    var pNode;
    
    if(nStart < nEnd){
        for(var i=0; i<this._parseResult.comments.length; i++){
            pNode = this._parseResult.comments[i];
            if(pNode.range[0] > nStart && pNode.range[1] < nEnd){
                if(pNode.type == "Block"){
                    pComments.push({
                                    type : pNode.type,
                                    value : pNode.value
                                    });
                }
            }
        }
    }
    return pComments;
};



Docreator.prototype._findLocations = function(){
    var pParentNode = this._parseResult.body;
    var pNode;
    var pExpression,pLeft,pRight;
    var sName;
    var sLocationName;
    var pFunc;
    for(var i=0; i<pParentNode.length; i++){
        pNode = pParentNode[i];
        if(pNode.type == Syntax.ExpressionStatement){
            pExpression = pNode.expression;
            if(pExpression.type == Syntax.AssignmentExpression 
                && pExpression.operator == "="){
                
                pLeft = pExpression.left;
                pRight = pExpression.right;
                
                if(pRight.type == Syntax.Identifier)
                   sName = pRight.name; 
                else if(pRight.type == Syntax.MemberExpression)
                    sName = pRight.property.name || pRight.property.value;
                else
                    continue;
                
                sLocationName = this._rawText.slice(pLeft.range[0],pLeft.range[1]+1);
                
                if(this.pStructures[sName]){
                    pFunc = this.pStructures[sName];
                }
                else if(this.pClasses[sName]){
                    pFunc = this.pClasses[sName];
                }
                else if(this.pObjects[sName]){
                    pFunc = this.pObjects[sName];
                }
                else if(this.pFunctions[sName]){
                    pFunc = this.pFunctions[sName];
                }
                else
                    continue;
                
                if(!pFunc.locations)
                    pFunc.locations = [];
                
                pFunc.locations.push(sLocationName);
            }
        }
    }
}

Docreator.prototype._findDefines = function(pParentNode){
    pParentNode = pParentNode || this._parseResult.body;
    
    var pNode;
    var sName,sValue;
    var pExpression,pArguments,pComments;
    var pRange;
    var pFile;
    
    for(var i=0; i<pParentNode.length; i++){
        pNode = pParentNode[i];
        
        if(pNode.type == Syntax.ExpressionStatement){
            pExpression = pNode.expression;
            if(pExpression.type == Syntax.CallExpression 
                && pExpression.callee.type == Syntax.Identifier){

                if(pExpression.callee.name == "Define"){
                    if(pExpression.arguments.length != 2)
                        continue;

                    pArguments = pExpression.arguments;
                    if(pArguments[0].type == Syntax.CallExpression){
                        
//                        pRange = pArguments[0].callee.range;
//                        sName = this._rawText.slice(pRange[0],pRange[1]+1);
//                        var pFunctionDefineArguments = [];
//                        for(var j=0;j<pArguments[0].arguments.length; j++){
//                            
//                            pRange = pArguments[0].arguments[j].range;
//                            
//                            pFunctionDefineArguments.push(this._rawText.
//                                slice(pRange[0],pRange[1] + 1));
//                        }

                        pRange = pArguments[0].range;
                        sName = this._rawText.slice(pRange[0],pRange[1]+1);

                        if(pArguments[1].type != Syntax.FunctionExpression){
                            console.error("unknown define type","name : " + sName);
                            continue;
                        }
                        
                        pRange = pArguments[1].range;
                        sValue = this._rawText.slice(pRange[0],pRange[1] + 1);
                        
                        pComments = this._findCommentsForNode(i);
                        if(pComments.length == 0)
                            console.warn("no comments for define",sName);
                        
                        pFile = this._findSourceFile(pNode.range);
                        
                        if(!this.pDefines.functions[sName])
                            this.pDefines.functions[sName] =    {
                                                                name : sName,
                                                                value : sValue,
                                                                comments : pComments,
                                                                requirement : pFile,
                                                                authors : pFile.authors
                                                                };
                        else{
                            console.error("probably define redefinition", sName);
                        }
                        //TODO : store defines by correct names (not slices)
                    }
                    else if(pArguments[0].type == Syntax.Identifier
                            || pArguments[0].type == Syntax.MemberExpression){
                            
                        pRange = pArguments[0].range;
                        sName = this._rawText.slice(pRange[0], pRange[1] + 1);
                        
                        pRange = pArguments[1].range;
                        sValue = this._rawText.slice(pRange[0],pRange[1] + 1);
                        
                        pComments = this._findCommentsForNode(i);
                        if(pComments.length == 0)
                            console.warn("no comments for define",sName);
                        
                        pFile = this._findSourceFile(pNode.range);
                        
                        if(!this.pDefines.constants[sName]){
                            this.pDefines.constants[sName] =    {
                                                                name : sName,
                                                                value : sValue,
                                                                comments : pComments,
                                                                requirement : pFile,
                                                                authors : pFile.authors
                                                                };
                        }
                        else{
                            console.error("probably define redefinition", sName);
                        }
                    }
                    else{
                        pRange = pExpression.range;
                        console.error("unknown define type; text:",
                                        this._rawText.slice(pRange[0],pRange[1] + 1));
                        continue;
                    }
                }
                else if(pExpression.callee.name == "Undef"){
                    if(pExpression.arguments.length != 1){
                        continue;
                    }
                    
                    pRange = pExpression.arguments[0].range;
                    sName = this._rawText.slice(pRange[0],pRange[1]);
                    
                    if(this.pDefines.constants[sName]){
                        delete this.pDefines.constants[sName];
                    }
                    else if(this.pDefines.functions[sName]){
                        delete this.pDefines.functions[sName];
                    }
                }
            }
        }
    }
};

Docreator.prototype._findGettersAnsSetters = function(){
    for(var i=0;i<this._parseResult.body.length;i++){
        var pNode = this._parseResult.body[i];
        
        if(pNode.type == Syntax.ExpressionStatement){
            var pExpression = pNode.expression;
            if(pExpression.type == Syntax.CallExpression){
                var pCallee = pExpression.callee;
                if(pCallee.type == Syntax.MemberExpression){
                    if(pCallee.object.type != Syntax.Identifier || pCallee.object.name != "Object"){
                        continue;
                    }
                    if(pCallee.property.type == Syntax.Identifier){
                        var sName = pCallee.property.name || pCallee.property.value;
                        if(sName != "defineProperty"){
                            continue;
                        }
                    }
                    this._processDefineProperty(pExpression.arguments, i);
                }
            }
        }
    }
};

Docreator.prototype._processDefineProperty = function(pArguments,iInd){
    var pTmp;
    var sClassName;
    var sMethodName;
    var pProperies;
    var pClass;
    var pGetter = {};
    var pSetter = {};
    if(pArguments.length != 3){
        console.error("object.defineProperty() unsupported argument list",pArguments);
        return;
    }
    pTmp = pArguments[0];
    if(pTmp.type == Syntax.MemberExpression){
        if(pTmp.property.name == "prototype"){
            if(pTmp.object.type == Syntax.Identifier){
                sClassName = pTmp.object.name;
            }
            else if(pTmp.object.type == Syntax.MemberExpression){
                sClassName = pTmp.object.property.name;
            }
            else{
                console.error("object.defineProperty() unsupported object type",pTmp);
                return;
            }
        }
        else{
            return;
            sClassName = pTmp.property.name;
        }
    }
    else if(pTmp.type == Syntax.Identifier){
        sClassName = pTmp.name;
    }
    else{
        console.error("object.defineProperty() unsupported object type",pTmp);
        return;
    }
    
    //finding Class object
    if(this.pClasses[sClassName]){
        pClass = this.pClasses[sClassName];
    }
    else if(this.pStructures[sClassName]){
        pClass = this.pStructures[sClassName];
    }
    else if(this.pObjects[sClassName]){
        pClass = this.pObjects[sClassName];
    }
    else{
        console.error("object.defineProperty() can't find object with name",sClassName);
        return;
    }
    
    pTmp = pArguments[1];
    if(pTmp.type != Syntax.Literal){
        console.error("object.defineProperty() unsupported object type",pTmp);
        return;
    }
    sMethodName = pTmp.value;
    
    pTmp = pArguments[2];
    if(pTmp.type != Syntax.ObjectExpression){
        console.error("object.defineProperty() unsupported object type",pTmp);
        return;
    }
    
    pProperies = pTmp.properties;
    
    for(var i=0;i<pProperies.length;i++){
        var pProperty = pProperies[i];
        if(pProperty.key.type != Syntax.Identifier){
            console.error("object.defineProperty() unsupported property type",pProperty);
            continue;
        }
        
        
        if(pProperty.key.name == "get"){
            pTmp = pGetter;
        }
        else if(pProperty.key.name == "set"){
            pTmp = pSetter;
        }
        else{
            console.error("object.defineProperty() unsupported property",pProperty);
            continue;
        }
        
        var iTmp;
        if(i!=0){
            iTmp = pProperies[i-1].range[1];
        }
        else{
            iTmp = pArguments[2].range[1];
        }
        pTmp.text = this._rawText.slice(pProperty.value.range[0],pProperty.value.range[1]);
        pTmp.comments = this._findComments(iTmp,pProperty,pProperty.value.range[0]);
    }
    if(pGetter || pSetter){
        if(!pClass.gettersSetters){
            pClass.gettersSetters = {};
        }
        if(!pClass.gettersSetters[sMethodName]){
            pClass.gettersSetters[sMethodName] = {};
        }
        pTmp = pClass.gettersSetters[sMethodName];
        if(pGetter){
            if(pTmp.getter){
                console.error("getter with name",sMethodName,"already exist");
                return;
            }
            pTmp.getter = pGetter;
        }
        if(pSetter){
            if(pTmp.setter){
                console.error("setter with name",sMethodName,"already exist");
                return;
            }
            pTmp.setter = pSetter;
        }
    }
};

Docreator.prototype._buildIncludedFileList = function(){
    this.pIncludedFiles = {};
    var pParentNode = this._parseResult.body;
    var pNode,pExpression,pCallee;
    var sFullPathName;
    var sName,sDir;
    var pFile;
    var pIncludedFiles = this.pIncludedFiles;
    var iInd;
    var nStart = this._parseResult.range[0];
    var nEnd = this._parseResult.range[1];
    
    for(var i=0;i<pParentNode.length;i++){
        pNode = pParentNode[i];
        if(pNode.type == Syntax.ExpressionStatement){
            pExpression = pNode.expression;
            if(pExpression.type == Syntax.CallExpression){
                pCallee = pExpression.callee;
                if(pCallee.type == Syntax.Identifier &&
                    pCallee.name == "__StartIncludedFile__" 
                    && pExpression.arguments.length == 1 
                    && pExpression.arguments[0].type == Syntax.Literal){
                    
                    sFullPathName = pExpression.arguments[0].value;
                    iInd = sFullPathName.lastIndexOf('/');
                    if(iInd == -1){
                        sName = sFullPathName;
                        sDir = "/";
                    }
                    else{
                        sName = sFullPathName.slice(iInd+1);
                        sDir = sFullPathName.slice(0,iInd+1);
                    }
                    pFile = {
                                name : sName,
                                path : sFullPathName,
                                dir : sDir,
                                start : nStart,
                                end : nEnd,
                                authors : {},
                                comment : null
                            };
                    pFile.start = pNode.range[0];
                    this.pIncludedFiles[sFullPathName] = pFile;
                }
                else if(pCallee.type == Syntax.Identifier &&
                    pCallee.name == "__EndIncludedFile__" 
                    && pExpression.arguments.length == 1
                    && pExpression.arguments[0].type == Syntax.Literal){
                    
                    sFullPathName = pExpression.arguments[0].value;
                    pFile = this.pIncludedFiles[sFullPathName];
                    pFile.end = pNode.range[0];
                }
            }
        }
    }
    
    var sKey;
    
    for(sKey in pIncludedFiles){    
        pFile = pIncludedFiles[sKey];
        pFile.comment = this._findFileComment(pFile);
        if(!pFile.comment && pFile.name != 'Include.js'){
            console.warn("no comments for file",pFile.name);
        }
        else{
            this._parseFileComment(pFile);
        }
        //console.log(pIncludedFiles[sName].comment);
    }
};

Docreator.prototype._findSourceFile = function(pRange){
    var pFile;
    var pIncludedFiles = this.pIncludedFiles;
    var pCurrentFile = undefined;
    for(var sName in pIncludedFiles){
        pFile = pIncludedFiles[sName];
        if((pFile.start < pRange[0]) && (pFile.end > pRange[1])){
            
            if(!pCurrentFile
                    || (pFile.start > pCurrentFile.start) 
                    || (pFile.end < pCurrentFile.end)){
                    
                pCurrentFile = pFile;
            }
        }
    }
    if(!pCurrentFile){
        return {name : "unknown", authors : {}};
    }
    return pCurrentFile;
};
Docreator.prototype._parseFileComment = function(pFile){
    if(!pFile.comment){
        return;
    }
    var sComment = pFile.comment;
    var pAuthors = [];
    var pEmails = [];
    var sTmp;
    var pTmp;
    var pCommand
    var commandRegExp = /@[\w]+/gi;
    var pCommentRegExp = /[\S]+[\w\W]+[^\s\.]/g;
    var pFindCommentStartRegExp = /[\s]*\*/g;
    var sCommand;
    var nLastIndex = 0;
    var pClearComment = undefined;
    //pTmp = sComment.match(/\*\s*@?([\w\.,:]+)\s+([\w\s]+)/gi);
    var pComment = sComment.split('\n');
    //console.log(pComment);
    for(var i=0; i < pComment.length;i++){
        pCommand = commandRegExp.exec(pComment[i]);
        if(!pCommand){
            pFindCommentStartRegExp.lastIndex = 0;
            pTmp = pFindCommentStartRegExp.exec(pComment[i]);
            nLastIndex = pFindCommentStartRegExp.lastIndex;
            if(!pTmp 
                || nLastIndex != pTmp[0].length){
//              console.error(nLastIndex,pTmp[0].length);
                continue;
            }
            
            pCommentRegExp.lastIndex = nLastIndex;
            pTmp = pCommentRegExp.exec(pComment[i]);
            if(!pTmp){
                continue;
            }

            var sClearComment = pTmp[0];

            if(!pClearComment){
                pClearComment = {type : "Block"};
                pClearComment.value = sClearComment;
            }
            else{
                pClearComment.value = pClearComment.value.concat('\n',sClearComment);
            }
        }
        else{
            sCommand = pCommand[0];
            sTmp = pComment[i].slice(commandRegExp.lastIndex);
            switch(sCommand){
                case "@author" :
                    pTmp = sTmp.split(',');
                    for(var j=0;j<pTmp.length;j++){
                        pAuthors.push(pTmp[j].match(/[\S]+/g).join(' '));
                    }
                    break;
                case "@brief" :
                    pFile.brief = sTmp.match(/[\S]+[\w\W]+[^\s\.]/)[0];
                    break;
                case "@email" :
                    pEmails.push(sTmp.match(/[\S]+[\w\W]+[^\s\.]/)[0]);
                    break;
                default:
                    //console.error(sCommand);
                    break;
            }
        }
        commandRegExp.lastIndex = 0;
    }
    if(pClearComment){
        pFile.comment = pClearComment;
    }
    else{
        delete pFile.comment;
    }
    var sName;
    for(var i=0;i<pAuthors.length;i++){
        sName = pAuthors[i]
        if(!pFile.authors[sName]){
            pFile.authors[sName] = {name : sName}
            if(pEmails[i])
                pFile.authors[sName].email = pEmails[i];
        }
    }
};

Docreator.prototype._findFileComment = function(pFile){
    var pParentNode = this._parseResult.comments;
    var pNode;
    var pCurrentFile = undefined;
    for(var i=0; i<pParentNode.length; i++){
        pNode = pParentNode[i];
        if((pFile.start < pNode.range[0]) && (pFile.end > pNode.range[1])
            && pNode.type == "Block" 
            && (pNode.value.indexOf("@file") != -1)){
            
            //this comment belongs to this file?
            for(var sName in this.pIncludedFiles){
                var pTmp = this.pIncludedFiles[sName];
                if((pTmp.start < pNode.range[0]) && (pTmp.end > pNode.range[1])){
            
                    if(!pCurrentFile
                            || (pTmp.start > pCurrentFile.start) 
                            || (pTmp.end < pCurrentFile.end)){

                        pCurrentFile = pTmp;
                    }
                }
            }
            if(pCurrentFile == pFile){
                pParentNode.splice(i,1);
                return pNode.value;
            }
        }
    }
    return null;
    
    var pIncludedFiles = this.pIncludedFiles;
    var pCurrentFile = undefined;
    for(var sName in pIncludedFiles){
        pFile = pIncludedFiles[sName];
        if((pFile.start < pRange[0]) && (pFile.end > pRange[1])){
            
            if(!pCurrentFile
                    || (pFile.start > pCurrentFile.start) 
                    || (pFile.end < pCurrentFile.end)){
                    
                pCurrentFile = pFile;
            }
        }
    }
    if(!pCurrentFile){
        return {name : "unknown", authors : {}};
    }
    return pCurrentFile;
};

Docreator.prototype._parseComments = function(){
    var sKey;
    var sMethod;
    var pMethods;
    for(sKey in this.pClasses){
        var pClass = this.pClasses[sKey]
        
        
        pMethods = pClass.methods.Private;
        for(sMethod in pMethods){
            this._parseMethodComments(pMethods[sMethod],pClass);
        }
        
        pMethods = pClass.methods.Public;
        for(sMethod in pMethods){
            this._parseMethodComments(pMethods[sMethod],pClass);
        }
        
        pMethods = pClass.methods.Static;
        for(sMethod in pMethods){
            this._parseMethodComments(pMethods[sMethod],pClass);
        }
    }
    for(sKey in this.pObjects){
        var pObject = this.pObjects[sKey]
        
        pMethods = pObject.methods.Private;
        for(sMethod in pMethods){
            this._parseMethodComments(pMethods[sMethod],pObject);
        }
        
        pMethods = pObject.methods.Public;
        for(sMethod in pMethods){
            this._parseMethodComments(pMethods[sMethod],pObject);
        }
        
        pMethods = pObject.methods.Static;
        for(sMethod in pMethods){
            this._parseMethodComments(pMethods[sMethod],pObject);
        }
    }
    for(sKey in this.pFunctions){
        this._parseMethodComments(this.pFunctions[sKey], this.pFunctions[sKey]);
    }
    //parse constructors
    
    for(sKey in this.pClasses){
        this._parseMethodComments(this.pClasses[sKey], this.pClasses[sKey]);
    }
    for(sKey in this.pStructures){
        this._parseMethodComments(this.pStructures[sKey], this.pStructures[sKey]);
    }
    
    //parse defines
    
    for(sKey in this.pDefines.constants){
        this._parseDefineComments(this.pDefines.constants[sKey]);
    }
    for(sKey in this.pDefines.functions){
        this._parseDefineComments(this.pDefines.functions[sKey]);
    }
};

Docreator.prototype._parseMethodComments = function(pMethod,pClass){
    var pComments,sComment;
    var pCommand,sCommand;
    var pCommandRegExp = /@[\w]+/gi;
    var pWordRegExp = /[\S]+/gi;
    var pCommentRegExp = /[\S]+[\w\W]+[^\s\.]/g;
    var pFindCommentStartRegExp = /[\s]*\*/g;
    var nLastIndex;
    var pTmp;
    var sTmp,sTmp2,sTmp3;
    var pClearComments = [];
    var sType,pType;
    var pArgumentComment;
    var sArgumentComment;
    var bSkipComment = false;
    var pClearComment = undefined;
    var nVariablesCount = 0;
    var pArgumentsList;
    for(sTmp in pMethod.arguments){
        nVariablesCount++;
    }

    if(pMethod.comments.length){
        for(var i=0;i<pMethod.comments.length;i++){
            bSkipComment = false;
            pClearComment = undefined;
            pComments = pMethod.comments[i].value.split('\n');
            for(var j=0;j<pComments.length;j++){
                if(bSkipComment){
                    break;
                }
                sComment = pComments[j];
                pCommand = pCommandRegExp.exec(sComment);
                if(!pCommand){
                    pFindCommentStartRegExp.lastIndex = 0;
                    pTmp = pFindCommentStartRegExp.exec(sComment);
                    nLastIndex = pFindCommentStartRegExp.lastIndex;
                    if(!pTmp 
                        || nLastIndex != pTmp[0].length){
                
                        continue;
                    }
                    
                    pCommentRegExp.lastIndex = nLastIndex;
                    pTmp = pCommentRegExp.exec(sComment);

                    if(!pTmp){
                        continue;
                    }

                    var sClearComment = pTmp[0];

                    if(!pClearComment){
                        pClearComment = {type : pMethod.comments[i].type};
                        pClearComment.value = sClearComment;
                    }
                    else{
                        pClearComment.value = pClearComment.value.concat('\n',sClearComment);
                    }
                }
                else{
                    sType = null;
                    sCommand = pCommand[0];
                    nLastIndex = pCommandRegExp.lastIndex;
                    switch (sCommand){
                        case "@property" :
                            if(pComments.length == 1){
                                console.error("@property unsupported syntax in method " 
                                    , pMethod , " in class " , pClass);
                                bSkipComment = true;
                                break;
                            }
                            nLastIndex = pCommandRegExp.lastIndex;
                            pCommentRegExp.lastIndex = nLastIndex;
                            var pFuncRegExp = /[\w]+\s*\(/gi;
                            var pFuncName = pFuncRegExp.exec(sComment);
                            if(!pFuncName){
                                console.error("@property no function name in method " 
                                    , pMethod , " in class " , pClass);
                                bSkipComment = true;
                                break;
                            }
                            
                            var sFuncName = /[\w]+/.exec(pFuncName[0])[0];
                            if(sFuncName != pMethod.name){
                                console.error("@property function name " + sFuncName 
                                    + " don't match with function name in method " 
                                    , pMethod , " in class " , pClass);
                                bSkipComment = true;
                                break;
                            }
                            
                            var pArguments = /\([\w\W]*\)/g.exec(sComment);
                            if(!pArguments){
                                console.error("@property no closing bracket in method " 
                                    , pMethod , " in class " , pClass);
                                bSkipComment = true;
                                break;
                            }
                            //////////////////////////////////
                            var isMainCall = true;
                            var bError = false;
                            //////////////////////////////////
                            var sArguments = pArguments[0].slice(1,pArguments[0].length - 1);
                            if(sArguments == ""){
                                pArgumentsList = [];
                            }
                            else{
                                pArgumentsList = sArguments.split(',');
                            }
                            for(var k=0;k<pArgumentsList.length;k++){
                                sTmp = pArgumentsList[k];
                                var pWords = sTmp.match(/\=?\s*[\S]+/gi);
                                if(pWords.length == 1){
                                    var sVarName = pWords[0].replace(/\s/g,"");
                                    pArgumentsList[k] = {
                                                            name : sVarName,
                                                            type : this.getTypeByName(sTmp),
                                                            sequence : k
                                                        };
                                }
                                else if(pWords.length == 2){
                                    sTmp = pWords[0].replace(/\s/g,"");
                                    sTmp2 = pWords[1].replace(/\s/g,"");
                                    if(sTmp2[0] == "="){
                                        // sVarName = defaultValue
                                        pArgumentsList[k] = {
                                                                name : sTmp,
                                                                type : this.getTypeByName(sTmp),
                                                                defaultValue : sTmp2.slice(1),
                                                                sequence : k
                                                            };
                                    }
                                    else{
                                        pArgumentsList[k] = {
                                                                name : sTmp2,
                                                                type : sTmp,
                                                                sequence : k
                                                            };
                                    }
                                }
                                else if(pWords.length == 3){
                                    sTmp = pWords[0].replace(/\s/g,"");
                                    sTmp2 = pWords[1].replace(/\s/g,"");
                                    sTmp3 = pWords[2].replace(/\s/g,"");
                                    if(sTmp3[0] != "="){
                                        console.error("@property wrong construction in method " 
                                            , pMethod , " in class " , pClass);
                                        bError = true;
                                        break;
                                    }
                                    else{
                                        pArgumentsList[k] = {
                                                                name : sTmp2,
                                                                type : sTmp,
                                                                defaultValue : sTmp3.slice(1),
                                                                sequence : k
                                                            };
                                    }
                                }
                                else{
                                    console.error("@property wrong construction in method " 
                                            , pMethod , " in class " , pClass);
                                    bError = true;
                                    break;
                                }
                                if(!pMethod.arguments[pArgumentsList[k].name]){
                                    isMainCall = false;
                                }
                            }
                            //test on main call
                            if(bError){
                                bSkipComment = true;
                                break;
                            }
                            if(isMainCall && nVariablesCount == pArgumentsList.length){
                                for(var k=0;k<pArgumentsList.length;k++){
                                    pMethod.arguments[pArgumentsList[k].name] = pArgumentsList[k];
                                }
                            }
                            else if(nVariablesCount == 0){
                                for(var k=0;k<pArgumentsList.length;k++){
                                    pMethod.arguments[pArgumentsList[k].name] = pArgumentsList[k];
                                }
                                return this._parseMethodComments(pMethod, pClass);
                            }
                            else{
                                if(!pMethod.alternatives){
                                    pMethod.alternatives = [];
                                }
                                var pAlternative =  {
                                                        arguments : {},
                                                        authors : pMethod.authors,
                                                        comments : [pMethod.comments[i]],
                                                        name : pMethod.name,
                                                        requirement : pMethod.requirement,
                                                        text : pMethod.text
                                                    };
                                for(var k=0;k<pArgumentsList.length;k++){
                                    pAlternative.arguments[pArgumentsList[k].name] = pArgumentsList[k];
                                }
                                pMethod.alternatives.push(pAlternative);
                                this._parseMethodComments(pAlternative, pClass);
                                bSkipComment = true;
                            }
                            break;
                            
                        case "@tparam" :
                            pWordRegExp.lastIndex = nLastIndex;
                            pType = pWordRegExp.exec(sComment);
                            if(!pType){
                                console.error("no variable type in method " , pMethod , " in class " , pClass);
                                break;
                            }
                            else{
                                sType = pType[0];
                            }
                            nLastIndex = pWordRegExp.lastIndex;
                            
                        case "@param" :
                            pWordRegExp.lastIndex = nLastIndex;
                            var pName = pWordRegExp.exec(sComment);
                            if(!pName){
                                console.error("no variable in method " , pMethod , " in class " , pClass);
                                break;
                            }
                            nLastIndex = pWordRegExp.lastIndex;
                            var pArgument;
                            if(!(pArgument = pMethod.arguments[pName[0]])){
                                console.error("method " , pMethod , " in class " 
                                    , pClass , " has't argument " + pName[0]);
                                break;
                            }
                            else{
                                pCommentRegExp.lastIndex = nLastIndex;
                                pArgumentComment = pCommentRegExp.exec(sComment);
                                if(!pArgumentComment){
                                    console.warn("argument " + pName + " in method " 
                                        , pMethod , " in class " 
                                        , pClass , " hasn't comment");
                                    sArgumentComment = null;
                                }
                                else{
                                    sArgumentComment = pArgumentComment[0];
                                }
                                if(sType){
                                    if(pArgument.type == "Pointer" || pArgument.type == "unknown"){
                                        pArgument.type = sType;
                                    }
                                    else{
                                        var pVariableType = VariableType[pArgument.type];
                                        //test on type match
                                        //main type 
                                        if(pArgument.type.toLowerCase() == sType.toLowerCase()){

                                        }
                                        //alternative type
                                        else{
                                            var k;
                                            for(k = 0; k<pVariableType.typeAlternatives.length; k++){
                                                var sAlternativeType = pVariableType.typeAlternatives[k];
                                                if(sAlternativeType.toLowerCase() == sType.toLowerCase()){
                                                    pArgument.type = sAlternativeType;
                                                    break;
                                                }
                                            }
                                            if(k == pVariableType.typeAlternatives.length){
                                                console.error("variable " + pArgument.name 
                                                + " in method " , pMethod , " in class " , pClass  
                                                , " have type mismatch commented type is " 
                                                + sType + " type by prefix is " + pArgument.type);
                                                pArgument.type = sType;
                                            }
                                        }
                                    }
                                }
                                pArgument.comment = sArgumentComment;
                            }
                            //console.error(pType,pName,pMethodComment,sComment);
                            break;
                        default :
                            break;
                    }
                }

                pCommandRegExp.lastIndex = 0;
            }

            if(pClearComment && !bSkipComment){
                pClearComments.push(pClearComment);
            }
        }
        pMethod.comments = pClearComments;
    }
    else{
        console.warn("no comments for method " , pMethod , " in class " , pClass);
    }
};
Docreator.prototype._parseDefineComments = function(pDefine){
    var pComments,sComment;
    var pCommand,sCommand;
    var pCommandRegExp = /@[\w]+/gi;
    var pCommentRegExp = /[\S]+[\w\W]+[^\s\.]/g;
    var pBriefRegExp = /[\S]+[\w\W]+[^\s\.]/g;
    var pFindCommentStartRegExp = /[\s]*\*/g;
    var nLastIndex;
    var pTmp;
    var pClearComments = [];

    var bSkipComment = false;
    var pClearComment = undefined;
    var isRecognize = false;
    var isTypeDef = false;

    if(pDefine.comments.length){
        for(var i=0;i<pDefine.comments.length;i++){
            bSkipComment = false;
            pClearComment = undefined;
            pComments = pDefine.comments[i].value.split('\n');
            for(var j=0;j<pComments.length;j++){
                if(bSkipComment){
                    break;
                }
                sComment = pComments[j];
                pCommand = pCommandRegExp.exec(sComment);
                if(!pCommand){
                    pFindCommentStartRegExp.lastIndex = 0;
                    pTmp = pFindCommentStartRegExp.exec(sComment);
                    nLastIndex = pFindCommentStartRegExp.lastIndex;
                    if(!pTmp 
                        || nLastIndex != pTmp[0].length){
                
                        continue;
                    }
                    
                    pCommentRegExp.lastIndex = nLastIndex;
                    pTmp = pCommentRegExp.exec(sComment);
                    if(!pTmp){
                        continue;
                    }

                    var sClearComment = pTmp[0];

                    if(!pClearComment){
                        pClearComment = {type : pDefine.comments[i].type};
                        pClearComment.value = sClearComment;
                    }
                    else{
                        pClearComment.value = pClearComment.value.concat('\n',sClearComment);
                    }
                }
                else{
                    sCommand = pCommand[0];
                    nLastIndex = pCommandRegExp.lastIndex;
                    switch (sCommand){    
                        case '@def' :
                            isRecognize = true;
                            break;
                        case "@typedef" :
                            isRecognize = true;
                            isTypeDef = true;
                            break;
                        case "@brief" :
                            pBriefRegExp.lastIndex = nLastIndex;
                            pTmp = pBriefRegExp.exec(sComment);
                            if(!pTmp){
                                console.error("define",pDefine,"have @brief command but don't have brief description");
                                break;
                            }
                            pDefine.brief = pTmp[0];
                            break;
                        default :
                            break;
                    }
                }

                pCommandRegExp.lastIndex = 0;
            }

            if(pClearComment && !bSkipComment){
                pClearComments.push(pClearComment);
            }
        }
        if(isRecognize){
            pDefine.comments = pClearComments;
            if(isTypeDef){
                pDefine.typedef = true;
            }
        }
        else{
            console.error("define comments not recognized",pDefine);
            pDefine.comments = [];
        }
    }
    else{
        console.warn("no comments for define",pDefine);
    }
};

watch();

window.Docreator = Docreator;
})();