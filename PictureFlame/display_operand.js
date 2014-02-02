Operand.prototype.greek = ['alpha','beta','gamma','delta',
			   'epsilon','phi','chi','eta',
			   'lambda','mu','nu','pi',
			   'chi','rho','sigma','tau',
			   'upsilon','nu','omega','chi',
			   'psi','zeta'];
Operand.prototype.caps = ['A','B','C','D',
			  'E','F','G','H',
			  'L','M','N','P',
			   'Q','R','S','T',
			   'U','V','W','X',
			   'Y','Z'];

function Operand(tagName, mm, nn){
    this.tag = tagName;
    var m = mm;
    var n = nn;

    var off_m = mm;
    var off_n = nn;
     
    var partType = null;
    var partDir = null;

    var curTop = -1;
    var curLeft = -1;

    this.subregion = function(index){
	var elmt = document.getElementById(this.tag);
	var tbl = elmt.childNodes[1];      

	var rStart = 0; var rEnd = tbl.rows.length-1;
	var cStart = 0; var cEnd = tbl.rows[0].cells.length-1;
	if (partType != null){
          if (partType.charAt(0) == '2'){ //2x1 || 2x2
	      if (index.charAt(0) == '0'){ //00, 01, 02 
		  rEnd = Math.min(curTop, off_m);
	      }

	      if (index.charAt(0) == '1'){
		rStart = Math.min(curTop, off_m);
		rEnd = Math.max(curTop, off_m);
	      }

	      if (index.charAt(0) == '2'){
		  rStart = Math.max(curTop, off_m);
	      }

	  }
          if (partType.charAt(2) == '2'){ //1x2 || 2x2
	      if (index.charAt(index.length-1) == '0'){
		   cEnd = Math.min(curLeft, off_n);
	      }
	      if (index.charAt(index.length-1) == '1'){
		cStart = Math.min(curLeft, off_n);
		cEnd = Math.max(curLeft, off_n);
	      }

	      if (index.charAt(index.length-1) == '2'){
		cStart = Math.max(curLeft, off_n);
	      }

	  }
	}
	
	return (new Region(this, rStart, rEnd, cStart, cEnd));
    }


    this.match = function (test){
	var result = false;	
	if (test.length == 1){
	    result =(this.tag.toUpperCase() == test.toUpperCase());	
	}
	else if (this.tag.length > 1){
	    //this is a scalar operand
	    result = (test == this.tag);
	}
	else{
	    //check if greek
	    for (var i = 0; i != this.greek.length; ++i){		
		if (test==this.greek[i]){
		    result |= (this.caps[i] == this.tag.toUpperCase());
		}
	    }
	}

	return result;
    }

    this.clear_select = function(){
	var elmt = document.getElementById(this.tag);
	var tbl = elmt.childNodes[1];      
	

	for (var i = 0; i != tbl.rows.length; ++i){
	    for (var j = 0; j != tbl.rows[0].cells.length; ++j){
		if (tbl.rows[i].cells[j].style.backgroundColor != '' ||
		    tbl.rows[i].cells[j].style.backgroundColor != 'undefined')
		    tbl.rows[i].cells[j].style.backgroundColor = '';
	    }
	}
    }

    this.select = function (part, color){
	var region = this.subregion(part);

	if (!color)
	    color='lightblue';

        for (var i= 0; i < region.m(); ++i){
	    for (var j=0; j < region.n(); ++j){
		var elmt = region.getElementNodeAt(i,j);
		elmt.style.backgroundColor = color;
	    }
	}
	
    }


    this.display = function(){
	var output = '<table class="matrix">';
	var colgroup = '<colgroup>';
	for (var i = 0; i != m+1 ; ++i){
	var row = '<tr>';
	for (var j = 0; j != n+1; ++j){
	    colgroup += '<col id="'+this.tag+'col'+j+'"/>';
	    row += '<td>'+
		(i==0 || j==0?'':String(Math.floor(Math.random()*10)-5).substring(0,7))+
		'</td>';
	}
	row += '</tr>';
	colgroup += '</colgroup>';
	output += colgroup;
	output += row;
	}
	output += '</table>';
    return output;
    }
    
    this.partition = function(type, dir){
	partType = type;

	partDir = dir;
	if (dir.length > 2){
	    partDir = dir.charAt(0);
	}

	var elmt = document.getElementById(this.tag);
	var tbl = elmt.childNodes[1];
	if (type=='2x1' || type=='2x2'){
	    if (partDir.charAt(0) == 'T'){
		curTop = 0;
	    }
	    else{
		curTop = tbl.rows.length-1;
	    }
	    tbl.rows[curTop].className = 'T';
	}
	if (type=='1x2' || type=='2x2'){  
	    if (partDir.charAt(partDir.length-1) == 'L')
		curLeft = 0;
	    else{
		curLeft = tbl.rows[0].cells.length-1;
	    }
	    for (var i = 0; i != tbl.rows.length; ++i){
		tbl.rows[i].cells[curLeft].className = 'L';
	    }
	    
	}
    }

    this.repartition = function(mm, nn){
	mm = (typeof(mm) !== 'undefined'? mm : 1);
	nn = (typeof(nn) !== 'undefined'? nn : 1);

	var elmt = document.getElementById(this.tag);
	var tbl = elmt.childNodes[1];

	if (partDir.charAt(0) == 'B')
	    mm *= -1;
	if (partDir.charAt(partDir.length-1) == 'R'){
	    nn *= -1;
	}
	
	//repartition
	if (partType=='2x1' || partType=='2x2'){
	    tbl.rows[curTop+mm].className = 'B';
	    off_m = curTop+mm;
	}
	if (partType=='1x2' || partType=='2x2'){         
	       for (var i = 0; i != tbl.rows.length; ++i){
		   tbl.rows[i].cells[curLeft+nn].className = 'R';
	       }
	       off_n = curLeft+nn;
	}
    }

    this.cont_with = function (){
	var elmt = document.getElementById(this.tag);
	var tbl = elmt.childNodes[1];

	for (var i = 0; i != tbl.rows.length; ++i){
	    if (tbl.rows[i].className == 'T')
		tbl.rows[i].className = '';
	    else if (tbl.rows[i].className == 'B'){
		tbl.rows[i].className = 'T';
		curTop = i;
	    }
	    
	    for (var j = 0; j != tbl.rows[i].cells.length; ++j){
		
		if (tbl.rows[i].cells[j].className == 'L')
		    tbl.rows[i].cells[j].className = '';
		else if (tbl.rows[i].cells[j].className == 'R'){
		    tbl.rows[i].cells[j].className = 'L';
		    curLeft = j;
		}
		
	    }
	    
	}
    }
    
}