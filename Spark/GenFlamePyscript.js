var dChoicesBefore = ["none", "TL", "BR", "TR", "BL", "LEFT", "RIGHT", "TOP", "BOTTOM"];
var dChoicesAfter  = ["none", "BR", "TL", "BL", "TR", "RIGHT", "LEFT", "BOTTOM", "TOP"];

function GenFlamePyscript( FnName, FnType, Variant, NumOpers, OperInfo, author, email )
{
    // This section will make this function compatible with the input it receives.
    FnType  = parseInt(FnType);
    Variant = parseInt(Variant);
    
    var newOperInfo = new Array();
    for (var i = 0; i < NumOpers; i++)
	newOperInfo.push(new Array(parseInt(OperInfo[i][0]), parseInt(OperInfo[i][1]), parseInt(OperInfo[i][2]), parseInt(OperInfo[i][3])));
    OperInfo = newOperInfo;

    var openTags = "<html><pre>";
    var closeTags = "</pre></html>";

    var algorithm = "copyright\n\n"
        + "header\n\n"
        + "partition"
        + "guard\n\n"
        + "setblocksize"
        + "repart"
        + "update\n\n"
        + "continue"
        + "merge";

    var copyrightStr    = copyright(author, email);
    var headerStr       = header(FnName, FnType, Variant, NumOpers, OperInfo);
    var partitionStr    = partition(NumOpers, OperInfo);
    var guardStr        = guard(NumOpers, OperInfo);
    var setBlockSizeStr = setBlockSize(FnType, NumOpers, OperInfo);
    var repartStr       = repartition(FnType, NumOpers, OperInfo);
    var updateStr       = update();
    var continueStr     = continueWith(FnType, NumOpers, OperInfo);
    var mergeStr        = merge(NumOpers, OperInfo);

    /*** ALGORITHM ***/
    algorithm = algorithm.replace(/copyright/, copyrightStr);
    algorithm = algorithm.replace(/header/, headerStr);
    algorithm = algorithm.replace(/partition/, partitionStr);
    algorithm = algorithm.replace(/guard/, guardStr);
    algorithm = algorithm.replace(/setblocksize/, setBlockSizeStr);
    algorithm = algorithm.replace(/repart/, repartStr);
    algorithm = algorithm.replace(/update/, updateStr);
    algorithm = algorithm.replace(/continue/, continueStr);
    algorithm = algorithm.replace(/merge/, mergeStr);
    
    algorithm = openTags + algorithm + closeTags;

    with (parent.frames[1].document) {
	open();
	writeln( algorithm );
	close();
    }

    return false;
}


function continueWith(FnType, NumOpers, OperInfo)
{
	var cont13 = "        <vec>L<tr>, <vec>R<tr> = flame.cont_with_1x3_to_1x2(<vec>0<tr>, <scalar>1<tr>, <vec>2<tr>, \\\n<t ><t >                                            '<dir>')";
	var cont31 = "        <vec>T, \\\n        <vec>B  = flame.cont_with_3x1_to_2x1(<vec>0,<t ><s> \\\n                                         <scalar>1<tr>, \\\n                                         <vec>2,<t ><s> \\\n                                         '<dir>')";
	var cont33 = "        <mat>TL, <mat>TR, \\\n        <mat>BL, <mat>BR  = flame.cont_with_3x3_to_2x2(<mat>00,<t > <vec>01,<s> <mat>02,<t > \\\n                                               <vec>10<tr>, <scalar>11, <vec>12<tr>, \\\n                                               <mat>20,<t > <vec>21,<s> <mat>22,<t > \\\n                                               '<dir>')";
	
	var part = "", current;
	var operand, dir, mat, vec, scalar, scSpace, tr, tSpace;

	for (var i = 0; i < NumOpers; i++) {
		operand = OperInfo[i];

        // ignore scalars and directionless
        if (isScalar(operand) || operand[OPERAND_DIR] == DIR_NONE)
            continue;

		dir = dChoicesBefore[operand[OPERAND_DIR]];
		mat = matrixForm(operand);
		vec = vectorForm(operand);
		scalar = scalarForm(operand);
		tr = "";
		tSpace = "";
		scSpace = ws(scalar.length - 1);

		if (isTwoDimensional(operand)) {
			
			current = cont33;
			if (isMatrix(operand)) {
				if (FnType == FN_UNB) {
					tr = "t";
					tSpace = " ";
				}
				else {
					vec = mat;
					scalar = mat;
					scSpace = "";
				}
			}
			else {
				part += "#       OPERAND " + (i + 1) + " CONTINUE WITH ERROR: Cannot split non-matrix into quadrants\n\n";
				continue;
			}
			
		}
		else if (isHorizontal(operand)) {
			
			current = cont13;
			if (isMatrix(operand) && FnType == FN_BLK) {
				vec = mat;
				scalar = mat;
				scSpace = "";
			}
			else if (isMatrix(operand) && FnType == FN_UNB) {
				scalar = vec;
				scSpace = "";
				vec = mat;
			}
			else if (isVector(operand) && FnType == FN_BLK) {
				scalar = vec;
				scSpace = "";
				tr = "t";
				tSpace = " ";
			}
			else if (isVector(operand) && FnType == FN_UNB) {
				// t*
				current = current.replace(/<tr>/, "t");
				current = current.replace(/<t >/, " ");
				current = current.replace(/<tr>/, "t");
				current = current.replace(/<t >/, " ");
				current = current.replace(/<tr>/, "t");
				current = current.replace(/<tr>/, "");
				current = current.replace(/<tr>/, "t");
			}
			
		}
		else if (isVertical(operand)) {
			
			current = cont31;
			if (isMatrix(operand) && FnType == FN_BLK) {
				vec = mat;
				scalar = mat;
				scSpace = "";
			}
			else if (isMatrix(operand) && FnType == FN_UNB) {
				scalar = vec;
				scSpace = "";
				vec = mat;
				tr = "t";
				tSpace = " ";
			}
			else if (isVector(operand) && FnType == FN_BLK) {
				scalar = vec;
				scSpace = "";
			}
			
		}

		current = current.replace(/<mat>/g, mat);
		current = current.replace(/<vec>/g, vec);
		current = current.replace(/<scalar>/g, scalar);
		current = current.replace(/<s>/g, scSpace);
		current = current.replace(/<tr>/g, tr);
		current = current.replace(/<t >/g, tSpace);
		current = current.replace(/<dir>/, dir);

		part += current + "\n\n";
	}

	return part;
}


