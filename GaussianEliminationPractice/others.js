function select_problem(btnId){
    if (problem_type == 0){

	if (btnId == "p0")
	    init_problem(p1.L, p1.U, p1.x);
	if (btnId == "p1")
	    init_problem(p2.L, p2.U, p2.x);	
	if (btnId == "p2")
	    init_problem(p3.L, p3.U, p3.x);	
	if (btnId == "p3")
	    init_problem(p4.L, p4.U, p4.x);	
	if (btnId == "p4")
	    init_problem(p5.L, p5.U, p5.x);	
	display_problem();
    }
    else{
	alert("Refresh page to start again");
    }
    problem_type = -1;
}

function display_problem(){
    context_switch(document.getElementById('take'+take));
    
    //create Take 1 problem
    document.getElementById('Step0-1').innerHTML += 
	create_multiplier_input(DIM, 1, "T1L", 
				create_equation(DIM, DIM, 0, "eq", "-0", A, b) );
    
    //create Take 2 problem
    document.getElementById('Step0-2').innerHTML += 
	create_multiplier_input(DIM, 1, "T2L", 
				create_matrix(DIM, DIM+1, curAb, false, true, "T2A", "-0") );
    
    //create Take 3 problem
    document.getElementById('Step0-3').innerHTML += 
	create_multiplier_input(DIM, 1, "T3L", 
				create_matrix(DIM, DIM+1, curAb, false, true, "T3A", "-0"), true );
    
    //create Take 4 problem
    document.getElementById('Step0-4').innerHTML += 
	create_multiplier_input(DIM, 1, "T4L", 
				create_matrix(DIM, DIM, A, false, false, "T4A", "-0"), true);
    
    make_gauss(DIM, DIM, L,cur_step, gaussL);
    document.getElementById('Step0b-4').innerHTML += 
	"<table><tr><td>" +
	create_matrix(DIM, DIM, 
	              gaussL, false, false, "", "") + 
	"</td><td>" +
	create_matrix(DIM, 1, b, false, false, "T4b", "-0") + 
	"</td></tr></table>" ;
}


function init_problem(LL, UU, xx){
    zero_array(DIM*DIM,A);
    zero_array(DIM, b);
    zero_array(DIM*DIM, gaussL);
    
    for (var i = 0; i != DIM*DIM; ++i){
	L[i] = LL[i];
	U[i] = UU[i];
    }
    for (var i = 0; i != DIM; ++i){
	x[i] = xx[i];
    }

    multiply_matrix(/*NO_TRANS, NO_TRANS, */
		    DIM, DIM, DIM,
		    /*1.0,*/ L, DIM, U,DIM,
		    /*1.0,*/ A, DIM);
    
    multiply_matrix(/*NO_TRANS, NO_TRANS, */
		    DIM, 1, DIM,
                /*1.0,*/ A, DIM, x, 1,
		    /*1.0,*/ b, 1);
    
    
    for (var i = 0; i != 4; ++i){
	with(cur_data[i]){
	    for (var j = 0; j != DIM*DIM; ++j){
		curA[j] = A[j];
		curAb[j] = A[j];
	    }
	    for (var j = 0; j != DIM; ++j){
		curb[j] = b[j];
	    curAb[j+DIM*DIM] = b[j];
	    }
	}
    }
}

function reveal(take){
    document.getElementById("ans"+take).style.display = "block";
}

function create_ending(take){
    out="<div><h3>Now perform back substitution</h3><input type='button' value='Reveal Solution' onClick='reveal("+take+")'/>";
    out += "<div style='display:none' id='ans"+take+"'>";
    for (var i = 0; i != DIM; ++i){
	out += "&chi;<sub>"+i+"</sub> = "+x[i];
	if (i+1 < DIM)
	    out += ", ";
    }
    out += "</div>";
    out += "</div>";
      return out;
}

function disable_take(old_take){
   old_take.style.border = "2px none orange";
}

function enable_take(new_take){
   new_take.style.border = "2px solid orange";
}

