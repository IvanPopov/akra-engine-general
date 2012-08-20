var NodeContext = false;
if (typeof esprima === 'undefined') {
    var esprima = require('./esprima.js');
    var fs = require('fs');
    NodeContext = true;
}
//try{
//    if(esprima.parse);
//}
//catch (e) {
//    var esprima = require('./esprima.js');
//    var fs = require('fs');
//}

(function (exports) {

    var IsDebug = false;
    var ExtractMacroMode = false;
    var UniqPrefix = '_' + (new Date()).getTime();
    var readFile;
    if (fs) {
        readFile = function (path) {
            var data = '';
            if (!path) return '';

            try {
                if (path[path.length - 1] === '/') {
                    path += exports['defaultInclude'];
                }
                data = fs.readFileSync(path, 'utf-8');
            }catch (e) {
                console.log('cannot open file <', path, '>');
            }
            //console.log(data);
            return data;
        }
    }
    else {
        readFile = function (url) {
            var xmlhttp;
            try {
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (E) {
                    xmlhttp = false;
                }
            }
            if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
                xmlhttp = new XMLHttpRequest();
            }

            xmlhttp.open('GET', url, false);
            xmlhttp.send(null);

            return xmlhttp.responseText;
        }
    }

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
    }

    function genEmptyDefine () {
        var def = {
            property:{},
            func:    {},
            include: {},
            enums:   {},
            depth:   -1
        };

        def.property[sk(Keywords.FUNC)] = {
            type:        Syntax.Identifier,
            name:       '',
            usageHistory:{}
        };

        return def;
    }

    function extend () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }

        if (typeof target !== "object" && !isFunction(target)) {
            target = {};
        }

        if (length === i) {
            target = this;
            --i;
        }

        for (; i < length; i++) {
            if ((options = arguments[ i ]) != null) {
                for (name in options) {
                    src = target[ name ];
                    copy = options[ name ];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && ( isPlainObject(copy) || (copyIsArray = isArray(copy)) )) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];

                        }
                        else {
                            clone = src && isPlainObject(src) ? src : {};
                        }

                        target[ name ] = extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[ name ] = copy;
                    }
                }
            }
        }

        return target;
    }

    var Class2type = {};
    var ToString = Object.prototype.toString;
    var HasOwn = Object.prototype.hasOwnProperty;

    (function () {
        var data = "Boolean Number String Function Array Date RegExp Object".split(" ");
        for (var i = 0, n = data.length; i < n; ++i) {
            Class2type[ "[object " + data[i] + "]" ] = data[i].toLowerCase();
        }
    })();

    function isFunction (obj) {
        return type(obj) === "function";
    }

    var isArray = function (obj) {
        return type(obj) === "array";
    }


    function isWindow (obj) {
        return obj && typeof obj === "object" && "setInterval" in obj;
    }

    function isNumeric (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    }

    function type (obj) {
        return obj == null ?
            String(obj) :
            Class2type[ ToString.call(obj) ] || "object";
    }

    function isPlainObject (obj) {
        if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor &&
                !HasOwn.call(obj, "constructor") &&
                !HasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        }
        catch (e) {
            return false;
        }

        var key;
        for (key in obj) {}

        return key === undefined || HasOwn.call(obj, key);
    }

    function isEmptyObject (obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    }

    function debug () {
        if (IsDebug) {
            cl.apply(null, arguments);
        }
    }

    function merge (obj1, obj2) {

        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = merge(obj1[p], obj2[p]);
                }
                else {
                    obj1[p] = obj2[p];
                }
            }
            catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }

    function mergeFast(o1, o2) {
        for (var i in o2) {
            o1[i] = o2[i];
        }
    }

    function mergeDefines (def1, def2) {
        mergeFast(def1.property, def2.property);
        mergeFast(def1.func, def2.func);
        mergeFast(def1.include, def2.include);
        mergeFast(def1.enums, def2.enums);
        def1.depth = def2.depth;
        return def1;
    }

    function sk (key) {
        return key + '$';// + CodeNum.val;
    }

    function enumsk (key) {
        return '$$enum_' + key + '$';
    }

    function cl (a, b, c, d, e, f) {
        switch (arguments.length) {
            case 1:
                console.log(a);
                break;
            case 2:
                console.log(a, b);
                break;
            case 3:
                console.log(a, b, c);
                break;
            case 4:
                console.log(a, b, c, d);
                break;
            case 5:
                console.log(a, b, c, d, e);
                break;
            default:
                console.log(arguments);
        }
    }

    function cw (a) {
        console.warn(a);
    }

    function addLiteral (target, name, value) {
        value = value || '';

        var k = sk(name);
        if (!target[k]) {
            target[k] = {
                type:         Syntax.Literal,
                value:        '',
                usageHistory: {}
            }
        }

        target[k].value = value;
    }

    var Syntax = esprima.syntax;
     /*
    var Syntax = {
        AssignmentExpression:  'AssignmentExpression',
        ArrayExpression:       'ArrayExpression',
        BlockStatement:        'BlockStatement',
        BinaryExpression:      'BinaryExpression',
        BreakStatement:        'BreakStatement',
        CallExpression:        'CallExpression',
        CatchClause:           'CatchClause',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement:     'ContinueStatement',
        DoWhileStatement:      'DoWhileStatement',
        DebuggerStatement:     'DebuggerStatement',
        EmptyStatement:        'EmptyStatement',
        ExpressionStatement:   'ExpressionStatement',
        ForStatement:          'ForStatement',
        ForInStatement:        'ForInStatement',
        FunctionDeclaration:   'FunctionDeclaration',
        FunctionExpression:    'FunctionExpression',
        Identifier:            'Identifier',
        IfStatement:           'IfStatement',
        Literal:               'Literal',
        LabeledStatement:      'LabeledStatement',
        LogicalExpression:     'LogicalExpression',
        MemberExpression:      'MemberExpression',
        NewExpression:         'NewExpression',
        ObjectExpression:      'ObjectExpression',
        Program:               'Program',
        ReturnStatement:       'ReturnStatement',
        SequenceExpression:    'SequenceExpression',
        SwitchStatement:       'SwitchStatement',
        SwitchCase:            'SwitchCase',
        ThisExpression:        'ThisExpression',
        ThrowStatement:        'ThrowStatement',
        TryStatement:          'TryStatement',
        UnaryExpression:       'UnaryExpression',
        UpdateExpression:      'UpdateExpression',
        VariableDeclaration:   'VariableDeclaration',
        WhileStatement:        'WhileStatement',
        WithStatement:         'WithStatement'
    }; */

    var Keywords = {
        Define:        'Define',
        Enum:          'Enum',
        EnumKeys:      '__KEYS__',
        EnumObject:    '__ENUM__',
        Undef:         'Undef',
        Include:       'Include',
        Insert:        'Insert',
        If:            'If',
        EndIf:         'Endif',
        ElseIf:        'Elseif',
        Ifdef:         'Ifdef',
        UnknownObject: '__',
        Effect:        'Effect',
        FILE:          '__FILE__',
        LINE:          '__LINE__',
        ARGS:          '__ARGS__',
        FUNC:          '__FUNC__'
    };


    var PathStack = [];

    function curPath () {
        return PathStack.join('');
    }

    function pushPath (path) {
        PathStack.push(path);
    }

    function popPath () {
        return PathStack.pop();
    }

    function extractFileName (fullPath) {
        return fullPath.replace(/^.*[\\\/]/, '')
    }

    function extractFilePath (fullPath) {
        var src = fullPath.split(/(\\|\/)/), dst = '';
        for (var i = 0; i < src.length - 1; ++i) {
            if (!src[i].length || ((src[i] == '/' || src[i] == '\\') && dst.length)) {
                continue;
            }
            dst += src[i] + (src[i] != '/' ? '/' : '');
        }
        return (src[0] == '/' || src[0] == '\\' ? '/' : '') + dst;
    }

    var uniqCodeNum = {val: 0};
    var InDefine = 0;

    (function () {

        var InFunction = 0;
        var InMemderExp = 0;
        function reflect (Tree, UseSemicolon, Define, IsEmpty, State, CodeNum) {
            UseSemicolon = (UseSemicolon === undefined ? true : UseSemicolon);
            IsEmpty = (IsEmpty === undefined ? true : IsEmpty);
            Define = Define || null;

            var Session = (IsDebug ? Math.floor(Math.random() * 1000000) : '');

            var IsIgnore = false;

            State = (State === undefined ? true : State);

            var CurFile = '';
            var Code = '';
            var SystemObjects = {};
            //CodeNum = CodeNum || {val: 0};
            //state mench
            var st = State; //state
            var stateStack = [];

            function pushState (state) {
                stateStack.push(st);
                st = state;
            }

            function popState () {
                if (stateStack.length) {
                    st = stateStack.pop();
                }
                else {
                    st = State;
                }
            }

            //ifdef stack
            var ignoreStack = [];

            function pushIgnore (state) {
                ignoreStack.push(IsIgnore);
                IsIgnore = state;
            }

            function popIgnore () {
                if (ignoreStack.length) {
                    IsIgnore = ignoreStack.pop();
                }
                else {
                    IsIgnore = false;
                }
            }

            function sc (replace) {
                if (st && UseSemicolon) {
                    var ltc = Code.substr(-2, 2);
                    switch (ltc) {
                        case ';\n':
                            return;
                        case '}\n':
                            if (replace) {
                                Code = Code.substr(0, Code.length - 1) + ';\n';
                            }
                            return;
                    }
                    c(';\n');
                }
            }

            function comment (x) {
                return '//' + Session + '// ' + x;// + ' \n';
            }


            function sn () {
                if (st) {
                    c('\n');
                }
            }

            function todo (text) {
                console.log("TODO: " + text);
            }

            function c (r) {
                Code += r;
                CodeNum.val ++;
            }

            function cn (k) {
                return k + '#' + CodeNum.val;
            }

            function setTopLevelObj (node, obj) {
                return node;
            }

            function getTopLevelObj (node) {
                var obj = node.object;
                if (obj && obj.type == Syntax.MemberExpression) {
                    return getTopLevelObj(obj);
                }
                return node;
            }

            function procProgram (node) {
                r(node.body);
            }

            function procIfStatement (node) {
                pushState(false);
                c('if (');
                r(node.test);
                c(')');
                popState();
                //c('\n');
                pushState(true);
                r(node.consequent);
                if (node.alternate) {
                    c('else ');
                    r(node.alternate);
                }

                popState();
                //sc();
                sn();
            }

            function procLiteral (node) {
                if (typeof node.value == "string") {
                    var value = String(node.value)
                        .replace(/\\"/g, '"').replace(/"/g, '\\"').replace(/\n/g, '');
                    c('"' + value + '"');
                }
                else {
                    c(node.value);
                }
                sc();
            }

            function procBlockStatement (node) {
                var body = node.body;
                c(' {\n');
                pushState(true);
                r(node.body);
                c('\n}\n');
                popState();
            }

            function procLogicalExpression (node) {

                var tleft = node.left.type,
                    tright = node.right.type;
                pushState(false);
                if (tleft == Syntax.Identifier ||
                    tleft == Syntax.Literal) {
                    r(node.left);
                }
                else {
                    c('(');
                    r(node.left);
                    c(')');
                }
                c(' ' + node.operator + ' ');
                if (tright == Syntax.Identifier ||
                    tright == Syntax.Literal) {
                    r(node.right);
                }
                else {
                    c('(');
                    r(node.right);
                    c(')');
                }
                popState();
                sc();
            }

            function procBinaryExpression (node) {
                pushState(false);
                var tleft = node.left.type,
                    tright = node.right.type;
                if (tleft == Syntax.Identifier ||
                    tleft == Syntax.Literal) {
                    r(node.left);
                }
                else {
                    c('(');
                    r(node.left);
                    c(')');
                }

                c(' ' + node.operator + ' ');
                if (tright == Syntax.Identifier ||
                    tright == Syntax.Literal) {
                    r(node.right);
                }
                else {
                    c('(');
                    r(node.right);
                    c(')');
                }

                popState();
                sc();
            }

            function procUnaryExpression (node) {
                c(node.operator);
                if (node.operator.length > 1) {
                    c(' ');
                }

                var targ = node.argument.type;
                pushState(false);
                if (targ == Syntax.Identifier ||
                    targ == Syntax.Literal) {
                    r(node.argument);
                }
                else {
                    c('(');
                    r(node.argument);
                    c(')');
                }
                popState();
                sc();
            }

            function procIdentifier (node) {
                var name = node.name;
                if (!IsEmpty) {

                    var key = sk(name), subst = Define.property[key];

                    if (subst && !subst.usageHistory[cn(key)]) {
                        subst.usageHistory[cn(key)] = 1;

                        if (subst.type != Syntax.MemberExpression) {

                            debug(comment(refl(node, CodeNum) + ' ==> '
                                              + refl(subst, CodeNum)));

                            if (subst.type != Syntax.Identifier &&
                                subst.type != Syntax.FunctionDeclaration &&
                                subst.type != Syntax.FunctionExpression &&
                                subst.type != Syntax.ObjectExpression &&
                                subst.type != Syntax.ArrayExpression &&
                                subst.type != Syntax.CallExpression &&
                                subst.type != Syntax.Literal) {

                                if (key == sk(Keywords.ARGS)) {
                                    r (subst);
                                }
                                else {
                                    c('(');
                                    r(subst)
                                    c(')');
                                }

                            }
                            else {
                                //cl('id >:', Define.property[sk(Keywords.FUNC)].name);
                                r(subst);
                                //cl('id <:', Define.property[sk(Keywords.FUNC)].name);
                            }
                            return;
                        }

                        var tlo = getTopLevelObj(subst);
                        if (tlo.object.name != Keywords.UnknownObject) {
                            return r(subst);
                        }
                    }
                }

                if (name == Keywords.FILE) {
                    c('"' + CurFile + '"');
                }
                else if (name == Keywords.LINE) {
                    c('""');
                }
                else {
                    c(name);
                }
                sc();
            }

            function procEmptyStatement (node) {
                sc();
            }

            function procExpressionStatement (node) {

                //pushState(true);
                r(node.expression);
                sc(1);
                //popState();
                //c('\n');

            }

            function procVariableDeclaration (node) {
                var decl = node.declarations;
                c('var ');
                pushState(false);
                for (var i = 0; i < decl.length; ++i) {
                    var v = decl[i];
                    r(v.id);
                    if (v.init) {
                        c('=');
                        r(v.init);
                    }
                    if (i != decl.length - 1) {
                        c(', ');
                    }
                }

                popState();
                //c('/* -- ' + st + ' -- */');
                sc(true);
            }

            function procObjectExpression (node) {
                var prop = node.properties;
                c(' {');
                pushState(false);
                for (var i = 0; i < prop.length; ++i) {
                    var kind = prop[i].kind;
                    if (!kind) {
                        r(prop[i].key);
                        c(': ');
                        r(prop[i].value);
                    }
                    else if (kind == 'get' || kind == 'set') {
                        if (prop[i].value.type != Syntax.FunctionExpression) {
                            throw new Error('unsupported getter');
                        }

                        c(kind + ' ');
                        r(prop[i].key);
                        c(' ');
                        procFunctionExpression(prop[i].value, true);
                    }
                    else {
                        cl(node);
                        throw new Error('unsupported <kind: ' + kind + '> of object member');
                    }
                    if (i != prop.length - 1) {
                        c(', ');
                    }
                }
                popState();
                c('}');
                sc();
            }

            function procArguments (args) {
                for (var i = 0; i < args.length; ++i) {
                    r(args[i]);
                    if (i != args.length - 1) {
                        c(', ');
                    }
                }
            }

            function procNewExpression (node) {
                c('new ');
                pushState(false);
                var callee = node.callee;
                if (IsEmpty) {
                    if (callee.type == Syntax.Identifier ||
                        callee.type == Syntax.MemberExpression) {
                        r(callee);
                    }
                    else {
                        c('(');
                        r(callee);
                        c(')');
                    }
                    c('(');
                    procArguments(node.arguments);
                    c(')');
                }
                else {

                    var calleeString = reflect(callee, false, Define, false, false, CodeNum);

                    if (callee.type != Syntax.Identifier &&
                        callee.type != Syntax.MemberExpression) {
                        calleeString = '(' + calleeString + ')';
                    }

                    node = extend(true, {}, node);

                    node.callee = {
                        type: Syntax.Identifier,
                        name: calleeString
                    };

                    node.type = Syntax.CallExpression;

                    r(node);
                }
                popState();
                sc();
            }

            function procAssignmentExpression (node) {
                pushState(false);
                r(node.left);
                c(' ' + node.operator + ' ');
                r(node.right);
                popState();
                sc();
            }


            function procMemberExpression (node) {

                if (!IsEmpty) {

                    var key = sk(refl(node, CodeNum)),
                        subst = Define.property[key];

                    if (subst && !subst.usageHistory[cn(key)]) {
                        //console.log(Define.property[sk(Keywords.UnknownObject)]);
                        subst.usageHistory[cn(key)] = 1;
                        return r(subst);
                    }

                    var p = node.property, tmp;
                    if (p.type == Syntax.Identifier) {
                        var keyCall = sk(p.name);
                        subst = Define.property[keyCall];

                        if (subst) {
                            var tlo = getTopLevelObj(subst);
                            if (tlo.object && tlo.object.name == Keywords.UnknownObject) {
                                if (IsDebug) {
                                    tmp = refl(node, CodeNum);
                                }

                                node.computed = subst.computed;
                                node.property = subst.property;

                                debug(comment(tmp + ' ==> '
                                                  + refl(node, CodeNum)));

                            }

                        }
                        else {
                            var keyLastIndex = key.lastIndexOf('.');
                            var keyCommon = sk(key.substr(0, keyLastIndex) + '.__');
                            var subst = Define.property[keyCommon];

                            if (subst && !subst.usageHistory[cn(keyCommon)]) {
                                Define.property[key] = subst;
                                Define.property[sk(Keywords.UnknownObject)] = {
                                    type:Syntax.Identifier,
                                    name: p.name,
                                    usageHistory: {}
                                };

                                r(node);
                                //cl('------------------------------------------------------');
                                //cl(Define.property);

                                //cl (refl(Define.func[('LOOKUPGETTER+2')].rel.body.body, CodeNum));

                                delete Define.property[sk(Keywords.UnknownObject)];
                                delete Define.property[key];
                                return;
                            }
                        }
                    }


                }

                pushState(false);

                function printEscaped (object) {

                    if (object.type == Syntax.AssignmentExpression ||
                        object.type == Syntax.BinaryExpression ||
                        object.type == Syntax.UpdateExpression ||
                        object.type == Syntax.UnaryExpression ||
                        object.type == Syntax.LogicalExpression) {
                        c('(');
                        r(object);
                        c(')');
                    }
                    else {
                        r(object);
                    }
                }

                var object = node.object;
                if (node.computed) {
                    printEscaped(object);
                    c('[');
                    r(node.property);
                    c(']');
                }
                else {
                    printEscaped(object);
                    c('.');
                    var isAlone = false;
                    if (node.property.type == Syntax.Identifier) {// &&
                        //node.name == 'constructor') {

                        //  if (node.property.name == 'constructor') {
                        //      console.log(node.property);
                        //  }
                       var k = sk(refl(node.property, CodeNum));
                        //cl(k);
                       if (!IsEmpty && Define.property[k]) {
                           if (Define.property[k].alone)
                            isAlone = true;
                       }
                    }
                    if (!isAlone)
                        r(node.property);
                    else
                        c(refl(node.property, CodeNum));
                }
                popState();
                sc();
            }

            function useEnumObjectMacro (node) {
                var enumName = node.arguments[0].name;
                var enumKeys = '{';
                var tmp;
                
                
                if (!Define) {
                    return;
                }

                var isEmpty = true;

                var enumSoName = enumsk(enumName) + '_obj';
                c(enumSoName);
                if (SystemObjects[enumSoName]) {
                    return;
                }

                for (var i = 0; i < Define.enums[enumName].length; ++ i) {
                    isEmpty = false;
                    tmp = Define.enums[enumName][i].value;
                    enumKeys += '' + Define.enums[enumName][i].enumKey + ': ' 
                        + (typeof tmp === 'string'? "'" + tmp + "'": tmp);
                    enumKeys += ', ';
                    
                }
                if (isEmpty) {
                    return;
                }

                enumKeys = enumKeys.substr(0, enumKeys.length - 2);
                enumKeys += '}';
                //c(enumKeys);
                SystemObjects[enumSoName] = enumKeys;
            }

            function useEnumKeysMacro (node) {
                var enumName = node.arguments[0].name;
                var enumKeys = '[';
                var tmp;
                
                if (!Define) {
                    return;
                }

                var isEmpty = true;
                
                var enumSoName = enumsk(enumName) + '_keys';
                c(enumSoName);
                if (SystemObjects[enumSoName]) {
                    return;
                }

                for (var i = 0; i < Define.enums[enumName].length; ++ i) {
                    isEmpty = false;
                    tmp = Define.enums[enumName][i].value;
                    enumKeys += '' + (typeof tmp === 'string'? "'" + tmp + "'": tmp) + ', ';
                    
                }
                if (isEmpty) {
                    return;
                }

                enumKeys = enumKeys.substr(0, enumKeys.length - 2);
                enumKeys += ']';

                SystemObjects[enumSoName] = enumKeys;
                //c(enumKeys);
            }

            function useIncludeMacro (node, insert) {
                insert = arguments.length < 2? false: insert;
                if (IsEmpty) {
                    return;
                }
                var argv = node.arguments, file, id, fileName;
                if (!argv.length) {
                    return;
                }

                file = esprima.parse(
                    reflect(argv[0], false, Define, false, true, CodeNum)
                    ).body[0].expression.value;
                pushPath(extractFilePath(file));

                fileName = extractFileName(file);

                if (fileName == '') {
                    fileName = exports['defaultInclude'];
                }

                id = simplifyPath(curPath() + fileName);

                var subst = Define.include[id];
                var prevFile;
                if (subst) {
                    if (!subst.used) {
                        if (!subst.skip) {
                           // cl('<include: ' + id + '> included. ');
                            
                            prevFile = CurFile;
                            CurFile = id;
                            if (!insert) {
                                subst.used = true;
                                r(subst);
                            }
                            else {
                                c(subst.insert);
                            }
                            //cl('file: ' + id + ' processed.');
                            CurFile = prevFile;
                        }
                        else {
                            cl('<include: ' + id + '> skipped. ');
                        }
                    }
                    else {
                        //cw('<include: ' + id + '> already been used.');
                    }
                }
                else {
                    cw('<include: ' + id + '> not found.');
                }

                popPath();
            }

            function useUndefMacro (node) {
                if (IsEmpty) {
                    return;
                }
                var argv = node.arguments;

                var key = refl(argv[0], CodeNum);

                if (argv[0].type == Syntax.CallExpression) {

                    var call = exports.reflect(argv[0].callee, false);
                    call += '+' + argv[0].arguments.length; //+ Idea sponsored bt Aldore
                    delete Define.func[call];
                    return;
                }
                delete Define.property[sk(key)];
            }

            function useElseIfMacro (node) {
                if (node.arguments.length) {
                    throw new Error('Parametric ElseIf unsupported!');
                }
                else {
                    len = ignoreStack.length;
                    if (!IsIgnore || ignoreStack[len - 1] === false) {
                        IsIgnore = !IsIgnore;
                    }
                }
            }


            function useIfdefMacro (node) {
                if (IsIgnore) {
                    return pushIgnore(true);
                }

                var arg = node.arguments[0];
                try {

                    if (!Define.property[sk(arg.name)]) {
                        pushIgnore(true);
                    }
                }
                catch (e) {
                    throw e;
                }
            }

            function useEndIfMacro (node) {
                popIgnore();
            }

            function useIfMacro (node) {
                if (IsIgnore) {
                    return pushIgnore(true);
                }


                var arg = node.arguments[0];
                try {
                    if (!(eval(reflect(arg, true, Define, false, st, CodeNum)))) {
                        pushIgnore(true);
                    }
                }
                catch (e) {
                    throw e;
                }
            }


            function procCallExpression (node) {

                var callee = node.callee;
                if (callee.type == Syntax.Identifier) {
                    switch (callee.name) {
                        case Keywords.EndIf:
                            return useEndIfMacro(node);
                        case Keywords.ElseIf:
                            return useElseIfMacro(node);
                        case Keywords.If:
                            return useIfMacro(node);
                        case Keywords.Ifdef:
                            return useIfdefMacro(node);
                    }

                    if (IsIgnore) {
                        return;
                    }

                    switch (callee.name) {
                        case Keywords.Include:
                            return useIncludeMacro(node);
                        case Keywords.Insert:
                            return useIncludeMacro(node, true);
                        case Keywords.Undef:
                            return useUndefMacro(node);
                        case Keywords.EnumKeys:
                            return useEnumKeysMacro(node);
                        case Keywords.EnumObject:
                            return useEnumObjectMacro(node);
                        case Keywords.Define:
                        case Keywords.Enum:
                            return;
                    }
                }

                if (IsIgnore) {
                    return;
                }


                if (!IsEmpty/*callee.type == Syntax.Identifier*/) {
                    var callOf = refl(callee, CodeNum);
                    var call = callOf + '+' + node.arguments.length;
                    var subst = Define.func[call];


                    if (subst && !subst.usageHistory[cn(call)]) {
                        //cl('call >:', Define.property[sk(Keywords.FUNC)].name);
                        //console.log(subst, call, Define.property);
                        var argBefore = subst.arg,
                            argBeforeName,
                            argAfter = node.arguments,
                            localProperties, toLiteral, prevDefine, nextDefine;
                            //var prefArgAfter = new Array(node.arguments.length);
                        //if(argAfter.length == 2)
                            //console.log('-->',refl(node, CodeNum), argAfter[1].value,  cl((new Error()).stack))
                        if (argBefore.length == argAfter.length) {
                            ++ Define.depth;

                            prevDefine = {};
                            nextDefine = {};

                            subst.usageHistory[cn(call)] = 1;

                            localProperties = Define.property;

                            for (var i = 0; i < argBefore.length; ++i) {
                                toLiteral = argBefore[i].toLiteral;
                                argBeforeName = argBefore[i].name;

                                var key = sk(argBefore[i].name);
                                if (localProperties[key]) {
                                    if (Define.depth > 0) {
                                        var keyReal = sk(refl(argAfter[i], CodeNum))
                                        argAfter[i] = extend(true, {}, localProperties[keyReal]);
                                    }
                                    else {

                                        cw(comment('::erase arg ' +
                                                       '<' + argBefore[i].name + '> (' +
                                                       refl(localProperties[key], CodeNum) +
                                                       ' ==> ' + refl(argAfter[i], CodeNum) + ') in call: ' + call));

                                    }

                                    prevDefine[key] = localProperties[key];
                                }
                                else {
                                    prevDefine[key] = null;
                                }

                                var argAfterFinal = argAfter[i];
                                if (toLiteral) {

                                    argAfterFinal = {
                                        type:  Syntax.Literal,
                                        value: reflect(argAfter[i], false, Define,false, st, CodeNum)
                                    };

                                }

                                nextDefine[key] = argAfterFinal;
                                nextDefine[key].usageHistory = {};
                            }

                            for (i in nextDefine) {
                                localProperties[i] = nextDefine[i];
                            }
                            //cl('call <>:', Define.property[sk(Keywords.FUNC)].name);

                            var ncode = reflect((subst.rel.body.body), true, Define, false, st, CodeNum);
                            //cl('call <:', Define.property[sk(Keywords.FUNC)].name, ncode);
                           // CodeNum ++;

                            //restoring previous Define
                            for (i in prevDefine) {
                                //console.log(i, localProperties[i]);
                                if (prevDefine[i] != null) {
                                    localProperties[i] = prevDefine[i];
                                }
                                else {
                                    delete (localProperties[i]);
                                }
                            }


                            debug(comment(refl(node, CodeNum) + ' ==> ' + ncode));

                            --Define.depth;
                            //if(argAfter.length == 2)console.log('<--',refl(node, CodeNum));
                            return c(ncode);
                        }
                    }
                    else {
                        call = callOf + '+*';
                        subst = Define.func[call];
                        //cl(call, Define.func);

                        if (subst && !subst.usageHistory[cn(call)]) {
                            var argObj = '';
                            for (var i = 0; i < node.arguments.length; ++i) {
                                argObj += reflect(node.arguments[i], false, Define, false, st, CodeNum);
                                if (i + 1 !== node.arguments.length) {
                                    argObj += ',';
                                }
                            }

                            //console.log(argObj);
                            if (argObj.match(/^\s*$/)) {
                                argObj = {type: Syntax.Identifier, name: 'undefined'};
                            }
                            else {
                                argObj = esprima.parse(argObj).body[0];
                            }

                            argObj.usageHistory = {};

                            Define.property[sk(Keywords.ARGS)] = argObj;
                            //console.log(argObj)
                            var code = reflect((subst.rel.body.body), true, Define, false, st, CodeNum);
                            delete Define.property[sk(Keywords.ARGS)];
                            return c(code);
                            //return;
                        }
                    }
                    if (!InDefine) {

                        var callIndex = call.lastIndexOf('.');
                        var callCommon = call.substr(0, callIndex);
                        var callForSubst = callCommon + '.__'+ '+' + node.arguments.length;
                        var key;

                        var callForSubstAlter = callCommon + '.__' + '+*';
                        var substAlter = Define.func[callForSubstAlter];

                        subst = Define.func[callForSubst];
                        if ((subst && !subst.usageHistory[cn(callForSubst)]) ||
                            (substAlter && !substAlter.usageHistory[cn(substAlter)])) {
                            //console.log('__', '-->', call.substr(callIndex + 1), call);
                            Define.func[call] = subst? subst: substAlter;
                            key = sk(Keywords.UnknownObject);

                            Define.property[key] = {
                                type: Syntax.Identifier,
                                name: callee.property.name,
                                usageHistory: {}
                            };

                            r(node);
                            delete Define.property[key];
                            return;
                        }
                    }

                }
                //var codePrev = Code;
                if (node.callee.type != Syntax.FunctionExpression) {
                    pushState(false);
                    r(node.callee);

                    c('(');
                    procArguments(node.arguments);
                    c(')');
                    popState();
                    //console.log('call finaly:', Code.substr(codePrev.length));
                }
                else {

                    c('(');
                    r(node.callee);
                    c(')');
                    c('(');
                    pushState(false);
                    procArguments(node.arguments);
                    popState();
                    c(')');
                }
                sc();
            }

            function procFunctionExpression (node, magicWord) {
                magicWord = magicWord || false;
                if (!magicWord) {
                    c('function');
                }
                c('(');
                pushState(false);
                procArguments(node.params);
                popState();
                c(')');
                pushState(true);
                r(node.body);
                popState();
            }

            function procThisExpression (node) {
                c("this");
            }

            function procArrayExpression (node) {
                c('[');
                pushState(false);
                procArguments(node.elements);
                popState();
                c(']');
                sc();
            }

            function procReturnStatement (node) {
                c('return ');
                pushState(false);
                r(node.argument);
                popState();
                sc();
            }

            function procBreakStatement (node) {
                c('break ');
                pushState(false);
                r(node.label);
                popState();
                sc();
            }

            function procCatchClause (node) {
                c('catch');
                c('(');
                pushState(false);
                r(node.param);
                popState();
                c(')')
                pushState(true);
                r(node.body);
                popState();
            }

            function procTryStatement (node) {
                c('try');
                pushState(true);
                r(node.block);
                r(node.handlers);
                if (node.finalizer) {
                    c('finally');
                    r(node.finalizer);
                }
                popState();
                sc();
            }

            function procConditionalExpression (node) {
                function escapedPrint (subNode) {
                    if (subNode.type == Syntax.SequenceExpression) {
                        c('(');
                        r(subNode);
                        c(')');
                    }
                    else {
                        r(subNode);
                    }
                }

                pushState(false);
                c('(');
                r(node.test);
                c('? ');
                escapedPrint(node.consequent);
                c(' : ');
                escapedPrint(node.alternate);
                c(')');
                popState();
                sc();
            }

            function procContinueStatement (node) {
                c('continue ');
                pushState(false);
                r(node.label);
                popState();
                sc();
            }

            function procDoWhileStatement (node) {
                c('do');
                pushState(true);
                r(node.body);
                popState();
                c('while');
                c('(');
                pushState(false);
                r(node.test);
                popState();
                c(')');
                sn();
            }

            function procDebuggerStatement (node) {
                c('debugger');
                sc();
            }

            function procForStatement (node) {
                c('for ');
                pushState(false);
                c('(');
                r(node.init);
                c('; ');
                r(node.test);
                c('; ');
                r(node.update);
                c(')');
                popState();
                pushState(true);
                r(node.body);
                popState();
                sn();
            }

            function procForInStatement (node) {
                c('for ');
                pushState(false);
                c('(');
                r(node.left);
                c(' in ');
                r(node.right);
                c(')');
                popState();
                pushState(true);
                r(node.body);
                popState();
                sn();
                //TODO: each property
            }

            function procFunctionDeclaration (node) {
                var key = sk(Keywords.FUNC);
                var funcName = node.id;
                var funcPrevName = Define.property[key].name;
                if (funcName.type === Syntax.Identifier) {
                    Define.property[key].name = funcName.name;
                    //cl(funcPrevName, '-->', funcName.name);
                }
                c('function ');
                pushState(false);
                r(node.id);
                popState();
                c('(');
                pushState(false);
                procArguments(node.params);
                popState();
                c(')');
                pushState(true);
                r(node.body);
                popState();
                sn();
                //cl(funcPrevName, '<--', Define.property[key].name);
                Define.property[key].name = funcPrevName;
            }

            function procLabeledStatement (node) {
                var label = node.label;
                //  if (label != Keywords.Effect) {

                // }
                pushState(false);
                r(label);
                c(':\n');
                r(node.body);
                popState();
                //  }
                // else
                //     procEffectStatements(node.body);
            }

            function procSequenceExpression (node) {
                pushState(false);
                procArguments(node.expressions);
                popState();
            }

            function procSwitchStatement (node) {
                c('switch');
                c('(');
                pushState(false);
                r(node.discriminant);
                popState();
                c(')');
                c(' {');
                r(node.cases);
                c('}');
                sn();
            }

            function procSwitchCase (node) {
                pushState(false);
                if (node.test == null) {
                    c('\ndefault:\n');
                }
                else {
                    c('\ncase ');
                    r(node.test);
                    c(':\n');
                }
                popState();
                pushState(true);
                r(node.consequent);
                popState();
                sc();
            }

            function procThrowStatement (node) {
                c('throw ');
                r(node.argument);
                sc();
            }

            function procUpdateExpression (node) {
                if (node.prefix) {
                    c(node.operator);
                }
                pushState(false);
                r(node.argument);
                popState();
                if (!node.prefix) {
                    c(node.operator);
                }
                sc();
            }

            function procWhileStatement (node) {
                c('while ');
                c('(');
                pushState(false);
                r(node.test);
                popState();
                c(')');
                pushState(true);
                r(node.body);
                popState();
            }

            function procWithStatement (node) {
                c('with ');
                c('(');
                pushState(false);
                r(node.object);
                popState()
                c(')');
                pushState(true);
                r(node.body);
                popState();
            }

            function r (node) {
                if (!node) {
                    return;
                }
                if (node instanceof Array) {
                    for (var i = 0; i < node.length; ++i) {
                        r(node[i]);
                    }
                    return;
                }
                if (IsIgnore) {
                    if (node.type == Syntax.CallExpression) {
                        procCallExpression(node);
                    }
                    else if (node.type == Syntax.ExpressionStatement) {
                        procExpressionStatement(node);
                    }
                    return;
                }
                switch (node.type) {
                    case Syntax.AssignmentExpression:
                        procAssignmentExpression(node);
                        break;
                    case Syntax.ArrayExpression:
                        procArrayExpression(node);
                        break;
                    case Syntax.BlockStatement:
                        procBlockStatement(node);
                        break;
                    case Syntax.BinaryExpression:
                        procBinaryExpression(node);
                        break;
                    case Syntax.BreakStatement:
                        procBreakStatement(node);
                        break;
                    case Syntax.CallExpression:

                        procCallExpression(node);

                        break;
                    case Syntax.CatchClause:
                        procCatchClause(node);
                        break;
                    case Syntax.ConditionalExpression:
                        procConditionalExpression(node);
                        break;
                    case Syntax.ContinueStatement:
                        procContinueStatement(node);
                        break;
                    case Syntax.DoWhileStatement:
                        procDoWhileStatement(node);
                        break;
                    case Syntax.DebuggerStatement:
                        procDebuggerStatement(node);
                        break;
                    case Syntax.EmptyStatement:
                        procEmptyStatement(node);
                        break;
                    case Syntax.ExpressionStatement:
                        procExpressionStatement(node);
                        break;
                    case Syntax.ForStatement:
                        procForStatement(node);
                        break;
                    case Syntax.ForInStatement:
                        procForInStatement(node);
                        break;
                    case Syntax.FunctionDeclaration:
                        InFunction ++;
                        procFunctionDeclaration(node);
                        InFunction --;
                        break;
                    case Syntax.FunctionExpression:
                        InFunction ++;
                        procFunctionExpression(node);
                        InFunction --;
                        break;
                    case Syntax.Identifier:
                        procIdentifier(node);
                        break;
                    case Syntax.IfStatement:
                        procIfStatement(node);
                        break;
                    case Syntax.Literal:
                        procLiteral(node);
                        break;
                    case Syntax.LabeledStatement:
                        procLabeledStatement(node);
                        break;
                    case Syntax.LogicalExpression:
                        procLogicalExpression(node);
                        break;
                    case Syntax.MemberExpression:
                        InMemderExp ++;
                        procMemberExpression(node);
                        InMemderExp --;
                        break;
                    case Syntax.NewExpression:
                        procNewExpression(node);
                        break;
                    case Syntax.ObjectExpression:
                        procObjectExpression(node);
                        break;
                    case Syntax.Program:
                        procProgram(node);
                        break;
                    case Syntax.ReturnStatement:
                        procReturnStatement(node);
                        break;
                    case Syntax.SequenceExpression:
                        procSequenceExpression(node);
                        break;
                    case Syntax.SwitchStatement:
                        procSwitchStatement(node);
                        break;
                    case Syntax.SwitchCase:
                        procSwitchCase(node);
                        break;
                    case Syntax.ThisExpression:
                        procThisExpression(node);
                        break;
                    case Syntax.ThrowStatement:
                        procThrowStatement(node);
                        break;
                    case Syntax.TryStatement:
                        procTryStatement(node);
                        break;
                    case Syntax.UnaryExpression:
                        procUnaryExpression(node);
                        break;
                    case Syntax.UpdateExpression:
                        procUpdateExpression(node);
                        break;
                    case Syntax.VariableDeclaration:
                        procVariableDeclaration(node);
                        break;
                    case Syntax.WhileStatement:
                        procWhileStatement(node);
                        break;
                    case Syntax.WithStatement:
                        procWithStatement(node);
                        break;
                    default:
                        todo("unsupported code structure");
                        cl(node);
                }
            }

            r(Tree);

            var codeSysObject = '';
            for (var i in SystemObjects) {
                codeSysObject += 'window.' + i + ' = ' + SystemObjects[i] + ';\n';
            }

            return codeSysObject + Code;
        }

        function refl (Tree, CodeNum) {
            return reflect(Tree, false, null, true, true, CodeNum);
        }

        var define = genEmptyDefine();


        exports.reflect = function (tree, semicolon, def, isNew, state) {

            if (isNew === true) {
                define = genEmptyDefine();
            }

            if (def) {
                define = mergeDefines(define, def);
                if (!def.property[sk(Keywords.FUNC)]) {
                    delete define.property[sk(Keywords.FUNC)];
                }
            }

            var isEmpty = (def ? false : true);
            uniqCodeNum.val ++;
            return reflect(tree, semicolon, define, isEmpty, state, uniqCodeNum);
        };

    }());


    (function () {
        var Define, tmp;
        var SubstArg, IsIgnore;
        var CurFile = null;
        var ignoreStack = [];

        function pushIgnore (state) {
            ignoreStack.push(IsIgnore);
            IsIgnore = state;
        }

        function popIgnore () {
            if (ignoreStack.length) {
                IsIgnore = ignoreStack.pop();
            }
            else {
                IsIgnore = false;
            }
        }

        function getLowLevelObj (node) {
            if (node.type == Syntax.MemberExpression) {
                return getLowLevelObj(node.object);
            }
            return node;
        }

        function useDefineMacro (node, enumName, enumKey) {
            InDefine ++;
            var argv = node.arguments;

            var key = exports.reflect(argv[0], false);

            if (argv[0].type == Syntax.CallExpression) {

                var call = exports.reflect(argv[0].callee, false);
                var argc = argv[0].arguments.length;

                var uniqPfx = call.replace(/\./g, '_') + '_' + argc + UniqPrefix;

                if (SubstArg) {
                    var localDefine = genEmptyDefine();
                    var useTransform;
                    if (argc === 1 && argv[0].arguments[0].name === Keywords.ARGS) {
                        call += '+*';
                    }
                    else {
                        call += '+' + argc; //+ Idea sponsored bt Aldore
                        for (var i = 0; i < argc; ++i) {
                            useTransform = false;

                            var arg = argv[0].arguments[i];
                            var prevName = arg.name;

                            if (prevName.substr(0, 2) == '$$') {
                                prevName = prevName.substr(2);
                                useTransform = true;
                                arg.toLiteral = true;
                            }

                            var nextName = uniqPfx + '_' + prevName;
                            /*
                            if (useTransform) {
                                nextName = '$$' + nextName;
                            } */

                            arg.name = nextName;
                            arg.usageHistory = {};

                            localDefine.property[sk(prevName)] = (arg);//clone(arg);
                        }
                    }

                    delete localDefine.property[sk(Keywords.FUNC)];//.name = Keywords.FUNC;
                    var funcStr = exports.reflect(argv[1].body, true, localDefine, true, true);

                    try {
                        argv[1].body.body = esprima.parse(funcStr).body[0].body;
                    }
                    catch (e) {
                        cl('error after function modification, param name replacing...');
                        cl(exports.reflect(argv[1].body, true, null, true, true));
                        cl(funcStr);
                        cl(localDefine);
                        throw e;
                    }
                }
                if (ExtractMacroMode) {
                    call = call + '+' + argv[0].arguments.length;
                }
                Define.func[call] = {
                    arg:          argv[0].arguments,
                    rel:          argv[1],
                    usageHistory: {},
                    alone: argv.length > 2
                };

                InDefine --;
                return;
            }
            //console.log(key, exports.reflect(argv[1]));
            key = sk(key);
            Define.property[key] = (argv[1]);
            Define.property[key].usageHistory = {};
            Define.property[key].alone = argv.length > 2;
            Define.property[key].enumName = enumName;
            Define.property[key].enumKey = enumKey;
            if (enumName) {
                Define.enums[enumName].push(Define.property[key]);
            }
            InDefine --;
        }


        function useIncludeMacro (node, insert) {
            insert = arguments.length < 2? false: insert;

            var argv = node.arguments, file, inject, fid, fileName;

            if (!argv.length) {
                return;
            }

            file = esprima.parse(
                exports.reflect(argv[0], true, Define, false, true)
                ).body[0].expression.value;

            pushPath(extractFilePath(file));

            fileName = extractFileName(file);
            if (fileName == '') {
                fileName = exports['defaultInclude'];
            }

            fid = simplifyPath(curPath() + fileName);

            if (!Define.include[fid]) {
                try {
                    inject = readFile(fid);

                }
                catch (e) {
                    if (!(e instanceof SyntaxError)) {
                        throw e;
                    }
                }


                if (!inject.length) {
                    return;
                }
                try {
                    var res = !insert? esprima.parse(inject): inject;
                }
                catch (e) {
                    cl('ERROR:: syntax error in: ' + fid);
                    throw e;
                }
                var prevFile = CurFile;
                CurFile = fid;
                
                if (!insert) {
                    Define = exports.analyze(res, Define, SubstArg);
                    Define.include[fid] = res.body;
                }
                else {
                    Define.include[fid] = {insert: res};
                }

                
                CurFile = prevFile;
            }
            else {
                //cw('<include: ' + fid + '> has already been used. ');
            }

            popPath();
        }

        function useEnumMacro (node) {
            var argv = node.arguments;

            if (argv.length < 2) {
                return;
            }

            var list = argv[0];
            if (list.type != Syntax.ArrayExpression) {
                return;
            }

            var n = 0, lastString = false, t, isAssigment, matches;
            var def = {
                type:      Syntax.CallExpression,
                callee:    {
                    type: Syntax.Identifier,
                    name: Keywords.Define
                },
                arguments: [
                    null,
                    {
                        type:  Syntax.Literal,
                        value: 0
                    }
                ]
            }

            var prefix = null, tmp;
            var enumName = String(argv[1].name),
                enumKey;
            if (argv.length > 2) {
                prefix = exports.reflect(argv[2], false);
            }
            if (Define.enums[enumName]) {
                throw new Error('Enum with name <' + enumName + '> \
                    already exists.\nfile: ' + CurFile + '\n' + 
                    'previsly defined in: ' + Define.enums[enumName]['@location']);
            }
            Define.enums[enumName] = [];
            Define.enums[enumName]['@location'] = CurFile;
            Define.enums[enumName]['@class'] = prefix;
        

            list = list.elements;
            for (var i = 0, en; i < list.length; ++i) {
                isAssigment = false;
                en = extend(true, {}, def);
                if (list[i].type == Syntax.AssignmentExpression) {
                    isAssigment = true;
                    tmp = list[i].left;
                    if (list[i].right.type === Syntax.Literal && typeof list[i].right.value === 'string') {
                        t = list[i].right.value;

                        if(matches = t.match(/^(.*?\w)(\d+)$/i)) {
                            t = matches[1];
                            n = Number(matches[2]);
                        }
                        else {
                            n = 0;
                        }

                        lastString = t;
                    }
                    else {
                        lastString = null;
                        n = Number(exports.reflect(list[i].right, false, Define));
                    }

                }
                else {
                    tmp = list[i];
                }
                enumKey = tmp;
                if (prefix) {
                    try {
                        tmp = esprima.parse(prefix + '.' +
                                                exports.reflect(tmp, false)).body;
                    }
                    catch (e) {
                        throw e;
                    }
                }

                if (lastString === null) {
                    en.arguments[0] = tmp;
                    en.arguments[1].value = n;
                }
                else {
                    if (matches) {
                        t += n;
                    }

                    if (!isAssigment) {
                        t = lastString + n;
                    }

                    en.arguments[0] = tmp;
                    en.arguments[1].value = t;
                }
                n++;
                debug('//' + ('Enum: ' + exports.reflect(tmp, false) + ' : ' + t));
                useDefineMacro(en, enumName, exports.reflect(enumKey, false));
            }

            //TODO: Undef for Enum
        }

        function useElseIfMacro (node) {
            if (node.arguments.length) {
                throw new Error('Parametric ElseIf unsupported!');
            }
            else {
                len = ignoreStack.length;
                if (!IsIgnore || ignoreStack[len - 1] === false) {
                    IsIgnore = !IsIgnore;
                }
            }
        }


        function useIfdefMacro (node) {
            if (IsIgnore) {
                return pushIgnore(true);
            }

            var arg = node.arguments[0];

            try {
                if (!Define.property[sk(arg.name)]) {
                    pushIgnore(true);
                }
            }
            catch (e) {
                throw e;
            }
        }

        function useEndIfMacro (node) {
            popIgnore();
        }

        function useIfMacro (node) {
            if (IsIgnore) {
                return pushIgnore(true);
            }


            var arg = node.arguments[0];
            try {
                //console.log('---------------------- DEAD LINE -----------------------');
                if (!(eval(exports.reflect(arg, true, Define, false)))) {
                    pushIgnore(true);
                }
            }
            catch (e) {
                cl('cannot eval If() statament with ignore: ' + IsIgnore); cl(Define);
                cl('value:');
                cl(exports.reflect(arg, true, Define, false));
                throw e;
            }
        }

        function procCallExpression (node) {
            var callee = node.callee;
            //console.log("procCallExpression", node);
            if (callee && callee.type == Syntax.Identifier) {

                if (callee.name == Keywords.ElseIf) {
                    useElseIfMacro(node)
                }
                else if (callee.name == Keywords.EndIf) {
                    useEndIfMacro(node);
                }

                if (callee.name == Keywords.If) {
                    useIfMacro(node);
                }
                else if (callee.name == Keywords.Ifdef) {
                    useIfdefMacro(node);
                }

                if (IsIgnore) {
                    return;
                }
                if (callee.name == Keywords.Define) {
                    useDefineMacro(node);
                }
                else if (callee.name == Keywords.EnumKeys) {
                    //useEnumKeysMacro(node);
                }
                else if (callee.name == Keywords.Undef) {
                    //useUndefMacro(node);
                }
                else if (callee.name == Keywords.Enum) {
                    useEnumMacro(node);
                }
                else if (callee.name == Keywords.Include) {
                    useIncludeMacro(node);
                }
                else if (callee.name == Keywords.Insert) {
                    useIncludeMacro(node, true);
                }

            }
            else {
                r(node.callee);
            }
            r(node.arguments);

        }

        function r (node) {
            if (!node) {
                return;
            }
            if (node instanceof Array) {
                for (var i = 0; i < node.length; ++i) {
                    r(node[i]);
                }
                return;
            }

            switch (node.type) {
                case Syntax.AssignmentExpression:
                    r(node.left);
                    r(node.right);
                    break;
                case Syntax.ArrayExpression:
                    r(node.elements)
                    break;
                case Syntax.BlockStatement:
                    r(node.body);
                    break;
                case Syntax.BinaryExpression:
                    r(node.left);
                    r(node.right);
                    break;
                case Syntax.BreakStatement:
                    break;
                case Syntax.CallExpression:
                    procCallExpression(node);
                    break;
                case Syntax.CatchClause:
                    r(node.param);
                    r(node.guard);
                    r(node.body);
                    break;
                case Syntax.ConditionalExpression:
                    r(node.test);
                    r(node.consequent);
                    r(node.alternate);
                    break;
                case Syntax.ContinueStatement:
                    break;
                case Syntax.DoWhileStatement:
                    r(node.body);
                    r(node.test);
                    break;
                case Syntax.DebuggerStatement:
                    break;
                case Syntax.EmptyStatement:
                    break;
                case Syntax.ExpressionStatement:
                    r(node.expression);
                    break;
                case Syntax.ForStatement:
                    r(node.init);
                    r(node.test);
                    r(node.update);
                    r(node.body)
                    break;
                case Syntax.ForInStatement:
                    r(node.left);
                    r(node.right);
                    r(node.body);
                    break;
                case Syntax.FunctionDeclaration:
                    r(node.params);
                    r(node.body);
                    break;
                case Syntax.FunctionExpression:
                    r(node.params);
                    r(node.body);
                    break;
                case Syntax.Identifier:
                    break;
                case Syntax.IfStatement:
                    r(node.test);
                    r(node.consequent);
                    r(node.alternate);
                    break;
                case Syntax.Literal:
                    break;
                case Syntax.LabeledStatement:
                    r(node.body);
                    break;
                case Syntax.LogicalExpression:
                    r(node.left);
                    r(node.right);
                    break;
                case Syntax.MemberExpression:
                    r(node.object);
                    break;
                case Syntax.NewExpression:
                    r(node.arguments);
                    break;
                case Syntax.ObjectExpression:
                    var p = node.properties;
                    for (var i = 0; i < p.length; ++i) {
                        r(p[i].key);
                        r(p[i].value);
                    }

                    break;
                case Syntax.Program:
                    r(node.body);
                    break;
                case Syntax.ReturnStatement:
                    r(node.argument);
                    break;
                case Syntax.SequenceExpression:
                    r(node.expressions);
                    break;
                case Syntax.SwitchStatement:
                    r(node.discriminant);
                    r(node.cases);
                    break;
                case Syntax.SwitchCase:
                    r(node.test);
                    r(node.consequent);
                    break;
                case Syntax.ThisExpression:
                    break;
                case Syntax.ThrowStatement:
                    r(node.argument);
                    break;
                case Syntax.TryStatement:
                    r(node.block);
                    break;
                case Syntax.UnaryExpression:
                    r(node.argument);
                    break;
                case Syntax.UpdateExpression:
                    r(node.argument);
                    break;
                case Syntax.VariableDeclaration:
                    var decl = node.declarations;
                    for (var i = 0; i < decl; ++i) {
                        r(decl[i].id);
                        r(decl[i].init);
                    }
                    break;
                case Syntax.WhileStatement:
                    r(node.test);
                    r(node.body);
                    break;
                case Syntax.WithStatement:
                    r(node.object);
                    r(node.body);
                    break;
                default:
                    console.log("unknown syntax structure founded:");
                    console.log(node);
            }
        }

        function analyze(tree, define, substArg) {
            IsIgnore = false;
            ignoreStack = [];
            SubstArg = (substArg === undefined ? true : substArg);

            debug('SubstArg: ' + SubstArg);
            var emptyDefine = genEmptyDefine();
            Define = (define ? mergeDefines(emptyDefine, define) : emptyDefine);
            r(tree);
            return Define;
        };


        //exports.next = null;

        function parse(code, custom) {
            IsDebug = exports['debug'];
            //PathStack = [];

            try {
                var res = esprima.parse(code);
            }
            catch (e) {
                throw e;
            }


            var def = exports.analyze(res);

            exports['next'] = function (custom) {
                if (typeof custom == 'object') {
                    if (custom.include) {
                        for (var i in custom.include) {
                            if (custom.include[i] === false) {
                                def.include[i].skip = true;
                            }
                        }
                    }
                }

                debug("=====> reflect starting...");
                debug(def);
                return exports.reflect(res, true, def, true);
            }

            //custom = {include: true};
            if (typeof custom == 'object') {
                var customResult = {};
                if (custom.include) {
                    var include = customResult.include = {};
                    for (var i in def.include) {
                        include[i] = true;
                    }
                }

                return customResult;
            }

            return exports.next();
        }

        function file(file) {
            pushPath(simplifyPath(extractFilePath(file)));
            var sCode = exports.code(readFile(file));
            popPath();
            return sCode;
        }

        function watch() {
            try { if(document); }catch (e) { return;}

            var inlineSources = document.getElementsByTagName('script');
            var str = '';
            for (var i in inlineSources) {
                var src = inlineSources[i];
                if (src.type == exports['scriptType']) {
                    if (src.src) {
                        str += readFile(src.src);
                    }

                    str += src.innerHTML;
                }
            }

            var head = document.getElementsByTagName("head")[0];
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML = exports.code(str);
            script.id = 'akra-js-' + (new Date()).getTime();
            head.appendChild(script);
            //eval();
        };
       
        function extractMacro (code, constCb, macroCb, enumCb, skipParsing) {
            
            constCb = constCb || function (name, value, alone) {
                return ('Define(' + name + ',' + value + (alone? ', true' : '') +  ')').replace(/(\r\n|\n|\r)/gm, '');
            };

            macroCb = macroCb || function (name, args, body) {
                return ('Define(' + name + '(' +args + '),function()' + body + ')').replace(/(\r\n|\n|\r)/gm, '');
            };

            enumCb = enumCb || function (name, enumData) {
                //cl(name, enumData);
                var res = 'Enum([\n';
                var prevValue = undefined;
                var bShortName = true;
                for (var i = 0; i < enumData.length; ++ i) {
                    res += '\t';
                    bShortName = true;
                    if (prevValue && enumData[i].value === prevValue + 1) {
                        res += enumData[i].enumKey;
                    }
                    else if ((typeof prevValue === 'string') && (typeof enumData[i].value === 'string')) {
                        var prevMatch = prevValue.match(/^.*?([0-9]+)$/);
                        var curMatch;
                        if (prevMatch) {
                            curMatch = enumData[i].value.match(/^.*?([0-9]+)$/);
                            if (curMatch && (Number(curMatch[1]) - 1) === Number(prevMatch[1])) {
                                res += enumData[i].enumKey;
                            }
                            else {
                                bShortName = false;
                            }
                        }
                        else {
                            bShortName = false;
                        }
                    }
                    else {
                        bShortName = false;
                    }

                    if (bShortName === false) {
                        res += enumData[i].enumKey + ' = ' + exports.reflect(enumData[i], false);
                    }
                    if (i !== enumData.length - 1) {
                        res += ',';
                    }
                    res += '\n';
                    prevValue = enumData[i].value;
                }
                res += '], ' + name + (enumData['@class']? ', ' + enumData['@class']:
                    '') + ');';

                return res;
            }

            ExtractMacroMode = true;
            //console.log(code);
            var def, res;
            try {
                if (!skipParsing)
                    res = esprima.parse(code);
            }
            catch (e) {
                cl('esprima parse error: ')
                throw e;
            }

            //parse(code);

            if (!skipParsing)
                def = exports.analyze(res, null, false);
            ExtractMacroMode = false;

            var pEnums = {};
            var all = ''
        
            for (var i in Define.property) {
                switch (i) {
                    case sk(Keywords.FILE):
                    case sk(Keywords.FUNC):
                    case sk(Keywords.LINE):
                    continue;
                }

                var p = Define.property[i];
                var k = i.substr(0, i.length - 1);
                var v = null;
                var pfx = null;
                var j;

                if (p.enumName) {
                    continue;
                }

                v = exports.reflect(p, true, 0, 0, false);
                all += constCb(k, v, p.alone) + '\n';
            }



            for (var i in Define.enums) {
                all += enumCb(i, Define.enums[i]) + '\n';
            }

            for (var i in Define.func) {
                var f = Define.func[i];
                var func = '', args = '';

                func = i.substr(0, i.lastIndexOf('+'));
               // cl(func);
                for (var j = 0; j < f.arg.length; ++j) {
                    args += exports.reflect(f.arg[j], false) + (j != f.arg.length - 1 ? ',' : '');
                }

                all += macroCb(func, args, exports.reflect(f.rel.body, true, 0, 0, false)) + '\n';
            }

            return all;
        };


        function extractFileMacro(file) {
            pushPath(extractFilePath(file));
            var sCode = this.extractMacro(readFile(file));
            popPath();
            return sCode;
        }

        exports['analyze'] = analyze;
        exports['code'] = parse;
        exports['file'] = file;
        exports['watch'] = watch;
        exports['extractMacro'] = extractMacro;
        exports['extractFileMacro'] = extractFileMacro;
		exports['defaultInclude'] = 'Include.js';
		exports['debug'] = false;
		exports['scriptType'] = 'text/akra-js';
		exports['keywords'] = {};

        exports.watch();
    })();

})((typeof exports === 'undefined' ? (Preprocessor = {}) : exports));