function copyright(author, email)
{
    var copyrightTemp = "# Programmed by: nameofauthor\n#                emailofauthor";

    //	copyrightTemp = copyrightTemp.replace(/yyyy/, (new Date()).getFullYear());
    copyrightTemp = copyrightTemp.replace(/nameofauthor/, author);
    copyrightTemp = copyrightTemp.replace(/emailofauthor/, email);

	return copyrightTemp;
}


function guard(NumOpers, OperInfo)
{
	var returnStr = "    while <vec><dir><tr>.shape[<index>] < <vec><tr>.shape[<index>]:";
	var dir = ["", "TL", "BR", "TR", "BL", "L", "R", "T", "B"];

	var operand, tr = "", vec;

	for (var i = 0; i < NumOpers; i++) {
		// if operand direction is not none
		operand = OperInfo[i];

        // can't split a scalar
        if (isScalar(operand))
            continue;
		
		if (operand[OPERAND_DIR] != DIR_NONE) {
			vec = defaultForm(operand);

			if (isVector(operand) && isHorizontal(operand))
				tr = "t";

			returnStr = returnStr.replace(/<dir>/, dir[operand[OPERAND_DIR]]);
			returnStr = returnStr.replace(/<vec>/g, vec);

			var rc = 0;
			// if direction is L-R or R-L, go by columns
			if (isHorizontal(operand))
				rc = 1;

			returnStr = returnStr.replace(/<index>/g, rc);
			returnStr = returnStr.replace(/<tr>/g, tr);
			
			return returnStr;
		}
	}

	return "#   GUARD ERROR: No variable to split";
}


function header(FnName, FnType, Variant, NumOpers, OperInfo)
{
	var returnStr = "import flame\nimport laff as laff\n\ndef <fn>_<type><var>(<args><nbalg>):";
    var operand;

	returnStr = returnStr.replace(/<fn>/, FnName);
    returnStr = returnStr.replace(/<type>/, BlkChoicesShort[FnType]);
    
    /*** _VAR ***/

    var variantStr = "";
    if (Variant != 0)
		variantStr = "_var" + Variant;

    returnStr = returnStr.replace(/<var>/, variantStr);

    /*** ARGS ***/
    
    var firstTime = 1;
    var argsStr = "";
    for (var i = 0; i < NumOpers; i++) {
    	operand = OperInfo[i];
		if (operand[OPERAND_IO] != IO_TEMP) {
	    		if (firstTime)
	    			firstTime = 0;
	    		else
	    			argsStr += ", ";
	    
	    		argsStr += defaultForm(operand);
	    
	    		if (isVector(operand) && isHorizontal(operand))
	    			argsStr += "t";
		}
    }

    returnStr = returnStr.replace(/<args>/, argsStr);

    /*** , NB_ALG ***/
    
    var nbalg = "";
    if (FnType != FN_UNB)
		nbalg = ", nb_alg";

    returnStr = returnStr.replace(/<nbalg>/, nbalg);

	return returnStr;
}

