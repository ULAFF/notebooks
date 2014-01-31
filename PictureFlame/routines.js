function gemv(tt, aa, AA, xx, bb, yy){
    var x_op, y_op, A_op, alpha_op, beta_op;
    
    var scala = extract_scalar_value(aa);
    var scalb = extract_scalar_value(bb);

    var x = extract_region(xx);
    var y = extract_region(yy);
    var A = extract_region(AA);
    
    var transa = tt.subregion;

    if (   y.m() == A.m()
	&& x.m() == A.n()){
	//both x, y are column vector
    }
    else if (   y.n() == A.m()
	     && x.m() == A.n()){
	//y is a row, x is a column
    }
    else if (   y.n() == A.m()
	&& x.n() == A.n()){
	//both are rows 
    }
    else if (   y.m() == A.m()
	&& x.n() == A.n()){
	//x is a row, y is a column
    }
    
    if (transa == "'Notranspose'"){
	for (var i = 0; i != A.m(); ++i){	
	    y.setElementAt(i,0,
			   scalb * y.getElementAt(i,0));
	    
	    for (var j = 0; j != A.n(); ++j){ //dot product
		y.setElementAt(i,0,
			       y.getElementAt(i,0) + 
			       scala * x.getElementAt(j,0) * A.getElementAt(i,j));
	    }	   
	}
	
    }
    else{
	for (var i = 0; i != A.n(); ++i){
	    if (y.m() == 1){ //y is a row vector
		y.setElementAt(0,i,
			       scalb * y.getElementAt(0,i));
	    }
	    else{ //y is a column vector
		y.setElementAt(i,0,
			       scalb * y.getElementAt(i,0));
	    }
	    
	    for (var j = 0; j != A.m(); ++j){ //dot product
		accum += x.getElementAt(0,j) * A.getElementAt(j,i);
	    }

	    if (y.m() == 1){ //y is a row vector
		y.setElementAt(0,i,
			       y.getElementAt(0,i) + scala * accum );
	    }
	    else{  //y is a column vector
		y.setElementAt(i,0,
			       y.getElementAt(i,0) + scala * accum );
	    }
	}
    }
}
