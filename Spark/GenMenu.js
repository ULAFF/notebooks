function GenChoices( Name, CurChoice, nchoices, Choices ){
  var i;

  str = "";

  str += "<select name=\""+Name+"\" id=\""+Name+"\" > \n\n";

  for ( i=0; i<nchoices; i++ ){
	str += "   <option value="+i+"\n";
        if ( parseInt(CurChoice) == i ) str += "selected";
        str += ">  "+Choices[ i ] + "  </option>";
        str += " \n\n";
  }

  str += "</select>";
	 
  return str;
}