function merge(NumOpers, OperInfo)
{
	var merge12 = "    flame.merge_1x2(<vec>L<tr>, <vec>R<tr>, <vec>)";
	var merge21 = "    flame.merge_2x1(<vec>T, \\\n                    <vec>B, <vec>)";
	var merge22 = "    flame.merge_2x2(<mat>TL, <mat>TR, \\\n                    <mat>BL, <mat>BR, <mat>)";
	
	var mergeStr = "", current;
	var operand, vec, tr, tSpace;

	for (var i = 0; i < NumOpers; i++) {
		operand = OperInfo[i];
        
        // only output variables and nonscalars with direction should be merged
        if (operand[OPERAND_IO] != IO_IO || isScalar(operand) || operand[OPERAND_DIR] == DIR_NONE)
            continue;

		vec = vectorForm(operand);
		tr = "", tSpace = "";

		if (isTwoDimensional(operand)) {
			
			if (isMatrix(operand))
				current = merge22;
			else {
				mergeStr += "#   OPERAND " + (i + 1) + " MERGE ERROR: Cannot split non-matrix into quadrants\n\n";
				continue;
			}
		}
		else if (isHorizontal(operand)) {
			
			current = merge12;
			if (isVector(operand)) {
				tr = "t";
				tSpace = " ";
			}
		}
		else if (isVertical(operand))
			current = merge21;
		
        // Universal vector promotion to matrix
		if (isMatrix(operand))
			vec = matrixForm(operand);

        current = current.replace(/<mat>/g, matrixForm(operand));
		current = current.replace(/<vec>/g, vec);
		current = current.replace(/<tr>/g, tr);
		current = current.replace(/<t >/g, tSpace);

		mergeStr += current + "\n\n";
	}

	return mergeStr;
}

function partition(NumOpers, OperInfo)
{
	var partition12 = "    <vec>L<tr>, <vec>R<tr> = flame.part_1x2(<vec><tr>, \\\n<t ><t >                            0, '<dir>')";
	var partition21 = "    <vec>T, \\\n    <vec>B  = flame.part_2x1(<vec>, \\\n                         0, '<dir>')";
	var partition22 = "    <mat>TL, <mat>TR, \\\n    <mat>BL, <mat>BR  = flame.part_2x2(<mat>, \\\n                               0, 0, '<dir>')";
	
	var part = "", current;
	var operand, dir, mat, vec, tr, tSpace;

	for (var i = 0; i < NumOpers; i++) {
		operand = OperInfo[i];

        // ignore scalars and directionless
        if (isScalar(operand) || operand[OPERAND_DIR] == DIR_NONE)
            continue;

		dir = dChoicesBefore[operand[OPERAND_DIR]];
        mat = matrixForm(operand);
		vec = vectorForm(operand);
		tr = "", tSpace = "";

		if (isTwoDimensional(operand)) {
			
			if (isMatrix(operand))
				current = partition22;
			else {
				part += "#   OPERAND " + (i + 1) + " PARTITION ERROR: Cannot split non-matrix into quadrants\n\n";
				continue;
			}
			
		}
		else if (isHorizontal(operand)) {
			
			current = partition12;
			if (isVector(operand)) {
				tr = "t";
				tSpace = " ";
			}
			
		}
		else if (isVertical(operand))
			current = partition21;
		
        // global vector promotion
		if (isMatrix(operand))
			vec = matrixForm(operand);

        current = current.replace(/<mat>/g, mat);
		current = current.replace(/<vec>/g, vec);
		current = current.replace(/<tr>/g, tr);
		current = current.replace(/<t >/g, tSpace);
		current = current.replace(/<dir>/, dir);

		part += current + "\n\n";
	}

	return part;
}


