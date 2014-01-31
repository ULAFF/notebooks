      function parse_fn(stmt){
	  var paramExpr = /\(.*\)/gi;
	  var fnNameExpr = /laff\.[^\(]+/gi;

	  var fnName = fnNameExpr.exec(stmt);
	  var oprds = new Array();
	  if (fnName){  
	      //there exist a laff function

	      //get name
	      fnName = fnName[0];

	      //get parameters 
	      var params = paramExpr.exec(stmt)[0];
	      var paramList = params.split(',');
	      
	      //remove ( and ) from the first and last param
	      paramList[0] = paramList[0].substr(1);
	      paramList[paramList.length-1] = paramList[paramList.length-1].substr(0,paramList[paramList.length-1].length-1);

	      //parse arguments
	      for (var i = 0; i != paramList.length; ++i)
		  oprds.push(parse_oprd(paramList[i]));
	  }
          return {fn:fnName, args:oprds}
      }

      function parse_stmt(stmt){
	  //remove ending ; and empty spaces
	  stmt = stmt.replace(';','').replace(/\s+/g, '');
	  
	  var operators = /[\*=\-\+]/gim;
	  var exprs = stmt.split(operators);
	  var fns = new Array();

	  if (exprs.length == 1){
	      //BLAS like call	      
	      return parse_fn(stmt);
	  }
	  else{
	      //matlab like calls     

	      //parse arguments
	      var oprds = new Array();
	      for (var i = 0; i != exprs.length; ++i)
		  oprds.push(parse_oprd(exprs[i]));

	      return {fn:'', args:oprds};
	  }
      }


      function parse_oprd(oprd){
	  //remove transpose
	  oprd = oprd.replace(/t$/gi,'');

	  var comdExpr = /\'.*\'/gi;
	  
	  if (Number(oprd).toString() == oprd){
	      return {op:'',subregion:oprd}
	  }
	  else if (comdExpr.exec(oprd)){
	      return {op:'', subregion:oprd}
	  }
	  else{
	      var name = oprd.match(/[A-z]+/gi)[0];
	      var anyIndex = oprd.match(/[012]+/gi);
	      var index = null;
	      if (anyIndex)
		  index = anyIndex[0];
	      
	      return {op:name, subregion:index};
	  }
      }

 

      function parse_fn_header(fnHeader){

        var fnNameExpr = /([A-z_]+[_A-z0-9]*\s*)\(/g;
        var fnName = fnNameExpr.exec(fnHeader)[0].replace(/\s/g,'');
        
        var fnParamsExpr = /\((.|\s)*\)/gm;
        var params = fnParamsExpr.exec(fnHeader)[0].replace(/\s/g,'');        
        params = params.substring(1,params.length-1);
      
        var blked_alg = params.search(/nb_alg/gi);
        if (blked_alg != -1)
          params.replace(",nb_alg", '');

        return {name:    fnName.substring(0,fnName.length-1), 
                blocked: (blked_alg==-1),
                operands: params.split(',')};
      }

      function parse(code){
        //parse input file
           //remove comments
           var newCode = code.replace(/\%.*\n/g, '');
	   if (DEFAULT_MODE == 2){
	       newCode = code.replace(/\#.*\n/g,'');
	       newCode = newCode.replace('import flame','');
	   }

           //remove empty lines
           newCode = newCode.replace(/\s*\n+/g,'\n');

           //function header
           var fnHeaderExpr = /^\s*function(.*)/m;
	   if (DEFAULT_MODE == 2)
	       fnHeaderExpr = /^\s*def(.*)/m;

           var fnHeader = fnHeaderExpr.exec(newCode)[0];
           newCode = newCode.replace(fnHeaderExpr, '');

           //identify loop
           var loopExpr = /\s*while(\s|\S)*end/m;
	   if (DEFAULT_MODE == 2)
	       loopExpr = /\s*while((\s|\S)(?!flame\.merge))*/gm;

           var loop = loopExpr.exec(newCode)[0];

           var headerExpr = /\s*while(.*)/;
	   if (DEFAULT_MODE == 2)
	       headerExpr = /\s*while.*:/;
           var header = headerExpr.exec(loop);
           loop = loop.replace(header[0],'');

           var footerExpr = /\s*end/gmi;
           var footer = footerExpr.exec(loop);
	   if (DEFAULT_MODE == 2)
	       footer = [""];

	   if (DEFAULT_MODE == 1)
	       loop = loop.replace(/end$/gim,'');

           var codeParts = newCode.split(loopExpr);

           //identify statements
           var stmtExpr= /[^;]+;/gm;
	   if (DEFAULT_MODE == 2)
	       stmtExpr = /[^)]*\)/gm;

           //initialization
           var codeStmts = codeParts[0].match(stmtExpr);

           var loopHeadPos = codeStmts.length;

           // loop header
           codeStmts.push(header[0]);
     
           //looped statment
           codeStmts = codeStmts.concat(loop.match(stmtExpr));

           var loopFootPos = codeStmts.length;
        
          // loop end
           codeStmts.push(footer[0]);

           //clean up
//           codeStmts = codeStmts.concat(codeParts[1].match(stmtExpr));

      
        return {fn:fnHeader, code:codeStmts, 
                head:loopHeadPos, foot:loopFootPos};
      }
