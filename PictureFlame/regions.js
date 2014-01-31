function Region(op, sr, er, sc, ec){
    
    var startRow = sr;
    var startCol = sc;
    
    var endRow = er;
    var endCol = ec;

    var oprd = op;

    var elmt = document.getElementById(op.tag);
    var tbl = elmt.childNodes[1];      	


    this.getElementAt = function (i,j){
	return Number(tbl.rows[i+startRow+1].cells[j+startCol+1].innerHTML);
    }

    this.getElementNodeAt = function (i,j){
	return tbl.rows[i+startRow+1].cells[j+startCol+1];
    }

    this.setElementAt = function (i,j, newVal){
	tbl.rows[i+startRow+1].cells[j+startCol+1].innerHTML = Number(newVal);//toFixed(5);
    }

    this.m = function(){
	return endRow - startRow;
    }

    this.n = function(){
	return endCol - startCol;
    }
    
}