function repartition(FnType, NumOpers, OperInfo)
{
	var repart12 = "        <vec>0<tr>, <scalar>1<tr>, <vec>2<tr> = flame.repart_1x2_to_1x3(<vec>L<tr>, <vec>R<tr>, \\\n<t ><s><t ><t >                                             <bl>, '<dir>')";
	var repart21 = "        <vec>0,<s><t > \\\n        <scalar>1<tr>, \\\n        <vec>2<s><t >  = flame.repart_2x1_to_3x1(<vec>T, \\\n<s><t >                                      <vec>B, \\\n<s><t >                                      <bl>, '<dir>')";
	var repart22 = "        <mat>00,<t > <vec>01,<s> <mat>02,<t > \\\n        <vec>10<tr>, <scalar>11, <vec>12<tr>, \\\n        <mat>20,<t > <vec>21,<s> <mat>22<t >  = flame.repart_2x2_to_3x3(<mat>TL, <mat>TR, \\\n<t ><s><t >                                                 <mat>BL, <mat>BR, \\\n<t ><s><t >                                                 <bl>, <bl>, '<dir>')";
	
	var bl = "1";
	if (FnType == FN_BLK)
		bl = "block_size";
	
	var part = "", current;
	var operand, dir, mat, vec, scalar, scSpace, tr, tSpace;

	for (var i = 0; i < NumOpers; i++) {
		operand = OperInfo[i];

        // ignore scalars and directionless
        if (isScalar(operand) || operand[OPERAND_DIR] == DIR_NONE)
            continue;

		dir = dChoicesAfter[operand[OPERAND_DIR]];
		mat = matrixForm(operand);
		vec = vectorForm(operand);
		scalar = scalarForm(operand);
		tr = "";
		tSpace = "";
		scSpace = ws(scalar.length - 1);

		if (isTwoDimensional(operand)) {
			if (isMatrix(operand)) {
				current = repart22;
				
				if (FnType == FN_UNB) {
					tr = "t";
					tSpace = " ";
				}
				else {
					vec = mat;
					scalar = mat;
					scSpace = "";
				}
			}
			else {
				part += "#       OPERAND " + (i + 1) + " REPARTITION ERROR: Cannot split non-matrix into quadrants\n\n";
				continue;
			}
		}
		else if (isHorizontal(operand)) {
			current = repart12;
			if (isMatrix(operand) && FnType == FN_BLK) {
				vec = mat;
				scalar = mat;
				scSpace = "";
			}
			else if (isMatrix(operand) && FnType == FN_UNB) {
				scalar = vec;
				scSpace = "";
				vec = mat;
			}
			else if (isVector(operand) && FnType == FN_BLK) {
				scalar = vec;
				scSpace = "";
				tr = "t";
				tSpace = " ";
			}
			else if (isVector(operand) && FnType == FN_UNB) {
				// t*
				current = current.replace(/<tr>/, "t");
				current = current.replace(/<t >/, " ");
				current = current.replace(/<tr>/, "");
				current = current.replace(/<t >/, "");
				current = current.replace(/<tr>/, "t");
				current = current.replace(/<t >/, " ");
				current = current.replace(/<tr>/, "t");
				current = current.replace(/<tr>/, "t");
			}
		}
		else if (isVertical(operand)) {
			
			current = repart21;
			if (isMatrix(operand) && FnType == FN_BLK) {
				vec = mat;
				scalar = mat;
				scSpace = "";
			}
			else if (isMatrix(operand) && FnType == FN_UNB) {
				scalar = vec;
				scSpace = "";
				vec = mat;
				tr = "t";
				tSpace = " ";
			}
			else if (isVector(operand) && FnType == FN_BLK) {
				scalar = vec;
				scSpace = "";
			}
			
		}

		current = current.replace(/<mat>/g, mat);
		current = current.replace(/<vec>/g, vec);
		current = current.replace(/<scalar>/g, scalar);
		current = current.replace(/<s>/g, scSpace);
		current = current.replace(/<tr>/g, tr);
		current = current.replace(/<t >/g, tSpace);
		current = current.replace(/<dir>/, dir);
		current = current.replace(/<bl>/g, bl);

		part += current + "\n\n";
	}

	return part;
}


function setBlockSize(FnType, NumOpers, OperInfo)
{
	if (FnType == FN_UNB)
		return "";
	
	var returnStr = "        block_size = min(<vec><dir><tr>.shape[<index>], nb_alg)";
	
	var dir = ["", "BR", "TL", "BL", "TR", "R", "L", "B", "T"];

	var operand, tr = "", vec;

	for (var i = 0; i < NumOpers; i++) {
		operand = OperInfo[i];
		
		if (operand[OPERAND_DIR] != DIR_NONE) {
			vec = defaultForm(operand);

			if (isVector(operand) && isHorizontal(operand))
				tr = "t";

			var rc = 0;
			// if direction is L-R or R-L, go by columns
			if (isHorizontal(operand))
				rc = 1;

			returnStr = returnStr.replace(/<dir>/, dir[operand[OPERAND_DIR]]);
			returnStr = returnStr.replace(/<vec>/g, vec);			
			returnStr = returnStr.replace(/<index>/g, rc);
			returnStr = returnStr.replace(/<tr>/, tr);
			
			return returnStr + "\n\n";
		}
	}

	return "#       BLOCK SIZE ERROR: No variable to split\n\n";
}


function update()
{
	return "        #------------------------------------------------------------#\n\n        #                       update line 1                        #\n        #                             :                              #\n        #                       update line n                        #\n\n        #------------------------------------------------------------#";
}