function context_switch(this_div){
    disable_take(document.getElementById('take'+take));
    enable_take(this_div);
    
    new_take = parseInt(this_div.id.substring(4), 10);

    //save current state
    if (curA)
	cur_data[take-1].curA = curA;
    if (curb)
	cur_data[take-1].curb = curb;
    if (curAb)
	cur_data[take-1].curAb = curAb;
    cur_data[take-1].step = cur_step;

    //load current state
    take = new_take;
    curA = cur_data[take-1].curA;
    curb = cur_data[take-1].curb;
    curAb = cur_data[take-1].curAb;
    cur_step = cur_data[take-1].step;
}



function make_gauss(r, c, L, cur_step, gaussL){
    for (var i =0; i != r; ++i){
	for (var j =0; j != c; ++j){	   
	    if (i != j)
		gaussL[j*r+i] = -L[j*r+i];
	    else
		gaussL[j*r+i] = 1;
	    if (j!=cur_step-1 && i!=j){
		gaussL[j*r+i] = 0;
	    }
	}

    }    
}

function appended_matrix(A, b, Ab){
    for (var i = 0; i !=A.length; ++i){
	Ab[i] = A[i];
    }
    for (var i = 0; i !=b.length; ++i){
	Ab[i+A.length] = b[i];
    }
}

function create_multiplier_input(r, step, id, mtx, gauss){
    var out = "<table><tr><td><table><tr><td";
    if (gauss) 
	out += " class='left'";
    out += ">&nbsp;</td><td><table>";

    for (var i = 0;i != r; ++i){
	out += "<tr>";
	for (var j = 0; j != r; ++j){
	    if (i < step || j != step-1){
		out += "<td>";
		if (gauss){
		    out += (i==j?"1":"0");
		}
	        out += "</td>";
	    }
	    else{	
		out += "<td>";
		if (!gauss)
		    out += "Row"+(i+1)+" - ";
		out += "<input id='"+id+i+(step-1)+"' ";
		out += "onFocus='reset_correctness(this)'/>";
		if (!gauss)
		    out += " &times; Row "+step;
		out += "</td>";
	    }
	}
        out += "</tr>";
    }
    out += "</table></td><td";
    if (gauss)
	out += " class='right'";
    out += ">&nbsp;</td></tr></table></td><td>"+mtx+"</td></tr></table>";
    return out;
}

function create_matrix(r, c, data, inout, appended, pre, post){
  var out = "<table><tr><td class='left'>&nbsp;</td><td><table id='"+pre+post+"'>"
  for (var i = 0; i != r; ++i){
    out += "<tr>";
    for (var j = 0; j != c; ++j){
	out += "<td"+((j==c-1 && appended) ? " class='bar'": "")+">";
	out += data[j*r+i];
	out += "</td>";
    }
    out += "</tr>";
  }
  return out + "</table></td><td class='right'>&nbsp;</td></table>";
}

function compute_new_curA(cur_step){
     //   top cur_step rows are from U
      for (var i = 0; i != cur_step; ++i)
	  for (var j = 0; j != DIM; ++j)
	      curA[j*DIM+i] = U[j*DIM+i];
      //   bottom DIM-cur_steps need to be computed
      for (var i = cur_step; i != DIM; ++i){
	  var lambda = L[(cur_step-1)*DIM+i];
	  for (var j = cur_step-1; j != DIM; ++j)
	      curA[j*DIM+i] -= /*A[j*DIM+i] -*/ lambda*U[j*DIM+(cur_step-1)];
      }
}

