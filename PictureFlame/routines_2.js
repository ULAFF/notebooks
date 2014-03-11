function execute_BLAS(stmt){
    if (stmt.fn == 'laff.zerov'){
	assign(stmt.args[0], 0.0000);
    }
    if (stmt.fn == 'laff.onev'){
	assign(stmt.args[0], 1.0000);
    }
    if (stmt.fn == 'laff.copy'){
	copy(stmt.args[0], stmt.args[1]);
    }
    if (stmt.fn == 'laff.scal'){
	scal(stmt.args[0], stmt.args[1], false);
    }
    if (stmt.fn == 'laff.invscal'){
	scal(stmt.args[0], stmt.args[1], true);
    }
    if (stmt.fn == 'laff.add'){
	add(stmt.args[0], stmt.args[1], stmt.args[2]);
    }
    if (stmt.fn == 'laff.dots'){
	dot(stmt.args[0], stmt.args[1], stmt.args[2], true);
    }
    if (stmt.fn == 'laff.dot'){
	dot(stmt.args[0], stmt.args[1], stmt.args[2], false);
    }
    if (stmt.fn == 'laff.axpy'){
	axpy(stmt.args[0], stmt.args[1], stmt.args[2]);
    }

    if (stmt.fn == 'laff.mac'){
	mac(stmt.args[0], stmt.args[1], stmt.args[2]);
    }
    if (stmt.fn == 'laff.ger'){
	ger(stmt.args[0], stmt.args[1], stmt.args[2], stmt.args[3]);
    }
    if (stmt.fn == 'laff.gemv'){
	gemv(stmt.args[0], stmt.args[1], stmt.args[2], stmt.args[3], stmt.args[4], stmt.args[5]);
    }

}


function extract_region(xx){
    var x_op;
    //find operands
    for (var i = 0; i != operands.length; ++i){
	if (operands[i].match(xx.op))
	    x_op = i;
    }

    //get region
    return  operands[x_op].subregion(xx.subregion);
}

function extract_scalar_value(aa){
    var scal = 1;

    if (aa.op== ''){
	//alpha is a constant
	scal = Number(aa.subregion);
    }
    else{
	//alpha is an operand

	var alpha = extract_region(aa);
	scal = Number(alpha.getElementAt(0,0));
    }
    return scal;
}


function assign(xx, val){
    var x = extract_region(xx);

    for (var j = 0; j < x.m(); ++j){
	for (var k = 0; k < x.n(); ++k){
	    x.setElementAt(j, k, val);
	}
    }
}


function copy(oprdOld, oprdNew){
   var src_region = extract_region(oprdOld);  
   var dst_region =  extract_region(oprdNew);  

    if (src_region.m() == dst_region.m() && 
	src_region.n() == dst_region.n()){  //same shape

	for (var j = 0; j < src_region.m(); ++j){
	    for (var k = 0; k < src_region.n(); ++k){
		dst_region.setElementAt(j,k, 
					src_region.getElementAt(j,k));
	    }
	}
    }
  
    if (src_region.m() == dst_region.n() && 
	src_region.n() == dst_region.m() ){  //transposed vector

	for (var j = 0; j < dst_region.m(); ++j){
	    for (var k = 0; k < dst_region.n(); ++k){
		dst_region.setElementAt(j,k, 
					src_region.getElementAt(k,j));
	    }
	}
    }
}

function scal(aa, xx, inv){
    var x_op, scal;

    scal = extract_scalar_value(aa);
    //find operands
    for (var i = 0; i != operands.length; ++i){
	if (operands[i].match(xx.op))
	    x_op = i;
    }

    //get region
    var x = operands[x_op].subregion(xx.subregion);

    for (var j = 0; j != x.m(); ++j){
	for (var k = 0; k != x.n(); ++k){
	    if (!inv)
		x.setElementAt(j, k, x.getElementAt(j, k) * scal);
	    else
		x.setElementAt(j, k, x.getElementAt(j, k) / scal);
	}
    }
}

function add(xx, yy, zz){
    var x = extract_region(xx);
    var y = extract_region(yy);
    var z = extract_region(zz);

    if (x.m() == y.m() &&
	x.n() == y.n() &&
	x.m() == z.m() &&
	x.n() == z.n()	){
	for (var i = 0; i != x.m(); ++i){
	    for (var j = 0; j != x.n(); ++j){
		z.setElementAt(i, j, x.getElementAt(i, j) + y.getElementAt(i, j));
	    }
	}
    }
}