function next(btn){
  if (correct_answers(cur_step)){

      //update curA with the answers
      compute_new_curA(cur_step);      

      //update curB
      zero_array(DIM, curb);
      multiply_matrix(/*NO_TRANS, NO_TRANS, */
		      DIM, 1, DIM,
		      /*1.0,*/ curA, DIM, x, 1,
		      /*1.0,*/ curb, 1);
      
      //update curAB
      appended_matrix(curA, curb, curAb);

      if (btn)
	  btn.style.display="none";

       //display next step
      switch (take){
        case 1:
	   with ( document.getElementById('Step'+cur_step+'-1') ){
  	     innerHTML += 
	         create_multiplier_input(DIM, cur_step+1, "T1L", 
		      create_equation(DIM, DIM, 
				      cur_step, "eq", "-"+cur_step, curA, curb) );
 	     style.display = 'block';
	   }
	   break;
        case 2:
	   with ( document.getElementById('Step'+cur_step+'-2') ){
	       innerHTML += 
		   create_multiplier_input(DIM, cur_step+1, "T2L",
		      create_matrix(DIM, DIM+1, 
				    curAb, false, true, "T2A", "-"+cur_step) );
	       style.display = 'block';
	   }   
	   break;
        case 3:
	   with ( document.getElementById('Step'+cur_step+'-3') ){
	       innerHTML += 
		   create_multiplier_input(DIM, cur_step+1, "T3L",
		         create_matrix(DIM, DIM+1, 
				       curAb, false, true, "T3A", "-"+cur_step), 
				       true );
	       style.display = 'block';
	   }   
	   break;
        case 4:
	   with ( document.getElementById('Step'+cur_step+'-4') ){
	       innerHTML += 
		   create_multiplier_input(DIM, cur_step+1, "T4L",
		         create_matrix(DIM, DIM, 
				       curA, false, false, "T4A", "-"+cur_step), 
			 true );
	       style.display = 'block';
	   } 
	   
	   make_gauss(DIM, DIM, L, cur_step+1, gaussL);
	   with (document.getElementById('Step'+cur_step+'b-4') ){
	       innerHTML += 
		   "<table><tr><td>" +
		   create_matrix(DIM, DIM, 
				 gaussL, false, false, "", "") + 
		   "</td><td>" +
		   create_matrix(DIM, 1,
				 curb, false, false, "T4b", "-"+cur_step) +
		   "</td></tr></table>" ;
	   }
	   break;
      default:
	   document.getElementById('Step'+cur_step+'-eqn').innerHTML += 
	       create_equation(DIM, DIM, 
			       cur_step, "eq", "-"+cur_step, curA, curb);
	   break;
	   
      }
    
    if (take==4 && cur_step==DIM-1){
	for (var i = 0; i != DIM; ++i){
	    document.getElementById('Step'+i+'b-4').style.display = "block";
	}
    }    
    if (cur_step==DIM-1){
	document.getElementById('Step'+cur_step+'-'+take).innerHTML += 
	    create_ending(take);
	    
    }
    
    cur_step += 1; 
  }
}

function reset_correctness(elmt){
    elmt.className="";
}

function highlight_correctness(elmt, correct){
  if (correct){
    elmt.className="";
    elmt.readOnly="T";
    elmt.disabled="disabled";
  }
  else{
   elmt.className="err";
   elmt.readOnly=false;
   elmt.disabled=false;
  }
}

function correct_answers(step){
  all_correct = true;

  //check L
  if (step == 0)
   all_correct = true;
  else {
    for (var i = step; i != DIM; ++i){
      var elmt = document.getElementById('T'+take+'L'+i+(step-1));
      
      //multipliers for Gauss Transforms are negated values of L
      var multiplier = parseInt(elmt.value,10) * (take>=3?-1:1);
      all_correct &=  (multiplier == L[(step-1)*DIM+i]);
   
      highlight_correctness(elmt, (multiplier == L[(step-1)*DIM+i]));

    }
  }

  return all_correct;
}


function create_equation(m, n, step, pre, post, mtx, vec){
  var eqn = "<table>";
  for (var i = 0; i != m; ++i){
    eqn += "<tr>";
    for (var j = 0; j != n; ++j){
      eqn += "<td>";
      if (j >= step || i<= j)
        eqn  += mtx[j*m+i]+ " &chi;<sub>"+j+"</sub>";
      eqn += "</td>";
      if (j >= step || i <= j){
        if (j != n-1)
          eqn += "<td>+</td>";
        else
          eqn += "<td>=</td>";
      }
      else{
        eqn += "<td>&nbsp;</td>";
      }
    }   
    eqn += "<td>"+vec[i]+"</td>";

    eqn += "</tr>";
  }
  eqn += "</table>";

  return eqn;
}