function dot(xx, yy, aa, add_alpha){
    var x_op, y_op, alpha_op;

    var x = extract_region(xx);
    var y = extract_region(yy);
    var alpha = extract_region(aa);

    var outputVal = 0;

    //check dimensions
    if (x.m() == 1 &&  y.m()== 1){
	//both row vectors
	for ( var i = 0; i != x.n(); ++i){
	    outputVal += 
		Number(x.getElementAt(0,i)) * Number(y.getElementAt(0,i));
	}
    }
    else if (x.n() == 1 &&  y.m()== 1){
	//x is col vector, y is row vector
	for ( var i = 0; i != x.m(); ++i){
	    outputVal += 
		Number(x.getElementAt(i,0)) * Number(y.getElementAt(0,i));
	}
    }
    else if (x.m() == 1 &&  y.n()== 1){
	//y is col vector, x is row vector
	for ( var i = 0; i != x.n(); ++i){
	    outputVal += 
		Number(x.getElementAt(0,i)) * Number(y.getElementAt(i,0));
	}
    }
    else if (x.n() == 1 &&  y.n()== 1){
	//both col vectors
	for ( var i = 0; i != x.m(); ++i){
	    outputVal += 
		Number(x.getElementAt(i,0)) * Number(y.getElementAt(i,0));
	}
    }
    if (add_alpha){
	alpha.setElementAt(0,0, outputVal + alpha.getElementAt(0, 0));
    }
    else{
	alpha.setElementAt(0,0, outputVal);
    }
}


function axpy(aa, xx, yy){

    var scal = extract_scalar_value(aa);
    var x = extract_region(xx);
    var y = extract_region(yy);
    
    //compute
    if (x.m() == 1 &&  y.m()== 1){
	//both row vectors
	for ( var i = 0; i != x.n(); ++i){
	    y.setElementAt(0,i, 
			   scal * Number(x.getElementAt(0,i)) 
			    + Number(y.getElementAt(0,i)));
	}
    }
    else if (x.n() == 1 &&  y.m()== 1){
	//y is a row vector, x is a column
	for ( var i = 0; i != x.m(); ++i){
	    y.setElementAt(0,i,
			   scal * Number(x.getElementAt(i,0))
			    + Number(y.getElementAt(0,i)));
	}
    }
    else if (x.m() == 1 &&  y.n()== 1){
	//x is a row vector, y is a column
	for ( var i = 0; i != x.n(); ++i){
	    y.setElementAt(i,0, 
			   scal * Number(x.getElementAt(0,i)) 
			   + Number(y.getElementAt(i,0)));
	}
    }
    else if (x.n() == 1 && y.n() == 1){
	//both col vectors
	for ( var i = 0; i != x.m(); ++i){
	    y.setElementAt(i,0, 
			   scal * Number(x.getElementAt(i,0))
			   + Number(y.getElementAt(i,0)));
	}
    }
}


function mac(xx, yy, aa){
    var x = extract_region(xx);
    var y = extract_region(yy);
    var alpha = extract_region(aa);

    if (x.m()  == 1 && y.m() == 1 &&
	x.n() == 1 && y.n() == 1 &&
	alpha.m() == 1 && alpha.n() == 1){
	//everything is a  scalar	

	alpha.setElementAt(0, 0, x.getElementAt(0,0) + y.getElementAt(0,0));
    }
}


function ger(aa, xx, yy, CC){
   var scal = extract_scalar_value(aa);

   var x = extract_region(xx);
   var y = extract_region(yy);
   var C = extract_region(CC);

    if (x.m()  == C.m() && y.n() == C.n() &&
	x.n() == 1 && y.m() == 1){
	
	for (var i = 0; i != C.m(); ++i){
	    for (var j = 0; j != C.n(); ++j){
		C.setElementAt(i, j,
		     C.getElementAt(i,j) + scal * x.getElementAt(i,0)*y.getElementAt(0,j));
	    }
	}
    }

}


function gemv(tt, aa, AA, xx, bb, yy){
    var alpha = extract_scalar_value(aa);
    var beta =  extract_scalar_value(bb);
    
    var A = extract_region(AA);
    var x = extract_region(xx);
    var y = extract_region(yy);
    
    var trans = (tt.subregion != "'Notranspose'");

    var tmp = 0;
    if (!trans){ //y = alpha Ax + beta y
      //x and y are both column vectors
      if (x.n()==1 && y.n()==1){
	for (var i = 0; i != A.m(); ++i){
	    tmp = 0;
	    for (var j = 0; j != A.n(); ++j){
		tmp += A.getElementAt(i, j) * x.getElementAt(j, 0);
	    }
	    y.setElementAt(i,0, 
			   alpha * tmp + beta * y.getElementAt(i,0));
	}
      }
      //x and y are both row vectors
      //x is a column and y is a row
      //y is a column and x is a row
    }
    else{  //y = alpha A'x + beta y
      //x and y are both row vectors
      if (x.m()==1 && y.m()==1){
	for (var i = 0; i != A.n(); ++i){
	    tmp = 0;
	    for (var j = 0; j != A.m(); ++j){
		tmp += A.getElementAt(j,i) * x.getElementAt(0,j);
	    }
	    y.setElementAt(0, i,
			   alpha * tmp + beta * y.getElementAt(0, i));
	}
      }
    }   
}